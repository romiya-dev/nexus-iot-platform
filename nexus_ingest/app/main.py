import os
import pika
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# 1. Load the environment variables (Your Cloud URL)
load_dotenv()
RABBITMQ_URL = os.getenv("RABBITMQ_URL")

app = FastAPI()

# Data Model
class SensorData(BaseModel):
    device_id: str
    temperature: float
    status: str

# Helper function to send message to Cloud RabbitMQ
def publish_to_queue(message: dict):
    try:
        if not RABBITMQ_URL:
            print("Error: RABBITMQ_URL is missing in .env file")
            return False

        # Connect to the Cloud
        params = pika.URLParameters(RABBITMQ_URL)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        
        # Ensure the queue exists
        channel.queue_declare(queue='iot_sensor_data')
        
        # Send the message
        channel.basic_publish(
            exchange='',
            routing_key='iot_sensor_data',
            body=json.dumps(message)
        )
        connection.close()
        return True
    except Exception as e:
        print(f"Error connecting to RabbitMQ: {e}")
        return False

@app.get("/")
def read_root():
    return {"system": "Nexus Industrial IoT", "status": "Cloud Connected"}

@app.post("/ingest")
def ingest_data(data: SensorData):
    # Convert data to dictionary
    data_dict = data.model_dump()
    
    # Send to RabbitMQ
    success = publish_to_queue(data_dict)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send data to Cloud Broker")
        
    return {"message": "Data Sent to Cloud Queue", "data": data_dict}