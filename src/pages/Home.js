import React, { useState, useContext } from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Grid, Modal, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';

const playerImages = [
  '/msd.webp', '/msd1.webp', '/msd3.webp', '/rohit.webp', '/rohit1.webp', '/rohit2.webp',
  '/vk.webp', '/vk1.webp', '/vk3.webp', '/jadeja.webp', '/bhumra.webp', '/pandiya.webp',
  '/patidar.webp', '/subhman gill.jpg', '/yash dayal.webp'
];

const actionShots = [
  '/actionshot 1.avif', '/action shot2.jpg', '/action shot 3.jpg', '/action shot 4.avif',
  '/action shot5.avif', '/action shot6.avif'
];

const stadiums = [
  '/stadium1.webp', '/stadium2.jpeg', '/stadium 4.avif', '/stdium 3.avif'
];

const teamRunsData = [
  { team: 'CSK', runs: 2500 },
  { team: 'MI', runs: 2400 },
  { team: 'RCB', runs: 2600 },
  { team: 'KKR', runs: 2200 },
  { team: 'PBKS', runs: 2100 },
  { team: 'RR', runs: 2000 },
  { team: 'GT', runs: 1900 },
  { team: 'LSG', runs: 1800 },
  { team: 'DC', runs: 1700 },
  { team: 'SRH', runs: 1600 },
];

const winRateData = [
  { team: 'CSK', wins: 10 },
  { team: 'MI', wins: 8 },
  { team: 'RCB', wins: 7 },
  { team: 'KKR', wins: 6 },
  { team: 'PBKS', wins: 5 },
];

const features = [
  {
    icon: '📊',
    title: 'AI-Powered Analytics',
    description: 'Our advanced AI algorithms analyze historical data and current form to provide accurate insights and predictions.',
    link: 'Explore Analytics →',
    action: 'explore'
  },
  {
    icon: '🧠',
    title: 'Prediction Engine',
    description: 'Get match predictions, player performance forecasts, and team analysis powered by machine learning models.',
    link: 'Try Prediction →',
    action: 'prediction'
  },
  {
    icon: '👥',
    title: 'Fan Community',
    description: 'Connect with fellow cricket enthusiasts, share opinions, and participate in discussions about your favorite teams.',
    link: 'Join Community →',
    action: 'community'
  },
  {
    icon: '🏅',
    title: 'Live Leaderboard',
    description: 'Real-time rankings, player statistics, and team standings. Track performance metrics, top scorers, best bowlers, and more.',
    link: 'View Leaderboard →',
    action: 'leaderboard'
  },
  {
    icon: '🎬',
    title: 'Match Highlights',
    description: 'Never miss a moment with curated highlights, key moments, and match analysis.',
    link: 'Watch Highlights →',
    action: 'highlights'
  },
  {
    icon: '📱',
    title: 'Mobile App',
    description: 'Take the cricket experience with you wherever you go with our feature-rich mobile application.',
    link: 'Coming Soon',
    action: 'mobile',
    status: 'coming-soon'
  }
];

const cricketFormats = [
  {
    icon: '',
    title: 'IPL Portal',
    status: 'Available Now',
    description: 'Comprehensive analytics for the Indian Premier League with team insights, player statistics, and AI-powered predictions.',
    link: 'Explore IPL '
  },
  {
    icon: '',
    title: 'T20 Cricket',
    status: 'Coming Soon',
    description: 'International T20 cricket analytics covering major tournaments, bilateral series, and emerging leagues worldwide.',
    link: 'Learn More '
  },
  {
    icon: '',
    title: 'ODI Cricket',
    status: 'Coming Soon',
    description: 'One Day International cricket analytics including World Cup coverage, team rankings, and historical performance data.',
    link: 'Learn More '
  }
];

export default function Home() {
  const { openLogin, openSignup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPlayers, setShowPlayers] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showStadiums, setShowStadiums] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBlog, setShowBlog] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  // Leaderboard data
  const topScorers = [
    { rank: 1, name: 'Virat Kohli', team: 'RCB', runs: 7000, matches: 250 },
    { rank: 2, name: 'Suresh Raina', team: 'CSK', runs: 5528, matches: 205 },
    { rank: 3, name: 'Rohit Sharma', team: 'MI', runs: 6200, matches: 240 },
    { rank: 4, name: 'David Warner', team: 'SRH', runs: 6084, matches: 200 },
    { rank: 5, name: 'AB de Villiers', team: 'RCB', runs: 5162, matches: 184 }
  ];

  const topBowlers = [
    { rank: 1, name: 'Lasith Malinga', team: 'MI', wickets: 170, matches: 176 },
    { rank: 2, name: 'Amit Mishra', team: 'DC', wickets: 171, matches: 215 },
    { rank: 3, name: 'Jasprit Bumrah', team: 'MI', wickets: 172, matches: 151 },
    { rank: 4, name: 'Yuzvendra Chahal', team: 'RCB', wickets: 200, matches: 190 },
    { rank: 5, name: 'Ravichandran Ashwin', team: 'DC', wickets: 179, matches: 200 }
  ];

  const handleFeatureClick = (feature) => {
    // Check if feature is coming soon
    if (feature.status === 'coming-soon') {
      return; // Do nothing for coming soon features
    }
    // Check if it's leaderboard - show modal instead of routing
    if (feature.action === 'leaderboard') {
      setShowLeaderboard(true);
      return;
    }
    const routes = {
      analytics: '/stats',
      explore: '/explore',
      prediction: '/predict',
      community: '/teams',
      highlights: '/matches',
      mobile: 'https://play.google.com/store/apps/details?id=com.wicketly.ai'
    };
    if (routes[feature.action].startsWith('http')) {
      window.open(routes[feature.action], '_blank');
    } else {
      window.location.href = routes[feature.action];
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <HeroSection />
      
      <Box sx={{ color: '#fff', py: 12, position: 'relative', zIndex: 1 }}>
        <Container maxWidth='xl'>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 3, color: '#fff', fontSize: '2.8rem' }}>
              Why Choose Wicketly.AI?
            </Typography>
            <Typography variant='h6' sx={{ color: '#aaa', fontWeight: 400, fontSize: '1.1rem' }}>
              Discover the features that make Wicketly.AI the ultimate cricket analytics platform
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 3 }}>
            {features.map((feature, idx) => (
              <Box key={idx} sx={{ 
                bgcolor: '#fff', 
                p: 3.5, 
                borderRadius: 3, 
                cursor: 'pointer', 
                transition: 'all 0.4s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                '&:hover': { 
                  transform: 'translateY(-8px)', 
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
                } 
              }}>
                <Box>
                  <Typography sx={{ fontSize: '3rem', mb: 2.5, textAlign: 'center' }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant='h6' sx={{ fontWeight: '700', mb: 2, color: '#0d3e65', textAlign: 'center', fontSize: '1.05rem', lineHeight: 1.3 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 3, color: '#555', lineHeight: 1.6, textAlign: 'center', fontSize: '0.9rem' }}>
                    {feature.description}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', pt: 2.5, borderTop: '1px solid #e0e0e0' }}>
                  <Button
                    onClick={(e) => { e.stopPropagation(); handleFeatureClick(feature); }}
                    disabled={feature.status === 'coming-soon'}
                    variant='text'
                    sx={{ 
                      color: '#ff6600', 
                      fontWeight: '600', 
                      fontSize: '0.9rem', 
                      textTransform: 'none', 
                      transition: '0.3s all',
                      '&:hover': { 
                        color: '#ff8533'
                      },
                      '&:disabled': {
                        color: '#ccc'
                      }
                    }}
                  >
                    {feature.link}
                  </Button>
                </Box>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#fff' }}>
          Cricket Formats
        </Typography>
        <Typography variant='h6' sx={{ textAlign: 'center', mb: 8, color: '#ccc', fontWeight: 500 }}>
          Explore analytics and predictions for all major cricket formats
        </Typography>
        <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {cricketFormats.map((format, idx) => (
            <Box key={idx} sx={{ p: 4, textAlign: 'center', cursor: 'pointer', transition: '0.4s all ease', borderRadius: 2, boxShadow: 2, bgcolor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', '&:hover': { boxShadow: 6, transform: 'translateY(-8px)', bgcolor: '#f5f5f5' } }}>
              <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>{format.icon}</Typography>
              <Typography sx={{ color: '#27ae60', fontWeight: 'bold', fontSize: '0.9rem', mb: 1, textTransform: 'uppercase' }}>
                {format.status}
              </Typography>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#0d3e65' }}>
                {format.title}
              </Typography>
              <Typography variant='body2' sx={{ mb: 3, color: '#666', lineHeight: 1.6, flex: 1 }}>
                {format.description}
              </Typography>
              <Typography sx={{ color: '#ff6600', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}>
                {format.link}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: 12, position: 'relative', zIndex: 1 }}>
        <Container maxWidth='xl'>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 2, color: '#fff', fontSize: '2.8rem' }}>
              IPL Statistics
            </Typography>
            <Typography variant='h6' sx={{ color: '#aaa', fontWeight: 400, fontSize: '1.1rem' }}>
              Comprehensive data visualization and analysis
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Box sx={{ 
              p: 4, 
              boxShadow: '0 8px 24px rgba(255, 102, 0, 0.15)', 
              border: '3px solid #ff6600', 
              bgcolor: '#fff', 
              borderRadius: 2,
              display: 'flex', 
              flexDirection: 'column'
            }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3, color: '#ff6600', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                📊 Team Runs
              </Typography>
              {teamRunsData.slice(0, 5).map((data, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>{data.team}</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#ff6600', fontSize: '0.95rem' }}>{data.runs}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ 
              p: 4, 
              boxShadow: '0 8px 24px rgba(39, 174, 96, 0.15)', 
              border: '3px solid #27ae60', 
              bgcolor: '#fff', 
              borderRadius: 2,
              display: 'flex', 
              flexDirection: 'column'
            }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3, color: '#27ae60', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                🏆 Win Rates
              </Typography>
              {winRateData.slice(0, 5).map((data, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>{data.team}</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#27ae60', fontSize: '0.95rem' }}>{data.wins}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ 
              p: 4, 
              boxShadow: '0 8px 24px rgba(52, 152, 219, 0.15)', 
              border: '3px solid #3498db', 
              bgcolor: '#fff', 
              borderRadius: 2,
              display: 'flex', 
              flexDirection: 'column'
            }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3, color: '#3498db', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                🎯 Best Economy
              </Typography>
              {[
                { bowler: 'Bumrah', economy: '6.5' },
                { bowler: 'Chahal', economy: '7.2' },
                { bowler: 'Rashid', economy: '6.8' },
                { bowler: 'Axar', economy: '7.1' },
                { bowler: 'Chahar', economy: '7.3' }
              ].map((data, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>{data.bowler}</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#3498db', fontSize: '0.95rem' }}>{data.economy}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ 
              p: 4, 
              boxShadow: '0 8px 24px rgba(155, 89, 182, 0.15)', 
              border: '3px solid #9b59b6', 
              bgcolor: '#fff', 
              borderRadius: 2,
              display: 'flex', 
              flexDirection: 'column'
            }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3, color: '#9b59b6', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                ⭐ Highest Scores
              </Typography>
              {[
                { player: 'Kohli', score: '183*' },
                { player: 'Rohit', score: '109' },
                { player: 'KL Rahul', score: '120' },
                { player: 'Ponting', score: '128' },
                { player: 'ABD', score: '175*' }
              ].map((data, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                  <Typography sx={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>{data.player}</Typography>
                  <Typography sx={{ fontWeight: 'bold', color: '#9b59b6', fontSize: '0.95rem' }}>{data.score}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth='lg' sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 4, color: '#0d3e65' }}>
            Gallery
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant={showPlayers ? 'contained' : 'outlined'}
              onClick={() => setShowPlayers(!showPlayers)}
              sx={{ 
                px: 4, 
                py: 1.2, 
                fontSize: '1rem',
                fontWeight: 'bold',
                bgcolor: showPlayers ? '#ff6600' : 'transparent',
                color: showPlayers ? '#fff' : '#0d3e65',
                borderColor: '#ff6600',
                border: '2px solid',
                transition: '0.3s',
                '&:hover': { 
                  bgcolor: '#ff6600', 
                  color: '#fff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(255, 102, 0, 0.3)'
                }
              }}
            >
              ⭐ Top Players
            </Button>
            <Button 
              variant={showActions ? 'contained' : 'outlined'}
              onClick={() => setShowActions(!showActions)}
              sx={{ 
                px: 4, 
                py: 1.2, 
                fontSize: '1rem',
                fontWeight: 'bold',
                bgcolor: showActions ? '#ff6600' : 'transparent',
                color: showActions ? '#fff' : '#0d3e65',
                borderColor: '#ff6600',
                border: '2px solid',
                transition: '0.3s',
                '&:hover': { 
                  bgcolor: '#ff6600', 
                  color: '#fff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(255, 102, 0, 0.3)'
                }
              }}
            >
              🎬 Action Shots
            </Button>
            <Button 
              variant={showStadiums ? 'contained' : 'outlined'}
              onClick={() => setShowStadiums(!showStadiums)}
              sx={{ 
                px: 4, 
                py: 1.2, 
                fontSize: '1rem',
                fontWeight: 'bold',
                bgcolor: showStadiums ? '#ff6600' : 'transparent',
                color: showStadiums ? '#fff' : '#0d3e65',
                borderColor: '#ff6600',
                border: '2px solid',
                transition: '0.3s',
                '&:hover': { 
                  bgcolor: '#ff6600', 
                  color: '#fff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(255, 102, 0, 0.3)'
                }
              }}
            >
              🏟️ IPL Stadiums
            </Button>
          </Box>
        </Box>

        {/* Top Players Gallery */}
        {showPlayers && (
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#0d3e65' }}>
              Top Players Gallery
            </Typography>
            <Grid container spacing={3}>
              {playerImages.map((img, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <Card sx={{ overflow: 'hidden', boxShadow: 2, transition: '0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.05)' } }}>
                    <CardMedia component='img' height='250' image={img} alt={`Player ${idx + 1}`} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Action Shots Gallery */}
        {showActions && (
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#0d3e65' }}>
              Action Shots Gallery
            </Typography>
            <Grid container spacing={3}>
              {actionShots.map((img, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card sx={{ overflow: 'hidden', boxShadow: 2, transition: '0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.05)' } }}>
                    <CardMedia component='img' height='250' image={img} alt={`Action ${idx + 1}`} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Stadiums Gallery */}
        {showStadiums && (
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#0d3e65' }}>
              IPL Stadiums Gallery
            </Typography>
            <Grid container spacing={3}>
              {stadiums.map((img, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card sx={{ overflow: 'hidden', boxShadow: 2, transition: '0.3s', '&:hover': { boxShadow: 6, transform: 'scale(1.05)' } }}>
                    <CardMedia component='img' height='250' image={img} alt={`Stadium ${idx + 1}`} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      <Box sx={{ color: '#fff', py: 8, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Container maxWidth='lg'>
          <Typography variant='h2' sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Elevate Your Cricket Experience?
          </Typography>
          <Typography variant='h6' sx={{ mb: 4, fontWeight: 500, color: '#ccc' }}>
            Join thousands of cricket fans who are already using Wicketly.AI to enhance their cricket journey
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant='contained' 
              sx={{ bgcolor: '#ff6600', px: 5, py: 1.5, fontSize: '1rem', fontWeight: 'bold', '&:hover': { bgcolor: '#ff5500' } }}
              onClick={() => openSignup()}
            >
              Sign Up Now
            </Button>
            <Button 
              variant='outlined' 
              sx={{ px: 5, py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderColor: '#fff', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' } }}
              onClick={() => openLogin()}
            >
              Log In
            </Button>
          </Box>
        </Container>
      </Box>

      <Modal open={showLeaderboard} onClose={() => setShowLeaderboard(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 600 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#0d3e65' }}>🏆 Live Leaderboard</Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65', borderBottom: '3px solid #ff6600', pb: 1 }}>
              📊 Top Scorers
            </Typography>
            {topScorers.map((player, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, mb: 1.5, bgcolor: idx === 0 ? '#fff3e0' : '#f5f5f5', borderRadius: 1, border: idx === 0 ? '2px solid #ff6600' : 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#ff6600', minWidth: '30px' }}>#{player.rank}</Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', color: '#0d3e65' }}>{player.name}</Typography>
                    <Typography variant='caption' sx={{ color: '#888' }}>{player.team}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#0d3e65', fontSize: '1rem' }}>{player.runs}</Typography>
                  <Typography variant='caption' sx={{ color: '#888' }}>{player.matches} matches</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65', borderBottom: '3px solid #27ae60', pb: 1 }}>
              🎯 Top Bowlers
            </Typography>
            {topBowlers.map((bowler, idx) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, mb: 1.5, bgcolor: idx === 0 ? '#f0f8f0' : '#f5f5f5', borderRadius: 1, border: idx === 0 ? '2px solid #27ae60' : 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#27ae60', minWidth: '30px' }}>#{bowler.rank}</Typography>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', color: '#0d3e65' }}>{bowler.name}</Typography>
                    <Typography variant='caption' sx={{ color: '#888' }}>{bowler.team}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 'bold', color: '#0d3e65', fontSize: '1rem' }}>{bowler.wickets}</Typography>
                  <Typography variant='caption' sx={{ color: '#888' }}>{bowler.matches} matches</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Button 
            variant='contained' 
            onClick={() => setShowLeaderboard(false)} 
            sx={{ width: '100%', mt: 4, bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold', py: 1.5 }}
          >
            Close Leaderboard
          </Button>
        </Box>
      </Modal>

      <Box sx={{ bgcolor: '#1a1a2e', color: '#fff', py: 8, mt: 8 }}>
        <Container maxWidth='lg'>
          <Grid container spacing={5} sx={{ mb: 6 }}>
            {/* Logo & Description */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box sx={{ width: 50, height: 50, bgcolor: '#ff6600', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '1.5rem' }}>
                  🏏
                </Box>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Wicketly.AI</Typography>
              </Box>
              <Typography variant='body2' sx={{ color: '#aaa', lineHeight: 1.8 }}>
                Your ultimate destination for all things cricket. Get real-time statistics, predictions, and connect with fellow cricket enthusiasts across all formats - IPL, T20, and ODI.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Box sx={{ width: 40, height: 40, bgcolor: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s', '&:hover': { bgcolor: '#ff6600' } }}>
                  <Typography>f</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, bgcolor: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s', '&:hover': { bgcolor: '#ff6600' } }}>
                  <Typography>𝕏</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, bgcolor: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s', '&:hover': { bgcolor: '#ff6600' } }}>
                  <Typography>📷</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, bgcolor: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s', '&:hover': { bgcolor: '#ff6600' } }}>
                  <Typography>▶</Typography>
                </Box>
                <Box sx={{ width: 40, height: 40, bgcolor: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s', '&:hover': { bgcolor: '#ff6600' } }}>
                  <Typography>in</Typography>
                </Box>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3 }}>Quick Links</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography onClick={() => navigate('/')} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Home</Typography>
                <Typography onClick={() => setShowFormats(true)} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Cricket Formats</Typography>
                <Typography onClick={() => setShowFeatures(true)} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Features</Typography>
                <Typography onClick={() => navigate('/teams')} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Teams</Typography>
                <Typography onClick={() => navigate('/predict')} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Prediction</Typography>
                <Typography onClick={() => navigate('/explore')} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Statistics</Typography>
              </Box>
            </Grid>

            {/* Resources */}
            <Grid item xs={12} sm={6} md={2.5}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3 }}>Resources</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography onClick={() => setShowBlog(true)} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Blog</Typography>
                <Typography onClick={() => setShowNews(true)} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>News</Typography>
                <Typography onClick={() => setShowFAQs(true)} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>FAQs</Typography>
                <Typography onClick={() => setShowHelp(true)} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Help Center</Typography>
                <Typography onClick={() => setShowPrivacy(true)} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Privacy Policy</Typography>
                <Typography onClick={() => setShowTerms(true)} sx={{ color: '#aaa', cursor: 'pointer', transition: '0.3s', '&:hover': { color: '#ff6600' } }}>Terms of Service</Typography>
              </Box>
            </Grid>

            {/* Newsletter */}
            <Grid item xs={12} sm={6} md={3.5}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 3 }}>Newsletter</Typography>
              <Typography variant='body2' sx={{ color: '#aaa', mb: 3, lineHeight: 1.6 }}>
                Subscribe to get the latest cricket updates, predictions, and exclusive content delivered to your inbox.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <input 
                  type='email' 
                  placeholder='Enter your email' 
                  style={{ 
                    flex: 1, 
                    padding: '12px 16px', 
                    borderRadius: '6px', 
                    border: 'none', 
                    bgcolor: '#333',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#333'
                  }} 
                />
                <Button variant='contained' sx={{ bgcolor: '#ff6600', px: 3, fontWeight: 'bold', '&:hover': { bgcolor: '#ff5500' } }}>
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Divider */}
          <Box sx={{ borderTop: '1px solid #333', pt: 4, textAlign: 'center' }}>
            <Typography variant='body2' sx={{ color: '#888' }}>
              © {new Date().getFullYear()} Wicketly.AI - Your Ultimate Cricket Analytics Platform | All rights reserved
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Formats Modal */}
      <Modal open={showFormats} onClose={() => setShowFormats(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 700 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65' }}>🏏 Cricket Formats</Typography>
          <Typography variant='body1' sx={{ color: '#555', mb: 2 }}>Different cricket formats and what they mean for strategy and predictions.</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>T20 (Fast & Aggressive)</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>Short format; high scoring; teams aim for aggressive batting and dynamic bowling variations.</Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>ODI (Balanced)</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>50-over format; more time for innings building; strategy mixes aggression with consolidation.</Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Test (Endurance)</Typography>
            <Typography sx={{ color: '#666' }}>Long format; emphasis on technique, stamina, and long-term strategy rather than burst scoring.</Typography>
          </Box>
          <Button variant='contained' onClick={() => setShowFormats(false)} sx={{ width: '100%', bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold' }}>Close</Button>
        </Box>
      </Modal>

      {/* Features Modal */}
      <Modal open={showFeatures} onClose={() => setShowFeatures(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 700 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65' }}>⭐ Features</Typography>
          <Typography variant='body1' sx={{ color: '#555', mb: 2 }}>Explore the features we provide to enhance your cricket experience.</Typography>
          <Box sx={{ mb: 3 }}>
            {features && features.map((f, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#0d3e65' }}>{f.icon} {f.title}</Typography>
                <Typography sx={{ color: '#666' }}>{f.description}</Typography>
              </Box>
            ))}
          </Box>
          <Button variant='contained' onClick={() => setShowFeatures(false)} sx={{ width: '100%', bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold' }}>Close</Button>
        </Box>
      </Modal>

      {/* Blog Modal */}
      <Modal open={showBlog} onClose={() => setShowBlog(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 600 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65' }}>📝 Blog</Typography>
          <Typography variant='body1' sx={{ color: '#555', mb: 2 }}>Latest cricket insights, analysis, and expert opinions on IPL matches, player performances, and predictions.</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Recent Articles:</Typography>
            <ul style={{ color: '#666', lineHeight: '1.8' }}>
              <li>CSK's Winning Strategy in 2025 IPL</li>
              <li>Analyzing Top Batsmen Performance Metrics</li>
              <li>Bowling Trends and Player Comparisons</li>
              <li>Venue-Based Match Predictions Guide</li>
            </ul>
          </Box>
          <Button variant='contained' onClick={() => setShowBlog(false)} sx={{ width: '100%', bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold' }}>Close</Button>
        </Box>
      </Modal>

      {/* News Modal */}
      <Modal open={showNews} onClose={() => setShowNews(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 600 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65' }}>📰 Latest News</Typography>
          <Typography variant='body1' sx={{ color: '#555', mb: 2 }}>Stay updated with the latest cricket news, team announcements, player transfers, and match schedules.</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Breaking News:</Typography>
            <ul style={{ color: '#666', lineHeight: '1.8' }}>
              <li>IPL 2025 Season Kicks Off with Exciting Matches</li>
              <li>New Player Acquisitions in Mega Auction</li>
              <li>Injury Updates and Team Roster Changes</li>
              <li>Venue and Schedule Announcements</li>
            </ul>
          </Box>
          <Button variant='contained' onClick={() => setShowNews(false)} sx={{ width: '100%', bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold' }}>Close</Button>
        </Box>
      </Modal>

      {/* FAQs Modal */}
      <Modal open={showFAQs} onClose={() => setShowFAQs(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 600 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65' }}>❓ Frequently Asked Questions</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Q: How accurate are the predictions?</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>A: Our AI models achieve 75-80% accuracy based on historical data and current form analysis.</Typography>
            
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Q: Can I create a custom prediction?</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>A: Yes! Visit the Prediction page to create custom match predictions with specific parameters.</Typography>
            
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Q: How often is the data updated?</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>A: Our analytics update in real-time during matches and daily for player/team statistics.</Typography>
            
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Q: Is the app free to use?</Typography>
            <Typography sx={{ color: '#666' }}>A: Yes! Wicketly.AI is completely free with all core features available to all users.</Typography>
          </Box>
          <Button variant='contained' onClick={() => setShowFAQs(false)} sx={{ width: '100%', bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold' }}>Close</Button>
        </Box>
      </Modal>

      {/* Help Center Modal */}
      <Modal open={showHelp} onClose={() => setShowHelp(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 600 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65' }}>🤝 Help Center</Typography>
          <Typography variant='body1' sx={{ color: '#555', mb: 2 }}>Get help and support for using Wicketly.AI platform.</Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Getting Started:</Typography>
            <ul style={{ color: '#666', lineHeight: '1.8' }}>
              <li>Create Your Account - Sign up in seconds</li>
              <li>Explore Analytics Dashboard - View real-time statistics</li>
              <li>Make Predictions - Analyze matches and create predictions</li>
              <li>Join Community - Connect with other cricket fans</li>
            </ul>
          </Box>
          <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 2, color: '#0d3e65' }}>Contact Support:</Typography>
          <Typography sx={{ color: '#666', mb: 2 }}>📧 Email: support@wicketly.ai<br />💬 Live Chat: Available 24/7</Typography>
          <Button variant='contained' onClick={() => setShowHelp(false)} sx={{ width: '100%', bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold' }}>Close</Button>
        </Box>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal open={showPrivacy} onClose={() => setShowPrivacy(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 600 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65' }}>🔒 Privacy Policy</Typography>
          <Typography sx={{ color: '#666', mb: 2 }}>
            <strong>Last Updated: November 2025</strong>
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Data Protection:</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>We collect and process personal data solely for providing and improving our services. Your data is encrypted and protected.</Typography>
            
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>User Rights:</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>You have the right to access, modify, or delete your personal data at any time through your account settings.</Typography>
            
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Third-party Sharing:</Typography>
            <Typography sx={{ color: '#666' }}>We do not sell or share your data with third parties without explicit consent.</Typography>
          </Box>
          <Button variant='contained' onClick={() => setShowPrivacy(false)} sx={{ width: '100%', bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold' }}>Close</Button>
        </Box>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal open={showTerms} onClose={() => setShowTerms(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 600 }, maxHeight: '80vh', overflowY: 'auto', bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 24 }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', mb: 3, color: '#0d3e65' }}>⚖️ Terms of Service</Typography>
          <Typography sx={{ color: '#666', mb: 2 }}>
            <strong>Last Updated: November 2025</strong>
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>User Responsibilities:</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>Users agree to use Wicketly.AI for lawful purposes only and not to engage in any prohibited activities.</Typography>
            
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Intellectual Property:</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>All content on Wicketly.AI is protected by copyright and intellectual property laws.</Typography>
            
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Limitation of Liability:</Typography>
            <Typography sx={{ color: '#666', mb: 2 }}>Wicketly.AI is provided "as is" without warranties. We are not liable for any indirect damages.</Typography>
            
            <Typography variant='h6' sx={{ fontWeight: 'bold', mb: 1, color: '#0d3e65' }}>Agreement to Terms:</Typography>
            <Typography sx={{ color: '#666' }}>By using Wicketly.AI, you agree to these terms and conditions.</Typography>
          </Box>
          <Button variant='contained' onClick={() => setShowTerms(false)} sx={{ width: '100%', bgcolor: '#0d3e65', '&:hover': { bgcolor: '#0a2b4a' }, fontWeight: 'bold' }}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
}
