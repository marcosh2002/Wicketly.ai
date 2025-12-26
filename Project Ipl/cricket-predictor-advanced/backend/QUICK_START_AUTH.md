# Auth Database API - Quick Start Guide

## What You Get

A complete **FastAPI-based authentication system** with SQLite database for:

✅ User registration & login
✅ Password hashing with salt (SHA-256)
✅ Persistent user storage in database
✅ Token balance management
✅ Referral system with bonuses
✅ Daily spin tracking
✅ Email validation

---

## Installation (5 minutes)

### Step 1: Install Dependencies

```bash
cd cricket-predictor-advanced/backend
pip install -r requirements.txt
```

### Step 2: Start the Service

**Option A: Simple (All-in-one startup)**
```bash
python run_services.py
```
This starts both Main API (8000) and Auth API (8001).

**Option B: Separate Terminals**

Terminal 1:
```bash
uvicorn auth_db:app --host 127.0.0.1 --port 8001 --reload
```

---

## Test It (2 minutes)

### Using Web Interface
Open browser: `http://127.0.0.1:8001/docs`

### Using cURL

**1. Register User**
```bash
curl -X POST "http://127.0.0.1:8001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**2. Login**
```bash
curl -X POST "http://127.0.0.1:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**3. Check Balance**
```bash
curl "http://127.0.0.1:8001/auth/user/testuser/tokens"
```

**4. Award Spin Reward**
```bash
curl -X POST "http://127.0.0.1:8001/auth/user/testuser/spin?reward=50"
```

---

## Files Created

| File | Purpose |
|------|---------|
| `auth_db.py` | Main authentication FastAPI app with database |
| `AUTH_API_DOCUMENTATION.md` | Complete API reference (13 endpoints) |
| `FRONTEND_INTEGRATION_GUIDE.py` | JavaScript/Python code examples |
| `run_services.py` | Startup script for both APIs |

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Create new user (100 tokens) |
| POST | `/auth/login` | Login user, get session token |
| GET | `/auth/user/{username}` | Get user profile |
| PUT | `/auth/user/{username}` | Update email/password |
| DELETE | `/auth/user/{username}` | Deactivate account |
| GET | `/auth/user/{username}/tokens` | Check token balance |
| POST | `/auth/user/{username}/add-tokens` | Award tokens |
| POST | `/auth/user/{username}/deduct-tokens` | Deduct tokens |
| GET | `/auth/user/{username}/referral` | Get referral info |
| GET | `/auth/user/{username}/spin-status` | Check daily spins |
| POST | `/auth/user/{username}/spin` | Record spin + reward |
| GET | `/auth/users` | List all users (admin) |
| GET | `/auth/health` | Service health check |

---

## Database Schema

SQLite database `cricket_auth.db` with users table:

```
users:
  - id (primary key)
  - username (unique)
  - email (unique)
  - password_hash (SHA-256)
  - salt (for hashing)
  - tokens (default: 100)
  - created_at
  - last_login
  - is_active
  - referral_code (unique)
  - referral_count
  - referral_bonus
  - spin_count
  - spin_date
  - spin_last_reward
```

---

## Integration with Frontend

### JavaScript (React/Vanilla)
Copy example from `FRONTEND_INTEGRATION_GUIDE.py`:
```javascript
// Register
const user = await registerUser(username, email, password);

// Login
const user = await loginUser(username, password);

// Get tokens
const balance = await getTokenBalance(username);

// Record spin
const spinResult = await recordSpin(username, 50);
```

### Python Backend
```python
from auth_db import CricketAuthClient

client = CricketAuthClient()
user = client.register('username', 'email@example.com', 'password')
tokens = client.get_tokens('username')
spin = client.record_spin('username', 50)
```

---

## Key Features

### 🔐 Security
- **Password Hashing**: SHA-256 with 16-byte salt
- **Token Generation**: URL-safe base64 (32 bytes)
- **Email Validation**: Valid format required
- **Soft Delete**: Accounts marked inactive, not deleted

### 💰 Token Economy
- **Starting Balance**: 100 tokens per user
- **Predictions**: Cost 10 tokens (from main API)
- **Spins**: 2 per day, rewards (5/15/50/100 tokens)
- **Referrals**: +10 tokens per successful referral

### 🎯 Gamification
- **Daily Spin Limit**: 2 spins, resets at UTC midnight
- **Referral Tracking**: Track referrer & bonus earnings
- **Token Management**: Add/deduct tokens, track balance

---

## Running Both APIs

Main API (predictions, matches):
```
http://127.0.0.1:8000
```

Auth API (users, tokens, spins):
```
http://127.0.0.1:8001
```

**Docs:**
- Main API: http://127.0.0.1:8000/docs
- Auth API: http://127.0.0.1:8001/docs

---

## Troubleshooting

**Q: Database not created?**
A: Run `python auth_db.py` once to initialize.

**Q: Port 8001 already in use?**
A: Change port in `auth_db.py` line 299 or use: `uvicorn auth_db:app --port 8002`

**Q: Can't register (email already exists)?**
A: Use unique email/username combo.

**Q: Spin limit exceeded?**
A: Limit resets daily at UTC midnight.

---

## Next Steps

1. **Test via Swagger UI**: http://127.0.0.1:8001/docs
2. **Integrate with frontend** using code examples from guide
3. **Create admin dashboard** to manage users
4. **Add email verification** (future feature)
5. **Set up daily tasks** (email reminders, bonus distribution)

---

## Support

For issues:
1. Check `AUTH_API_DOCUMENTATION.md` for detailed API reference
2. Review `FRONTEND_INTEGRATION_GUIDE.py` for code examples
3. Check SQLite database: `cricket_auth.db` in backend folder

---

**Version:** 1.0.0  
**Created:** December 5, 2025  
**Status:** Ready to use ✓
