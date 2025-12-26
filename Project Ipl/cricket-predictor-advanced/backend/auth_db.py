"""
Authentication Database Service
Handles user registration, login, and storage with SQLite + SQLAlchemy
"""

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, String, Integer, DateTime, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import hashlib
import secrets
from functools import lru_cache
import os

# Database setup
DATABASE_URL = "sqlite:///./cricket_auth.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==================== Database Models ====================

class User(Base):
    """SQLAlchemy User model for database storage"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    tokens = Column(Integer, default=100)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    referral_code = Column(String, unique=True, index=True, nullable=True)
    referral_count = Column(Integer, default=0)
    referral_bonus = Column(Float, default=0.0)
    
    # Spin tracking
    spin_count = Column(Integer, default=0)
    spin_date = Column(String, nullable=True)  # Stores date as YYYY-MM-DD
    spin_last_reward = Column(Integer, default=0)
    
    def __repr__(self):
        return f"<User(username={self.username}, email={self.email}, tokens={self.tokens})>"


# ==================== Pydantic Models ====================

class UserRegister(BaseModel):
    """Request schema for user registration"""
    username: str
    email: str
    password: str
    referral_code: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "username": "cricket_fan",
                "email": "user@example.com",
                "password": "secure_password_123",
                "referral_code": "REF_CODE_123"
            }
        }


class UserLogin(BaseModel):
    """Request schema for user login"""
    username: str
    password: str
    
    class Config:
        schema_extra = {
            "example": {
                "username": "cricket_fan",
                "password": "secure_password_123"
            }
        }


class UserResponse(BaseModel):
    """Response schema for user data"""
    id: int
    username: str
    email: str
    tokens: int
    created_at: datetime
    last_login: Optional[datetime]
    is_active: bool
    referral_code: str
    referral_count: int
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Response schema for authentication token"""
    access_token: str
    token_type: str
    user: UserResponse


class UserUpdate(BaseModel):
    """Request schema for updating user profile"""
    email: Optional[str] = None
    password: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "email": "newemail@example.com",
                "password": "new_password_123"
            }
        }


# ==================== Password Hashing ====================

def hash_password(password: str, salt: str = None) -> tuple:
    """Hash password with salt using SHA-256"""
    if salt is None:
        salt = secrets.token_hex(16)
    
    password_hash = hashlib.sha256((salt + password).encode()).hexdigest()
    return password_hash, salt


def verify_password(password: str, password_hash: str, salt: str) -> bool:
    """Verify password against stored hash"""
    computed_hash, _ = hash_password(password, salt)
    return computed_hash == password_hash


# ==================== Database Dependency ====================

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==================== Database Initialization ====================

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")


# ==================== FastAPI Application ====================

app = FastAPI(
    title="Cricket Auth Database API",
    description="Authentication service with SQLite database storage",
    version="1.0.0"
)

# ==================== Authentication Endpoints ====================

@app.on_event("startup")
def startup_event():
    """Initialize database on startup"""
    init_db()


@app.post("/auth/register", response_model=TokenResponse, tags=["Authentication"])
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user with email and password
    
    Returns:
        - access_token: JWT-like token for session management
        - user: User profile data
    """
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.username == user_data.username) | (User.email == user_data.email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Generate referral code
    referral_code = f"REF_{secrets.token_hex(8).upper()}"
    
    # Hash password
    password_hash, salt = hash_password(user_data.password)
    
    # Create new user
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=password_hash,
        salt=salt,
        tokens=100,  # Starting tokens
        referral_code=referral_code,
        created_at=datetime.utcnow()
    )
    
    # Handle referral bonus
    if user_data.referral_code:
        referrer = db.query(User).filter(User.referral_code == user_data.referral_code).first()
        if referrer:
            referrer.referral_count += 1
            referrer.tokens += 10  # Bonus for referrer
            referrer.referral_bonus += 10.0
    
    # Add user to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token
    token = secrets.token_urlsafe(32)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(new_user)
    }


@app.post("/auth/login", response_model=TokenResponse, tags=["Authentication"])
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user with username and password
    
    Returns:
        - access_token: JWT-like token for session management
        - user: User profile data
    """
    # Find user
    user = db.query(User).filter(User.username == credentials.username).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash, user.salt):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    # Generate token
    token = secrets.token_urlsafe(32)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }


@app.get("/auth/user/{username}", response_model=UserResponse, tags=["User Profile"])
def get_user(username: str, db: Session = Depends(get_db)):
    """Get user profile by username"""
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse.from_orm(user)


@app.put("/auth/user/{username}", response_model=UserResponse, tags=["User Profile"])
def update_user(username: str, user_update: UserUpdate, db: Session = Depends(get_db)):
    """Update user profile (email and/or password)"""
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.email:
        # Check if email already exists
        existing = db.query(User).filter(User.email == user_update.email).first()
        if existing and existing.id != user.id:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = user_update.email
    
    if user_update.password:
        password_hash, salt = hash_password(user_update.password)
        user.password_hash = password_hash
        user.salt = salt
    
    db.commit()
    db.refresh(user)
    
    return UserResponse.from_orm(user)


@app.delete("/auth/user/{username}", tags=["User Profile"])
def delete_user(username: str, db: Session = Depends(get_db)):
    """Delete user account (soft delete by marking inactive)"""
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = False
    db.commit()
    
    return {"message": f"User {username} has been deactivated"}


# ==================== User Management Endpoints ====================

@app.get("/auth/users", tags=["Admin"])
def list_all_users(db: Session = Depends(get_db)):
    """
    Get all registered users (Admin endpoint)
    
    Returns list of all users with their profile data
    """
    users = db.query(User).filter(User.is_active == True).all()
    return [UserResponse.from_orm(user) for user in users]


@app.get("/auth/user/{username}/tokens", tags=["User Profile"])
def get_user_tokens(username: str, db: Session = Depends(get_db)):
    """Get user's current token balance"""
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": username,
        "tokens": user.tokens,
        "referral_bonus": user.referral_bonus,
        "referral_count": user.referral_count
    }


@app.post("/auth/user/{username}/add-tokens", tags=["User Management"])
def add_tokens(username: str, amount: int, db: Session = Depends(get_db)):
    """Add tokens to user account"""
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.tokens += amount
    db.commit()
    db.refresh(user)
    
    return {
        "username": username,
        "tokens": user.tokens,
        "added": amount
    }


@app.post("/auth/user/{username}/deduct-tokens", tags=["User Management"])
def deduct_tokens(username: str, amount: int, db: Session = Depends(get_db)):
    """Deduct tokens from user account"""
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.tokens < amount:
        raise HTTPException(status_code=400, detail="Insufficient tokens")
    
    user.tokens -= amount
    db.commit()
    db.refresh(user)
    
    return {
        "username": username,
        "tokens": user.tokens,
        "deducted": amount
    }


# ==================== Referral Endpoints ====================

@app.get("/auth/user/{username}/referral", tags=["Referral"])
def get_referral_info(username: str, db: Session = Depends(get_db)):
    """Get user's referral information"""
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": username,
        "referral_code": user.referral_code,
        "referral_count": user.referral_count,
        "referral_bonus": user.referral_bonus,
        "total_tokens": user.tokens
    }


# ==================== Spin Tracking Endpoints ====================

@app.get("/auth/user/{username}/spin-status", tags=["Spin"])
def get_spin_status(username: str, db: Session = Depends(get_db)):
    """Get user's spin status and remaining spins for today"""
    from datetime import date
    
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    today = str(date.today())
    spins_left = 2
    
    if user.spin_date == today:
        spins_left = max(0, 2 - user.spin_count)
    else:
        # Reset spins for new day
        user.spin_count = 0
        user.spin_date = today
        db.commit()
        spins_left = 2
    
    return {
        "username": username,
        "spins_left": spins_left,
        "last_reward": user.spin_last_reward,
        "today_date": today
    }


@app.post("/auth/user/{username}/spin", tags=["Spin"])
def record_spin(username: str, reward: int, db: Session = Depends(get_db)):
    """Record a spin and update user tokens with reward"""
    from datetime import date
    
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    today = str(date.today())
    
    # Reset if new day
    if user.spin_date != today:
        user.spin_count = 0
        user.spin_date = today
    
    # Check spin limit
    if user.spin_count >= 2:
        raise HTTPException(status_code=400, detail="Daily spin limit exceeded")
    
    # Update user
    user.spin_count += 1
    user.spin_last_reward = reward
    user.tokens += reward
    
    db.commit()
    db.refresh(user)
    
    return {
        "username": username,
        "reward": reward,
        "tokens": user.tokens,
        "spins_left": max(0, 2 - user.spin_count)
    }


# ==================== Health Check ====================

@app.get("/auth/health", tags=["Health"])
def health_check():
    """Check if authentication service is running"""
    return {
        "status": "online",
        "service": "Cricket Auth Database API",
        "database": "SQLite"
    }


if __name__ == "__main__":
    import uvicorn
    init_db()
    uvicorn.run(app, host="127.0.0.1", port=8002)
