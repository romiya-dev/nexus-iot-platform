from django.contrib import admin
from .models import SensorLog

@admin.register(SensorLog)
class SensorLogAdmin(admin.ModelAdmin):
    list_display = ('device_id', 'temperature', 'status', 'timestamp')
    list_filter = ('status', 'timestamp')