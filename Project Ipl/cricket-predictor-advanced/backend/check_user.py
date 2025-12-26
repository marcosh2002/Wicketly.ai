import sqlite3

conn = sqlite3.connect('cricket_auth.db')
cursor = conn.cursor()

# Get all users
cursor.execute('SELECT id, username, email FROM users')
users = cursor.fetchall()

print(f"Total users in database: {len(users)}")
print("\nUsers:")
for user in users:
    print(f"  ID: {user[0]}, Username: {user[1]}, Email: {user[2]}")

# Check specifically for Marcosh69
cursor.execute('SELECT * FROM users WHERE username = ?', ('Marcosh69',))
result = cursor.fetchone()

if result:
    print(f"\n✓ Marcosh69 found in database!")
    print(f"  Full record: {result}")
else:
    print(f"\n✗ Marcosh69 NOT found in database!")

conn.close()
