import json
import sys
import os
import uuid
import hashlib
import sqlite3

STORAGE_DIR = os.path.join(os.path.dirname(__file__), "data")
USERS_FILE = os.path.join(STORAGE_DIR, "users.json")
DB_PATH = os.path.join(os.path.dirname(__file__), "../cricket_auth.db")

if len(sys.argv) < 3:
    print("Usage: python set_user_password.py <username> <new_password>")
    sys.exit(1)

username = sys.argv[1]
new_password = sys.argv[2]

if not os.path.exists(USERS_FILE):
    print(f"Users file not found: {USERS_FILE}")
    sys.exit(1)

with open(USERS_FILE, 'r', encoding='utf-8') as fh:
    users = json.load(fh)

user = next((u for u in users if u.get('username') == username), None)
if not user:
    print(f"User '{username}' not found")
    sys.exit(1)

salt = uuid.uuid4().hex
pwd_hash = hashlib.sha256((salt + new_password).encode('utf-8')).hexdigest()
user['salt'] = salt
user['password_hash'] = pwd_hash

with open(USERS_FILE, 'w', encoding='utf-8') as fh:
    json.dump(users, fh, indent=2)

print(f"Password set for user {username}")

def update_sqlite_password(username, new_password):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Use the same hash logic as your backend
    hashed = hashlib.sha256(new_password.encode()).hexdigest()
    cursor.execute("SELECT * FROM users WHERE username=?", (username,))
    user = cursor.fetchone()
    if not user:
        print(f'User {username} not found in cricket_auth.db.')
        conn.close()
        return
    cursor.execute("UPDATE users SET password=? WHERE username=?", (hashed, username))
    conn.commit()
    print(f'Password for {username} has been reset in cricket_auth.db.')
    conn.close()

update_sqlite_password(username, new_password)
