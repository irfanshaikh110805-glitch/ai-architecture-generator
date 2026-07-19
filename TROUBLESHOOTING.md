# Troubleshooting Guide

## 🐛 Common Issues and Solutions

### Issue 1: "ModuleNotFoundError: No module named 'asyncpg'"

**Symptoms:**
```
ModuleNotFoundError: No module named 'asyncpg'
```

**Cause:** Dependencies not installed in virtual environment or venv is broken.

**Solution:**

**Option A: Quick Fix (Run this)**
```bash
cd backend
venv\Scripts\activate
pip install asyncpg
```

**Option B: Complete Fix (Recommended)**
Double-click: **`FIX_VENV.bat`**

Or manually:
```bash
cd backend
rmdir /s /q venv
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

---

### Issue 2: "Could not import module 'main'"

**Cause:** Running uvicorn from wrong directory.

**Solution:**
```bash
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

### Issue 3: Virtual Environment Path Issues

**Symptoms:**
```
Fatal error in launcher: Unable to create process using...
```

**Cause:** Virtual environment was moved or created in different location.

**Solution:**
Run **`FIX_VENV.bat`** to recreate the virtual environment.

---

### Issue 4: "JWT_SECRET_KEY environment variable must be set"

**Cause:** Missing or invalid secret keys in `.env` file.

**Solution:**
```bash
cd backend
python env_template_generator.py
# Then edit .env with real values
```

Or manually generate keys:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Add to `backend/.env`:
```env
SECRET_KEY=<your-generated-key>
JWT_SECRET_KEY=<your-generated-key>
```

---

### Issue 5: Port Already in Use

**Symptoms:**
```
ERROR: [Errno 10048] error while attempting to bind on address
```

**Solution:**

**Find and kill the process:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

**Or use a different port:**
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

---

### Issue 6: Database Connection Error

**Symptoms:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solution:**

1. Check `DATABASE_URL` in `backend/.env`
2. Verify Supabase is accessible
3. Test connection:
```bash
python -c "import psycopg2; print('OK')"
```

4. Verify credentials in Supabase Dashboard

---

### Issue 7: Frontend Build Errors

**Symptoms:**
```
Module not found: Error: Can't resolve...
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Issue 8: ESLint Errors

**Symptoms:**
```
Error: Cannot call impure function during render
```

**Solution:**
Already fixed! But if you see new errors:
```bash
cd frontend
npm run lint:fix
```

---

### Issue 9: CORS Errors

**Symptoms:**
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked
```

**Solution:**

Check `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

### Issue 10: Gemini API Quota Exceeded

**Symptoms:**
```
429: Quota exceeded
```

**Solution:**

1. Check your Google Cloud Console
2. Verify API key in `backend/.env`
3. Wait for quota reset or upgrade plan
4. Consider implementing request caching

---

## 🔧 Complete Reset

If nothing else works, do a complete reset:

```bash
# 1. Remove virtual environment
cd backend
rmdir /s /q venv

# 2. Recreate venv
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# 3. Remove node modules
cd ..\frontend
rmdir /s /q node_modules
npm install

# 4. Regenerate configs
cd ..\backend
python env_template_generator.py

# 5. Test
python -m uvicorn main:app --reload
```

---

## 🆘 Still Having Issues?

1. Check all environment variables are set
2. Verify Python version (should be 3.11+)
3. Verify Node version (should be 18+)
4. Check firewall/antivirus settings
5. Review error logs in detail

---

## 📞 Getting Help

When asking for help, include:

1. **Error message** (full traceback)
2. **What you tried** (commands you ran)
3. **Environment info**:
   ```bash
   python --version
   node --version
   npm --version
   ```
4. **Relevant config** (without secrets!)

---

## ✅ Verification Checklist

Before starting, verify:

- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] Virtual environment created and activated
- [ ] Backend dependencies installed (`pip list`)
- [ ] Frontend dependencies installed (`npm list`)
- [ ] `.env` files created and configured
- [ ] Supabase database setup complete
- [ ] API keys valid and not expired

---

## 🎯 Quick Health Check

Run these to verify everything is working:

```bash
# Backend health
curl http://localhost:8000/health

# Frontend running
curl http://localhost:5173

# Database connection
cd backend
python -c "from database import engine; print('DB OK')"
```

---

**Remember:** Most issues are caused by:
1. Wrong directory
2. Missing dependencies
3. Invalid environment variables
4. Port conflicts

Check these first! 🎯
