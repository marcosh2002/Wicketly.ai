import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

function TeamRunsChart({ data }) {
  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="team" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="runs" fill="#8884d8" />
    </BarChart>
  );
}

export default TeamRunsChart;