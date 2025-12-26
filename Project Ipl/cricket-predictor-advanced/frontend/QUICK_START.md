# 🎡 Spin to Win Wheel - Quick Start Guide

## What You Got ✨

A complete popup notification system that appears **2 times per day (12 hours apart)** with an animated spin wheel. Users can win **0-200 points** with exciting congratulations animations!

## 📁 Files Created

### Frontend
- ✅ **`assets/spin-wheel.css`** - Complete styling with animations
- ✅ **`assets/spin-wheel.js`** - Main wheel class and functions
- ✅ **`SPIN_WHEEL_GUIDE.md`** - Complete documentation
- ✅ **`spin-wheel-example.html`** - Test page with examples
- ✅ **`index.html`** - Updated with auto-initialization

### Backend
- ✅ **`api.py`** - 3 new endpoints added:
  - `POST /spin-wheel/claim-reward` - Award points to user
  - `GET /spin-wheel/can-spin` - Check if user can spin today
  - `POST /spin-wheel/record-spin` - Record spin attempt

## 🚀 How to Use

### Option 1: Auto-Popup (Recommended)
The popup will automatically show up to 2 times per day:

```javascript
// Already added to index.html - nothing to do!
scheduleSpinWheelPopups();
```

### Option 2: Manual Trigger
Show the popup whenever you want:

```javascript
initializeSpinWheel({
  username: 'user123',
  apiBaseUrl: 'http://localhost:8000'
});
```

### Option 3: Test It Now
1. Open **`spin-wheel-example.html`** in your browser
2. Click "Spin Now!" button
3. Watch the wheel spin and see congratulations animation
4. Check your points update in the backend

## 🎨 What Users See

### Popup #1 - The Spinning Wheel
```
┌─────────────────────────┐
│     WELCOME TO          │
│    SPIN N WIN           │
│                         │
│    [Spinning Wheel]     │
│                         │
│    [SPIN NOW Button]    │
└─────────────────────────┘
```

### Popup #2 - Win Animation (e.g., Jackpot 200 points)
```
┌─────────────────────────┐
│  🎉 CONGRATULATIONS! 🎉 │
│                         │
│         +200            │
│      Jackpot!           │
│                         │
│  [Claim Reward Button]  │
│                         │
│  [Confetti falling]     │
└─────────────────────────┘
```

## 🎯 Key Features

| Feature | Status |
|---------|--------|
| Appears 2x daily | ✅ |
| 12-hour gap enforcement | ✅ |
| 8 wheel segments | ✅ |
| Jackpot winner = 200 pts | ✅ |
| Animated congratulations | ✅ |
| Confetti celebration | ✅ |
| Backend point integration | ✅ |
| Mobile responsive | ✅ |
| Local storage tracking | ✅ |

## 💾 Data Storage

### Frontend (Browser Local Storage)
```javascript
spinWheel_Thu Dec 05 2024 = {
  count: 1,
  times: ["2024-12-05T10:30:00.000Z"]
}
```

### Backend (User JSON)
```json
{
  "username": "user123",
  "tokens": 350,
  "spin_history_user123": {
    "date": "2024-12-05",
    "count": 1,
    "times": ["2024-12-05T10:30:00.000Z"]
  }
}
```

## 🎲 Wheel Segments

| Segment | Points | Probability |
|---------|--------|------------|
| Win 50 | 50 | 12.5% |
| Win 100 | 100 | 12.5% |
| **Jackpot!** | **200** | **12.5%** 🏆 |
| Win 75 | 75 | 12.5% |
| Try Again | 0 | 12.5% |
| Win 150 | 150 | 12.5% |
| Win 25 | 25 | 12.5% |
| Bonus 125 | 125 | 12.5% |

## 🔧 Customization Examples

### Change Jackpot Amount
In `spin-wheel.js`, find wheelSegments:
```javascript
{ label: 'Jackpot!', value: 500, color: '#FFD93D' }, // Changed from 200 to 500
```

### Change Colors
```javascript
{ label: 'Win 50', value: 50, color: '#FF0000' }, // Changed color
```

### Change Spin Duration
```javascript
this.spinDuration = 5; // Longer spin (seconds)
```

### Change Daily Limit
In `api.py`, find the can-spin function:
```python
if spin_data['count'] >= 5:  # Changed from 2 to 5 spins per day
    return {"ok": False, "error": "Maximum spins reached"}
```

## 🧪 Testing

### Test Page
Navigate to: **`http://localhost:3000/spin-wheel-example.html`**

### Test Endpoints
```bash
# Check if user can spin
curl "http://localhost:8000/spin-wheel/can-spin?username=test"

# Claim reward
curl -X POST "http://localhost:8000/spin-wheel/claim-reward?username=test&points=200"

# Record spin
curl -X POST "http://localhost:8000/spin-wheel/record-spin?username=test"
```

### Browser Console Events
```javascript
// Listen for rewards claimed
window.addEventListener('spin-reward-claimed', (e) => {
  console.log('Points:', e.detail.points);
  console.log('New Balance:', e.detail.newBalance);
});
```

## 🐛 Troubleshooting

### Popup Not Showing?
1. ✅ Check if 2 popups already shown today
2. ✅ Clear localStorage: `localStorage.clear()`
3. ✅ Check browser console for errors
4. ✅ Verify CSS is loaded

### Points Not Updating?
1. ✅ Verify username is correct
2. ✅ Check backend API is running
3. ✅ Look for CORS errors in console
4. ✅ Verify user exists in database

### Animation Laggy?
1. ✅ Close other tabs
2. ✅ Update browser
3. ✅ Check GPU acceleration enabled
4. ✅ Reduce confetti count

## 📱 Browser Support
- Chrome/Edge: ✅ Perfect
- Firefox: ✅ Perfect  
- Safari: ✅ Perfect
- Mobile Browsers: ✅ Fully responsive

## 💡 Pro Tips

1. **Use with Login Page**: Initialize in profile/dashboard only
   ```javascript
   if (loggedIn) initializeSpinWheel({ username: currentUser });
   ```

2. **Track Wins**: Listen for wins and save them
   ```javascript
   window.addEventListener('spin-reward-claimed', saveWinStats);
   ```

3. **Customize Per User**: Show different wheels for VIP users
   ```javascript
   if (user.isVIP) initializeSpinWheel({ /* VIP options */ });
   ```

4. **Track Analytics**: Send to analytics when user spins
   ```javascript
   onWin: (points) => trackEvent('spin_win', { points })
   ```

## 🎓 Next Steps

1. **Integrate with Dashboard**: Add spin wheel to user profile
2. **Add Sound**: Play celebration sounds on win
3. **Leaderboard**: Show top spinners this week
4. **Social Share**: Let users share Jackpot wins
5. **Seasonal Wheels**: Different wheels for holidays
6. **Power-ups**: Special wheels with better odds

## 📊 Expected Results

After 30 days with 2 spins/day:
- Total spins: 60
- Average points per spin: ~75
- Total points earned: ~4,500
- Jackpot wins: ~7-8 (12.5% chance)

---

**Questions?** Check `SPIN_WHEEL_GUIDE.md` for detailed documentation!

**Ready to spin?** 🎡
