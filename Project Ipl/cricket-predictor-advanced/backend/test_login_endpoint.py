#!/usr/bin/env python
"""Test the actual login endpoint with FastAPI TestClient."""

from fastapi.testclient import TestClient
import sys
sys.path.insert(0, '.')

from api import app

client = TestClient(app)

print("=" * 70)
print("TESTING LOGIN ENDPOINT")
print("=" * 70)

# Test 1: Correct credentials
print("\n1. Testing Marcosh69 with correct password (123456):")
response = client.post(
    "/users/login",
    data={"username_or_email": "Marcosh69", "password": "123456"}
)
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# Test 2: Wrong password
print("\n2. Testing Marcosh69 with wrong password (Password):")
response = client.post(
    "/users/login",
    data={"username_or_email": "Marcosh69", "password": "Password"}
)
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# Test 3: With email
print("\n3. Testing with email (subhrodeepbanerjee2002@gmail.com) and correct password:")
response = client.post(
    "/users/login",
    data={"username_or_email": "subhrodeepbanerjee2002@gmail.com", "password": "123456"}
)
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

print("\n" + "=" * 70)
