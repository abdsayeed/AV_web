"""
Rate limiting via Upstash Redis sliding window.
Falls back to no-op if UPSTASH_REDIS_REST_URL is not configured.
"""
import functools
import os
import time
from typing import Callable

from rest_framework import status
from rest_framework.response import Response


def _get_client():
    url = os.environ.get("UPSTASH_REDIS_REST_URL")
    token = os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    if not url or not token:
        return None
    try:
        from upstash_redis import Redis
        return Redis(url=url, token=token)
    except ImportError:
        return None


def rate_limit(key: str, limit: int, window: int):
    """
    Decorator for DRF APIView methods.
    key: identifier prefix (e.g. 'login', 'forgot_password')
    limit: max requests
    window: time window in seconds
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(self, request, *args, **kwargs):
            client = _get_client()
            if client is None:
                return func(self, request, *args, **kwargs)

            ip = (
                request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
                or request.META.get("REMOTE_ADDR", "unknown")
            )
            redis_key = f"rl:{key}:{ip}"
            now = int(time.time())
            window_start = now - window

            pipe = client.pipeline()
            pipe.zremrangebyscore(redis_key, 0, window_start)
            pipe.zadd(redis_key, {str(now): now})
            pipe.zcard(redis_key)
            pipe.expire(redis_key, window)
            results = pipe.execute()

            count = results[2]
            if count > limit:
                return Response(
                    {"detail": "Too many requests. Please try again later."},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )
            return func(self, request, *args, **kwargs)
        return wrapper
    return decorator
