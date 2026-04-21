"""
Sentry error monitoring configuration
"""
import os
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.logging import LoggingIntegration
import logging

logger = logging.getLogger(__name__)


def init_sentry():
    """Initialize Sentry error monitoring for all environments."""
    sentry_dsn = os.getenv("SENTRY_DSN")
    environment = os.getenv("ENVIRONMENT", "development")

    if not sentry_dsn:
        logger.info("Sentry not initialized: SENTRY_DSN is not set.")
        return

    # Use lower sample rates in development to avoid quota noise
    is_dev = environment == "development"
    traces_sample_rate = 0.2 if is_dev else 0.1
    profiles_sample_rate = 0.2 if is_dev else 0.1

    try:
        sentry_sdk.init(
            dsn=sentry_dsn,
            environment=environment,
            traces_sample_rate=traces_sample_rate,
            profiles_sample_rate=profiles_sample_rate,
            send_default_pii=True,   # Captures request headers and user IP
            integrations=[
                # Starlette must come before FastAPI
                StarletteIntegration(transaction_style="endpoint"),
                FastApiIntegration(transaction_style="endpoint"),
                SqlalchemyIntegration(),
                LoggingIntegration(
                    level=logging.INFO,        # Breadcrumb level
                    event_level=logging.ERROR, # Send as Sentry event level
                ),
            ],
            before_send=filter_events,
        )
        logger.info(
            f"Sentry initialized | environment={environment} "
            f"traces={traces_sample_rate} profiles={profiles_sample_rate}"
        )
    except Exception as e:
        logger.error(f"Failed to initialize Sentry: {e}")


def filter_events(event, hint):
    """Drop noisy health-check and metrics events from Sentry."""
    url = event.get("request", {}).get("url", "")
    if url.endswith("/health") or url.endswith("/metrics"):
        return None
    return event
