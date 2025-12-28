import React, { useMemo } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000';

async function fetchOverByOver(team1, team2, overs) {
  const resp = await axios.get(`${API_BASE}/analytics/over-by-over`, {
    params: { team1, team2, overs }
  });
  return resp.data;
}

export default function OverByOverChart({ team1 = 'CSK', team2 = 'MI', overs = 20 }) {
  const { data, error, isLoading } = useQuery(['over-by-over', team1, team2, overs], () => fetchOverByOver(team1, team2, overs), {
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false
  });

  const chartData = useMemo(() => {
    if (!data || !data.ok) return [];
    const t1 = data.progression.team1 || [];
    const t2 = data.progression.team2 || [];
    const maxLen = Math.max(t1.length, t2.length);
    const arr = [];
    for (let i = 0; i < maxLen; i++) {
      arr.push({
        over: (i + 1).toString(),
        [team1]: t1[i] ? t1[i].cumulative : null,
        [team2]: t2[i] ? t2[i].cumulative : null
      });
    }
    return arr;
  }, [data, team1, team2]);

  if (isLoading) return (
    <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: '#9fb6c8' }}>Loading over-by-over data...</Typography>
    </Box>
  );

  if (error || (data && !data.ok)) return (
    <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: '#f88' }}>Unable to load chart data.</Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', height: 260 }}>
      <Typography sx={{ color: '#bfe6ff', fontWeight: 700, mb: 1 }}>Over-by-over Cumulative Runs</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#083242" />
          <XAxis dataKey="over" stroke="#9fb6c8" />
          <YAxis stroke="#9fb6c8" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={team1} stroke="#ff6600" strokeWidth={2} dot={{ r: 2 }} />
          <Line type="monotone" dataKey={team2} stroke="#00bcd4" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
