import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AccountCircle, Logout } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import API_BASE from "../config";

export default function Navbar({ onOpenLogin, onOpenSignup }) {
  const { user, logout, updateUserTokens } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [referralInfo, setReferralInfo] = useState(null);
  const [loadingReferral, setLoadingReferral] = useState(false);

  // Fetch latest token balance when user changes
  useEffect(() => {
    if (user && user.username) {
      const fetchTokens = async () => {
        try {
          const response = await fetch(`${API_BASE}/users/${user.username}/balance`);
          const data = await response.json();
          if (data.ok && data.tokens !== undefined) {
            updateUserTokens(data.tokens);
          }
        } catch (err) {
          console.error('Error fetching tokens:', err);
        }
      };
      
      fetchTokens();
    }
  }, [user?.username, updateUserTokens]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav style={{
      background: "transparent", color: "#fff", padding: "12px 20px", position: "relative", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(16, 185, 129, 0.2)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px"
    }}>
      {/* Logo Section */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
        <motion.div whileHover={{ scale: 1.08 }} style={{ cursor: "pointer" }}>
          <img src="/my-logo.png" alt="Wicketly Logo" style={{ height: "70px", filter: "drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))" }} />
        </motion.div>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", justifyContent: "center", gap: "25px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: "500", transition: "0.3s", paddingBottom: "2px", borderBottom: "2px solid transparent", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.borderColor = "#10b981"} onMouseLeave={(e) => e.target.style.borderColor = "transparent"}>Home</Link>
        <Link to="/teams" style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: "500", transition: "0.3s", paddingBottom: "2px", borderBottom: "2px solid transparent", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.borderColor = "#10b981"} onMouseLeave={(e) => e.target.style.borderColor = "transparent"}>Teams</Link>
        <Link to="/matches" style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: "500", transition: "0.3s", paddingBottom: "2px", borderBottom: "2px solid transparent", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.borderColor = "#10b981"} onMouseLeave={(e) => e.target.style.borderColor = "transparent"}>Matches</Link>
        <Link to="/players" style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: "500", transition: "0.3s", paddingBottom: "2px", borderBottom: "2px solid transparent", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.borderColor = "#10b981"} onMouseLeave={(e) => e.target.style.borderColor = "transparent"}>Players</Link>
        <Link to="/pvp" style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: "500", transition: "0.3s", paddingBottom: "2px", borderBottom: "2px solid transparent", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.borderColor = "#10b981"} onMouseLeave={(e) => e.target.style.borderColor = "transparent"}>PVP</Link>
        <Link to="/predict" style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: "500", transition: "0.3s", paddingBottom: "2px", borderBottom: "2px solid transparent", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.borderColor = "#10b981"} onMouseLeave={(e) => e.target.style.borderColor = "transparent"}>Predict</Link>
        <Link to="/points" style={{ color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: "500", transition: "0.3s", paddingBottom: "2px", borderBottom: "2px solid transparent", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.borderColor = "#10b981"} onMouseLeave={(e) => e.target.style.borderColor = "transparent"}>Points</Link>
        <Link to="/spin" style={{ color: "#FFD700", textDecoration: "none", fontSize: "15px", fontWeight: "700", transition: "0.3s", paddingBottom: "2px", borderBottom: "2px solid transparent", cursor: "pointer" }} onMouseEnter={(e) => e.target.style.borderColor = "#FFD700"} onMouseLeave={(e) => e.target.style.borderColor = "transparent"}>Spin & Win</Link>
      </div>

      {/* Auth Section */}
      <div style={{ position: "relative", display: "flex", gap: "12px", alignItems: "center" }}>
        {user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "20px",
                  background: "rgba(0, 198, 255, 0.2)",
                  border: "2px solid #00c6ff"
                }}
              >
                <AccountCircle style={{ fontSize: "24px" }} />
                <span style={{ fontWeight: 600 }}>{user.display_name || user.username}</span>
                <span style={{
                  marginLeft: '8px',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '4px 8px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#FFD700',
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  {user.tokens !== undefined ? `${user.tokens} ⚡` : '0 ⚡'}
                </span>
              </motion.div>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "10px",
                    background: "white",
                    color: "#333",
                    borderRadius: "8px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                    minWidth: "200px",
                    zIndex: 1000,
                    overflow: "hidden"
                  }}
                >
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee" }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{user.display_name || user.username}</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#999" }}>{user.username}</p>
                  </div>
                  {/* Referral section */}
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #eee', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <small style={{ display: 'block', color: '#666' }}>Referral</small>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                        {referralInfo ? (
                          <span>{referralInfo.referral_code}</span>
                        ) : (
                          <span style={{ color: '#999' }}>{loadingReferral ? 'Loading...' : '—'}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={async () => {
                          // fetch referral if not loaded
                          if (!referralInfo && !loadingReferral) {
                            setLoadingReferral(true);
                            try {
                              const res = await fetch(`${API_BASE}/users/${encodeURIComponent(user.username)}/referral`);
                              const d = await res.json();
                              if (res.ok) setReferralInfo(d);
                            } catch (e) {
                              console.error('Referral fetch', e);
                            } finally {
                              setLoadingReferral(false);
                            }
                          }
                          // copy link if available
                          const link = referralInfo && referralInfo.share_link ? referralInfo.share_link : `${window.location.origin}/?ref=${referralInfo ? referralInfo.referral_code : ''}`;
                          try {
                            await navigator.clipboard.writeText(link);
                            alert('Referral link copied to clipboard');
                          } catch (e) {
                            // fallback
                            prompt('Copy this referral link', link);
                          }
                        }}
                        style={{
                          padding: '8px 10px',
                          background: 'linear-gradient(45deg,#00c6ff,#0072ff)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "background 0.3s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                  >
                    <Logout style={{ fontSize: "18px" }} />
                    Logout
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenLogin}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(45deg, #00c6ff, #0072ff)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s"
                }}
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenSignup}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(45deg, #FFD700, #FFA500)",
                  color: "#333",
                  border: "none",
                  borderRadius: "20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s"
                }}
              >
                Sign Up
              </motion.button>
            </>
          )}
        </div>
    </nav>
  );
}