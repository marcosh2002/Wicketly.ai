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
  const [popupText, setPopupText] = useState('');
  const [nextSpinCountdown, setNextSpinCountdown] = useState(0);
  const [isJackpot, setIsJackpot] = useState(false);
  const [jackpotChance, setJackpotChance] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Use user.tokens directly from context - no flickering
  const balance = user?.tokens || 0;

  const rewards = [5, 15, 50, 100, 200]; // Added 200 token jackpot
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700']; // Added gold for jackpot

  const getSecondsToUtcMidnight = () => {
    const now = new Date();
    const next = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0, 0, 0
    ));
    return Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000));
  };

  const formatCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (val) => String(val).padStart(2, '0');
    return `${pad(hours)} hrs ${pad(minutes)} min ${pad(seconds)} sec`;
  };

  const playJackpotSound = () => {
    if (!audioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const master = audioCtx.createGain();
      master.gain.value = 0.8;
      master.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      const tones = [440, 660, 880, 1175];
      tones.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        gain.gain.value = 0.0001;
        gain.gain.exponentialRampToValueAtTime(0.9, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.18);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.2);
      });

      const bass = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bass.type = 'square';
      bass.frequency.value = 110;
      bassGain.gain.value = 0.0001;
      bassGain.gain.exponentialRampToValueAtTime(0.7, now + 0.02);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      bass.connect(bassGain);
      bassGain.connect(master);
      bass.start(now);
      bass.stop(now + 0.55);

      setTimeout(() => audioCtx.close(), 800);
    } catch (err) {
      console.warn('Jackpot audio failed:', err);
    }
  };

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
        if ((data.spins_left || 0) <= 0) {
          // Start countdown at 24 hrs 59 min 59 sec (86399 seconds)
          setNextSpinCountdown(86399);
        } else {
          setNextSpinCountdown(0);
        }
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

        if (data.reward === 100 || data.reward === 200) {
          const label = data.reward === 200 ? 'MEGA JACKPOT' : 'JACKPOT REWARD';
          setPopupText(`${label} • ${data.reward} TOKENS`);
          setShowPopup(true);
          playJackpotSound();
          setTimeout(() => setShowPopup(false), 2800);
        }
        
        // Update context with new balance - this will automatically update display
        if (data.new_balance !== undefined) {
          // Balance will be fetched from context, no local state needed
          console.log('New balance from backend:', data.new_balance);
        }
        const nextSpinsLeft = typeof data.spins_left === 'number'
          ? data.spins_left
          : Math.max(0, spinsLeft - 1);
        setSpinsLeft(nextSpinsLeft);
        if (nextSpinsLeft <= 0) {
          setNextSpinCountdown(getSecondsToUtcMidnight());
        }

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
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          style={{
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            padding: '14px 26px',
            borderRadius: '999px',
            background: 'linear-gradient(120deg, #f8f2c0 0%, #f7c948 45%, #f59e0b 100%)',
            color: '#0b1020',
            fontWeight: 900,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            boxShadow: '0 18px 40px rgba(245, 158, 11, 0.45), inset 0 1px 0 rgba(255,255,255,0.5)',
            overflow: 'hidden'
          }}
        >
          <motion.span
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))',
              transform: 'skewX(-18deg)'
            }}
            animate={{ x: ['-120%', '220%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            style={{
              position: 'absolute',
              top: '4px',
              left: '10px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#fff7ed',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.9)'
            }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.3, 0.9] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.span
            style={{
              position: 'absolute',
              bottom: '6px',
              right: '12px',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#fffaf0',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
            }}
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          <span style={{ position: 'relative', zIndex: 1 }}>{popupText}</span>
        </motion.div>
      )}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button
            type="button"
            onClick={() => setAudioEnabled((prev) => !prev)}
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fde68a',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.5px'
            }}
          >
            {audioEnabled ? 'Sound: ON' : 'Sound: OFF'}
          </button>
        </div>
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(145deg, #0b0f1a 0%, #121a2b 45%, #0b1020 100%)',
            borderRadius: '24px',
            padding: '42px',
            textAlign: 'center',
            marginBottom: '30px',
            border: '1px solid rgba(255, 215, 0, 0.22)',
            boxShadow: '0 24px 60px rgba(2, 6, 23, 0.75), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}
        >
          <div style={{
            fontSize: '12px',
            color: '#f1c761',
            marginBottom: '12px',
            fontWeight: 700,
            letterSpacing: '1.4px',
            textTransform: 'uppercase'
          }}>
            Your Remaining Balance
          </div>
          <div style={{
            fontSize: '64px',
            fontWeight: 900,
            color: 'transparent',
            marginBottom: '12px',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(120deg, #f8f2c0 0%, #f7c948 38%, #f59e0b 75%, #fde68a 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            textShadow: '0 10px 30px rgba(245, 158, 11, 0.25)'
          }}>
            {balance} ⚡
          </div>
          <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
            Spins Remaining Today: <strong style={{ color: '#fde68a' }}>{spinsLeft}/2</strong>
            {spinsLeft <= 0 && nextSpinCountdown > 0 && (
              <div style={{ marginTop: '8px', fontSize: '13px', color: '#e2e8f0', fontWeight: 600 }}>
                Next spin reset in {formatCountdown(nextSpinCountdown)} left
              </div>
            )}
          </div>
        </motion.div>

        {/* Spin Wheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'linear-gradient(145deg, #0b1020 0%, #131b2f 45%, #0b1224 100%)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 24px 60px rgba(2, 6, 23, 0.75), inset 0 1px 0 rgba(255,255,255,0.06)',
            border: '1px solid rgba(255, 215, 0, 0.18)',
            marginBottom: '30px'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
          }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 700,
              color: 'transparent',
              background: 'linear-gradient(110deg, #f8f2c0 0%, #f7c948 45%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
            }}>
              Spin & Win
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(34, 197, 94, 0.15) 100%)',
              color: '#fde68a',
              padding: '8px 16px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              border: '1px solid rgba(245, 158, 11, 0.35)'
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
                boxShadow: '0 0 40px rgba(245, 158, 11, 0.35), inset 0 0 18px rgba(15, 23, 42, 0.6)',
                border: '6px solid rgba(245, 158, 11, 0.35)'
              }}
            >
              {/* Center Circle */}
              <div style={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f8f2c0 0%, #f7c948 60%, #f59e0b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 900,
                color: '#0b1020',
                boxShadow: '0 12px 30px rgba(245, 158, 11, 0.35)'
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
                borderTop: '30px solid #f59e0b'
              }} />
            </motion.div>

            {/* Spin Info */}
            <div style={{
              flex: 1,
              minWidth: '250px'
            }}>
              <h3 style={{
                fontSize: '24px',
                color: '#f8fafc',
                marginTop: 0,
                marginBottom: '20px'
              }}>
                How It Works
              </h3>
              <ul style={{
                fontSize: '16px',
                color: '#cbd5e1',
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
                    background: lastReward
                      ? 'linear-gradient(135deg, rgba(22, 101, 52, 0.4), rgba(6, 78, 59, 0.45))'
                      : 'linear-gradient(135deg, rgba(127, 29, 29, 0.42), rgba(69, 10, 10, 0.5))',
                    color: lastReward ? '#bbf7d0' : '#fecaca',
                    border: lastReward
                      ? '1px solid rgba(74, 222, 128, 0.35)'
                      : '1px solid rgba(248, 113, 113, 0.35)',
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
                  background: spinsLeft <= 0
                    ? 'linear-gradient(120deg, #475569, #64748b)'
                    : 'linear-gradient(120deg, #f8f2c0 0%, #f7c948 45%, #f59e0b 100%)',
                  color: spinsLeft <= 0 ? '#e2e8f0' : '#0b1020',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  borderRadius: '10px',
                  fontWeight: 800,
                  cursor: spinsLeft <= 0 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  marginTop: '20px',
                  transition: 'all 0.3s',
                  boxShadow: spinsLeft <= 0 ? 'none' : '0 18px 38px rgba(245, 158, 11, 0.35)'
                }}
              >
                {isSpinning ? 'Spinning...' : spinsLeft <= 0 ? 'No Spins Left' : 'SPIN THE WHEEL'}
              </motion.button>

              {spinsLeft <= 0 && nextSpinCountdown > 0 && (
                <div style={{
                  marginTop: '12px',
                  fontSize: '14px',
                  color: '#cbd5e1',
                  textAlign: 'center'
                }}>
                  Next spin reset in {formatCountdown(nextSpinCountdown)} left
                </div>
              )}

              {lastReward && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.7))',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#f8fafc'
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
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            borderRadius: '20px',
            padding: '30px',
            color: '#e2e8f0',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            boxShadow: '0 20px 50px rgba(2, 6, 23, 0.55)'
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: '22px', color: '#fde68a' }}>Pro Tips</h3>
          <ul style={{ lineHeight: 1.9, fontWeight: 500, color: '#cbd5e1' }}>
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
