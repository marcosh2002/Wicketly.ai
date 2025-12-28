import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Points() {
  const { user } = useContext(AuthContext);
  const [pointsValue, setPointsValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.username) {
      setLoading(true);
      const apiUrl = `http://127.0.0.1:8000/users/${encodeURIComponent(user.username)}/balance`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setPointsValue(data.tokens);
          } else {
            setPointsValue(typeof user.tokens !== 'undefined' ? user.tokens : 100);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching balance:', err);
          setPointsValue(typeof user.tokens !== 'undefined' ? user.tokens : 100);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 40, maxWidth: 900, margin: '40px auto', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>Your Points</h2>
        <p style={{ color: '#aaa', fontSize: 16 }}>You need to be logged in to view your points and referral details.</p>
        <p style={{ color: '#aaa', fontSize: 16 }}>Every new user receives <strong>100 points</strong> at signup. Use points to make predictions (10 points per prediction).</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: '40px auto', minHeight: '100vh' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #1e2a78 0%, #00c6ff 100%)',
          borderRadius: 20,
          padding: 60,
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(30, 42, 120, 0.2)',
          marginBottom: 40
        }}
      >
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: 12 }}>
          Your Points Balance
        </div>
        <div style={{ fontSize: 96, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 12, textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          {loading ? '...' : pointsValue}
        </div>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
          ⚡ Points Available
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e2a78', marginBottom: 16 }}>
            💰 How You Earn
          </div>
          <div style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
            <div style={{ marginBottom: 12 }}>
              <strong>New Signup:</strong> 100 points
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Referral Bonus:</strong> +50 points when a friend signs up using your code
            </div>
            <div>
              <strong>Friend's Signup:</strong> +50 points when you sign up using a referral code
            </div>
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1e2a78', marginBottom: 16 }}>
            🎯 How You Spend
          </div>
          <div style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
            <div style={{ marginBottom: 12 }}>
              <strong>Match Prediction:</strong> 10 points per prediction
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Exclusive Features:</strong> Points unlock premium content
            </div>
            <div>
              <strong>Leaderboards:</strong> More predictions = higher rankings
            </div>
          </div>
        </div>
      </div>

      {user.referral_code && (
        <div
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            borderRadius: 16,
            padding: 32,
            boxShadow: '0 8px 24px rgba(255, 167, 38, 0.2)',
            color: '#111'
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            🚀 Invite Friends & Earn
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: 14, lineHeight: 1.6 }}>
            Share your unique referral code with friends. When they sign up using your code, you both get <strong>50 bonus points</strong>!
          </p>

          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 16
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Your Referral Code</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', letterSpacing: 2 }}>
              {user.referral_code}
            </div>
          </div>

          <button
            onClick={async () => {
              const link = `${window.location.origin}/?ref=${user.referral_code}`;
              try {
                await navigator.clipboard.writeText(link);
                alert('Referral link copied!');
              } catch (e) {
                prompt('Copy this referral link', link);
              }
            }}
            style={{
              padding: '14px 24px',
              borderRadius: 12,
              background: '#fff',
              color: '#FFA500',
              border: 'none',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Copy Referral Link
          </button>
        </div>
      )}
    </div>
  );
}
