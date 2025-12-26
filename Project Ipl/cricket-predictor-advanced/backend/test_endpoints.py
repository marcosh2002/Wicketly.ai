from fastapi.testclient import TestClient
import json

from api import app

client = TestClient(app)

print('=== Register test user ===')
resp = client.post('/users/register', data={
    'username': 'autotest',
    'display_name': 'Auto Test',
    'email': 'autotest@example.com',
    'password': 'TestPass123'
})
print('status:', resp.status_code)
print(json.dumps(resp.json(), indent=2))

print('\n=== Login test user ===')
resp2 = client.post('/users/login', data={
    'username_or_email': 'autotest',
    'password': 'TestPass123'
})
print('status:', resp2.status_code)
print(json.dumps(resp2.json(), indent=2))

print('\n=== Over-by-over ===')
resp3 = client.get('/analytics/over-by-over', params={'team1': 'CSK', 'team2': 'MI', 'overs': 6})
print('status:', resp3.status_code)
print(json.dumps(resp3.json(), indent=2))
