"""
Redis cache service for caching AI responses with performance optimizations
"""
import json
import logging
from typing import Optional, Any, List
import redis.asyncio as redis
import os
from exceptions import CacheError

logger = logging.getLogger(__name__)


class CacheService:
    """Redis cache service with connection pooling and batch operations"""
    
    def __init__(self):
        self._redis: Optional[redis.Redis] = None
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.cache_ttl = int(os.getenv("CACHE_TTL", "86400"))
        self.max_connections = int(os.getenv("REDIS_MAX_CONNECTIONS", "20"))  # Increased
        self.socket_keepalive = True
        self.socket_keepalive_options = {
            1: 1,  # TCP_KEEPIDLE
            2: 1,  # TCP_KEEPINTVL
            3: 3,  # TCP_KEEPCNT
        }
    
    async def connect(self):
        """Connect to Redis with connection pooling"""
        try:
            self._redis = await redis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True,
                max_connections=self.max_connections,
                socket_keepalive=self.socket_keepalive,
                socket_keepalive_options=self.socket_keepalive_options,
                socket_connect_timeout=5,
                retry_on_timeout=True,
                health_check_interval=30
            )
            # Test connection
            await self._redis.ping()
            logger.info(f"Redis connection established (pool size: {self.max_connections})")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            # Don't raise - allow app to run without cache
            self._redis = None
    
    async def disconnect(self):
        """Disconnect from Redis with proper cleanup"""
        if self._redis:
            try:
                await self._redis.aclose()
                logger.info("Redis connection closed")
            except Exception as e:
                logger.error(f"Error closing Redis connection: {e}")
            finally:
                self._redis = None
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self._redis:
            return None
        
        try:
            value = await self._redis.get(key)
            if value:
                logger.debug(f"Cache hit: {key}")
                return json.loads(value)
            logger.debug(f"Cache miss: {key}")
            return None
        except Exception as e:
            logger.warning(f"Cache get error: {e}")
            return None
    
    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None
    ) -> bool:
        """Set value in cache"""
        if not self._redis:
            return False
        
        try:
            ttl = ttl or self.cache_ttl
            serialized = json.dumps(value)
            await self._redis.setex(key, ttl, serialized)
            logger.debug(f"Cache set: {key} (TTL: {ttl}s)")
            return True
        except Exception as e:
            logger.warning(f"Cache set error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete value from cache"""
        if not self._redis:
            return False
        
        try:
            await self._redis.delete(key)
            logger.debug(f"Cache delete: {key}")
            return True
        except Exception as e:
            logger.warning(f"Cache delete error: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        if not self._redis:
            return False
        
        try:
            return await self._redis.exists(key) > 0
        except Exception as e:
            logger.warning(f"Cache exists error: {e}")
            return False
    
    async def get_many(self, keys: List[str]) -> dict:
        """Get multiple values from cache (batch operation for better performance)"""
        if not self._redis or not keys:
            return {}
        
        try:
            values = await self._redis.mget(keys)
            result = {}
            for key, value in zip(keys, values):
                if value:
                    try:
                        result[key] = json.loads(value)
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to decode cached value for key: {key}")
            logger.debug(f"Cache get_many: {len(result)}/{len(keys)} hits")
            return result
        except Exception as e:
            logger.warning(f"Cache get_many error: {e}")
            return {}
    
    async def set_many(self, items: dict, ttl: Optional[int] = None) -> bool:
        """Set multiple values in cache (batch operation for better performance)"""
        if not self._redis or not items:
            return False
        
        try:
            ttl = ttl or self.cache_ttl
            pipeline = self._redis.pipeline()
            
            for key, value in items.items():
                serialized = json.dumps(value)
                pipeline.setex(key, ttl, serialized)
            
            await pipeline.execute()
            logger.debug(f"Cache set_many: {len(items)} items (TTL: {ttl}s)")
            return True
        except Exception as e:
            logger.warning(f"Cache set_many error: {e}")
            return False
    
    async def clear_pattern(self, pattern: str) -> int:
        """Clear all keys matching pattern"""
        if not self._redis:
            return 0
        
        try:
            keys = []
            async for key in self._redis.scan_iter(match=pattern):
                keys.append(key)
            
            if keys:
                deleted = await self._redis.delete(*keys)
                logger.info(f"Cleared {deleted} keys matching pattern: {pattern}")
                return deleted
            return 0
        except Exception as e:
            logger.warning(f"Cache clear pattern error: {e}")
            return 0
    
    async def health_check(self) -> bool:
        """Check if Redis is connected and healthy"""
        if not self._redis:
            return False
        
        try:
            await self._redis.ping()
            return True
        except Exception as e:
            logger.warning(f"Redis health check failed: {e}")
            return False


# Global cache instance
cache_service = CacheService()
