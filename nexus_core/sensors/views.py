from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import SensorLog

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # <--- Only logged in users!
def get_sensor_history(request):
    # Get last 20 readings, ordered by time
    data = SensorLog.objects.all().order_by('-timestamp')[:20]
    
    # Format for React (Reverse so oldest is on left of graph)
    formatted_data = [
        {
            "time": log.timestamp.strftime("%H:%M:%S"),
            "temp": log.temperature
        }
        for log in reversed(data)
    ]
    return Response(formatted_data)