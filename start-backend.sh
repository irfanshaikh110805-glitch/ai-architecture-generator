#!/bin/bash

# Start Backend Server Script
# This script starts PostgreSQL, Redis, and the FastAPI backend

echo "🚀 Starting ArchitechAI Backend..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start PostgreSQL and Redis
echo "📦 Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "postgres.*Up"; then
    echo "✅ PostgreSQL is running"
else
    echo "❌ PostgreSQL failed to start"
    exit 1
fi

if docker-compose ps | grep -q "redis.*Up"; then
    echo "✅ Redis is running"
else
    echo "❌ Redis failed to start"
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Run migrations
echo "🗄️  Running database migrations..."
alembic upgrade head

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo "📖 API docs available at http://localhost:8000/docs"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

# Start the server
python -m uvicorn main_enhanced:app --reload --port 8000
