import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, MenuItem, Select, TextField, Typography, LinearProgress } from '@mui/material';
import API_BASE from '../config';

// This API_BASE is now imported from config.js, but keep local for backward compatibility

async function fetchPrediction(team1, team2, venue, weather) {
  // quick GET predict endpoint uses team1_score and team2_score and overs; use defaults for a baseline
  const params = {
    team1,
    team2,
    team1_score: 120,
    team2_score: 115,
    overs: 20,
    venue: venue || 'Neutral',
    weather: weather || 'Sunny'
  };
  const resp = await axios.get(`${API_BASE}/predict`, { params });
  return resp.data;
}

async function fetchPlayers(team) {
  const resp = await axios.get(`${API_BASE}/players`, { params: { team } });
  return resp.data;
}

export default function MatchPredictionBreakdown({ defaultTeam1 = 'CSK', defaultTeam2 = 'MI' }) {
  const [team1, setTeam1] = useState(defaultTeam1);
  const [team2, setTeam2] = useState(defaultTeam2);
  const [venue, setVenue] = useState('M. A. Chidambaram Stadium, Chennai');
  const [weather, setWeather] = useState('Sunny');
  const [manualScores, setManualScores] = useState({ s1: 120, s2: 115 });

  const { data: teamsData } = useQuery(['teams-list'], async () => {
    try {
      const r = await axios.get(`${API_BASE}/teams`);
      return r.data.teams || [];
    } catch (e) {
      return [];
    }
  });

  const { data: prediction, isLoading: predLoading, refetch: refetchPrediction } = useQuery(
    ['predict', team1, team2, venue, weather, manualScores.s1, manualScores.s2],
    () => fetchPrediction(team1, team2, venue, weather),
    { enabled: false }
  );

  const { data: playersData, isLoading: playersLoading } = useQuery(
    ['players', team1],
    () => fetchPlayers(team1),
    { enabled: !!team1 }
  );

  const teamWin = useMemo(() => {
    if (!prediction || !prediction.ok) return null;
    // backend returns predicted_winner and winning_probability (percent of winner)
    const winner = prediction.predicted_winner;
    const winProb = prediction.winning_probability || 50;
    const t1Prob = winner === team1 ? winProb : Math.round(100 - winProb);
    const t2Prob = 100 - t1Prob;
    return { winner, t1Prob, t2Prob };
  }, [prediction, team1]);

  function getTossAdvice(venueName) {
    // Simple heuristic: certain venues favor batting first
    const battingFav = ['Chidambaram', 'Eden Gardens', 'Wankhede', 'M. A. Chidambaram'];
    const pitchText = battingFav.some(v => venueName.includes(v)) ? 'bat' : 'bowl';
    return `Toss winner often chooses to ${pitchText} first at this venue.`;
  }

  function getWeatherImpactText(weatherKind) {
    switch ((weatherKind || '').toLowerCase()) {
      case 'rainy':
      case 'rain':
        return 'Rain may reduce scoring and increase uncertainty; consider bowling-friendly conditions.';
      case 'hot':
        return 'Hot conditions usually favor batting as the ball comes on quicker; expect higher scoring.';
      case 'overcast':
        return 'Overcast conditions can help seamers early; expect wicket opportunities.';
      default:
        return 'Clear skies; standard conditions with typical scoring patterns.';
    }
  }

  const keyPlayers = useMemo(() => {
    if (!playersData || !playersData.players) return [];
    // pick top batters by 'Runs' or first 3 players as a fallback
    const players = playersData.players;
    const runCols = ['Runs', 'runs', 'RunsScored', 'Runs_total'];
    const col = runCols.find(c => players[0] && players[0][c] !== undefined);
    if (col) {
      return players
        .filter(p => p[col] !== undefined)
        .sort((a, b) => Number(b[col] || 0) - Number(a[col] || 0))
        .slice(0, 3);
    }
    return players.slice(0, 3);
  }, [playersData]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Select 
          value={team1} 
          onChange={(e) => setTeam1(e.target.value)} 
          size='small'
          sx={{ 
            color: '#fff',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 102, 0, 0.3)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 102, 0, 0.5)' },
            backgroundColor: '#051a28'
          }}
        >
          {teamsData && teamsData.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
        <Select 
          value={team2} 
          onChange={(e) => setTeam2(e.target.value)} 
          size='small'
          sx={{ 
            color: '#fff',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 102, 0, 0.3)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 102, 0, 0.5)' },
            backgroundColor: '#051a28'
          }}
        >
          {teamsData && teamsData.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
        <TextField 
          size='small' 
          label='Venue' 
          value={venue} 
          onChange={(e) => setVenue(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': { color: '#fff' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 102, 0, 0.3)' },
            '& .MuiInputBase-input::placeholder': { color: '#8ab3d0', opacity: 0.7 }
          }}
          InputLabelProps={{ style: { color: '#8ab3d0' } }}
        />
        <Select 
          value={weather} 
          onChange={(e) => setWeather(e.target.value)} 
          size='small'
          sx={{ 
            color: '#fff',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 102, 0, 0.3)' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 102, 0, 0.5)' },
            backgroundColor: '#051a28'
          }}
        >
          <MenuItem value='Sunny'>Sunny</MenuItem>
          <MenuItem value='Hot'>Hot</MenuItem>
          <MenuItem value='Overcast'>Overcast</MenuItem>
          <MenuItem value='Rainy'>Rainy</MenuItem>
        </Select>
        <Button 
          variant='contained' 
          onClick={() => refetchPrediction()} 
          disabled={predLoading}
          sx={{ bgcolor: '#ff6600', '&:hover': { bgcolor: '#ff8533' }, fontWeight: 700, color: '#fff' }}
        >
          Analyze
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box sx={{ p: 2, bgcolor: '#051a28', borderRadius: 2, border: '1px solid rgba(255, 102, 0, 0.1)' }}>
          <Typography sx={{ color: '#e6f7ff', fontWeight: 800, fontSize: '1rem', mb: 1 }}>Team Win Probability</Typography>
          {predLoading && <LinearProgress sx={{ mt: 2 }} />}
          {!prediction && !predLoading && (
            <Typography sx={{ color: '#8ab3d0', mt: 1 }}>Click "Analyze" to see win probabilities</Typography>
          )}
          {prediction && prediction.ok && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>{team1}: {teamWin ? `${teamWin.t1Prob}%` : '—'}</Typography>
              <LinearProgress variant='determinate' value={teamWin ? teamWin.t1Prob : 0} sx={{ height: 10, borderRadius: 6, bgcolor: '#1a3a4a', '& .MuiLinearProgress-bar': { bgcolor: '#ff6600' } }} />
              <Typography sx={{ color: '#fff', fontWeight: 700, mt: 2, mb: 1 }}>{team2}: {teamWin ? `${teamWin.t2Prob}%` : '—'}</Typography>
              <LinearProgress variant='determinate' value={teamWin ? teamWin.t2Prob : 0} sx={{ height: 10, borderRadius: 6, bgcolor: '#1a3a4a', '& .MuiLinearProgress-bar': { bgcolor: '#00bcd4' } }} />
              <Typography sx={{ color: '#8ab3d0', mt: 1, fontSize: '0.9rem' }}>Model confidence: {prediction.confidence || 'N/A'}</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ p: 2, bgcolor: '#051a28', borderRadius: 2, border: '1px solid rgba(255, 102, 0, 0.1)' }}>
          <Typography sx={{ color: '#e6f7ff', fontWeight: 800, fontSize: '1rem', mb: 1 }}>Toss Advantage</Typography>
          <Typography sx={{ color: '#d9f0f7', mt: 1 }}>{getTossAdvice(venue)}</Typography>

          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 102, 0, 0.1)' }}>
            <Typography sx={{ color: '#e6f7ff', fontWeight: 700, mb: 1 }}>Pitch & Weather Impact</Typography>
            <Typography sx={{ color: '#d9f0f7', mt: 1 }}>{getWeatherImpactText(weather)}</Typography>
          </Box>
        </Box>

        <Box sx={{ gridColumn: '1 / span 2', p: 2, bgcolor: '#051a28', borderRadius: 2, border: '1px solid rgba(255, 102, 0, 0.1)' }}>
          <Typography sx={{ color: '#e6f7ff', fontWeight: 800, fontSize: '1rem', mb: 1 }}>Key Player Influence</Typography>
          {playersLoading && <Typography sx={{ color: '#8ab3d0', mt: 1 }}>Loading players…</Typography>}
          {!playersLoading && keyPlayers.length === 0 && (
            <Typography sx={{ color: '#8ab3d0', mt: 1 }}>No player stats available for this team.</Typography>
          )}
          {!playersLoading && keyPlayers.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {keyPlayers.map((p, idx) => (
                <Box key={idx} sx={{ p: 2, bgcolor: '#051a28', borderRadius: 2, minWidth: 160, border: '1px solid rgba(255, 102, 0, 0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  <Typography sx={{ color: '#e6f7ff', fontWeight: 700, mb: 0.5 }}>{p.Player || p.playerName || p.Name || p.name || p.batsman || `Player ${idx+1}`}</Typography>
                  <Typography sx={{ color: '#8ab3d0', fontSize: '0.9rem', mb: 0.5 }}>{p.Runs ? `Runs: ${p.Runs}` : p.runs ? `Runs: ${p.runs}` : 'N/A'}</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#ffcc80' }}>{p.Role || p.role || p.Position || 'Batsman'}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
