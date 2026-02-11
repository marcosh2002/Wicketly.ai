import React from "react";

const matches = [
  "CSK vs MI - Winner: CSK",
  "RCB vs KKR - Winner: KKR",
  "SRH vs DC - Winner: SRH"
  // Add more sample matches here
];

export default function MatchesList() {
  return (
    <ul>
      {matches.map((match, idx) => <li key={idx}>{match}</li>)}
    </ul>
  );
}