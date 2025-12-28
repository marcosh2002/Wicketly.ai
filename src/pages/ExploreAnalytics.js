import React from 'react';
import { Box, Container, Grid, Paper, Typography, Button, LinearProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import OverByOverChart from '../components/OverByOverChart';
import MatchPredictionBreakdown from '../components/MatchPredictionBreakdown';
import VenuePerformanceChart from '../components/VenuePerformanceChart';
import LockIcon from '@mui/icons-material/Lock';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';

const glowStyle = {
  boxShadow: '0 8px 30px rgba(13,62,101,0.12), 0 0 20px rgba(255,102,0,0.06) inset',
  borderRadius: 12,
  padding: 18
};

function StatCard({ title, children, accent }) {
  return (
    <Paper elevation={6} sx={{ 
      ...glowStyle, 
      bgcolor: '#0a2a3d', 
      color: '#e6f7ff',
      border: '1px solid rgba(255, 102, 0, 0.1)',
      '&:hover': {
        boxShadow: '0 12px 40px rgba(13,62,101,0.2), 0 0 30px rgba(255,102,0,0.1) inset'
      }
    }}>
      <Typography variant='subtitle2' sx={{ color: accent || '#ffb86b', fontWeight: '700', mb: 1, fontSize: '1rem' }}>{title}</Typography>
      {children}
    </Paper>
  );
}

function FadedComingSoon({ title, icon }) {
  return (
    <Paper elevation={2} sx={{ p: 3, textAlign: 'center', opacity: 0.65, borderRadius: 2, bgcolor: '#0a2a3d', border: '1px dashed rgba(255, 102, 0, 0.2)', transition: 'all 0.3s ease' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
        <IconButton size='small' sx={{ bgcolor: 'rgba(255, 102, 0, 0.1)', color: '#ffcc80' }}>
          {icon}
        </IconButton>
        <Typography variant='h6' sx={{ color: '#d9f0f7', fontWeight: 700 }}>{title}</Typography>
      </Box>
      <Typography sx={{ color: '#8ab3d0' }}>
        Coming Soon
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant='outlined' startIcon={<LockIcon />} disabled sx={{ color: '#8ab3d0', borderColor: '#1a3a4a' }}>
          Locked
        </Button>
      </Box>
    </Paper>
  );
}

export default function ExploreAnalytics() {
  // Placeholder data (can be replaced with real API calls)
  const confidence = 78; // percent animated
  const predictedRunRange = '140 - 173';

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #0f1a2e 0%, #1a3a4a 50%, #0f2d3d 100%)',
      minHeight: '100vh', 
      py: 6, 
      color: '#e6f7ff',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 50%, rgba(255, 102, 0, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <Container maxWidth='xl' sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant='h3' sx={{ fontWeight: '800', color: '#fff', mb: 1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Explore Analytics</Typography>
          <Typography sx={{ color: '#c0d9e8', fontSize: '1.1rem' }}>Futuristic IPL dashboard — cricket-themed, AI-driven, and richly visual.</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left column: Key features + Match Prediction */}
          <Grid item xs={12} md={4}>
              <StatCard title='Match Prediction Breakdown' accent='#ffcc80'>
                <Box sx={{ bgcolor: '#051a28', p: 2, borderRadius: 1.5, color: '#e6f7ff' }}>
                  <MatchPredictionBreakdown />
                </Box>
              </StatCard>
              <Box sx={{ height: 18 }} />

            <StatCard title='Predicted Run Range' accent='#a3e635'>
              <Typography sx={{ color: '#d9f0f7', mb: 1, fontWeight: 600 }}>Expected Runs</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant='h5' sx={{ color: '#fff', fontWeight: 800 }}>{predictedRunRange}</Typography>
                <Button variant='contained' sx={{ bgcolor: '#ff6600', '&:hover': { bgcolor: '#ff8533' }, color: '#fff', fontWeight: 700 }}>View Details</Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant='caption' sx={{ color: '#c0d9e8', fontWeight: 600 }}>Wicket Fall Timeline</Typography>
                <Box sx={{ mt: 1, height: 70, bgcolor: '#051a28', borderRadius: 2, p: 2, border: '1px solid rgba(255, 102, 0, 0.1)' }}>
                  <Typography variant='caption' sx={{ color: '#8ab3d0' }}>Wickets predicted at key milestones</Typography>
                </Box>
              </Box>
            </StatCard>

            <Box sx={{ height: 18 }} />

            <StatCard title='Toss & Pitch Impact' accent='#82e0ff'>
              <Typography sx={{ color: '#e6f7ff', mb: 1, fontWeight: 600 }}>Toss advantage: <strong>Batting</strong></Typography>
              <Typography sx={{ color: '#e6f7ff', mb: 1, fontWeight: 600 }}>Pitch: Spin-friendly</Typography>
              <Typography sx={{ color: '#c0d9e8' }}>Weather: Slight chance of rain — reduces confidence by 5-10%</Typography>
            </StatCard>
          </Grid>

          {/* Middle column: Visual Analytics */}
          <Grid item xs={12} md={5}>
            <Paper elevation={8} sx={{ ...glowStyle, minHeight: 420, p: 3, bgcolor: '#0a2a3d', border: '1px solid rgba(255, 102, 0, 0.1)' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid rgba(255, 102, 0, 0.1)' }}>
                  <Box>
                    <Typography variant='h6' sx={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>Visual Analytics</Typography>
                    <Typography variant='caption' sx={{ color: '#8ab3d0', fontSize: '0.95rem' }}>Venue-based performance • Head-to-head • Over-by-over predictions</Typography>
                  </Box>
                  <Box>
                    <Button variant='contained' sx={{ bgcolor: '#ff6600', ml: 2, color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#ff8533' } }}>Export CSV</Button>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 260, bgcolor: '#051a28', borderRadius: 2, p: 2, border: '1px solid rgba(255, 102, 0, 0.1)' }}>
                    <Typography sx={{ color: '#8ab3d0', fontWeight: 700, mb: 1 }}>Over-by-Over Projection</Typography>
                    <OverByOverChart team1={'CSK'} team2={'MI'} overs={20} />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ height: 260, bgcolor: '#051a28', borderRadius: 2, p: 2, border: '1px solid rgba(255, 102, 0, 0.1)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ color: '#e6f7ff', fontWeight: 700, fontSize: '1rem' }}>Venue Performance</Typography>
                      <img src="/assets/venue-placeholder.svg" alt="venue" loading="lazy" style={{ width: 48, height: 48 }} />
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant='caption' sx={{ color: '#8ab3d0', mb: 1, display: 'block' }}>Top teams by average runs at the venue</Typography>
                      <Box sx={{ mt: 1 }}>
                        {/* VenuePerformanceChart fetches data from backend */}
                        <VenuePerformanceChart venue={'M. A. Chidambaram Stadium'} />
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mt: 1, height: 120, bgcolor: '#051a28', borderRadius: 2, p: 2, border: '1px solid rgba(255, 102, 0, 0.1)' }}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography sx={{ color: '#e6f7ff', fontWeight: 700, fontSize: '0.95rem' }}>Powerplay Projection</Typography>
                        <Typography sx={{ color: '#8ab3d0', fontSize: '0.9rem', mt: 1 }}>Expected: 45-52 runs, 0-1 wickets</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography sx={{ color: '#e6f7ff', fontWeight: 700, fontSize: '0.95rem' }}>Death Over Projection</Typography>
                        <Typography sx={{ color: '#8ab3d0', fontSize: '0.9rem', mt: 1 }}>Expected: 35-42 runs in final 5 overs</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right column: Player & Team insights */}
          <Grid item xs={12} md={3}>
            <StatCard title='Player Insights (IPL Only)' accent='#b39ddb'>
              <Typography sx={{ color: '#e6f7ff', mb: 1 }}>• Current season form graph</Typography>
              <Typography sx={{ color: '#e6f7ff', mb: 1 }}>• Player matchups</Typography>
              <Typography sx={{ color: '#e6f7ff', mb: 1 }}>• Top batters/bowlers ranking</Typography>
              <Typography sx={{ color: '#e6f7ff', mb: 2 }}>• Player Impact Index</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant='contained' sx={{ bgcolor: '#ff6600', color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#ff8533' }, width: '100%' }}>Open Player Insights</Button>
              </Box>
            </StatCard>

            <Box sx={{ height: 18 }} />

            <StatCard title='Team Form Analysis' accent='#8ef6c0'>
              <Typography sx={{ color: '#e6f7ff', mb: 1 }}>• Last 5 IPL matches</Typography>
              <Typography sx={{ color: '#e6f7ff', mb: 1 }}>• Batting/Bowling strengths</Typography>
              <Typography sx={{ color: '#e6f7ff' }}>• Fielding efficiency score</Typography>
            </StatCard>

            <Box sx={{ height: 18 }} />

            <Paper elevation={3} sx={{ p: 3, bgcolor: '#0a2a3d', borderRadius: 2, border: '1px solid rgba(255, 102, 0, 0.1)' }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem', mb: 1 }}>Advanced IPL Stats</Typography>
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography sx={{ color: '#8ab3d0' }}>Over-by-over prediction • Wicket timeline • Predicted run range</Typography>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', gap: 1, alignItems: 'center' }}>
                <PieChartIcon sx={{ color: '#ffcc80' }} />
                <Typography sx={{ color: '#e6f7ff', fontWeight: 700 }}>Predicted Run Range</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Full-width: Player comparison animation & H2H */}
          <Grid item xs={12}>
            <Paper elevation={8} sx={{ ...glowStyle, p: 3, bgcolor: '#0a2a3d', border: '1px solid rgba(255, 102, 0, 0.1)' }}>
              <Grid container spacing={2} alignItems='center'>
                <Grid item xs={12} md={8}>
                  <Typography variant='h6' sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', mb: 1 }}>Player Comparison Animation</Typography>
                  <Typography sx={{ color: '#8ab3d0', mb: 2 }}>Smooth animated comparisons of two players' impact indices</Typography>
                  <Box sx={{ mt: 2, height: 120, bgcolor: '#051a28', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 102, 0, 0.1)' }}>
                    <Typography sx={{ color: '#8ab3d0' }}>Select two players to compare their performance metrics</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant='h6' sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', mb: 1 }}>Head-to-Head</Typography>
                  <Typography sx={{ color: '#8ab3d0', mb: 2 }}>Historical matchup visualization</Typography>
                  <Box sx={{ mt: 2, height: 120, bgcolor: '#051a28', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255, 102, 0, 0.1)' }}>
                    <Typography sx={{ color: '#8ab3d0' }}>Team vs Team records</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Coming soon formats */}
          <Grid item xs={12} md={4}>
            <FadedComingSoon title='T20 International Analytics' icon={<TimelineIcon />} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FadedComingSoon title='ODI Analytics' icon={<TimelineIcon />} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FadedComingSoon title='Future Formats' icon={<TimelineIcon />} />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
