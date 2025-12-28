import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { IPL_TEAMS } from "../data/iplTeams";
import { teamsData } from "../data/teamsData";

export default function Teams() {
  const { user, requireAuth, openSignup, openLogin } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    // Try fetching from backend, otherwise use teamsData directly
    // Backend returns short names like "CSK", "MI", "RCB"
    // teamsData has both short names and full names
    setTeams(teamsData);
  }, []);

  const handleTeamClick = (team) => {
    if (!user) {
      setShowAuthPrompt(true);
    } else {
      setSelectedTeam(team);
    }
  };

  return (
    <div style={{ padding: "36px 20px", background: "transparent", minHeight: "100vh", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "12px", fontSize: "2.5rem", fontWeight: "bold" }}>IPL Teams</h2>
        <p style={{ textAlign: "center", color: "#aaa", marginBottom: "36px", fontSize: "1.05rem" }}>
          Explore all IPL franchises and their details
        </p>

        {/* Grid Layout for Teams */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "24px"
        }}>
          {teams.map((team, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => handleTeamClick(team)}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "20px",
                cursor: "pointer",
                border: `2px solid ${team.color || "#e0e0e0"}`,
                boxShadow: "0 2px 8px rgba(2,12,27,0.2)",
                transition: "all 0.3s ease"
              }}
              whileHover={{
                y: -8,
                boxShadow: "0 12px 24px rgba(2,12,27,0.4)",
                borderColor: team.color || "#0b2545"
              }}
            >
              {/* Team Logo */}
              <div style={{
                height: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
                background: `linear-gradient(135deg, ${team.color || "#f0f4f8"}15, ${team.color || "#f0f4f8"}05)`,
                borderRadius: "12px",
                overflow: "hidden",
                border: `2px solid ${team.color || "#e0e0e0"}30`
              }}>
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    style={{
                      maxWidth: "85%",
                      maxHeight: "85%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))"
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `<div style="fontSize: 48px; fontWeight: 700; color: ${team.color || '#666'}">${team.name}</div>`;
                    }}
                  />
                ) : (
                  <div style={{ fontSize: "48px", fontWeight: 700, color: team.color || "#666" }}>
                    {team.name}
                  </div>
                )}
              </div>

              {/* Team Name and City */}
              <h3 style={{
                margin: "12px 0 4px 0",
                color: "#0b2545",
                fontSize: "1.25rem",
                fontWeight: 700
              }}>
                {team.fullName || team.name}
              </h3>
              <p style={{
                margin: "0 0 12px 0",
                color: "#666",
                fontSize: "0.9rem"
              }}>
                {team.city}
              </p>

              {/* Captain and Coach */}
              {team.captain && (
                <div style={{
                  marginBottom: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(11,37,69,0.1)",
                  fontSize: "0.85rem"
                }}>
                  <div style={{ color: "#666", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 600 }}>Captain:</span> {team.captain}
                  </div>
                  {team.coach && (
                    <div style={{ color: "#666" }}>
                      <span style={{ fontWeight: 600 }}>Coach:</span> {team.coach}
                    </div>
                  )}
                </div>
              )}

              {/* Titles */}
              {team.titles !== undefined && (
                <div style={{
                  color: "#FF6E1A",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  marginBottom: "12px"
                }}>
                  Titles: {team.titles}
                </div>
              )}

              {/* Top Scorer and Bowler */}
              {(team.topScorer || team.topBowler) && (
                <div style={{
                  fontSize: "0.8rem",
                  marginBottom: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(11,37,69,0.1)"
                }}>
                  {team.topScorer && (
                    <div style={{ color: "#666", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600 }}>Top Scorer:</span> {team.topScorer}
                    </div>
                  )}
                  {team.topBowler && (
                    <div style={{ color: "#666" }}>
                      <span style={{ fontWeight: 600 }}>Top Bowler:</span> {team.topBowler}
                    </div>
                  )}
                </div>
              )}

              {/* Click to View Button */}
              <button style={{
                width: "100%",
                marginTop: "16px",
                padding: "10px 16px",
                background: "linear-gradient(45deg, #00c6ff, #0072ff)",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}>
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Auth Prompt Modal */}
      <AnimatePresence>
        {showAuthPrompt && !user && (
          <div style={{position:'fixed', inset:0, display:'grid', placeItems:'center', background:'rgba(2,6,23,0.5)', zIndex:1200}}>
            <motion.div
              initial={{scale:0.95, opacity:0}}
              animate={{scale:1, opacity:1}}
              exit={{scale:0.95, opacity:0}}
              style={{background:'#fff', padding:28, borderRadius:14, width:'min(520px,94%)', boxShadow:'0 20px 40px rgba(2,12,27,0.25)'}}
            >
              <h3 style={{marginTop:0, color:'#0b2545', fontSize:'1.3rem'}}>Sign in to view team details</h3>
              <p style={{color:'#555', lineHeight:1.6}}>Sign up or log in to access detailed team statistics, player rosters, and exclusive insights.</p>
              <div style={{display:'flex', justifyContent:'flex-end', gap:12, marginTop:24}}>
                <button onClick={() => { openSignup(); setShowAuthPrompt(false); }} style={{padding:'10px 20px', background:'linear-gradient(45deg,#00c6ff,#0072ff)', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:'0.95rem'}}>Sign Up</button>
                <button onClick={() => { openLogin(); setShowAuthPrompt(false); }} style={{padding:'10px 20px', background:'transparent', color:'#0b2545', border:'2px solid #0b2545', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:'0.95rem'}}>Log In</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Team Detail Modal */}
      <AnimatePresence>
        {selectedTeam && user && (
          <div style={{position:'fixed', inset:0, display:'grid', placeItems:'center', background:'rgba(2,6,23,0.55)', zIndex:1300}}>
            <motion.div
              initial={{scale:0.9, opacity:0, y:20}}
              animate={{scale:1, opacity:1, y:0}}
              exit={{scale:0.9, opacity:0, y:-20}}
              style={{
                background:'#fff',
                borderRadius:16,
                width:'min(680px,94%)',
                maxHeight:'85vh',
                overflow:'auto',
                boxShadow:'0 25px 50px rgba(2,12,27,0.3)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTeam(null)}
                style={{
                  position:'absolute',
                  top:16,
                  right:16,
                  width:36,
                  height:36,
                  background:'#f0f4f8',
                  border:'none',
                  borderRadius:'50%',
                  fontSize:'1.3rem',
                  cursor:'pointer',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  zIndex:10
                }}
              >
                ✕
              </button>

              {/* Header with Logo and Color */}
              <div style={{
                background: `linear-gradient(135deg, ${selectedTeam.color || '#0b2545'}40, ${selectedTeam.color || '#0b2545'}20)`,
                padding:'32px 28px',
                borderBottom:'1px solid rgba(11,37,69,0.1)',
                textAlign:'center'
              }}>
                {selectedTeam.logo && (
                  <img
                    src={selectedTeam.logo}
                    alt={selectedTeam.name}
                    style={{
                      maxWidth:'140px',
                      maxHeight:'140px',
                      objectFit:'contain',
                      marginBottom:'16px',
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.1))"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <h2 style={{ margin:'0 0 8px 0', color:'#0b2545', fontSize:'2rem', fontWeight:700 }}>
                  {selectedTeam.fullName || selectedTeam.name}
                </h2>
                <p style={{ margin:'0', color:'#666', fontSize:'1rem' }}>
                  {selectedTeam.city}
                </p>
              </div>

              {/* Content */}
              <div style={{ padding:'28px' }}>
                {/* Description */}
                <div style={{ marginBottom:'24px' }}>
                  <h4 style={{ margin:'0 0 12px 0', color:'#0b2545', fontSize:'1.1rem', fontWeight:700 }}>About</h4>
                  <p style={{ margin:'0', color:'#555', lineHeight:1.8, fontSize:'0.95rem' }}>
                    {selectedTeam.description}
                  </p>
                </div>

                {/* Key Information Grid */}
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(2, 1fr)',
                  gap:'16px',
                  marginBottom:'24px'
                }}>
                  <div style={{ background:'#f8f9fa', padding:'16px', borderRadius:'10px' }}>
                    <div style={{ fontSize:'0.8rem', color:'#999', textTransform:'uppercase', fontWeight:700, marginBottom:'6px' }}>Founded</div>
                    <div style={{ fontSize:'1.1rem', fontWeight:700, color:'#0b2545' }}>{selectedTeam.founded}</div>
                  </div>
                  <div style={{ background:'#f8f9fa', padding:'16px', borderRadius:'10px' }}>
                    <div style={{ fontSize:'0.8rem', color:'#999', textTransform:'uppercase', fontWeight:700, marginBottom:'6px' }}>Captain</div>
                    <div style={{ fontSize:'1rem', fontWeight:700, color:'#0b2545' }}>{selectedTeam.captain}</div>
                    {selectedTeam.captainNote && (
                      <div style={{ fontSize:'0.75rem', color:'#666', marginTop:'4px', fontStyle:'italic' }}>
                        {selectedTeam.captainNote}
                      </div>
                    )}
                  </div>
                  <div style={{ background:'#f8f9fa', padding:'16px', borderRadius:'10px' }}>
                    <div style={{ fontSize:'0.8rem', color:'#999', textTransform:'uppercase', fontWeight:700, marginBottom:'6px' }}>Coach</div>
                    <div style={{ fontSize:'1.1rem', fontWeight:700, color:'#0b2545' }}>{selectedTeam.coach}</div>
                  </div>
                  <div style={{ background:'#f8f9fa', padding:'16px', borderRadius:'10px' }}>
                    <div style={{ fontSize:'0.8rem', color:'#999', textTransform:'uppercase', fontWeight:700, marginBottom:'6px' }}>Home Stadium</div>
                    <div style={{ fontSize:'0.95rem', fontWeight:700, color:'#0b2545' }}>{selectedTeam.stadium}</div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{
                  display:'grid',
                  gridTemplateColumns:'repeat(2, 1fr)',
                  gap:'16px',
                  marginBottom:'24px',
                  paddingTop:'24px',
                  borderTop:'1px solid rgba(11,37,69,0.1)'
                }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'2.4rem', fontWeight:700, color:'#00c6ff' }}>{selectedTeam.titles}</div>
                    <div style={{ fontSize:'0.9rem', color:'#666', marginTop:'4px' }}>IPL Titles</div>
                    {selectedTeam.titleYears && (
                      <div style={{ fontSize:'0.75rem', color:'#999', marginTop:'8px' }}>
                        {selectedTeam.titleYears}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'2.4rem', fontWeight:700, color:'#0072ff' }}>{selectedTeam.wins}</div>
                    <div style={{ fontSize:'0.9rem', color:'#666', marginTop:'4px' }}>Total Wins</div>
                  </div>
                </div>

                {/* Title Years Display */}
                {selectedTeam.titleYears && selectedTeam.titleYears !== "No titles yet" && (
                  <div style={{
                    background:'linear-gradient(135deg, #FF6E1A15, #FF8C4215)',
                    padding:'16px',
                    borderRadius:'10px',
                    marginBottom:'24px',
                    borderLeft:'4px solid #FF6E1A'
                  }}>
                    <div style={{ fontSize:'0.8rem', color:'#999', textTransform:'uppercase', fontWeight:700, marginBottom:'8px' }}>Championship Years</div>
                    <div style={{ fontSize:'1rem', fontWeight:600, color:'#0b2545' }}>
                      {selectedTeam.titleYears}
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                {selectedTeam.additionalInfo && (
                  <div style={{
                    background:'linear-gradient(135deg, rgba(11,37,69,0.08), rgba(255,110,26,0.08))',
                    padding:'18px',
                    borderRadius:'10px',
                    borderLeft:'4px solid #0b2545',
                    marginBottom:'24px'
                  }}>
                    <h4 style={{ margin:'0 0 8px 0', color:'#0b2545', fontSize:'0.95rem', fontWeight:700, textTransform:'uppercase' }}>Team Highlights</h4>
                    <p style={{ margin:'0', color:'#555', lineHeight:1.6, fontSize:'0.9rem' }}>
                      {selectedTeam.additionalInfo}
                    </p>
                  </div>
                )}

                {/* Top Performers */}
                {(selectedTeam.topScorer || selectedTeam.topBowler) && (
                  <div style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(2, 1fr)',
                    gap:'16px',
                    marginBottom:'24px',
                    paddingTop:'24px',
                    borderTop:'1px solid rgba(11,37,69,0.1)'
                  }}>
                    {selectedTeam.topScorer && (
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:'0.9rem', fontWeight:600, color:'#0b2545' }}>{selectedTeam.topScorer}</div>
                        <div style={{ fontSize:'0.85rem', color:'#666', marginTop:'4px' }}>Top Scorer</div>
                      </div>
                    )}
                    {selectedTeam.topBowler && (
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:'0.9rem', fontWeight:600, color:'#0b2545' }}>{selectedTeam.topBowler}</div>
                        <div style={{ fontSize:'0.85rem', color:'#666', marginTop:'4px' }}>Top Bowler</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setSelectedTeam(null)}
                  style={{
                    width:'100%',
                    padding:'12px 20px',
                    background:'linear-gradient(45deg, #00c6ff, #0072ff)',
                    color:'#fff',
                    border:'none',
                    borderRadius:'8px',
                    fontWeight:700,
                    cursor:'pointer',
                    fontSize:'0.95rem'
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
