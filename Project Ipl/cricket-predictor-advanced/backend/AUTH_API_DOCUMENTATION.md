# Cricket Auth Database API Documentation

## Overview

The **Cricket Auth Database API** (`auth_db.py`) is a FastAPI-based authentication service that provides persistent user storage, session management, and token economy integration using SQLite database.

### Key Features

- ✅ **User Registration & Login** with password hashing (SHA-256 with salt)
- ✅ **SQLite Database** for persistent user storage
- ✅ **Token Management** system (add/deduct tokens, track balance)
- ✅ **Referral Program** with bonus tracking
- ✅ **Spin Tracking** with daily limits (2 spins/day, UTC reset)
- ✅ **User Profile Management** (update email/password, delete account)
- ✅ **Admin Endpoints** for user management

---

## Installation & Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Required packages:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlalchemy` - ORM for database
- `pydantic` - Data validation
- `email-validator` - Email format validation

### 2. Initialize Database

The database (`cricket_auth.db`) is automatically created on first startup.

```bash
python auth_db.py
```

This will:
- Create SQLite database file
- Create all tables (users, tokens, spins)
- Start the service on `http://127.0.0.1:8001`

### 3. Run the Service

**Option A: Standalone (for testing)**
```bash
python auth_db.py
```

**Option B: With Uvicorn (production)**
```bash
uvicorn auth_db:app --host 127.0.0.1 --port 8001 --reload
```

---

## API Endpoints

### Base URL
```
http://127.0.0.1:8001
```

### Interactive API Documentation
```
http://127.0.0.1:8001/docs        # Swagger UI
http://127.0.0.1:8001/redoc       # ReDoc
```

---

## Authentication Endpoints

### 1. Register New User
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "cricket_fan",
  "email": "user@example.com",
  "password": "secure_password_123",
  "referral_code": "REF_ABC123"  // Optional
}
```

**Response (201):**
```json
{
  "access_token": "token_string_here",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "cricket_fan",
    "email": "user@example.com",
    "tokens": 100,
    "created_at": "2025-12-05T10:30:00",
    "last_login": null,
    "is_active": true,
    "referral_code": "REF_UNIQUE123",
    "referral_count": 0
  }
}
```

**Features:**
- New users start with **100 tokens**
- Auto-generated unique referral code
- If `referral_code` provided and valid, referrer gets **+10 tokens**
- Passwords securely hashed with SHA-256 + salt

---

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "cricket_fan",
  "password": "secure_password_123"
}
```

**Response (200):**
```json
{
  "access_token": "token_string_here",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "cricket_fan",
    "email": "user@example.com",
    "tokens": 100,
    "created_at": "2025-12-05T10:30:00",
    "last_login": "2025-12-05T15:45:30",
    "is_active": true,
    "referral_code": "REF_UNIQUE123",
    "referral_count": 0
  }
}
```

**Error Responses:**
- `401`: Invalid username or password
- `403`: Account is inactive

---

### 3. Get User Profile
**GET** `/auth/user/{username}`

**Response (200):**
```json
{
  "id": 1,
  "username": "cricket_fan",
  "email": "user@example.com",
  "tokens": 115,
  "created_at": "2025-12-05T10:30:00",
  "last_login": "2025-12-05T15:45:30",
  "is_active": true,
  "referral_code": "REF_UNIQUE123",
  "referral_count": 1
}
```

---

### 4. Update User Profile
**PUT** `/auth/user/{username}`

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "password": "new_password_456"
}
```

Both fields are optional. Update only what you need.

**Response (200):**
```json
{
  "id": 1,
  "username": "cricket_fan",
  "email": "newemail@example.com",
  "tokens": 115,
  "created_at": "2025-12-05T10:30:00",
  "last_login": "2025-12-05T15:45:30",
  "is_active": true,
  "referral_code": "REF_UNIQUE123",
  "referral_count": 1
}
```

---

### 5. Delete User Account
**DELETE** `/auth/user/{username}`

**Response (200):**
```json
{
  "message": "User cricket_fan has been deactivated"
}
```

Note: Accounts are soft-deleted (marked inactive, not removed from database).

---

## User Management Endpoints

### 6. List All Users
**GET** `/auth/users`

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "cricket_fan",
    "email": "user@example.com",
    "tokens": 115,
    "created_at": "2025-12-05T10:30:00",
    "last_login": "2025-12-05T15:45:30",
    "is_active": true,
    "referral_code": "REF_UNIQUE123",
    "referral_count": 1
  }
]
```

---

### 7. Get User Token Balance
**GET** `/auth/user/{username}/tokens`

**Response (200):**
```json
{
  "username": "cricket_fan",
  "tokens": 115,
  "referral_bonus": 10.0,
  "referral_count": 1
}
```

---

### 8. Add Tokens
**POST** `/auth/user/{username}/add-tokens?amount=50`

**Query Parameter:**
- `amount` (integer): Number of tokens to add (must be positive)

**Response (200):**
```json
{
  "username": "cricket_fan",
  "tokens": 165,
  "added": 50
}
```

---

### 9. Deduct Tokens
**POST** `/auth/user/{username}/deduct-tokens?amount=10`

**Query Parameter:**
- `amount` (integer): Number of tokens to deduct (must be positive)

**Response (200):**
```json
{
  "username": "cricket_fan",
  "tokens": 155,
  "deducted": 10
}
```

**Error Responses:**
- `400`: Insufficient tokens

---

## Referral System Endpoints

### 10. Get Referral Info
**GET** `/auth/user/{username}/referral`

**Response (200):**
```json
{
  "username": "cricket_fan",
  "referral_code": "REF_UNIQUE123",
  "referral_count": 2,
  "referral_bonus": 20.0,
  "total_tokens": 120
}
```

**Referral Rewards:**
- Each successful referral: **+10 tokens** to referrer
- Tracked via `referral_count` and `referral_bonus` fields

---

## Spin System Endpoints

### 11. Get Spin Status
**GET** `/auth/user/{username}/spin-status`

**Response (200):**
```json
{
  "username": "cricket_fan",
  "spins_left": 2,
  "last_reward": 50,
  "today_date": "2025-12-05"
}
```

**Daily Spin Limit:**
- Maximum **2 spins per day**
- Resets at **UTC midnight**
- Returns `spins_left` (0-2)

---

### 12. Record Spin & Award Reward
**POST** `/auth/user/{username}/spin?reward=50`

**Query Parameter:**
- `reward` (integer): Reward amount to add to user tokens

**Response (200):**
```json
{
  "username": "cricket_fan",
  "reward": 50,
  "tokens": 205,
  "spins_left": 1
}
```

**Error Responses:**
- `400`: Daily spin limit exceeded

**Spin Rewards (Suggested):**
- Common: 5, 15 tokens
- Rare: 50, 100 tokens

---

## Health Check

### 13. Service Health
**GET** `/auth/health`

**Response (200):**
```json
{
  "status": "online",
  "service": "Cricket Auth Database API",
  "database": "SQLite"
}
```

---

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer | Primary key |
| `username` | String | Unique username |
| `email` | String | Unique email address |
| `password_hash` | String | SHA-256 hashed password |
| `salt` | String | Random salt for hashing |
| `tokens` | Integer | User's token balance (default: 100) |
| `created_at` | DateTime | Account creation timestamp |
| `last_login` | DateTime | Last login timestamp |
| `is_active` | Boolean | Account status (true = active) |
| `referral_code` | String | Unique referral code |
| `referral_count` | Integer | Number of successful referrals |
| `referral_bonus` | Float | Total referral bonus earned |
| `spin_count` | Integer | Number of spins today |
| `spin_date` | String | Date of last spin (YYYY-MM-DD) |
| `spin_last_reward` | Integer | Last spin reward amount |

---

## Security Features

### Password Hashing
- **Algorithm**: SHA-256
- **Salt**: 16-byte random hex string
- **Format**: `hash(salt + password)`
- Each user has unique salt, preventing rainbow table attacks

### Token Generation
- **Format**: URL-safe base64 encoded 32-byte random string
- **Purpose**: Session management and API access

### User Privacy
- **Soft Delete**: Deleted users marked inactive, not removed from DB
- **Email Validation**: Valid email format required
- **Password Requirements**: No length requirement (can be enforced in frontend)

---

## Integration Examples

### 1. Register with Referral
```bash
curl -X POST "http://127.0.0.1:8001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "new_user",
    "email": "new@example.com",
    "password": "password123",
    "referral_code": "REF_UNIQUE123"
  }'
```

### 2. Login & Get Token
```bash
curl -X POST "http://127.0.0.1:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cricket_fan",
    "password": "secure_password_123"
  }'
```

### 3. Check User Balance
```bash
curl "http://127.0.0.1:8001/auth/user/cricket_fan/tokens"
```

### 4. Award Spin Reward
```bash
curl -X POST "http://127.0.0.1:8001/auth/user/cricket_fan/spin?reward=50"
```

---

## Running Multiple Services

You can run both `api.py` and `auth_db.py` simultaneously:

**Terminal 1 - Main API:**
```bash
uvicorn api:app --port 8000
```

**Terminal 2 - Auth Database API:**
```bash
uvicorn auth_db:app --port 8001
```

---

## Troubleshooting

### Q: Database file not created?
**A:** Ensure the `backend/` directory is writable. Run `python auth_db.py` to initialize.

### Q: "Username or email already exists"?
**A:** Use a unique username and email for registration.

### Q: User can't login?
**A:** Check:
- Username is correct (case-sensitive)
- Password is correct
- Account is active (`is_active: true`)

### Q: Spin limit exceeded but it's tomorrow?
**A:** Ensure server time is set correctly. Spin date resets at **UTC midnight**.

---

## Best Practices

1. **Use HTTPS in production** to protect passwords in transit
2. **Store tokens securely** on frontend (avoid localStorage for sensitive data)
3. **Implement rate limiting** to prevent brute force attacks
4. **Regular backups** of `cricket_auth.db` file
5. **Monitor login attempts** for suspicious activity
6. **Set strong password policies** in frontend validation

---

## Future Enhancements

- JWT token support for stateless authentication
- Email verification on registration
- Password reset via email
- Two-factor authentication (2FA)
- User activity logging
- Session management with token expiry
- Admin dashboard for user management
- Bulk user import/export

---

## Support & Contributions

For issues or feature requests, please refer to the project's main documentation or contact the development team.

**Last Updated:** December 5, 2025
**Version:** 1.0.0
