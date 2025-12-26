"""
Frontend Integration Guide - Using Auth Database API

This module provides utility functions to integrate the Auth Database API
with your frontend applications (React, HTML, etc.)
"""

# ==================== JavaScript/Fetch Examples ====================

# For use in React or Vanilla JavaScript

FRONTEND_INTEGRATION_JS = """
// Auth API Configuration
const AUTH_API_URL = 'http://127.0.0.1:8001';

// ==================== User Authentication ====================

// 1. Register New User
async function registerUser(username, email, password, referralCode = null) {
    try {
        const response = await fetch(`${AUTH_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                referral_code: referralCode
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }
        
        const data = await response.json();
        
        // Store token and user info in localStorage
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userTokens', data.user.tokens);
        
        console.log('✓ Registration successful:', data.user);
        return data.user;
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        throw error;
    }
}

// 2. Login User
async function loginUser(username, password) {
    try {
        const response = await fetch(`${AUTH_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }
        
        const data = await response.json();
        
        // Store token and user info
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userTokens', data.user.tokens);
        
        console.log('✓ Login successful:', data.user);
        return data.user;
    } catch (error) {
        console.error('❌ Login error:', error.message);
        throw error;
    }
}

// 3. Logout User
function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userTokens');
    console.log('✓ Logged out');
}

// ==================== User Profile ====================

// 4. Get User Profile
async function getUserProfile(username) {
    try {
        const response = await fetch(`${AUTH_API_URL}/auth/user/${username}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        
        const user = await response.json();
        console.log('✓ User profile:', user);
        return user;
    } catch (error) {
        console.error('❌ Error fetching profile:', error.message);
        throw error;
    }
}

// 5. Update User Profile
async function updateUserProfile(username, updates = {}) {
    try {
        const response = await fetch(`${AUTH_API_URL}/auth/user/${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Update failed');
        }
        
        const updatedUser = await response.json();
        
        // Update localStorage if tokens changed
        if (updatedUser.tokens) {
            localStorage.setItem('userTokens', updatedUser.tokens);
        }
        
        console.log('✓ Profile updated:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('❌ Update error:', error.message);
        throw error;
    }
}

// ==================== Token Management ====================

// 6. Get Token Balance
async function getTokenBalance(username) {
    try {
        const response = await fetch(`${AUTH_API_URL}/auth/user/${username}/tokens`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch tokens');
        }
        
        const data = await response.json();
        
        // Update localStorage
        localStorage.setItem('userTokens', data.tokens);
        
        console.log('✓ Token balance:', data.tokens);
        return data;
    } catch (error) {
        console.error('❌ Error fetching tokens:', error.message);
        throw error;
    }
}

// 7. Add Tokens (for admins/rewards)
async function addTokens(username, amount) {
    try {
        const response = await fetch(
            `${AUTH_API_URL}/auth/user/${username}/add-tokens?amount=${amount}`,
            { method: 'POST' }
        );
        
        if (!response.ok) {
            throw new Error('Failed to add tokens');
        }
        
        const data = await response.json();
        
        // Update localStorage
        localStorage.setItem('userTokens', data.tokens);
        
        console.log(`✓ Added ${amount} tokens. New balance: ${data.tokens}`);
        return data;
    } catch (error) {
        console.error('❌ Error adding tokens:', error.message);
        throw error;
    }
}

// 8. Deduct Tokens (for predictions, etc.)
async function deductTokens(username, amount) {
    try {
        const response = await fetch(
            `${AUTH_API_URL}/auth/user/${username}/deduct-tokens?amount=${amount}`,
            { method: 'POST' }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Insufficient tokens');
        }
        
        const data = await response.json();
        
        // Update localStorage
        localStorage.setItem('userTokens', data.tokens);
        
        console.log(`✓ Deducted ${amount} tokens. New balance: ${data.tokens}`);
        return data;
    } catch (error) {
        console.error('❌ Error deducting tokens:', error.message);
        throw error;
    }
}

// ==================== Referral System ====================

// 9. Get Referral Information
async function getReferralInfo(username) {
    try {
        const response = await fetch(`${AUTH_API_URL}/auth/user/${username}/referral`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch referral info');
        }
        
        const data = await response.json();
        console.log('✓ Referral info:', data);
        return data;
    } catch (error) {
        console.error('❌ Error fetching referral info:', error.message);
        throw error;
    }
}

// ==================== Spin System ====================

// 10. Get Spin Status
async function getSpinStatus(username) {
    try {
        const response = await fetch(`${AUTH_API_URL}/auth/user/${username}/spin-status`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch spin status');
        }
        
        const data = await response.json();
        console.log('✓ Spin status:', data);
        return data;
    } catch (error) {
        console.error('❌ Error fetching spin status:', error.message);
        throw error;
    }
}

// 11. Record Spin and Award Reward
async function recordSpin(username, reward) {
    try {
        const response = await fetch(
            `${AUTH_API_URL}/auth/user/${username}/spin?reward=${reward}`,
            { method: 'POST' }
        );
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Spin failed');
        }
        
        const data = await response.json();
        
        // Update localStorage
        localStorage.setItem('userTokens', data.tokens);
        
        console.log(`✓ Spin successful! Won ${data.reward} tokens. Total: ${data.tokens}`);
        return data;
    } catch (error) {
        console.error('❌ Spin error:', error.message);
        throw error;
    }
}

// ==================== Utility Functions ====================

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// Get current username from storage
function getCurrentUsername() {
    return localStorage.getItem('username');
}

// Get current token balance from storage
function getCurrentTokenBalance() {
    return parseInt(localStorage.getItem('userTokens') || '0');
}

// ==================== React Component Example ====================

// Example: Login Component (React)
function LoginComponent() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await loginUser(username, password);
            window.location.href = '/dashboard'; // Redirect after login
        } catch (error) {
            alert('Login failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}

// Example: Token Balance Component (React)
function TokenBalanceComponent() {
    const [tokens, setTokens] = React.useState(0);
    const username = getCurrentUsername();
    
    React.useEffect(() => {
        if (username) {
            getTokenBalance(username).then(data => {
                setTokens(data.tokens);
            });
        }
    }, [username]);
    
    return (
        <div className="token-balance">
            💰 Balance: {tokens} tokens
        </div>
    );
}
"""

# ==================== Python Backend Integration ====================

PYTHON_INTEGRATION = """
# Python Backend Integration Example

import requests
import json
from typing import Dict, Optional

AUTH_API_URL = 'http://127.0.0.1:8001'

class CricketAuthClient:
    '''Client for Auth Database API integration'''
    
    def __init__(self, base_url: str = AUTH_API_URL):
        self.base_url = base_url
    
    # ==================== Authentication ====================
    
    def register(self, username: str, email: str, password: str, 
                 referral_code: Optional[str] = None) -> Dict:
        '''Register new user'''
        response = requests.post(
            f'{self.base_url}/auth/register',
            json={
                'username': username,
                'email': email,
                'password': password,
                'referral_code': referral_code
            }
        )
        response.raise_for_status()
        return response.json()
    
    def login(self, username: str, password: str) -> Dict:
        '''Login user'''
        response = requests.post(
            f'{self.base_url}/auth/login',
            json={'username': username, 'password': password}
        )
        response.raise_for_status()
        return response.json()
    
    # ==================== User Profile ====================
    
    def get_user(self, username: str) -> Dict:
        '''Get user profile'''
        response = requests.get(f'{self.base_url}/auth/user/{username}')
        response.raise_for_status()
        return response.json()
    
    def update_user(self, username: str, email: Optional[str] = None, 
                    password: Optional[str] = None) -> Dict:
        '''Update user profile'''
        response = requests.put(
            f'{self.base_url}/auth/user/{username}',
            json={
                'email': email,
                'password': password
            }
        )
        response.raise_for_status()
        return response.json()
    
    # ==================== Tokens ====================
    
    def get_tokens(self, username: str) -> Dict:
        '''Get token balance'''
        response = requests.get(f'{self.base_url}/auth/user/{username}/tokens')
        response.raise_for_status()
        return response.json()
    
    def add_tokens(self, username: str, amount: int) -> Dict:
        '''Add tokens'''
        response = requests.post(
            f'{self.base_url}/auth/user/{username}/add-tokens?amount={amount}'
        )
        response.raise_for_status()
        return response.json()
    
    def deduct_tokens(self, username: str, amount: int) -> Dict:
        '''Deduct tokens'''
        response = requests.post(
            f'{self.base_url}/auth/user/{username}/deduct-tokens?amount={amount}'
        )
        response.raise_for_status()
        return response.json()
    
    # ==================== Referrals ====================
    
    def get_referral_info(self, username: str) -> Dict:
        '''Get referral information'''
        response = requests.get(f'{self.base_url}/auth/user/{username}/referral')
        response.raise_for_status()
        return response.json()
    
    # ==================== Spins ====================
    
    def get_spin_status(self, username: str) -> Dict:
        '''Get spin status'''
        response = requests.get(f'{self.base_url}/auth/user/{username}/spin-status')
        response.raise_for_status()
        return response.json()
    
    def record_spin(self, username: str, reward: int) -> Dict:
        '''Record spin and award reward'''
        response = requests.post(
            f'{self.base_url}/auth/user/{username}/spin?reward={reward}'
        )
        response.raise_for_status()
        return response.json()

# Usage Example
if __name__ == '__main__':
    client = CricketAuthClient()
    
    # Register user
    user = client.register(
        username='cricket_fan',
        email='fan@example.com',
        password='secure123'
    )
    print('Registered:', user['user'])
    
    # Login
    auth = client.login('cricket_fan', 'secure123')
    print('Logged in:', auth['user']['username'])
    
    # Check tokens
    tokens = client.get_tokens('cricket_fan')
    print('Tokens:', tokens['tokens'])
    
    # Award spin reward
    spin = client.record_spin('cricket_fan', 50)
    print('Spin reward:', spin['reward'], 'tokens')
"""

# ==================== cURL Examples ====================

CURL_EXAMPLES = """
# Authentication API - cURL Examples

# 1. Register User
curl -X POST "http://127.0.0.1:8001/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "cricket_fan",
    "email": "fan@example.com",
    "password": "secure123",
    "referral_code": "REF_ABC123"
  }'

# 2. Login
curl -X POST "http://127.0.0.1:8001/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "cricket_fan",
    "password": "secure123"
  }'

# 3. Get User Profile
curl "http://127.0.0.1:8001/auth/user/cricket_fan"

# 4. Update User Profile
curl -X PUT "http://127.0.0.1:8001/auth/user/cricket_fan" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "newemail@example.com",
    "password": "newpassword456"
  }'

# 5. Get Token Balance
curl "http://127.0.0.1:8001/auth/user/cricket_fan/tokens"

# 6. Add Tokens
curl -X POST "http://127.0.0.1:8001/auth/user/cricket_fan/add-tokens?amount=50"

# 7. Deduct Tokens
curl -X POST "http://127.0.0.1:8001/auth/user/cricket_fan/deduct-tokens?amount=10"

# 8. Get Referral Info
curl "http://127.0.0.1:8001/auth/user/cricket_fan/referral"

# 9. Get Spin Status
curl "http://127.0.0.1:8001/auth/user/cricket_fan/spin-status"

# 10. Record Spin
curl -X POST "http://127.0.0.1:8001/auth/user/cricket_fan/spin?reward=50"

# 11. List All Users
curl "http://127.0.0.1:8001/auth/users"
"""

if __name__ == '__main__':
    print("Frontend Integration Guide")
    print("=" * 60)
    print()
    print("See AUTH_API_DOCUMENTATION.md for complete API reference")
    print()
    print("JavaScript/Fetch Integration:")
    print(FRONTEND_INTEGRATION_JS)
    print()
    print("=" * 60)
    print()
    print("Python Backend Integration:")
    print(PYTHON_INTEGRATION)
    print()
    print("=" * 60)
    print()
    print("cURL Examples:")
    print(CURL_EXAMPLES)
