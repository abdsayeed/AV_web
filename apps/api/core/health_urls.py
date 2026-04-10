from django.urls import path
from django.http import JsonResponse
from django.db import connection
import time

_start_time = time.time()

def health_check(request):
    db_ok = False
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        db_ok = True
    except Exception:
        pass
    return JsonResponse({
        "status": "ok" if db_ok else "degraded",
        "db": "ok" if db_ok else "error",
        "uptime": round(time.time() - _start_time),
    })

urlpatterns = [path("", health_check)]
