# Quick Start Guide

## 🚀 Running the Application

### Option 1: Use the Batch Files (Easiest)

**Start Backend:**
```bash
# Double-click or run:
START_BACKEND.bat
```

**Start Frontend:**
```bash
# Double-click or run:
START_FRONTEND.bat
```

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📍 Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

---

## 🐛 Troubleshooting

### Error: "Could not import module 'main'"

**Problem:** Running uvicorn from wrong directory

**Solution:** Make sure you're in the `backend` folder:
```bash
cd backend
python -m uvicorn main:app --reload
```

### Error: "Port 8000 is already in use"

**Solution:** Kill the existing process:
```bash
# Find the process
netstat -ano | findstr :8000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

### Error: "Module not found"

**Solution:** Activate virtual environment and install dependencies:
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Error: Frontend won't start

**Solution:** Install dependencies:
```bash
cd frontend
npm install
npm run dev
```

---

## ✅ Verification Steps

1. **Backend Running:**
   - Open: http://localhost:8000/health
   - Should see: `{"status":"healthy","model":"gemini-2.0-flash"}`

2. **Frontend Running:**
   - Open: http://localhost:5173
   - Should see the landing page

3. **API Connection:**
   - Click "Start Generating Free" button
   - Should navigate to login/signup

---

## 🔧 Development Mode

Both servers run in **watch mode** and will auto-reload on file changes:

- **Backend:** Hot reload with Uvicorn
- **Frontend:** Hot Module Replacement (HMR) with Vite

---

## 🛑 Stopping the Servers

Press **CTRL+C** in each terminal window to stop the servers gracefully.

---

## 📦 First Time Setup

If this is your first time running the application:

1. **Backend Setup:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python env_template_generator.py
# Edit .env with your values
```

2. **Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your values
```

3. **Database Setup:**
- Go to Supabase Dashboard
- Run the SQL in `backend/supabase_migration.sql`

---

## 🎯 Ready to Develop!

Once both servers are running:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

Happy coding! 🚀
