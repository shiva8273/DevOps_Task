"""school_backend URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    """Health check endpoint for DevOps container monitoring and CI"""
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health', health_check, name='health-no-slash'),
    path('health/', health_check, name='health'),
    path('api/health', health_check, name='api-health-no-slash'),
    path('api/health/', health_check, name='api-health'),
    path('api/', include('school.urls')),
]
