"""
Supabase Client for IPL Cricket Predictor
Handles user management via direct Supabase PostgreSQL database.

Features:
- User signup/login with email and password
- Username-based authentication (no email verification needed!)
- Token management
- Referral system
- Cloud-based PostgreSQL storage (direct table access)
"""

from supabase import create_client, Client
from datetime import datetime
import uuid
import hashlib
import secrets

# Supabase credentials
SUPABASE_URL = "https://jbgrchrnhhvzmnwsqtbs.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZ3JjaHJuaGh2em1ud3NxdGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODM0NzksImV4cCI6MjA4NzI1OTQ3OX0.HhQVhE4xHe86YSOY4yYMUksPB1N7Q0f_xggIH-L2ukY"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_supabase() -> Client:
    """Get Supabase client instance"""
    return supabase


# ==================== Password Hashing ====================

def hash_password(password: str, salt: str = None) -> tuple:
    """Hash password with salt using SHA-256"""
    if salt is None:
        salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256(f"{password}{salt}".encode()).hexdigest()
    return pwd_hash, salt

def verify_password(password: str, pwd_hash: str, salt: str) -> bool:
    """Verify password against hash"""
    check_hash, _ = hash_password(password, salt)
    return check_hash == pwd_hash


# ==================== User Authentication ====================

def signup_user(email: str, password: str, display_name: str = None, username: str = None):
    """
    Register a new user directly in Supabase users table (no email verification).
    
    Args:
        email: User's email address
        password: User's password (min 6 characters)
        display_name: User's display name
        username: User's unique username
    
    Returns:
        dict with user data or error
    """
    try:
        # Check if email already exists
        email_check = supabase.table("users").select("id").eq("email", email).execute()
        if email_check.data and len(email_check.data) > 0:
            return {"ok": False, "error": "email already registered"}
        
        # Check if username already exists
        final_username = username or email.split("@")[0]
        username_check = supabase.table("users").select("id").eq("username", final_username).execute()
        if username_check.data and len(username_check.data) > 0:
            return {"ok": False, "error": "username exists"}
        
        # Hash password
        pwd_hash, salt = hash_password(password)
        
        # Generate user ID and referral code
        user_id = str(uuid.uuid4())
        referral_code = user_id[:8].upper()
        
        # Create user profile in users table
        profile_data = {
            "id": user_id,
            "email": email,
            "username": final_username,
            "display_name": display_name or final_username,
            "password_hash": pwd_hash,
            "password_salt": salt,
            "tokens": 100,
            "referral_code": referral_code,
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Insert into Supabase users table
        result = supabase.table("users").insert(profile_data).execute()
        
        if result.data:
            print(f"[SUPABASE] User {final_username} registered in cloud database!")
            return {
                "ok": True,
                "user": {
                    "id": user_id,
                    "email": email,
                    "username": final_username,
                    "display_name": profile_data["display_name"],
                    "tokens": profile_data["tokens"],
                    "referral_code": referral_code
                }
            }
        else:
            return {"ok": False, "error": "Failed to create user"}
            
    except Exception as e:
        error_msg = str(e)
        print(f"Supabase signup error: {e}")
        if "duplicate" in error_msg.lower() or "unique" in error_msg.lower():
            if "email" in error_msg.lower():
                return {"ok": False, "error": "email already registered"}
            if "username" in error_msg.lower():
                return {"ok": False, "error": "username exists"}
        return {"ok": False, "error": str(e)}


def login_user(email: str, password: str):
    """
    Authenticate user directly from Supabase users table.
    
    Args:
        email: User's email
        password: User's password
    
    Returns:
        dict with user data or error
    """
    try:
        # Find user by email
        result = supabase.table("users").select("*").eq("email", email).execute()
        
        if not result.data or len(result.data) == 0:
            return {"ok": False, "error": "Invalid email or password"}
        
        user = result.data[0]
        
        # Verify password
        if not verify_password(password, user.get("password_hash", ""), user.get("password_salt", "")):
            return {"ok": False, "error": "Invalid email or password"}
        
        # Update last_login
        supabase.table("users").update({"last_login": datetime.utcnow().isoformat()}).eq("id", user["id"]).execute()
        
        print(f"[SUPABASE] User {user['username']} logged in!")
        return {
            "ok": True,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "username": user["username"],
                "display_name": user.get("display_name", user["username"]),
                "tokens": user.get("tokens", 100),
                "referral_code": user.get("referral_code", "")
            },
            "token": user["id"]
        }
            
    except Exception as e:
        print(f"Supabase login error: {e}")
        return {"ok": False, "error": "Login failed"}


def login_with_username(username: str, password: str):
    """
    Login using username instead of email.
    
    Args:
        username: User's username
        password: User's password
    
    Returns:
        dict with user data or error
    """
    try:
        # Find user by username
        result = supabase.table("users").select("*").eq("username", username).execute()
        
        if not result.data or len(result.data) == 0:
            return {"ok": False, "error": "User not found"}
        
        user = result.data[0]
        
        # Verify password
        if not verify_password(password, user.get("password_hash", ""), user.get("password_salt", "")):
            return {"ok": False, "error": "Invalid password"}
        
        # Update last_login
        supabase.table("users").update({"last_login": datetime.utcnow().isoformat()}).eq("id", user["id"]).execute()
        
        print(f"[SUPABASE] User {user['username']} logged in!")
        return {
            "ok": True,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "username": user["username"],
                "display_name": user.get("display_name", user["username"]),
                "tokens": user.get("tokens", 100),
                "referral_code": user.get("referral_code", "")
            },
            "token": user["id"]
        }
            
    except Exception as e:
        print(f"Supabase login error: {e}")
        return {"ok": False, "error": "Login failed"}


def get_user_by_id(user_id: str):
    """Get user profile by ID from Supabase"""
    try:
        result = supabase.table("users").select("*").eq("id", user_id).execute()
        if result.data and len(result.data) > 0:
            user = result.data[0]
            return {
                "ok": True,
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "username": user["username"],
                    "display_name": user.get("display_name", user["username"]),
                    "tokens": user.get("tokens", 100),
                    "referral_code": user.get("referral_code", "")
                }
            }
        return {"ok": False, "error": "User not found"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


# ==================== Token Management ====================

def add_tokens(user_id: str, amount: int) -> dict:
    """Add tokens to user account"""
    try:
        user = supabase.table("users").select("tokens").eq("id", user_id).execute()
        if not user.data:
            return {"ok": False, "error": "User not found"}
        
        current_tokens = user.data[0].get("tokens", 0)
        new_tokens = current_tokens + amount
        
        supabase.table("users").update({"tokens": new_tokens}).eq("id", user_id).execute()
        
        return {"ok": True, "tokens": new_tokens}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def deduct_tokens(user_id: str, amount: int) -> dict:
    """Deduct tokens from user account"""
    try:
        user = supabase.table("users").select("tokens").eq("id", user_id).execute()
        if not user.data:
            return {"ok": False, "error": "User not found"}
        
        current_tokens = user.data[0].get("tokens", 0)
        if current_tokens < amount:
            return {"ok": False, "error": "Insufficient tokens"}
        
        new_tokens = current_tokens - amount
        supabase.table("users").update({"tokens": new_tokens}).eq("id", user_id).execute()
        
        return {"ok": True, "tokens": new_tokens}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def get_tokens(user_id: str) -> dict:
    """Get user's current token balance"""
    try:
        user = supabase.table("users").select("tokens").eq("id", user_id).execute()
        if user.data:
            return {"ok": True, "tokens": user.data[0].get("tokens", 0)}
        return {"ok": False, "error": "User not found"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


# ==================== Referral System ====================

def apply_referral(user_id: str, referral_code: str) -> dict:
    """Apply a referral code to give bonus tokens to both users"""
    try:
        # Find the referrer by referral code
        referrer = supabase.table("users").select("*").eq("referral_code", referral_code.upper()).execute()
        if not referrer.data:
            return {"ok": False, "error": "Invalid referral code"}
        
        referrer_data = referrer.data[0]
        
        # Can't refer yourself
        if referrer_data["id"] == user_id:
            return {"ok": False, "error": "Cannot use your own referral code"}
        
        # Check if user already used a referral
        user = supabase.table("users").select("referred_by").eq("id", user_id).execute()
        if user.data and user.data[0].get("referred_by"):
            return {"ok": False, "error": "Referral already applied"}
        
        # Update user's referred_by field
        supabase.table("users").update({"referred_by": referrer_data["id"]}).eq("id", user_id).execute()
        
        # Add bonus tokens to both users (50 each)
        add_tokens(user_id, 50)
        add_tokens(referrer_data["id"], 50)
        
        return {"ok": True, "message": "Referral applied! Both users received 50 bonus tokens"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def get_all_users():
    """Get all users from Supabase (admin function)"""
    try:
        result = supabase.table("users").select("id, email, username, display_name, tokens, referral_code, is_active, created_at").execute()
        return {"ok": True, "users": result.data}
    except Exception as e:
        return {"ok": False, "error": str(e)}
