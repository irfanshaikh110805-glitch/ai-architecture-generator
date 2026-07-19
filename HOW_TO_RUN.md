# 🚀 How to Run the AI Architecture Generator

## Quick Start Guide

This guide will help you run both the backend (FastAPI) and frontend (React) servers.

---

## ✅ Prerequisites

Before starting, ensure you have:
- ✅ Python 3.13+ installed
- ✅ Node.js v22+ installed
- ✅ Your Gemini API key is already configured in `backend/.env`

---

## 🎯 Option 1: Run Using PowerShell Commands (Recommended)

### Step 1: Start the Backend Server

Open **PowerShell** or **Command Prompt** and run:

```powershell
# Navigate to your project directory
cd "C:\Users\irfan.ZEBRONICS\Desktop\work in under process\ai-architecture-generator"

# Navigate to backend folder
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the backend server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**✅ Backend Running:** `http://localhost:8000`
**📚 API Docs:** `http://localhost:8000/docs`

---

### Step 2: Start the Frontend Server

Open a **NEW PowerShell/Command Prompt window** (keep the backend running) and run:

```powershell
# Navigate to your project directory
cd "C:\Users\irfan.ZEBRONICS\Desktop\work in under process\ai-architecture-generator"

# Navigate to frontend folder
cd frontend

# Install dependencies (first time only)
npm install

# Start the frontend development server
npm run dev
```

**✅ Frontend Running:** `http://localhost:5173`

---

## 🎯 Option 2: Run Using Batch Files (Easiest)

### Step 1: Start Backend

1. Navigate to your project folder
2. Double-click: **`start_backend.bat`**
3. A terminal window will open showing the backend server

### Step 2: Start Frontend

1. In the same project folder
2. Double-click: **`start_frontend.bat`**
3. A new terminal window will open showing the frontend server
4. Your browser should automatically open to `http://localhost:5173`

---

## 🌐 Access Your Application

Once both servers are running:

1. **Open your browser** and go to: `http://localhost:5173`
2. You'll see the **ArchitechAI Landing Page**
3. Click **"Start Generating Free"** or **"Sign Up"**
4. Enter your project idea and generate architecture!

---

## 🛠️ Common Commands

### Backend Commands

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# Install new dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest tests/
```

### Frontend Commands

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🔍 Verify Everything is Working

### Check Backend Health

Open: `http://localhost:8000/health`

You should see:
```json
{
  "status": "healthy",
  "database": "connected",
  "ai_service": "ready"
}
```

### Check Frontend

Open: `http://localhost:5173`

You should see the ArchitechAI landing page with:
- Hero section with video background
- Features section
- How it Works section
- Testimonials
- Navigation menu

---

## ❌ Troubleshooting

### Backend Won't Start

**Problem:** `ModuleNotFoundError`
```powershell
# Solution: Reinstall dependencies
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

**Problem:** Port 8000 already in use
```powershell
# Solution: Kill the process or use different port
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
# Update VITE_API_URL in frontend/.env to http://localhost:8001
```

**Problem:** Gemini API key error
```powershell
# Solution: Check your .env file
cd backend
notepad .env
# Ensure GEMINI_API_KEY is correct
```

---

### Frontend Won't Start

**Problem:** `npm: command not found`
```powershell
# Solution: Install Node.js from https://nodejs.org
# After installing, restart your terminal
```

**Problem:** Port 5173 already in use
```powershell
# Solution: The dev server will automatically use 5174
# Or manually specify:
npm run dev -- --port 3000
```

**Problem:** API calls failing
```powershell
# Solution: Check VITE_API_URL in frontend/.env
cd frontend
notepad .env
# Should be: VITE_API_URL=http://localhost:8000
```

---

## 🔄 Stopping the Servers

### Stop Backend
- Press `Ctrl + C` in the backend terminal window

### Stop Frontend
- Press `Ctrl + C` in the frontend terminal window

---

## 📱 Test Mobile Responsiveness

After starting the application:

1. Open Chrome DevTools (`F12`)
2. Click the **Device Toggle** button (or `Ctrl + Shift + M`)
3. Select different device sizes:
   - iPhone 12 Pro
   - iPad
   - Galaxy S20
4. Verify:
   - ✅ Video background is visible
   - ✅ Navigation hamburger menu works
   - ✅ All buttons are clickable
   - ✅ Text is readable
   - ✅ No horizontal scrolling

---

## 🚀 Quick Reference

| What | URL |
|------|-----|
| Frontend App | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| Alternative API Docs | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |

---

## 📞 Need Help?

**Developer:** Irfan Shekh
- 📧 Email: irfanshaikh110805@gmail.com
- 📱 Phone: +91 99642 64412

---

**Happy Coding! 🎉**
