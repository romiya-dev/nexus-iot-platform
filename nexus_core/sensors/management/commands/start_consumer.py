import json
import os
import pika
from django.core.management.base import BaseCommand
from sensors.models import SensorLog
from dotenv import load_dotenv

class Command(BaseCommand):
    help = 'Starts the RabbitMQ Consumer to ingest IoT data'

    def handle(self, *args, **options):
        # 1. Load Environment Variables
        load_dotenv()
        url = os.getenv('RABBITMQ_URL')
        
        if not url:
            self.stdout.write(self.style.ERROR('Error: RABBITMQ_URL not found in .env'))
            return

        # 2. Connect to CloudAMQP
        params = pika.URLParameters(url)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        
        # Ensure queue exists (idempotent)
        channel.queue_declare(queue='iot_sensor_data')

        # 3. Define what happens when a message arrives
        def callback(ch, method, properties, body):
            try:
                data = json.loads(body)
                self.stdout.write(self.style.SUCCESS(f"Received: {data}"))
                
                # SAVE TO DATABASE
                SensorLog.objects.create(
                    device_id=data['device_id'],
                    temperature=data['temperature'],
                    status=data['status']
                )
                self.stdout.write(self.style.SUCCESS("Saved to DB"))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error saving data: {e}"))

        # 4. Start Listening
        channel.basic_consume(queue='iot_sensor_data', on_message_callback=callback, auto_ack=True)
        self.stdout.write(self.style.SUCCESS('Waiting for messages... To exit press CTRL+C'))
        channel.start_consuming()