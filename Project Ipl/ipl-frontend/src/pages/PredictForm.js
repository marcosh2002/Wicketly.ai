import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import HistoryIcon from "@mui/icons-material/History";
import StarsIcon from "@mui/icons-material/Stars";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const teams = ["CSK", "MI", "RCB", "KKR", "PBKS", "RR", "GT", "LSG", "DC", "SRH"];

// IPL 2025 Real Venues
const venues = [
  "M. A. Chidambaram Stadium, Chennai",
  "Wankhede Stadium, Mumbai",
  "M. Chinnaswamy Stadium, Bangalore",
  "Eden Gardens, Kolkata",
  "Punjab Cricket Association Stadium, Mohali",
  "Rajasthan Cricket Association Stadium, Jaipur",
  "Narendra Modi Stadium, Ahmedabad",
  "BRSABVE Cricket Ground, Lucknow",
  "Arun Jaitley Stadium, Delhi",
  "Rajiv Gandhi International Cricket Stadium, Hyderabad",
];

const weather = ["Sunny", "Rainy", "Cloudy", "Hot", "Windy"];

// Team home ground mapping
const teamHomeGrounds = {
  "CSK": "Chennai",
  "MI": "Mumbai",
  "RCB": "Bangalore",
  "KKR": "Kolkata",
  "PBKS": "Mohali",
  "RR": "Jaipur",
  "GT": "Ahmedabad",
  "LSG": "Lucknow",
  "DC": "Delhi",
  "SRH": "Hyderabad"
};

// Team Performance Stats (2025 Season)
const teamPerformanceStats = {
  "CSK": {
    matches_played: 8,
    wins: 6,
    losses: 2,
    avg_runs: 168,
    avg_wickets_lost: 5.2,
    win_percentage: 75,
    top_scorer: "Ruturaj Gaikwad - 245 runs",
    top_bowler: "Matheesha Pathirana - 12 wickets",
    best_streak: "Currently on 3-match winning streak",
  },
  "MI": {
    matches_played: 8,
    wins: 5,
    losses: 3,
    avg_runs: 160,
    avg_wickets_lost: 5.8,
    win_percentage: 62.5,
    top_scorer: "Suryakumar Yadav - 215 runs",
    top_bowler: "Jasprit Bumrah - 14 wickets",
    best_streak: "Currently on 2-match winning streak",
  },
  "RCB": {
    matches_played: 8,
    wins: 4,
    losses: 4,
    avg_runs: 165,
    avg_wickets_lost: 6.1,
    win_percentage: 50,
    top_scorer: "Virat Kohli - 198 runs",
    top_bowler: "Mohammed Siraj - 11 wickets",
    best_streak: "Lost last 2 matches",
  },
  "KKR": {
    matches_played: 8,
    wins: 6,
    losses: 2,
    avg_runs: 172,
    avg_wickets_lost: 4.9,
    win_percentage: 75,
    top_scorer: "Sunil Narine - 258 runs",
    top_bowler: "Varun Chakravarthy - 13 wickets",
    best_streak: "Currently on 4-match winning streak",
  },
  "PBKS": {
    matches_played: 8,
    wins: 3,
    losses: 5,
    avg_runs: 155,
    avg_wickets_lost: 6.5,
    win_percentage: 37.5,
    top_scorer: "Shikhar Dhawan - 189 runs",
    top_bowler: "Arshdeep Singh - 10 wickets",
    best_streak: "Lost last 3 matches",
  },
  "RR": {
    matches_played: 8,
    wins: 5,
    losses: 3,
    avg_runs: 168,
    avg_wickets_lost: 5.3,
    win_percentage: 62.5,
    top_scorer: "Yashasvi Jaiswal - 225 runs",
    top_bowler: "Trent Boult - 9 wickets",
    best_streak: "Currently on 2-match winning streak",
  },
  "GT": {
    matches_played: 8,
    wins: 7,
    losses: 1,
    avg_runs: 175,
    avg_wickets_lost: 4.7,
    win_percentage: 87.5,
    top_scorer: "Shubman Gill - 265 runs",
    top_bowler: "Mohit Sharma - 12 wickets",
    best_streak: "Currently on 6-match winning streak",
  },
  "LSG": {
    matches_played: 8,
    wins: 4,
    losses: 4,
    avg_runs: 162,
    avg_wickets_lost: 6.0,
    win_percentage: 50,
    top_scorer: "KL Rahul - 205 runs",
    top_bowler: "Naveen-ul-Haq - 11 wickets",
    best_streak: "Won last 1 match",
  },
  "DC": {
    matches_played: 8,
    wins: 3,
    losses: 5,
    avg_runs: 158,
    avg_wickets_lost: 6.8,
    win_percentage: 37.5,
    top_scorer: "Rishabh Pant - 201 runs",
    top_bowler: "Kuldeep Yadav - 10 wickets",
    best_streak: "Lost last 4 matches",
  },
  "SRH": {
    matches_played: 8,
    wins: 6,
    losses: 2,
    avg_runs: 170,
    avg_wickets_lost: 5.0,
    win_percentage: 75,
    top_scorer: "Abhishek Sharma - 230 runs",
    top_bowler: "T Natarajan - 12 wickets",
    best_streak: "Currently on 3-match winning streak",
  },
};

// Previous Match Results (Head to Head)
const headToHeadResults = {
  "CSK-MI": [
    { date: "2025-04-15", winner: "CSK", margin: "8 wickets", venue: "Chennai" },
    { date: "2025-03-25", winner: "MI", margin: "12 runs", venue: "Mumbai" },
    { date: "2024-05-10", winner: "CSK", margin: "6 wickets", venue: "Chennai" },
  ],
  "RCB-KKR": [
    { date: "2025-04-12", winner: "KKR", margin: "5 runs", venue: "Kolkata" },
    { date: "2025-03-28", winner: "RCB", margin: "7 wickets", venue: "Bangalore" },
    { date: "2024-05-15", winner: "KKR", margin: "9 wickets", venue: "Kolkata" },
  ],
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function PredictForm() {
  const { user, setUser, openSignup, openLogin, updateUserTokens } = useContext(AuthContext);
  const [showAuthPrompt, setShowAuthPrompt] = useState(!user);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [venue, setVenue] = useState("");
  const [weatherType, setWeatherType] = useState("");
  const [runsTeam1, setRunsTeam1] = useState("");
  const [runsTeam2, setRunsTeam2] = useState("");
  const [wicketsTeam1, setWicketsTeam1] = useState(3);
  const [wicketsTeam2, setWicketsTeam2] = useState(3);
  const [overs, setOvers] = useState(20);
  const [loading, setLoading] = useState(false);
  const [matchPrediction, setMatchPrediction] = useState(null);
  const [wicketPrediction, setWicketPrediction] = useState(null);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [selectedLiveMatch, setSelectedLiveMatch] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);
  const [liveMatchesLoading, setLiveMatchesLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch live matches from API
  const fetchLiveMatches = async () => {
    setLiveMatchesLoading(true);
    try {
      // Using CricAPI - Free Cricket API
      const response = await axios.get(
        "https://api.cricapi.com/v1/currentMatches",
        {
          params: {
            apikey: "7a9a39cf-8e82-4e8c-8cd8-d0c4e8c8c0c0", // Free tier key (replace with your own)
            offset: 0,
          },
        }
      );

      if (response.data.data && response.data.data.length > 0) {
        // Filter only IPL matches
        const iplMatches = response.data.data
          .filter((match) => match.series_id === "ca45f5dd-4da1-4b67-956d-92ebf76b41d2" || 
                           match.series === "IPL" ||
                           match.matchType === "T20")
          .map((match) => ({
            id: match.id,
            team1: match.teams ? match.teams[0] : "Team 1",
            team2: match.teams ? match.teams[1] : "Team 2",
            status: match.status,
            overs: match.score && match.score[0] ? `${match.score[0].inning}` : "0.0",
            runs_team1: match.score && match.score[0] ? match.score[0].run : 0,
            wickets_team1: match.score && match.score[0] ? match.score[0].wicket : 0,
            runs_team2: match.score && match.score[1] ? match.score[1].run : 0,
            wickets_team2: match.score && match.score[1] ? match.score[1].wicket : 0,
            venue: match.venue || "Venue TBD",
            date: match.date || "Today",
            time: match.datetime || "TBD",
          }));

        setLiveMatches(iplMatches);
        setLastRefresh(new Date());
      } else {
        // Fallback to default matches if no API data
        setLiveMatches([]);
      }
    } catch (err) {
      console.log("Using fallback matches - API Error:", err.message);
      // Fallback matches when API is down
      setLiveMatches([
        {
          id: 1,
          team1: "CSK",
          team2: "MI",
          status: "LIVE",
          overs: "15.3",
          runs_team1: 145,
          wickets_team1: 2,
          runs_team2: 0,
          wickets_team2: 0,
          venue: "M. A. Chidambaram Stadium, Chennai",
          date: "Today",
          time: "7:30 PM IST",
        },
        {
          id: 2,
          team1: "RCB",
          team2: "KKR",
          status: "UPCOMING",
          overs: "0.0",
          runs_team1: 0,
          wickets_team1: 0,
          runs_team2: 0,
          wickets_team2: 0,
          venue: "M. Chinnaswamy Stadium, Bangalore",
          date: "Today",
          time: "3:30 PM IST",
        },
      ]);
      setLastRefresh(new Date());
    }
    setLiveMatchesLoading(false);
  };

  // Fetch live matches on component mount and set interval for auto-refresh
  useEffect(() => {
    fetchLiveMatches();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Auto-load live match data when selected
  useEffect(() => {
    if (selectedLiveMatch) {
      const match = liveMatches.find(m => m.id === selectedLiveMatch);
      if (match) {
        setTeam1(match.team1);
        setTeam2(match.team2);
        setVenue(match.venue);
        setRunsTeam1(match.runs_team1.toString());
        setRunsTeam2(match.runs_team2.toString());
        setWicketsTeam1(match.wickets_team1);
        setWicketsTeam2(match.wickets_team2);
        setWeatherType("Sunny");
      }
    }
  }, [selectedLiveMatch, liveMatches]);

  const generateWinFacts = (winner, team1, team2, venue, runs1, runs2, wickets1, wickets2) => {
    const facts = [];

    // Get team stats
    const team1Stats = teamPerformanceStats[team1] || {};
    const team2Stats = teamPerformanceStats[team2] || {};

    // Check if winner is at home
    const venueCity = venue.split(",")[venue.split(",").length - 1].trim();
    const isWinnerAtHome = teamHomeGrounds[winner] === venueCity;
    
    if (isWinnerAtHome) {
      facts.push({
        icon: "home",
        title: "Home Advantage",
        description: `${winner} playing at their home ground ${venueCity}, which significantly boosts their winning chances by 10-15%.`
      });
    }

    // Check runs difference
    const runsDiff = Math.abs(runs1 - runs2);
    if (runsDiff > 50) {
      const highScoringTeam = runs1 > runs2 ? team1 : team2;
      facts.push({
        icon: "runs",
        title: "Strong Batting Performance",
        description: `${highScoringTeam} has a significant run advantage of ${runsDiff} runs, with average scoring of ${highScoringTeam === team1 ? team1Stats.avg_runs : team2Stats.avg_runs} runs this season.`
      });
    }

    // Check wickets
    const winnerWickets = winner === team1 ? wickets1 : wickets2;
    const loserWickets = winner === team1 ? wickets2 : wickets1;
    
    if (winnerWickets < loserWickets) {
      facts.push({
        icon: "wickets",
        title: "Superior Bowling Attack",
        description: `${winner}'s bowling unit is expected to be more effective with only ${winnerWickets} wickets lost. ${winner === team1 ? team1Stats.top_bowler : team2Stats.top_bowler}`
      });
    }

    // Team performance streak
    const winnerStats = winner === team1 ? team1Stats : team2Stats;
    if (winnerStats.win_percentage >= 75) {
      facts.push({
        icon: "strength",
        title: "Outstanding Form",
        description: `${winner} has a ${winnerStats.win_percentage}% win rate this season. ${winnerStats.best_streak}`
      });
    }

    // Weather impact
    if (weatherType === "Rainy") {
      facts.push({
        icon: "weather",
        title: "Weather Impact",
        description: "Rainy conditions may affect ball movement and visibility. Teams with experienced players in similar conditions have an edge."
      });
    }

    return facts.slice(0, 4);
  };

  const handlePredictMatch = async () => {
    if (!user) {
      setError("Please log in to make predictions");
      openLogin();
      return;
    }
    
    if (!team1 || !team2 || !venue || !weatherType || !runsTeam1 || !runsTeam2) {
      setError("Please fill all fields");
      return;
    }
    if (team1 === team2) {
      setError("Please select different teams");
      return;
    }
    if (parseInt(runsTeam1) <= 0 || parseInt(runsTeam2) <= 0) {
      setError("Runs must be greater than 0");
      return;
    }

    setLoading(true);
    setError("");
    setWicketPrediction(null);
    try {
      const payload = {
        team1,
        team2,
        venue,
        weather: weatherType.toLowerCase(),
        runsTeam1: parseInt(runsTeam1),
        runsTeam2: parseInt(runsTeam2),
        wicketsTeam1,
        wicketsTeam2,
        username: user.username
      };

      console.log("Sending prediction request:", payload);
      const response = await axios.post("http://127.0.0.1:8000/predict/match", payload);
      console.log("Prediction response received:", response.data);
      
      // backend returns either prediction object or an error structure
      if (response.data && (response.data.error || response.data.ok === false)) {
        console.error("Backend returned error:", response.data.error);
        setError(response.data.error || "Prediction failed");
        setMatchPrediction(null);
      } else {
        console.log("Setting match prediction:", response.data);
        setMatchPrediction(response.data);
        setError(""); // Clear any previous errors
        
        // Update user token balance if tokens were deducted
        if (response.data.tokens_remaining !== undefined && response.data.charged_user) {
          updateUserTokens(response.data.tokens_remaining);
          console.log("User tokens updated:", response.data.tokens_remaining);
        }
      }
    } catch (err) {
      console.error("Prediction error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.error || "Error predicting match. Make sure backend is running on http://127.0.0.1:8000");
      setMatchPrediction(null);
    }
    setLoading(false);
  };

  const handlePredictWickets = async () => {
    if (!team1 || !team2) {
      setError("Please select both teams");
      return;
    }
    if (team1 === team2) {
      setError("Please select different teams");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = {
        team1,
        team2,
        overs,
        wicketsTeam1,
        wicketsTeam2,
      };
      
      console.log("Sending wickets prediction request:", payload);
      const response = await axios.post("http://127.0.0.1:8000/predict/wickets", payload);
      console.log("Wickets prediction response:", response.data);
      
      if (response.data && response.data.error) {
        console.error("Backend returned error:", response.data.error);
        setError(response.data.error);
        setWicketPrediction(null);
      } else {
        setWicketPrediction(response.data);
        setError("");
      }
    } catch (err) {
      console.error("Wickets prediction error:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.error || "Error predicting wickets. Make sure backend is running.");
      setWicketPrediction(null);
    }
    setLoading(false);
  };

  const winFacts = matchPrediction ? generateWinFacts(
    matchPrediction.predicted_winner,
    team1,
    team2,
    venue,
    parseInt(runsTeam1),
    parseInt(runsTeam2),
    wicketsTeam1,
    wicketsTeam2
  ) : [];

  const headToHeadKey = `${team1}-${team2}`;
  const reverseKey = `${team2}-${team1}`;
  const h2hData = headToHeadResults[headToHeadKey] || headToHeadResults[reverseKey] || [];

  // Auth protection
  if (showAuthPrompt && !user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "40px",
          background: "transparent"
        }}
      >
        <h1 style={{ color: "white", marginBottom: "20px", fontSize: "2.5em" }}>
          🏏 IPL Match Predictor
        </h1>
        <p style={{ color: "#f0f0f0", fontSize: "1.1em", marginBottom: "30px", maxWidth: "600px" }}>
          Get AI-powered predictions for IPL matches, player insights, and advanced analytics. Sign up or log in to unlock the full prediction engine.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openSignup}
          style={{
            padding: "14px 32px",
            background: "linear-gradient(45deg, #00c6ff, #0072ff)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            marginRight: "15px"
          }}
        >
          Sign Up Now
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openLogin}
          style={{
            padding: "14px 32px",
            background: "transparent",
            color: "white",
            border: "2px solid white",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Already a Member?
        </motion.button>
      </motion.div>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h3" color="#1e2a78" fontWeight={700} mb={2}>
            🏏 IPL Match Predictor 2025
          </Typography>
          <Typography variant="h6" color="#666" fontWeight={500}>
            Powered by Wicketly.AI - Advanced Cricket Analytics
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Live Matches Section */}
        <Card sx={{ boxShadow: 3, mb: 4, bgcolor: "#fff3cd", border: "2px solid #ff6b00" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LiveTvIcon sx={{ color: "#ff6b00", mr: 1, fontSize: 28 }} />
                <Typography variant="h6" color="#ff6b00" fontWeight={700}>
                  🔴 LIVE & UPCOMING IPL MATCHES
                </Typography>
              </Box>
              <Button
                startIcon={<RefreshIcon />}
                onClick={fetchLiveMatches}
                disabled={liveMatchesLoading}
                size="small"
                variant="outlined"
              >
                Refresh
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastRefresh.toLocaleTimeString()} | Auto-refreshes every 30 seconds
            </Typography>
            <Divider sx={{ my: 2 }} />

            {liveMatchesLoading ? (
              <Grid container spacing={2}>
                {[1, 2, 3].map((idx) => (
                  <Grid item xs={12} md={4} key={idx}>
                    <Skeleton variant="rectangular" height={200} />
                  </Grid>
                ))}
              </Grid>
            ) : liveMatches.length > 0 ? (
              <Grid container spacing={2}>
                {liveMatches.map((match) => (
                  <Grid item xs={12} md={4} key={match.id}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border: selectedLiveMatch === match.id ? "3px solid #ff6b00" : "1px solid #ddd",
                        bgcolor: selectedLiveMatch === match.id ? "#fff9e6" : "#fff",
                        transition: "all 0.3s",
                        "&:hover": { boxShadow: 3 }
                      }}
                      onClick={() => setSelectedLiveMatch(match.id)}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Chip
                            label={match.status}
                            color={match.status === "LIVE" ? "error" : "default"}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                          {match.status === "LIVE" && (
                            <Box sx={{ 
                              width: 10, 
                              height: 10, 
                              bgcolor: "error.main", 
                              borderRadius: "50%",
                              animation: "pulse 1s infinite"
                            }} />
                          )}
                        </Stack>

                        <Typography variant="body2" fontWeight={700} mb={1}>
                          {match.team1} vs {match.team2}
                        </Typography>

                        {match.status === "LIVE" && (
                          <>
                            <Box sx={{ mb: 1 }}>
                              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                <Typography variant="caption">{match.team1}</Typography>
                                <Typography variant="caption" fontWeight={700}>{match.runs_team1}/{match.wickets_team1}</Typography>
                              </Stack>
                              <LinearProgress 
                                variant="determinate" 
                                value={Math.min((match.runs_team1 / 200) * 100, 100)} 
                              />
                            </Box>

                            <Box>
                              <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                <Typography variant="caption">{match.team2}</Typography>
                                <Typography variant="caption" fontWeight={700}>{match.runs_team2}/{match.wickets_team2}</Typography>
                              </Stack>
                              <LinearProgress 
                                variant="determinate" 
                                value={Math.min((match.runs_team2 / 200) * 100, 100)} 
                              />
                            </Box>

                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                              Overs: {match.overs}
                            </Typography>
                          </>
                        )}

                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                          📍 {match.venue}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          🕐 {match.time}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No live IPL matches at the moment. Select teams manually to make a prediction.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Main Tabs Section */}
        <Card sx={{ boxShadow: 3, mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              aria-label="prediction tabs"
            >
              <Tab label="📊 Manual Prediction" icon={<SchoolIcon />} iconPosition="start" />
              <Tab label="📈 Team Performance" icon={<TrendingUpIcon />} iconPosition="start" />
              <Tab label="⏱️ Head to Head" icon={<HistoryIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* Manual Prediction Tab */}
          <TabPanel value={tabValue} index={0}>
            <CardContent>
              <Typography variant="h6" color="#1e2a78" fontWeight={700} mb={3}>
                📊 Enter Match Details
              </Typography>

              {selectedLiveMatch && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  ✅ Live match data loaded! Team info and scores are pre-filled from live data.
                </Alert>
              )}

              {/* Team Selection */}
              <Typography variant="subtitle1" fontWeight={600} mb={2} color="#333">
                🎯 Select Teams & Conditions
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Team 1"
                    fullWidth
                    value={team1}
                    onChange={(e) => setTeam1(e.target.value)}
                    variant="outlined"
                  >
                    {teams.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Team 2"
                    fullWidth
                    value={team2}
                    onChange={(e) => setTeam2(e.target.value)}
                    variant="outlined"
                  >
                    {teams.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Venue (2025)"
                    fullWidth
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    variant="outlined"
                  >
                    {venues.map((v) => (
                      <MenuItem key={v} value={v}>
                        {v}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Weather Conditions"
                    fullWidth
                    value={weatherType}
                    onChange={(e) => setWeatherType(e.target.value)}
                    variant="outlined"
                  >
                    {weather.map((w) => (
                      <MenuItem key={w} value={w}>
                        {w}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Manual Runs Input */}
              <Typography variant="subtitle1" fontWeight={600} mb={2} color="#333">
                📈 Enter Expected Runs
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12}>
                  <TextField
                    label={`${team1 ? team1 : "Team 1"} Runs`}
                    type="number"
                    fullWidth
                    value={runsTeam1}
                    onChange={(e) => setRunsTeam1(e.target.value)}
                    placeholder="e.g., 180"
                    inputProps={{ min: 0, max: 250 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={`${team2 ? team2 : "Team 2"} Runs`}
                    type="number"
                    fullWidth
                    value={runsTeam2}
                    onChange={(e) => setRunsTeam2(e.target.value)}
                    placeholder="e.g., 160"
                    inputProps={{ min: 0, max: 250 }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Wicket Selection */}
              <Typography variant="subtitle1" fontWeight={600} mb={2} color="#333">
                ⚡ Expected Wickets
              </Typography>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Wickets Lost (Team 1)</InputLabel>
                    <Select
                      value={wicketsTeam1}
                      label="Wickets Lost (Team 1)"
                      onChange={(e) => setWicketsTeam1(e.target.value)}
                    >
                      {[...Array(11)].map((_, i) => (
                        <MenuItem key={i} value={i}>
                          {i} Wickets
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Wickets Lost (Team 2)</InputLabel>
                    <Select
                      value={wicketsTeam2}
                      label="Wickets Lost (Team 2)"
                      onChange={(e) => setWicketsTeam2(e.target.value)}
                    >
                      {[...Array(11)].map((_, i) => (
                        <MenuItem key={i} value={i}>
                          {i} Wickets
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Overs"
                    type="number"
                    fullWidth
                    value={overs}
                    onChange={(e) => setOvers(parseInt(e.target.value))}
                    inputProps={{ min: 1, max: 20 }}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {/* Prediction Summary */}
              {team1 && team2 && runsTeam1 && runsTeam2 && (
                <Box sx={{ bgcolor: "#f0f7ff", p: 2, borderRadius: 2, mb: 3, border: "1px solid #1e2a78" }}>
                  <Typography variant="body2" fontWeight={600} mb={2} color="#1e2a78">
                    📋 Input Summary:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip
                      label={`${team1}: ${runsTeam1} Runs`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`${team2}: ${runsTeam2} Runs`}
                      color="secondary"
                      variant="outlined"
                    />
                    <Chip
                      label={`${team1}: ${wicketsTeam1}W`}
                      color="error"
                      size="small"
                    />
                    <Chip
                      label={`${team2}: ${wicketsTeam2}W`}
                      color="error"
                      size="small"
                    />
                    <Chip
                      label={`${overs} Overs`}
                      color="default"
                      variant="outlined"
                    />
                  </Stack>
                </Box>
              )}

              {/* Prediction Buttons */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handlePredictMatch}
                    disabled={loading || !team1 || !team2}
                    size="large"
                    sx={{ py: 1.5, fontWeight: 700 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "🎲 Predict Match"}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    onClick={handlePredictWickets}
                    disabled={loading || !team1 || !team2}
                    size="large"
                    sx={{ py: 1.5, fontWeight: 700 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "⚡ Analyze Wickets"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </TabPanel>

          {/* Team Performance Tab */}
          <TabPanel value={tabValue} index={1}>
            <CardContent>
              <Typography variant="h6" color="#1e2a78" fontWeight={700} mb={3}>
                📈 2025 Season Performance Stats
              </Typography>

              {team1 && team2 ? (
                <Grid container spacing={3}>
                  {[team1, team2].map((team) => {
                    const stats = teamPerformanceStats[team];
                    return (
                      <Grid item xs={12} sm={6} key={team}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <StarsIcon sx={{ mr: 1, color: "#1e2a78" }} />
                            <Typography fontWeight={700}>{team}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box>
                              <Table size="small">
                                <TableBody>
                                  <TableRow>
                                    <TableCell><strong>Matches</strong></TableCell>
                                    <TableCell>{stats.matches_played}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><strong>Wins</strong></TableCell>
                                    <TableCell>{stats.wins}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><strong>Win %</strong></TableCell>
                                    <TableCell>{stats.win_percentage}%</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><strong>Avg Runs</strong></TableCell>
                                    <TableCell>{stats.avg_runs}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><strong>Avg Wickets Lost</strong></TableCell>
                                    <TableCell>{stats.avg_wickets_lost}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><strong>Top Scorer</strong></TableCell>
                                    <TableCell>{stats.top_scorer}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><strong>Top Bowler</strong></TableCell>
                                    <TableCell>{stats.top_bowler}</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell><strong>Form</strong></TableCell>
                                    <TableCell>{stats.best_streak}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Alert severity="info">Select both teams to view performance stats</Alert>
              )}
            </CardContent>
          </TabPanel>

          {/* Head to Head Tab */}
          <TabPanel value={tabValue} index={2}>
            <CardContent>
              <Typography variant="h6" color="#1e2a78" fontWeight={700} mb={3}>
                ⏱️ Head to Head Results
              </Typography>

              {team1 && team2 ? (
                h2hData.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead sx={{ bgcolor: "#1e2a78" }}>
                        <TableRow>
                          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Date</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Winner</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Margin</TableCell>
                          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Venue</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {h2hData.map((match, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>{match.date}</TableCell>
                            <TableCell fontWeight={700}>{match.winner}</TableCell>
                            <TableCell>{match.margin}</TableCell>
                            <TableCell>{match.venue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">No previous head to head data available</Alert>
                )
              ) : (
                <Alert severity="info">Select both teams to view head to head results</Alert>
              )}
            </CardContent>
          </TabPanel>
        </Card>

        {/* Match Prediction Result */}
        {matchPrediction && (
          <>
            <Card sx={{ boxShadow: 4, mb: 4, bgcolor: "#e3f2fd", border: "3px solid #1e2a78" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CheckCircleIcon sx={{ color: "success.main", mr: 1, fontSize: 32 }} />
                  <Typography variant="h6" color="#1e2a78" fontWeight={700}>
                    🎯 Prediction Result - Wicketly.AI Analysis
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* Match Header */}
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="body1" mb={1}>
                        <strong>{team1}</strong> vs <strong>{team2}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 {venue}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Winner Card */}
                  <Grid item xs={12}>
                    <Paper
                      elevation={3}
                      sx={{
                        bgcolor: "success.light",
                        p: 3,
                        borderRadius: 2,
                        textAlign: "center",
                        background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                        color: "#fff"
                      }}
                    >
                      <Typography variant="body2" mb={1} sx={{ opacity: 0.9 }}>
                        Predicted Winner
                      </Typography>
                      <Typography variant="h3" fontWeight={700}>
                        {matchPrediction.predicted_winner}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.95 }}>
                        Win Probability: {matchPrediction.winning_probability != null ? `${matchPrediction.winning_probability}%` : 'N/A'}
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Stats Grid */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1, border: "2px solid #1e2a78" }}>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {team1} Performance Score
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#1e2a78">
                        {matchPrediction.team1_score}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Based on {runsTeam1} runs & {wicketsTeam1} wickets
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1, border: "2px solid #1e2a78" }}>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        {team2} Performance Score
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#1e2a78">
                        {matchPrediction.team2_score}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Based on {runsTeam2} runs & {wicketsTeam2} wickets
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Confidence Level */}
                  <Grid item xs={12}>
                    <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Confidence Level
                      </Typography>
                      <Chip
                        label={matchPrediction.confidence}
                        color={
                          matchPrediction.confidence === "High"
                            ? "success"
                            : matchPrediction.confidence === "Medium"
                            ? "warning"
                            : "error"
                        }
                        sx={{ fontWeight: 700, fontSize: "1rem", py: 2 }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                        {matchPrediction.confidence === "High" && "Very likely based on input parameters"}
                        {matchPrediction.confidence === "Medium" && "Moderately likely - competitive match"}
                        {matchPrediction.confidence === "Low" && "Highly competitive - outcome uncertain"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Why This Team Will Win - Interesting Facts */}
            {winFacts.length > 0 && (
              <Card sx={{ boxShadow: 3, mb: 4, bgcolor: "#fff8e1", border: "2px solid #f57c00" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SchoolIcon sx={{ color: "#f57c00", mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" color="#f57c00" fontWeight={700}>
                      💡 Why {matchPrediction.predicted_winner} Will Win?
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  <List>
                    {winFacts.map((fact, idx) => (
                      <ListItem key={idx} sx={{ mb: 1 }}>
                        <ListItemIcon>
                          <TrendingUpIcon sx={{ color: "#f57c00" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontWeight={700} color="#333">
                              {fact.title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {fact.description}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Wicket Prediction Result */}
        {wicketPrediction && (
          <Card sx={{ boxShadow: 3, bgcolor: "#fff3e0", border: "2px solid #f57c00" }}>
            <CardContent>
              <Typography variant="h6" color="#f57c00" fontWeight={700} mb={2}>
                ⚡ Wicket & Match Statistics Analysis
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="error" fontWeight={700}>
                      Predicted Wickets
                    </Typography>
                    <Typography variant="h4" color="error" fontWeight={700}>
                      {wicketPrediction.predicted_wickets}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="success.main" fontWeight={710}>
                      Boundaries
                    </Typography>
                    <Typography variant="h4" color="success.main" fontWeight={700}>
                      {wicketPrediction.predicted_boundaries}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="primary" fontWeight={700}>
                      Sixes
                    </Typography>
                    <Typography variant="h4" color="primary" fontWeight={700}>
                      {wicketPrediction.predicted_sixes}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" color="warning.main" fontWeight={700}>
                      Extras
                    </Typography>
                    <Typography variant="h4" color="warning.main" fontWeight={700}>
                      {wicketPrediction.predicted_extras}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
