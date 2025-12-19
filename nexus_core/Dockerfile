# Use a lightweight Python version
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies (needed for some Python packages)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose Port 8001
EXPOSE 8001

# Command to run the server (listening on all interfaces)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]