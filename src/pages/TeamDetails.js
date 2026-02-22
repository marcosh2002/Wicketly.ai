import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function TeamDetails() {
  const { teamName } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/players?team=${teamName}`)
      .then(res => setPlayers(res.data.players || []))
      .catch(() => setPlayers([]));
  }, [teamName]);

  return (
    <div>
      <h2 style={{ textAlign: "center", fontWeight: "bold" }}>{teamName} Players</h2>
      <ul>
        {players.length === 0 && <li>No players found for this team.</li>}
        {players.map((player, idx) => (
          <li key={idx}>
            {player.Player_Name}
            {player.Country ? ` (${player.Country})` : ""}
            {player.Batting_Hand ? ` | Batting: ${player.Batting_Hand}` : ""}
            {player.Bowling_Skill ? ` | Bowling: ${player.Bowling_Skill}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}