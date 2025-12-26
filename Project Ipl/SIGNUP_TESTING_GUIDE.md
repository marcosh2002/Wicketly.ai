<!-- Signup Testing Guide -->

## ✅ **Signup/Login Troubleshooting Guide**

### **Step 1: Verify Backend is Running**
```
Backend should be running on: http://127.0.0.1:8000
Check: http://127.0.0.1:8000/health
Should return: {"status":"API is running",...}
```

### **Step 2: Test in Browser Console**
```javascript
// Test signup
fetch('http://127.0.0.1:8000/users/register', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: new URLSearchParams({username: 'testuser', display_name: 'Test User'})
})
.then(r => r.json())
.then(d => console.log(d))

// Test login
fetch('http://127.0.0.1:8000/users/testuser')
.then(r => r.json())
.then(d => console.log(d))
```

### **Step 3: Check Network Tab**
- Open DevTools (F12)
- Go to Network tab
- Try signup
- Look for POST /users/register request
- Check Status Code (should be 200)
- Check Response (should have ok: true)

### **Step 4: Check Console Tab**
- Open DevTools (F12)
- Go to Console tab
- Try signup
- Look for any error messages
- Should show auth success/error

### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| **Connection Refused** | Check backend is running: `uvicorn api:app --reload` |
| **CORS Error** | Backend CORS is enabled - should work |
| **Username Already Exists** | Try a different username |
| **Form Not Submitting** | Check all required fields are filled |
| **Modal Not Opening** | Check browser console for errors |

### **How to Use**
1. Click "Login / Sign Up" button in navbar
2. Fill in the form fields
3. Click "Create Account" for signup
4. Success message should appear
5. Form should switch to login view
6. Now you can login with your credentials

