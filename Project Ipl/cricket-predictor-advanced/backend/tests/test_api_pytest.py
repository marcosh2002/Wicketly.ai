import pytest
from fastapi.testclient import TestClient
from api import app

client = TestClient(app)

def test_over_by_over():
    resp = client.get('/analytics/over-by-over', params={'team1': 'CSK', 'team2': 'MI', 'overs': 4})
    assert resp.status_code == 200
    data = resp.json()
    assert data.get('ok') is True
    assert 'progression' in data

def test_venue():
    resp = client.get('/analytics/venue', params={'venue': 'Chidambaram'})
    assert resp.status_code == 200
    data = resp.json()
    assert data.get('ok') is True
    assert isinstance(data.get('results'), list)

def test_register_and_login():
    username = 'pytest_user'
    # register (ok if already exists)
    resp = client.post('/users/register', data={
        'username': username,
        'display_name': 'PyTest User',
        'email': f'{username}@example.com',
        'password': 'Secret123'
    })
    assert resp.status_code == 200
    # login
    resp2 = client.post('/users/login', data={'username_or_email': username, 'password': 'Secret123'})
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2.get('ok') is True
    assert 'token' in data2
