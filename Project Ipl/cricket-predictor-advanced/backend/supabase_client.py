"""
Supabase Configuration and Client
Handles connection to Supabase for user authentication and data storage.
"""

import os
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://jbgrchrnhhvzmnwsqtbs.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiZ3JjaHJuaGh2em1ud3NxdGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODM0NzksImV4cCI6MjA4NzI1OTQ3OX0.HhQVhE4xHe86YSOY4yYMUksPB1N7Q0f_xggIH-L2ukY"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

def get_supabase() -> Client:
    """Get Supabase client instance"""
    return supabase


# ==================== User Authentication ====================

def signup_user(email: str, password: str, display_name: str = None, username: str = None):
    """
    Register a new user with Supabase Auth and create profile in users table.
    
    Args:
        email: User's email address
        password: User's password (min 6 characters)
        display_name: User's display name
        username: User's unique username
    
    Returns:
        dict with user data or error
    """
    try:
        # Sign up with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "display_name": display_name or username or email.split("@")[0],
                    "username": username or email.split("@")[0]
                }
            }
        })
        
        if auth_response.user:
            user_id = auth_response.user.id
            
            # Create user profile in users table
            profile_data = {
                "id": user_id,
                "email": email,
                "username": username or email.split("@")[0],
                "display_name": display_name or username or email.split("@")[0],
                "tokens": 100,  # Default tokens
                "referral_code": user_id[:8].upper(),
                "is_active": True
            }
            
            # Insert into users table
            profile_response = supabase.table("users").insert(profile_data).execute()
            
            return {
                "ok": True,
                "user": {
                    "id": user_id,
                    "email": email,
                    "username": profile_data["username"],
                    "display_name": profile_data["display_name"],
                    "tokens": profile_data["tokens"],
                    "referral_code": profile_data["referral_code"]
                },
                "session": auth_response.session
            }
        else:
            return {"ok": False, "error": "Signup failed"}
            
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg.lower() or "already exists" in error_msg.lower():
            return {"ok": False, "error": "email already registered"}
        if "user_username_key" in error_msg.lower():
            return {"ok": False, "error": "username exists"}
        print(f"Supabase signup error: {e}")
        return {"ok": False, "error": str(e)}


def login_user(email: str, password: str):
    """
    Authenticate user with Supabase Auth.
    
    Args:
        email: User's email or username
        password: User's password
    
    Returns:
        dict with user data and session or error
    """
    try:
        # Try to login with email
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if auth_response.user:
            user_id = auth_response.user.id
            
            # Get user profile from users table
            profile = supabase.table("users").select("*").eq("id", user_id).single().execute()
            
            user_data = profile.data if profile.data else {
                "id": user_id,
                "email": auth_response.user.email,
                "username": auth_response.user.user_metadata.get("username", email.split("@")[0]),
                "display_name": auth_response.user.user_metadata.get("display_name", email.split("@")[0]),
                "tokens": 100,
                "referral_code": user_id[:8].upper()
            }
            
            # Update last_login
            supabase.table("users").update({"last_login": "now()"}).eq("id", user_id).execute()
            
            return {
                "ok": True,
                "user": user_data,
                "token": auth_response.session.access_token if auth_response.session else None
            }
        else:
            return {"ok": False, "error": "Invalid credentials"}
            
    except Exception as e:
        error_msg = str(e).lower()
        if "invalid" in error_msg or "credentials" in error_msg:
            return {"ok": False, "error": "Invalid email or password"}
        print(f"Supabase login error: {e}")
        return {"ok": False, "error": "Login failed"}


def login_with_username(username: str, password: str):
    """
    Login using username instead of email.
    First looks up the email from users table, then authenticates.
    
    Args:
        username: User's username
        password: User's password
    
    Returns:
        dict with user data and session or error
    """
    try:
        # First, find user by username to get email
        user_lookup = supabase.table("users").select("email").eq("username", username).single().execute()
        
        if not user_lookup.data:
            return {"ok": False, "error": "User not found"}
        
        email = user_lookup.data["email"]
        
        # Now login with email
        return login_user(email, password)
        
    except Exception as e:
        print(f"Username login error: {e}")
        return {"ok": False, "error": "Login failed"}


def logout_user(access_token: str = None):
    """Sign out user"""
    try:
        supabase.auth.sign_out()
        return {"ok": True}
    except Exception as e:
        print(f"Logout error: {e}")
        return {"ok": False, "error": str(e)}


def get_user_by_id(user_id: str):
    """Get user profile by ID"""
    try:
        response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        if response.data:
            return {"ok": True, "user": response.data}
        return {"ok": False, "error": "User not found"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def get_user_by_username(username: str):
    """Get user profile by username"""
    try:
        response = supabase.table("users").select("*").eq("username", username).single().execute()
        if response.data:
            # Remove sensitive fields
            user_data = dict(response.data)
            user_data.pop("password_hash", None)
            user_data.pop("salt", None)
            return {"ok": True, "user": user_data}
        return {"ok": False, "error": "User not found"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def update_user_tokens(user_id: str, tokens: int):
    """Update user's token balance"""
    try:
        response = supabase.table("users").update({"tokens": tokens}).eq("id", user_id).execute()
        return {"ok": True, "tokens": tokens}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def deduct_tokens(user_id: str, amount: int = 1):
    """Deduct tokens from user's balance"""
    try:
        # Get current tokens
        user = supabase.table("users").select("tokens").eq("id", user_id).single().execute()
        if not user.data:
            return {"ok": False, "error": "User not found"}
        
        current_tokens = user.data["tokens"]
        if current_tokens < amount:
            return {"ok": False, "error": "Insufficient tokens"}
        
        new_balance = current_tokens - amount
        supabase.table("users").update({"tokens": new_balance}).eq("id", user_id).execute()
        
        return {"ok": True, "tokens": new_balance}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def add_tokens(user_id: str, amount: int):
    """Add tokens to user's balance"""
    try:
        # Get current tokens
        user = supabase.table("users").select("tokens").eq("id", user_id).single().execute()
        if not user.data:
            return {"ok": False, "error": "User not found"}
        
        new_balance = user.data["tokens"] + amount
        supabase.table("users").update({"tokens": new_balance}).eq("id", user_id).execute()
        
        return {"ok": True, "tokens": new_balance}
    except Exception as e:
        return {"ok": False, "error": str(e)}


# ==================== Referral System ====================

def apply_referral(user_id: str, referral_code: str):
    """Apply referral code and give bonus to both users"""
    try:
        # Find referrer by code
        referrer = supabase.table("users").select("*").eq("referral_code", referral_code).single().execute()
        
        if not referrer.data:
            return {"ok": False, "error": "Invalid referral code"}
        
        if referrer.data["id"] == user_id:
            return {"ok": False, "error": "Cannot use your own referral code"}
        
        # Update referred user
        supabase.table("users").update({"referred_by": referral_code}).eq("id", user_id).execute()
        
        # Give bonus tokens to both
        add_tokens(user_id, 50)  # Bonus for new user
        add_tokens(referrer.data["id"], 25)  # Bonus for referrer
        
        return {"ok": True, "message": "Referral applied! You earned 50 bonus tokens."}
    except Exception as e:
        return {"ok": False, "error": str(e)}


# ==================== Initialization ====================

def create_users_table_sql():
    """
    SQL to create users table in Supabase.
    Run this in Supabase SQL Editor.
    """
    return """
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        tokens INTEGER DEFAULT 100,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE
    );

    -- Create index on username for faster lookups
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);

    -- Enable Row Level Security
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;

    -- Policy: Users can read their own data
    CREATE POLICY "Users can view own profile" ON users
        FOR SELECT USING (auth.uid() = id);

    -- Policy: Users can update their own data
    CREATE POLICY "Users can update own profile" ON users
        FOR UPDATE USING (auth.uid() = id);

    -- Policy: Allow insert during signup
    CREATE POLICY "Enable insert for signup" ON users
        FOR INSERT WITH CHECK (true);

    -- Policy: Allow service role full access
    CREATE POLICY "Service role has full access" ON users
        USING (current_setting('request.jwt.claim.role', true) = 'service_role');
    """


if __name__ == "__main__":
    print("Supabase Configuration")
    print(f"URL: {SUPABASE_URL}")
    print("\n--- SQL to create users table ---")
    print(create_users_table_sql())
