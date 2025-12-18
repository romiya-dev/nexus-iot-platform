from django.db import models

class SensorLog(models.Model):
    device_id = models.CharField(max_length=50)
    temperature = models.FloatField()
    status = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.device_id} - {self.temperature}°C"