import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { IPL_TEAMS } from "../data/iplTeams";
import API_BASE from "../config";

export default function Teams() {
  const { user, requireAuth, openSignup, openLogin } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE}/teams`)
      .then(res => setTeams(res.data.teams && res.data.teams.length ? res.data.teams : IPL_TEAMS))
      .catch(() => setTeams(IPL_TEAMS));
  }, []);

  const handleTeamClick = () => {
    if (!user) {
      setShowAuthPrompt(true);
    }
  };


  return (
    <div style={{ padding: "36px 20px", background: "#f7fbff", minHeight: "70vh" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: "#0b2545", marginBottom: "24px" }}>IPL Teams</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {teams.map((team, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={handleTeamClick}
              style={{
                padding: "16px 20px",
                margin: "12px 0",
                background: "#ffffff",
                border: "1px solid rgba(11,37,69,0.06)",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 700,
                color: "#04233a",
                transition: "transform 0.18s, box-shadow 0.18s",
                boxShadow: "0 2px 8px rgba(2,12,27,0.04)",
                fontSize: "1.05rem"
              }}
              whileHover={{ y: -4, boxShadow: "0 8px 20px rgba(2,12,27,0.08)" }}
            >
              {team}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}