# 🏭 Nexus - Industrial IoT Platform

Nexus is a scalable, real-time Industrial IoT ingestion and monitoring platform. It demonstrates a modern **Event-Driven Microservices Architecture** designed to handle high-velocity sensor data without blocking the main ingestion pipeline.

## 🚀 Architecture

The system is composed of three decoupled services:

1.  **Ingestion Service (FastAPI):** High-performance async API that receives raw sensor data and streams it to the dashboard via WebSockets.
2.  **Message Broker (RabbitMQ):** A cloud-hosted decoupling layer that ensures data reliability and buffers spikes in traffic.
3.  **Core Service (Django):** A robust backend that consumes messages from the queue, provides persistent storage (SQL), and handles JWT Authentication.
4.  **Dashboard (React.js):** A real-time frontend visualizing live data streams using Recharts.

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite, Recharts, Tailwind CSS
* **Backend (Ingest):** Python 3.11, FastAPI, Uvicorn, Websockets
* **Backend (Core):** Django 5.0, Django REST Framework, SimpleJWT
* **Broker:** RabbitMQ (CloudAMQP)
* **DevOps:** Docker, Docker Compose

## ✨ Key Features

* **Real-Time Visualization:** Live line charts updating instantly via WebSockets.
* **Fault Tolerance:** Data is queued in RabbitMQ, ensuring zero data loss even if the storage service is down.
* **Hybrid Cloud:** Local microservices connected to a cloud-managed message broker.
* **Security:** JWT-based authentication protecting the dashboard and history API.
* **Historical Data:** Fetches past sensor readings from the database upon login.

## 📦 How to Run Locally

### Prerequisites
* Python 3.11+
* Node.js 18+
* RabbitMQ URL (CloudAMQP)

### 1. Setup Environment
Create a `.env` file in the root directory:
```bash
RABBITMQ_URL=amqps://your-user:password@host/vhost

2. Start Ingestion Service (FastAPI)

cd nexus_ingest
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

. API Docs: http://localhost:8000/docs
. WebSocket: ws://localhost:8000/ws

3. Start Core Service (Django)
Open a new terminal:

cd nexus_core
python -m venv venv
# Windows:
venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001

. Admin Panel: http://localhost:8001/admin

⚠️ Important: To save data to the database, run the consumer in a separate terminal:
python manage.py start_consumer

4. Start Dashboard (React)

Open a new terminal:
cd nexus_dashboard
npm install
npm run dev

. Dashboard: http://localhost:5173
