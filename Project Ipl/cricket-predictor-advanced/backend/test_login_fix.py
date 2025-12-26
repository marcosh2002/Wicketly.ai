#!/usr/bin/env python
"""Test script to verify login fix for plaintext passwords."""

import json
import sys
from passlib.context import CryptContext

# Initialize password context
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Read users
with open("data/users.json", "r") as f:
    users = json.load(f)

print("=" * 60)
print("LOGIN FIX TEST")
print("=" * 60)

# Test cases
test_cases = [
    ("Marcosh69", "123456", "Plaintext password - correct"),
    ("Marcosh69", "Password", "Plaintext password - incorrect (wrong case)"),
    ("testuser", "password123", "Plaintext password - another user"),
    ("autotest", "autotest123", "Hashed password - should fail without knowing original"),
]

for username, password, description in test_cases:
    print(f"\n{description}")
    print(f"  Username: {username}")
    print(f"  Password: {password}")
    
    # Simulate the login logic
    target = username.strip().lower()
    u = next((x for x in users if x.get("username", "").strip().lower() == target or 
              (x.get("email", "") and x.get("email", "").strip().lower() == target)), None)
    
    if not u:
        print("  ❌ Result: user not found")
        continue
    
    hashed = u.get("password", "")
    
    # Check if password is hashed
    if hashed.startswith("$pbkdf2"):
        try:
            verified = pwd_context.verify(password, hashed)
        except Exception as e:
            verified = False
            print(f"  Hashed password verification error: {e}")
    else:
        # Handle plaintext passwords
        verified = (password == hashed)
    
    print(f"  Stored password: {hashed[:30]}..." if len(hashed) > 30 else f"  Stored password: {hashed}")
    print(f"  ✅ Result: Login successful" if verified else f"  ❌ Result: invalid credentials")

print("\n" + "=" * 60)
print("Test complete!")
print("=" * 60)
