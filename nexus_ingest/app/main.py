import os
import pika
import json
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List

# 1. Load Environment Variables
load_dotenv()
RABBITMQ_URL = os.getenv("RABBITMQ_URL")

app = FastAPI()

# --- WEBSOCKET MANAGER ---
class ConnectionManager:
    def __init__(self):
        # Keep track of active connections (dashboards)
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print("New Dashboard Connected")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print("Dashboard Disconnected")

    async def broadcast(self, message: str):
        # Send message to all connected dashboards
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# --- DATA MODELS ---
class SensorData(BaseModel):
    device_id: str
    temperature: float
    status: str

# --- RABBITMQ HELPER ---
def publish_to_queue(message: dict):
    try:
        if not RABBITMQ_URL:
            return False
        params = pika.URLParameters(RABBITMQ_URL)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.queue_declare(queue='iot_sensor_data')
        channel.basic_publish(
            exchange='',
            routing_key='iot_sensor_data',
            body=json.dumps(message)
        )
        connection.close()
        return True
    except Exception as e:
        print(f"RabbitMQ Error: {e}")
        return False

# --- ROUTES ---
@app.get("/")
def read_root():
    return {"system": "Nexus Industrial IoT", "status": "Real-Time Ready"}

# New: WebSocket Endpoint for Dashboards
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive, wait for messages (optional)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/ingest")
async def ingest_data(data: SensorData):
    data_dict = data.model_dump()
    
    # 1. Send to Cloud (Reliable Storage)
    publish_to_queue(data_dict)
    
    # 2. Broadcast to Dashboard (Real-Time UI)
    await manager.broadcast(json.dumps(data_dict))
        
    return {"message": "Data Ingested & Broadcasted", "data": data_dict}