# Configuration Guide - Multi-API Setup

## Overview

This guide explains how to set up and configure both the Main Prediction API (api.py) and Auth Database API (auth_db.py) to work together seamlessly.

---

## Port Configuration

### Default Ports
```
Main API (api.py):      http://127.0.0.1:8000
Auth DB API (auth_db.py): http://127.0.0.1:8001
```

### Change Port (if needed)

**For Main API (api.py)**
Find this line in api.py:
```python
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
```

Change to:
```python
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8002, debug=True)
```

**For Auth API (auth_db.py)**
Find this line in auth_db.py:
```python
if __name__ == "__main__":
    import uvicorn
    init_db()
    uvicorn.run(app, host="127.0.0.1", port=8001)
```

Change to:
```python
if __name__ == "__main__":
    import uvicorn
    init_db()
    uvicorn.run(app, host="127.0.0.1", port=8002)
```

---

## Running Both APIs

### Option 1: Dual Terminal Setup (Recommended for Development)

**Terminal 1 - Start Main API**
```bash
cd cricket-predictor-advanced/backend
python -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 - Start Auth API**
```bash
cd cricket-predictor-advanced/backend
python -m uvicorn auth_db:app --host 127.0.0.1 --port 8001 --reload
```

### Option 2: Automated Startup Script

```bash
cd cricket-predictor-advanced/backend
python run_services.py
```

This starts both services automatically and shows status.

### Option 3: Standalone Scripts

**Start Main API**
```bash
cd cricket-predictor-advanced/backend
python api.py
```

**Start Auth API (separate terminal)**
```bash
cd cricket-predictor-advanced/backend
python auth_db.py
```

---

## CORS Configuration

If frontend is on different port/domain, enable CORS:

### In api.py (Main API)
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### In auth_db.py (Auth API)
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Frontend Configuration

### React (ipl-frontend)

Update `.env` file:
```
REACT_APP_MAIN_API=http://127.0.0.1:8000
REACT_APP_AUTH_API=http://127.0.0.1:8001
```

In API calls:
```javascript
// Main API calls
const MAIN_API = process.env.REACT_APP_MAIN_API || 'http://127.0.0.1:8000';

// Auth API calls
const AUTH_API = process.env.REACT_APP_AUTH_API || 'http://127.0.0.1:8001';
```

### HTML/Vanilla JS (frontend)

Update configuration in JavaScript files:
```javascript
const MAIN_API_URL = 'http://127.0.0.1:8000';
const AUTH_API_URL = 'http://127.0.0.1:8001';
```

---

## Database Configuration

### Location
SQLite database created automatically:
```
cricket-predictor-advanced/backend/cricket_auth.db
```

### Backup Database
```bash
# Copy database for backup
cp cricket_auth.db cricket_auth.db.backup
```

### Reset Database
```bash
# Delete database (will be recreated on next run)
rm cricket_auth.db
```

### Custom Database Path
Edit auth_db.py:
```python
# Default
DATABASE_URL = "sqlite:///./cricket_auth.db"

# Custom path
DATABASE_URL = "sqlite:////path/to/custom/cricket_auth.db"
```

---

## Dependencies Management

### Install All Dependencies
```bash
cd cricket-predictor-advanced/backend
pip install -r requirements.txt
```

### requirements.txt Updated With:
```
fastapi          # Web framework
uvicorn          # ASGI server
sqlalchemy       # ORM for database
pydantic         # Data validation
email-validator  # Email validation
```

### View Installed Packages
```bash
pip list
```

### Update Specific Package
```bash
pip install --upgrade fastapi
```

---

## Environment Variables

Create `.env` file in backend directory:

```env
# Database
DATABASE_URL=sqlite:///./cricket_auth.db

# API Configuration
MAIN_API_HOST=127.0.0.1
MAIN_API_PORT=8000
AUTH_API_HOST=127.0.0.1
AUTH_API_PORT=8001

# Frontend URLs
REACT_APP_API_URL=http://127.0.0.1:3000
REACT_APP_MAIN_API=http://127.0.0.1:8000
REACT_APP_AUTH_API=http://127.0.0.1:8001

# Security
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256

# CORS
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Load Environment Variables

In auth_db.py:
```python
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cricket_auth.db")
```

Install python-dotenv:
```bash
pip install python-dotenv
```

---

## Health Check

### Check if APIs are running
```bash
# Main API
curl http://127.0.0.1:8000/health

# Auth API
curl http://127.0.0.1:8001/auth/health
```

### Check via Browser
- Main API: http://127.0.0.1:8000/docs
- Auth API: http://127.0.0.1:8001/docs

Both should load Swagger UI documentation.

---

## Common Configuration Issues

### Issue: Address Already in Use
**Error**: `Address already in use`

**Solution**: Change port
```bash
uvicorn auth_db:app --port 8002
```

### Issue: Cannot Connect to Database
**Error**: `Can't open database file`

**Solution**: Ensure backend directory is writable
```bash
# Linux/Mac
ls -la cricket-predictor-advanced/backend/

# Windows PowerShell
Get-ChildItem cricket-predictor-advanced/backend/
```

### Issue: Import Errors
**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: Install dependencies
```bash
pip install -r requirements.txt
```

### Issue: CORS Errors in Frontend
**Error**: `Access to XMLHttpRequest blocked by CORS`

**Solution**: Add CORS middleware to both API files (see CORS Configuration above)

---

## Production Deployment

### For Production Use:

1. **Use PostgreSQL instead of SQLite**
```python
DATABASE_URL = "postgresql://user:password@localhost/cricket_db"
```

2. **Use environment-based configuration**
```python
import os
DATABASE_URL = os.getenv("DATABASE_URL")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")
```

3. **Use Gunicorn/ASGI Server**
```bash
# Production server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker api:app
```

4. **Enable HTTPS**
```bash
uvicorn auth_db:app --ssl-keyfile=key.pem --ssl-certfile=cert.pem
```

5. **Set Debug to False**
```python
app = FastAPI(debug=False)
```

---

## Monitoring & Logging

### View API Logs
```bash
# With timestamps
uvicorn auth_db:app --log-level debug

# Redirect to file
uvicorn auth_db:app > api.log 2>&1 &
```

### Database Queries
Enable SQLAlchemy logging:
```python
import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

### Monitor Processes
```bash
# Check running processes
ps aux | grep uvicorn

# Kill specific process
kill -9 <PID>

# Windows - Check ports
netstat -ano | findstr :8001
```

---

## Scaling Configuration

### Load Balancing
For multiple instances, use NGINX:
```nginx
upstream auth_api {
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
    server 127.0.0.1:8003;
}

server {
    listen 80;
    location /auth {
        proxy_pass http://auth_api;
    }
}
```

### Database Clustering
Upgrade from SQLite to PostgreSQL with replication for production.

### Caching
Add Redis for session caching:
```python
import redis
redis_client = redis.Redis(host='localhost', port=6379)
```

---

## Troubleshooting Checklist

- [ ] Both ports (8000, 8001) are available
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] Database permissions correct
- [ ] Backend directory writable
- [ ] Python version >= 3.7
- [ ] CORS configured if frontend on different port
- [ ] Environment variables loaded (if using .env)
- [ ] Firewall allows connections to localhost
- [ ] No zombie processes holding ports

---

## Support Resources

1. **API Documentation**
   - Main API: http://127.0.0.1:8000/docs
   - Auth API: http://127.0.0.1:8001/docs

2. **Reference Guides**
   - `AUTH_API_DOCUMENTATION.md` - Complete endpoint reference
   - `QUICK_START_AUTH.md` - Getting started guide
   - `FRONTEND_INTEGRATION_GUIDE.py` - Code examples

3. **Test with cURL**
   - See examples in `QUICK_START_AUTH.md`

---

**Version:** 1.0.0  
**Updated:** December 5, 2025
