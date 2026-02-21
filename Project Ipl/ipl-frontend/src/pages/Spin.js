import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config';

export default function Spin() {
  const navigate = useNavigate();
  const { user, openSignup } = useContext(AuthContext);
  const [spinsLeft, setSpinsLeft] = useState(2);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastReward, setLastReward] = useState(null);
  const [spinMessage, setSpinMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [nextSpinCountdown, setNextSpinCountdown] = useState(0);
  const [isJackpot, setIsJackpot] = useState(false);
  const [jackpotChance, setJackpotChance] = useState(0);

  // Use user.tokens directly from context - no flickering
  const balance = user?.tokens || 0;

  const rewards = [5, 15, 50, 100, 200]; // Added 200 token jackpot
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700']; // Added gold for jackpot

  useEffect(() => {
    // Check if user is logged in
    if (!user || !user.username) {
      console.warn('⚠️ User not logged in. User object:', user);
      // User not logged in, redirect to home and open signup
      const timer = setTimeout(() => {
        navigate('/');
        openSignup();
      }, 500);
      return () => clearTimeout(timer);
    }
    console.log('✅ User logged in:', { username: user.username, id: user.id, tokens: user.tokens });
    fetchSpinStatus();
  }, [user?.username, navigate, openSignup]);

  // Countdown timer for next spin
  useEffect(() => {
    if (nextSpinCountdown > 0) {
      const timer = setTimeout(() => {
        setNextSpinCountdown(nextSpinCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nextSpinCountdown]);

  // Auto-refresh spin status every 30 seconds
  useEffect(() => {
    if (!user?.username) return;
    
    const interval = setInterval(() => {
      fetchSpinStatus();
    }, 30000);
    return () => clearInterval(interval);
  }, [user?.username]);

  const fetchBalance = async () => {
    try {
      if (!user?.username) {
        console.warn('⚠️ No username for balance fetch. User:', user);
        return;
      }
      console.log(`📊 Fetching balance for user: "${user.username}"`);
      const response = await fetch(`${API_BASE}/users/${user.username}/balance`);
      const data = await response.json();
      console.log('✅ Balance loaded:', data);
      if (data.ok) {
        // Balance is read from user context now
        console.log('Balance synced from context');
      }
    } catch (err) {
      console.error('❌ Fetch balance error:', err);
    }
  };

  const fetchSpinStatus = async () => {
    try {
      if (!user?.username) {
        console.warn('⚠️ No username for spin status fetch. User:', user);
        return;
      }
      const response = await fetch(`${API_BASE}/users/${user.username}/spin_status`);
      const data = await response.json();
      console.log('✅ Spin status loaded:', data);
      if (data.ok) {
        setSpinsLeft(data.spins_left || 0);
        if (data.last_reward) {
          setLastReward(data.last_reward);
        }
      } else {
        console.error('❌ Spin status error:', data);
      }
    } catch (err) {
      console.error('❌ Fetch spin status error:', err);
    }
  };

  const performSpin = async () => {
    if (!user || isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setSpinMessage('Spinning...');

    try {
      // Determine if jackpot hit (2% chance)
      const jackpotRoll = Math.random();
      const hitJackpot = jackpotRoll < 0.02;
      setIsJackpot(hitJackpot);
      setJackpotChance(Math.round(jackpotRoll * 100) / 100);

      // Animate wheel spinning with more rotations for jackpot
      let currentRotation = 0;
      const spinInterval = setInterval(() => {
        currentRotation += 15;
        setRotation(currentRotation);
      }, 50);

      // Longer spin duration for jackpot
      const spinDuration = hitJackpot ? 3500 : 2000;
      await new Promise(resolve => setTimeout(resolve, spinDuration));
      clearInterval(spinInterval);

      // Call spin endpoint
      const response = await fetch(`${API_BASE}/users/${user.username}/spin`, {
        method: 'POST'
      });

      const data = await response.json();

      if (data.ok) {
        setLastReward(data.reward);
        
        if (hitJackpot) {
          setSpinMessage(`🎉 JACKPOT! Won 200 tokens! 🎉`);
          setIsJackpot(true);
        } else {
          setSpinMessage(`Won ${data.reward} tokens!`);
          setIsJackpot(false);
        }
        
        // Update context with new balance - this will automatically update display
        if (data.new_balance !== undefined) {
          // Balance will be fetched from context, no local state needed
          console.log('New balance from backend:', data.new_balance);
        }
        setSpinsLeft(Math.max(0, spinsLeft - 1));

        // Reset message after 4 seconds
        setTimeout(() => {
          setSpinMessage('');
          setIsJackpot(false);
        }, 4000);
      } else {
        setSpinMessage(data.error || 'Spin failed');
        setIsJackpot(false);
      }
    } catch (err) {
      console.error('Error during spin:', err);
      setSpinMessage('Error performing spin');
      setIsJackpot(false);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '30px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ fontSize: '16px', color: '#666', marginBottom: '10px', fontWeight: 600 }}>
            Your Token Balance
          </div>
          <div style={{
            fontSize: '64px',
            fontWeight: 900,
            color: '#1e2a78',
            marginBottom: '10px',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {balance} ⚡
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            Spins Remaining Today: <strong>{spinsLeft}/2</strong>
          </div>
        </motion.div>

        {/* Spin Wheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            marginBottom: '30px'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1e2a78'
            }}>
              Spin & Win
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              Daily Spins: {spinsLeft}/2
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Spin Wheel */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ type: 'linear', duration: 0 }}
              style={{
                position: 'relative',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                background: `conic-gradient(${colors.map((c, i) => `${c} ${(i * 360 / colors.length)}deg ${((i + 1) * 360 / colors.length)}deg`).join(', ')})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(0,0,0,0.3)'
              }}
            >
              {/* Center Circle */}
              <div style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 900,
                color: '#1e2a78'
              }}>
                {rewards[(Math.round(rotation / 90)) % rewards.length]}
              </div>

              {/* Pointer */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                width: '0',
                height: '0',
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderTop: '30px solid #1e2a78'
              }} />
            </motion.div>

            {/* Spin Info */}
            <div style={{
              flex: 1,
              minWidth: '250px'
            }}>
              <h3 style={{
                fontSize: '24px',
                color: '#1e2a78',
                marginTop: 0,
                marginBottom: '20px'
              }}>
                How It Works
              </h3>
              <ul style={{
                fontSize: '16px',
                color: '#666',
                lineHeight: 1.8,
                paddingLeft: '20px'
              }}>
                <li>Spin the wheel up to 2 times per day</li>
                <li>Win tokens based on where it lands</li>
                <li>Possible rewards: 5, 15, 50, or 100 tokens</li>
                <li>Use tokens for special features</li>
              </ul>

              {spinMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: lastReward ? '#d4edda' : '#f8d7da',
                    color: lastReward ? '#155724' : '#721c24',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '20px',
                    textAlign: 'center',
                    fontWeight: 600
                  }}
                >
                  {spinMessage}
                </motion.div>
              )}

              <motion.button
                onClick={performSpin}
                disabled={isSpinning || spinsLeft <= 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '100%',
                  padding: '14px 32px',
                  background: spinsLeft <= 0 ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: spinsLeft <= 0 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  marginTop: '20px',
                  transition: 'all 0.3s'
                }}
              >
                {isSpinning ? 'Spinning...' : spinsLeft <= 0 ? 'No Spins Left' : 'SPIN THE WHEEL'}
              </motion.button>

              {lastReward && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: '#f0f7ff',
                  borderLeft: '4px solid #667eea',
                  borderRadius: '4px',
                  fontSize: '14px',
                  color: '#1e2a78'
                }}>
                  Last reward: <strong>{lastReward} tokens</strong>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            borderRadius: '20px',
            padding: '30px',
            color: '#333'
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: '22px' }}>Pro Tips</h3>
          <ul style={{ lineHeight: 1.9, fontWeight: 500 }}>
            <li>Come back daily to maximize your spins</li>
            <li>Save tokens for premium features</li>
            <li>Higher spin counts don't increase odds</li>
            <li>Rewards are randomly distributed</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
