import React from "react";

const teams = [
  "Chennai Super Kings", "Mumbai Indians", "Royal Challengers Bangalore",
  "Kolkata Knight Riders", "Sunrisers Hyderabad", "Delhi Capitals",
  "Punjab Kings", "Rajasthan Royals", "Gujarat Titans", "Lucknow Super Giants"
];

export default function TeamsList() {
  return (
    <ul>
      {teams.map((team, idx) => <li key={idx}>{team}</li>)}
    </ul>
  );
}