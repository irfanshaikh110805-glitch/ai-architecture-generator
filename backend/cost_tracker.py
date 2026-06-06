"""
AI API cost tracking and budget management
"""
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from models import UsageRecord, User
from repository import UsageRepository

logger = logging.getLogger(__name__)


class CostTracker:
    """Track and manage AI API costs"""
    
    # Gemini API pricing (as of 2024)
    # Source: https://ai.google.dev/pricing
    PRICING = {
        "gemini-2.5-flash": {
            "input_per_1k": 0.00001875,   # $0.00001875 per 1K input tokens
            "output_per_1k": 0.000075,    # $0.000075 per 1K output tokens
        },
        "gemini-1.5-flash": {
            "input_per_1k": 0.000035,     # $0.000035 per 1K input tokens
            "output_per_1k": 0.00014,     # $0.00014 per 1K output tokens
        },
        "gemini-1.5-pro": {
            "input_per_1k": 0.00125,      # $0.00125 per 1K input tokens
            "output_per_1k": 0.005,       # $0.005 per 1K output tokens
        }
    }
    
    # Budget thresholds (USD)
    BUDGET_THRESHOLDS = {
        "daily": 10.0,      # $10/day
        "weekly": 50.0,     # $50/week
        "monthly": 200.0,   # $200/month
    }
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.usage_repo = UsageRepository(session)
    
    def calculate_cost(
        self,
        model: str,
        input_tokens: int,
        output_tokens: int
    ) -> float:
        """
        Calculate cost for a single API call
        
        Args:
            model: Model name (e.g., "gemini-2.5-flash")
            input_tokens: Number of input tokens
            output_tokens: Number of output tokens
            
        Returns:
            Cost in USD
        """
        if model not in self.PRICING:
            logger.warning(f"Unknown model for pricing: {model}, using gemini-2.5-flash")
            model = "gemini-2.5-flash"
        
        pricing = self.PRICING[model]
        
        input_cost = (input_tokens / 1000) * pricing["input_per_1k"]
        output_cost = (output_tokens / 1000) * pricing["output_per_1k"]
        
        total_cost = input_cost + output_cost
        
        logger.debug(
            f"Cost calculation: {model} - "
            f"Input: {input_tokens} tokens (${input_cost:.6f}), "
            f"Output: {output_tokens} tokens (${output_cost:.6f}), "
            f"Total: ${total_cost:.6f}"
        )
        
        return total_cost
    
    async def track_request(
        self,
        user_id: int,
        endpoint: str,
        model: str,
        input_tokens: int,
        output_tokens: int
    ) -> UsageRecord:
        """
        Track a single API request
        
        Args:
            user_id: User ID
            endpoint: API endpoint
            model: Model used
            input_tokens: Input tokens
            output_tokens: Output tokens
            
        Returns:
            UsageRecord
        """
        cost = self.calculate_cost(model, input_tokens, output_tokens)
        total_tokens = input_tokens + output_tokens
        
        record = await self.usage_repo.record_usage(
            user_id=user_id,
            endpoint=endpoint,
            tokens_used=total_tokens,
            cost=cost
        )
        
        logger.info(
            f"Tracked usage for user {user_id}: "
            f"{total_tokens} tokens, ${cost:.6f}"
        )
        
        # Check budget alerts
        await self.check_budget_alerts(user_id)
        
        return record
    
    async def get_user_costs(
        self,
        user_id: int,
        period: str = "daily"
    ) -> Dict[str, float]:
        """
        Get user costs for a period
        
        Args:
            user_id: User ID
            period: "daily", "weekly", or "monthly"
            
        Returns:
            Dict with cost statistics
        """
        now = datetime.now(timezone.utc)
        
        if period == "daily":
            since = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == "weekly":
            since = now - timedelta(days=7)
        elif period == "monthly":
            since = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            raise ValueError(f"Invalid period: {period}")
        
        # Get usage records
        result = await self.session.execute(
            select(
                func.count(UsageRecord.id).label("request_count"),
                func.sum(UsageRecord.tokens_used).label("total_tokens"),
                func.sum(UsageRecord.cost).label("total_cost"),
                func.avg(UsageRecord.cost).label("avg_cost"),
                func.max(UsageRecord.cost).label("max_cost")
            )
            .where(
                UsageRecord.user_id == user_id,
                UsageRecord.created_at >= since
            )
        )
        row = result.one()
        
        return {
            "period": period,
            "request_count": row.request_count or 0,
            "total_tokens": row.total_tokens or 0,
            "total_cost": float(row.total_cost or 0.0),
            "avg_cost_per_request": float(row.avg_cost or 0.0),
            "max_cost": float(row.max_cost or 0.0),
            "budget_threshold": self.BUDGET_THRESHOLDS.get(period, 0.0),
            "budget_remaining": self.BUDGET_THRESHOLDS.get(period, 0.0) - float(row.total_cost or 0.0),
        }
    
    async def check_budget_alerts(self, user_id: int) -> Dict[str, bool]:
        """
        Check if user has exceeded budget thresholds
        
        Args:
            user_id: User ID
            
        Returns:
            Dict with alert status for each period
        """
        alerts = {}
        
        for period in ["daily", "weekly", "monthly"]:
            costs = await self.get_user_costs(user_id, period)
            threshold = self.BUDGET_THRESHOLDS[period]
            total_cost = costs["total_cost"]
            
            # Alert at 80% and 100% of threshold
            if total_cost >= threshold:
                logger.warning(
                    f"Budget exceeded for user {user_id}: "
                    f"{period} cost ${total_cost:.2f} >= ${threshold:.2f}"
                )
                alerts[f"{period}_exceeded"] = True
            elif total_cost >= threshold * 0.8:
                logger.info(
                    f"Budget warning for user {user_id}: "
                    f"{period} cost ${total_cost:.2f} >= 80% of ${threshold:.2f}"
                )
                alerts[f"{period}_warning"] = True
            else:
                alerts[f"{period}_ok"] = True
        
        return alerts
    
    async def get_global_costs(
        self,
        period: str = "daily"
    ) -> Dict[str, float]:
        """
        Get global costs across all users
        
        Args:
            period: "daily", "weekly", or "monthly"
            
        Returns:
            Dict with global cost statistics
        """
        now = datetime.now(timezone.utc)
        
        if period == "daily":
            since = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == "weekly":
            since = now - timedelta(days=7)
        elif period == "monthly":
            since = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            raise ValueError(f"Invalid period: {period}")
        
        # Get usage records
        result = await self.session.execute(
            select(
                func.count(UsageRecord.id).label("request_count"),
                func.count(func.distinct(UsageRecord.user_id)).label("unique_users"),
                func.sum(UsageRecord.tokens_used).label("total_tokens"),
                func.sum(UsageRecord.cost).label("total_cost"),
                func.avg(UsageRecord.cost).label("avg_cost")
            )
            .where(UsageRecord.created_at >= since)
        )
        row = result.one()
        
        return {
            "period": period,
            "request_count": row.request_count or 0,
            "unique_users": row.unique_users or 0,
            "total_tokens": row.total_tokens or 0,
            "total_cost": float(row.total_cost or 0.0),
            "avg_cost_per_request": float(row.avg_cost or 0.0),
        }
    
    async def get_cost_by_user(
        self,
        limit: int = 10,
        period: str = "monthly"
    ) -> list:
        """
        Get top users by cost
        
        Args:
            limit: Number of users to return
            period: "daily", "weekly", or "monthly"
            
        Returns:
            List of users with cost data
        """
        now = datetime.now(timezone.utc)
        
        if period == "daily":
            since = now.replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == "weekly":
            since = now - timedelta(days=7)
        elif period == "monthly":
            since = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        else:
            raise ValueError(f"Invalid period: {period}")
        
        # Get top users by cost
        result = await self.session.execute(
            select(
                UsageRecord.user_id,
                User.email,
                User.tier,
                func.count(UsageRecord.id).label("request_count"),
                func.sum(UsageRecord.tokens_used).label("total_tokens"),
                func.sum(UsageRecord.cost).label("total_cost")
            )
            .join(User, UsageRecord.user_id == User.id)
            .where(UsageRecord.created_at >= since)
            .group_by(UsageRecord.user_id, User.email, User.tier)
            .order_by(func.sum(UsageRecord.cost).desc())
            .limit(limit)
        )
        
        return [
            {
                "user_id": row.user_id,
                "email": row.email,
                "tier": row.tier,
                "request_count": row.request_count,
                "total_tokens": row.total_tokens,
                "total_cost": float(row.total_cost),
            }
            for row in result
        ]


# Global cost tracker instance
_cost_tracker: Optional[CostTracker] = None


def get_cost_tracker(session: AsyncSession) -> CostTracker:
    """Get cost tracker instance"""
    return CostTracker(session)
