# Spin to Win Wheel - Integration Guide

## Overview
The Spin to Win Wheel is a popup feature that shows up to 2 times per day (with a 12-hour gap) and allows users to spin a wheel to win points (between 0-200 points).

## Features
- ✅ Appears up to 2 times per day automatically
- ✅ 12-hour gap between consecutive popups
- ✅ Spinning animation with random segments
- ✅ Animated congratulations modal when user wins
- ✅ Confetti animation for visual feedback
- ✅ Integrates with backend API to update user points
- ✅ Responsive design (mobile & desktop)
- ✅ Local storage for tracking daily popups

## Files Included

### Frontend Files
1. **`spin-wheel.css`** - All styling for wheel and congratulations modals
2. **`spin-wheel.js`** - Main JavaScript class and functions
3. **`index.html`** - Updated with spin wheel integration

### Backend Files
1. **`api.py`** - Updated with spin wheel endpoints:
   - `POST /spin-wheel/claim-reward` - Claims and adds points to user
   - `GET /spin-wheel/can-spin` - Check if user can spin today
   - `POST /spin-wheel/record-spin` - Records spin attempt

## Wheel Segments (8 segments)
```
1. Win 50 points
2. Win 100 points
3. Jackpot! (200 points) 🎯
4. Win 75 points
5. Try Again (0 points)
6. Win 150 points
7. Win 25 points
8. Bonus 125 points
```

## How to Use

### 1. Basic Setup
The spin wheel is already initialized in `index.html`. It will automatically show if conditions are met.

```html
<!-- Include CSS -->
<link rel="stylesheet" href="assets/spin-wheel.css">

<!-- Include JavaScript -->
<script src="assets/spin-wheel.js"></script>

<!-- Initialize on page load -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    scheduleSpinWheelPopups();
  });
</script>
```

### 2. Manual Trigger
To manually show the spin wheel popup:

```javascript
// Simple trigger
initializeSpinWheel();

// With options including username and API base URL
initializeSpinWheel({
  username: 'user123',
  apiBaseUrl: 'http://localhost:8000',
  onWin: (points, label) => {
    console.log(`Won ${points} points!`);
  },
  onClose: () => {
    console.log('Popup closed');
  }
});
```

### 3. Listen for Reward Claims
```javascript
window.addEventListener('spin-reward-claimed', (event) => {
  const { points, newBalance } = event.detail;
  console.log(`Claimed ${points} points. New balance: ${newBalance}`);
  // Update your UI with new balance
});
```

### 4. Check if User Can Spin
```javascript
async function checkCanSpin(username) {
  const response = await fetch(`http://localhost:8000/spin-wheel/can-spin?username=${username}`);
  const data = await response.json();
  console.log(`Can spin: ${data.can_spin}, Spins used: ${data.spins_used}/2`);
}
```

## Customization

### Change Wheel Segments
Edit in `spin-wheel.js`:
```javascript
this.wheelSegments = [
  { label: 'Win 50', value: 50, color: '#FF6B6B' },
  { label: 'Win 100', value: 100, color: '#4ECDC4' },
  // ... add/modify segments
];
```

### Change Spin Duration
```javascript
this.spinDuration = 3; // seconds (increase for longer spin)
```

### Change Number of Rotations
```javascript
this.minSpins = 5;    // minimum full rotations
this.maxSpins = 8;    // maximum full rotations
```

### Modify Colors
- Header background: Change gradient in `.spin-wheel-modal`
- Button color: Edit `.spin-button` background
- Congratulations modal: Edit `.congratulations-content` gradient

## Daily Limit System
- Users can spin maximum **2 times per day**
- Each day resets at 00:00 (midnight)
- A 12-hour gap is enforced between the first and second spin of the day

## Storage
- Spin data stored in `localStorage` with key: `spinWheel_[DATE]`
- User history stored in backend user data: `spin_history_[USERNAME]`

## API Endpoints

### 1. Claim Reward
```
POST /spin-wheel/claim-reward?username=user123&points=200
Response: {
  "ok": true,
  "message": "Successfully added 200 points",
  "previous_balance": 100,
  "new_balance": 300,
  "points_added": 200
}
```

### 2. Check If Can Spin
```
GET /spin-wheel/can-spin?username=user123
Response: {
  "ok": true,
  "can_spin": true,
  "spins_used": 0,
  "max_spins": 2,
  "date": "2024-12-05"
}
```

### 3. Record Spin
```
POST /spin-wheel/record-spin?username=user123
Response: {
  "ok": true,
  "message": "Spin recorded",
  "spin_number": 1,
  "timestamp": "2024-12-05T10:30:00.000Z"
}
```

## Troubleshooting

### Popup Not Showing
1. Check browser console for errors
2. Verify CSS file is loaded
3. Check if 2 popups already shown today
4. Clear localStorage: `localStorage.clear()`

### Points Not Updating
1. Verify username is passed to `initializeSpinWheel()`
2. Check backend API is running and accessible
3. Look for CORS errors in browser console
4. Verify user exists in backend database

### Animation Issues
1. Check if CSS animations are supported
2. Verify `spin-wheel.css` is properly linked
3. Check browser console for JavaScript errors

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (uses modern CSS/JS)

## Mobile Responsiveness
The wheel is fully responsive and works on:
- Phones (320px - 480px)
- Tablets (480px - 1024px)
- Desktop (1024px+)

## Performance Notes
- Lightweight: ~20KB JS + 15KB CSS
- No external dependencies required
- Smooth 60FPS animations
- Efficient localStorage usage

## Future Enhancements
- [ ] Social sharing when winning Jackpot
- [ ] Leaderboard for weekly winners
- [ ] Special seasonal wheels
- [ ] Progressive rewards (more spins = better odds)
- [ ] Sound effects
- [ ] Video celebration for Jackpot
