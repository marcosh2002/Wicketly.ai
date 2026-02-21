import React, { useMemo } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';
import API_BASE from '../config';

async function fetchVenue(venue) {
  const resp = await axios.get(`${API_BASE}/analytics/venue`, { params: { venue } });
  return resp.data;
}

export default function VenuePerformanceChart({ venue = 'Stadium' }) {
  const { data, error, isLoading } = useQuery(['venue', venue], () => fetchVenue(venue), {
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false
  });

  const chartData = useMemo(() => {
    if (!data || !data.ok) return [];
    return data.results.map(r => ({ team: r.team, avg_runs: r.avg_runs }));
  }, [data]);

  if (isLoading) return (
    <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: '#9fb6c8' }}>Loading venue performance...</Typography>
    </Box>
  );

  if (error || (data && !data.ok)) return (
    <Box sx={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: '#f88' }}>Unable to load venue data.</Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', height: 260 }}>
      <Typography sx={{ color: '#bfe6ff', fontWeight: 700, mb: 1 }}>Venue Avg Runs — {venue}</Typography>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#083242" />
          <XAxis type="number" stroke="#9fb6c8" />
          <YAxis dataKey="team" type="category" stroke="#9fb6c8" width={90} />
          <Tooltip />
          <Bar dataKey="avg_runs" fill="#8ef6c0" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
