import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Matches() {
  const { user, openSignup, openLogin } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterTeam1, setFilterTeam1] = useState("");
  const [filterTeam2, setFilterTeam2] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(!user);

  useEffect(() => {
    if (!user) {
      setShowAuthPrompt(true);
      setLoading(false);
      return;
    }

    axios.get("http://127.0.0.1:8000/matches")
      .then(res => {
        const data = res.data.matches || res.data || [];
        const matchesArray = Array.isArray(data) ? data : [];

        // Helper to safely extract year from various date formats
        const getYear = (d) => {
          if (!d) return 0;
          // Try Date parse first
          const parsed = new Date(d);
          if (!isNaN(parsed.getFullYear())) return parsed.getFullYear();
          // Fallback: look for 4 digit year in string
          const m = d.match(/(20\d{2}|19\d{2})/);
          return m ? parseInt(m[0]) : 0;
        };

        // Sort matches in descending order by full date (newest first)
        const sortedMatches = matchesArray.slice().sort((a, b) => {
          const yearA = getYear(a.date);
          const yearB = getYear(b.date);
          // If same year and full date exists try ISO compare
          if (yearA === yearB && a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
          }
          return yearB - yearA; // Descending by year
        });

        setMatches(sortedMatches);
        // derive available years and teams for filters
        const years = Array.from(new Set(sortedMatches.map(m => {
          if (!m || !m.date) return 'Unknown';
          const d = new Date(m.date);
          if (!isNaN(d.getFullYear())) return d.getFullYear();
          const mRes = m.date.match(/(20\d{2}|19\d{2})/);
          return mRes ? parseInt(mRes[0]) : 'Unknown';
        })));
        setAvailableYears(years.filter(y => y !== undefined).sort((a,b)=> (a==='Unknown'?1:(b==='Unknown'?-1: b - a))));
        const teams = Array.from(new Set(sortedMatches.reduce((acc,m)=>{ if(m.team1) acc.push(m.team1); if(m.team2) acc.push(m.team2); return acc; },[])));
        setAvailableTeams(teams.sort());
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setMatches([]);
        setLoading(false);
      });
  }, [user]);

  if (showAuthPrompt && !user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "40px"
        }}
      >
        <h1 style={{ color: "#ffffff", marginBottom: "20px", fontSize: "2.5em" }}>
          IPL Matches
        </h1>
        <p style={{ color: "#cccccc", fontSize: "1.1em", marginBottom: "30px", maxWidth: "600px" }}>
          View all IPL matches, schedules, results, and live scores
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openSignup}
          style={{
            padding: "14px 32px",
            background: "linear-gradient(45deg, #00c6ff, #0072ff)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            marginRight: "15px"
          }}
        >
          Sign Up Now
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openLogin}
          style={{
            padding: "14px 32px",
            background: "transparent",
            color: "#00c6ff",
            border: "2px solid #00c6ff",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Already a Member?
        </motion.button>
      </motion.div>
    );
  }

  if (loading) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "40px" }}>
      Loading matches...
    </motion.div>
  );
  
  if (error) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", color: "red", padding: "40px" }}>
      Error: {error}
    </motion.div>
  );

  return (
    <div style={{ 
      padding: "40px 20px", 
      background: "transparent",
      minHeight: "100vh"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ 
          textAlign: "center", 
          color: "#fff", 
          marginBottom: "12px",
          fontSize: "2.5rem",
          fontWeight: 700
        }}>
          IPL Matches
        </h2>
        <p style={{
          textAlign: "center",
          color: "#cccccc",
          marginBottom: "40px",
          fontSize: "1.05rem"
        }}>
          View all IPL matches, schedules, results, and live scores
        </p>

        <div style={{ marginBottom: 18, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            placeholder="Search by team, venue, date..."
            value={searchText}
            onChange={(e)=>setSearchText(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', minWidth: 220 }}
          />
          <select value={filterYear} onChange={(e)=>setFilterYear(e.target.value)} style={{ padding: '10px', borderRadius: 8, border: '1px solid #ddd' }}>
            <option value="">All Years</option>
            {availableYears.map((y, i)=>(<option key={i} value={y}>{y}</option>))}
          </select>
          <select value={filterTeam1} onChange={(e)=>setFilterTeam1(e.target.value)} style={{ padding: '10px', borderRadius: 8, border: '1px solid #ddd' }}>
            <option value="">Any Team 1</option>
            {availableTeams.map((t, i)=>(<option key={i} value={t}>{t}</option>))}
          </select>
          <select value={filterTeam2} onChange={(e)=>setFilterTeam2(e.target.value)} style={{ padding: '10px', borderRadius: 8, border: '1px solid #ddd' }}>
            <option value="">Any Team 2</option>
            {availableTeams.map((t, i)=>(<option key={i} value={t}>{t}</option>))}
          </select>
          <button onClick={()=>{ setSearchText(''); setFilterYear(''); setFilterTeam1(''); setFilterTeam2(''); }} style={{ padding: '10px 14px', borderRadius: 8, border: 'none', background:'#0b2545', color:'#fff' }}>Reset</button>
        </div>

        {(() => {
          const q = (searchText||"").toLowerCase().trim();
          const filtered = matches.filter(m=>{
            if (!m) return false;
            if (filterYear) {
              const year = m.date ? (new Date(m.date).getFullYear && !isNaN(new Date(m.date).getFullYear()) ? new Date(m.date).getFullYear() : ((m.date.match(/(20\d{2}|19\d{2})/)||[null])[0])) : 'Unknown';
              if (String(year) !== String(filterYear)) return false;
            }
            if (filterTeam1 && m.team1 !== filterTeam1) return false;
            if (filterTeam2 && m.team2 !== filterTeam2) return false;
            if (!q) return true;
            const hay = `${m.team1 || ''} ${m.team2 || ''} ${m.venue || ''} ${m.date || ''}`.toLowerCase();
            return hay.indexOf(q) !== -1;
          });
          if (filtered.length === 0) {
            return (
              <div style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#ffffff",
                borderRadius: "12px",
                border: "2px dashed #ddd"
              }}>
                <p style={{ color: "#666", fontSize: "1.1rem" }}>No matches found for selected filters</p>
              </div>
            );
          }

          const groups = filtered.reduce((acc, m) => {
            const yearMatch = (m.date && new Date(m.date).getFullYear && !isNaN(new Date(m.date).getFullYear()))
              ? new Date(m.date).getFullYear()
              : (m.date && (m.date.match(/(20\d{2}|19\d{2})/) || [0])[0]);
            const year = yearMatch || 'Unknown';
            acc[year] = acc[year] || [];
            acc[year].push(m);
            return acc;
          }, {});

          const yearKeys = Object.keys(groups)
            .map(k => (k === 'Unknown' ? k : parseInt(k)))
            .sort((a, b) => {
              if (a === 'Unknown') return 1;
              if (b === 'Unknown') return -1;
              return b - a;
            });

          return yearKeys.map((yk, yi) => {
            const yearKey = yk;
            const items = groups[yearKey];
            items.sort((a, b) => {
              const da = a.date ? new Date(a.date) : new Date(0);
              const db = b.date ? new Date(b.date) : new Date(0);
              return db - da;
            });

            return (
              <div key={yi} style={{ marginBottom: 28 }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#ffffff', fontSize: '1.6rem' }}>{yearKey}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                  {items.map((match, idx) => (
                    <motion.div
                      key={`${yearKey}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(11,37,69,0.15)' }}
                      style={{
                        padding: '24px',
                        background: '#ffffff',
                        border: '2px solid #0b254530',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(11,37,69,0.08)'
                      }}
                    >
                      <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '2px solid #00c6ff40' }}>
                        <h4 style={{ margin: 0, color: '#0b2545', fontSize: '1.15rem', fontWeight: 700 }}>
                          <span style={{ color: '#FF6E1A' }}>{match.team1 || 'N/A'}</span>
                          <span style={{ color: '#999', margin: '0 8px' }}>vs</span>
                          <span style={{ color: '#00c6ff' }}>{match.team2 || 'N/A'}</span>
                        </h4>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.95rem' }}>
                          <span style={{ color: '#666', fontWeight: 600, marginRight: '8px' }}>📅</span>
                          <span style={{ color: '#333' }}>{match.date || 'TBD'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.95rem' }}>
                          <span style={{ color: '#666', fontWeight: 600, marginRight: '8px' }}>⏰</span>
                          <span style={{ color: '#333' }}>{match.time || 'TBD'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.95rem' }}>
                          <span style={{ color: '#666', fontWeight: 600, marginRight: '8px' }}>📍</span>
                          <span style={{ color: '#333' }}>{match.venue || 'TBD'}</span>
                        </div>
                      </div>

                      <div style={{ background: match.winner && match.winner !== 'TBD' ? 'linear-gradient(135deg, #2e7d3215, #4caf5015)' : 'linear-gradient(135deg, #f5f5f515, #e0e0e015)', padding: '14px', borderRadius: '8px', borderLeft: `4px solid ${match.winner && match.winner !== 'TBD' ? '#4caf50' : '#ff9800'}` }}>
                        <span style={{ color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Result</span>
                        <div style={{ color: match.winner && match.winner !== 'TBD' ? '#2e7d32' : '#ff9800', fontWeight: 700, fontSize: '1.05rem', marginTop: '4px' }}>{match.winner && match.winner !== 'TBD' ? `🏆 ${match.winner}` : '⏳ TBD'}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}