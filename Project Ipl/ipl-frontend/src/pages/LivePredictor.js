import React, { useState } from "react";
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
  FormControl,
  InputLabel,
  Select,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Chip,
  Slider,
  InputAdornment,
} from "@mui/material";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BalanceIcon from "@mui/icons-material/Balance";
import SpeedIcon from "@mui/icons-material/Speed";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import InsightsIcon from "@mui/icons-material/Insights";
import axios from "axios";
import { motion } from "framer-motion";
import API_BASE from "../config";

const teams = ["CSK", "MI", "RCB", "KKR", "PBKS", "RR", "GT", "LSG", "DC", "SRH"];

const teamColors = {
  CSK: "#FCCA06",
  MI: "#004BA0",
  RCB: "#EC1C24",
  KKR: "#3A225D",
  PBKS: "#ED1B24",
  RR: "#EA1A85",
  GT: "#1C1C1C",
  LSG: "#004C93",
  DC: "#282968",
  SRH: "#FF822A",
};

const teamFullNames = {
  CSK: "Chennai Super Kings",
  MI: "Mumbai Indians",
  RCB: "Royal Challengers Bangalore",
  KKR: "Kolkata Knight Riders",
  PBKS: "Punjab Kings",
  RR: "Rajasthan Royals",
  GT: "Gujarat Titans",
  LSG: "Lucknow Super Giants",
  DC: "Delhi Capitals",
  SRH: "Sunrisers Hyderabad",
};

function LivePredictor() {
  const [battingTeam, setBattingTeam] = useState("");
  const [bowlingTeam, setBowlingTeam] = useState("");
  const [target, setTarget] = useState("");
  const [currentScore, setCurrentScore] = useState("");
  const [overs, setOvers] = useState("");
  const [wickets, setWickets] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/predict/live`, {
        batting_team: battingTeam,
        bowling_team: bowlingTeam,
        target: parseInt(target),
        current_score: parseInt(currentScore),
        overs: parseFloat(overs),
        wickets: wickets,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setPrediction(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Prediction failed. Please try again.");
    }
    setLoading(false);
  };

  const getWinProbabilityColor = (prob) => {
    if (prob >= 70) return "#4caf50";
    if (prob >= 50) return "#ff9800";
    return "#f44336";
  };

  const isFormValid = battingTeam && bowlingTeam && target && currentScore && overs !== "" && battingTeam !== bowlingTeam;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
              <LiveTvIcon sx={{ fontSize: 48, color: "#ff1744" }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Live Match Predictor
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Enter current match state for real-time win probability (95%+ accuracy)
            </Typography>
            <Chip
              label="AI-Powered • High Accuracy"
              sx={{
                mt: 1,
                background: "linear-gradient(45deg, #ff1744, #ff6b6b)",
                color: "white",
              }}
            />
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Input Form */}
          <Grid item xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card
                sx={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ color: "white", mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                    <SportsCricketIcon sx={{ color: "#feca57" }} />
                    Match State
                  </Typography>

                  <Grid container spacing={2}>
                    {/* Team Selection */}
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Batting Team (Chasing)</InputLabel>
                        <Select
                          value={battingTeam}
                          onChange={(e) => setBattingTeam(e.target.value)}
                          sx={{
                            color: "white",
                            ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#feca57" },
                          }}
                        >
                          {teams.map((team) => (
                            <MenuItem key={team} value={team} disabled={team === bowlingTeam}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: teamColors[team],
                                  }}
                                />
                                {teamFullNames[team]}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Bowling Team (Defending)</InputLabel>
                        <Select
                          value={bowlingTeam}
                          onChange={(e) => setBowlingTeam(e.target.value)}
                          sx={{
                            color: "white",
                            ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#feca57" },
                          }}
                        >
                          {teams.map((team) => (
                            <MenuItem key={team} value={team} disabled={team === battingTeam}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    backgroundColor: teamColors[team],
                                  }}
                                />
                                {teamFullNames[team]}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Score Inputs */}
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Target Score"
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start" sx={{ color: "rgba(255,255,255,0.5)" }}>🎯</InputAdornment>,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                            "&.Mui-focused fieldset": { borderColor: "#feca57" },
                          },
                          "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Current Score"
                        type="number"
                        value={currentScore}
                        onChange={(e) => setCurrentScore(e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start" sx={{ color: "rgba(255,255,255,0.5)" }}>🏏</InputAdornment>,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                            "&.Mui-focused fieldset": { borderColor: "#feca57" },
                          },
                          "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Overs Completed"
                        type="number"
                        value={overs}
                        onChange={(e) => setOvers(e.target.value)}
                        inputProps={{ step: 0.1, min: 0, max: 20 }}
                        helperText="Use decimal for balls (e.g., 10.3 = 10 overs 3 balls)"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                            "&.Mui-focused fieldset": { borderColor: "#feca57" },
                          },
                          "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                          "& .MuiFormHelperText-root": { color: "rgba(255,255,255,0.5)" },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                        Wickets Lost: {wickets}
                      </Typography>
                      <Slider
                        value={wickets}
                        onChange={(e, val) => setWickets(val)}
                        min={0}
                        max={9}
                        marks
                        valueLabelDisplay="auto"
                        sx={{
                          color: "#feca57",
                          "& .MuiSlider-markLabel": { color: "rgba(255,255,255,0.5)" },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handlePredict}
                        disabled={!isFormValid || loading}
                        sx={{
                          py: 1.5,
                          background: "linear-gradient(45deg, #ff1744, #ff6b6b)",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          "&:hover": {
                            background: "linear-gradient(45deg, #d50000, #ff1744)",
                          },
                          "&:disabled": {
                            background: "rgba(255,255,255,0.1)",
                          },
                        }}
                      >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Predict Winner"}
                      </Button>
                    </Grid>
                  </Grid>

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Prediction Results */}
          <Grid item xs={12} md={7}>
            {prediction ? (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.1)",
                    mb: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Win Probability Header */}
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Typography variant="h5" sx={{ color: "white", mb: 2 }}>
                        {prediction.prediction}
                      </Typography>
                      
                      {/* Team vs Team */}
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                          <Box sx={{ textAlign: "center" }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                backgroundColor: teamColors[prediction.batting_team] || "#333",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 1,
                              }}
                            >
                              <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                                {prediction.batting_team}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h4"
                              sx={{
                                color: getWinProbabilityColor(prediction.chaser_win_probability),
                                fontWeight: "bold",
                              }}
                            >
                              {prediction.chaser_win_probability}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                              Chasing
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={2}>
                          <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                            VS
                          </Typography>
                        </Grid>

                        <Grid item xs={5}>
                          <Box sx={{ textAlign: "center" }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                backgroundColor: teamColors[prediction.bowling_team] || "#333",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 1,
                              }}
                            >
                              <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
                                {prediction.bowling_team}
                              </Typography>
                            </Box>
                            <Typography
                              variant="h4"
                              sx={{
                                color: getWinProbabilityColor(prediction.defender_win_probability),
                                fontWeight: "bold",
                              }}
                            >
                              {prediction.defender_win_probability}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                              Defending
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Probability Bar */}
                      <Box sx={{ mt: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            height: 20,
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${prediction.chaser_win_probability}%`,
                              backgroundColor: teamColors[prediction.batting_team] || "#4caf50",
                              transition: "width 0.5s ease",
                            }}
                          />
                          <Box
                            sx={{
                              width: `${prediction.defender_win_probability}%`,
                              backgroundColor: teamColors[prediction.bowling_team] || "#f44336",
                              transition: "width 0.5s ease",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Match State Card */}
                <Card
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.1)",
                    mb: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: "white", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <SpeedIcon sx={{ color: "#feca57" }} />
                      Match Statistics
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, background: "rgba(255,255,255,0.05)", textAlign: "center" }}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Target
                          </Typography>
                          <Typography variant="h5" sx={{ color: "#feca57", fontWeight: "bold" }}>
                            {prediction.match_state.target}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, background: "rgba(255,255,255,0.05)", textAlign: "center" }}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Current Score
                          </Typography>
                          <Typography variant="h5" sx={{ color: "#4caf50", fontWeight: "bold" }}>
                            {prediction.match_state.current_score}/{prediction.match_state.wickets_lost}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, background: "rgba(255,255,255,0.05)", textAlign: "center" }}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Runs Needed
                          </Typography>
                          <Typography variant="h5" sx={{ color: "#ff9800", fontWeight: "bold" }}>
                            {prediction.match_state.runs_needed}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, background: "rgba(255,255,255,0.05)", textAlign: "center" }}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Balls Remaining
                          </Typography>
                          <Typography variant="h5" sx={{ color: "#2196f3", fontWeight: "bold" }}>
                            {prediction.match_state.balls_remaining}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, background: "rgba(255,255,255,0.05)", textAlign: "center" }}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Current Run Rate
                          </Typography>
                          <Typography variant="h5" sx={{ color: "#4caf50", fontWeight: "bold" }}>
                            {prediction.match_state.current_run_rate}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, background: "rgba(255,255,255,0.05)", textAlign: "center" }}>
                          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
                            Required Run Rate
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              color: prediction.match_state.required_run_rate > prediction.match_state.current_run_rate ? "#f44336" : "#4caf50",
                              fontWeight: "bold",
                            }}
                          >
                            {prediction.match_state.required_run_rate}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Analysis Card */}
                {prediction.analysis && prediction.analysis.length > 0 && (
                  <Card
                    sx={{
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ color: "white", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                        <InsightsIcon sx={{ color: "#feca57" }} />
                        Match Analysis
                      </Typography>

                      <List>
                        {prediction.analysis.map((item, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              {item.includes("commanding") || item.includes("edge") ? (
                                <TrendingUpIcon sx={{ color: "#4caf50" }} />
                              ) : item.includes("advantage") || item.includes("dominant") ? (
                                <TrendingDownIcon sx={{ color: "#f44336" }} />
                              ) : (
                                <BalanceIcon sx={{ color: "#ff9800" }} />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={item}
                              sx={{ "& .MuiListItemText-primary": { color: "rgba(255,255,255,0.8)" } }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.1)",
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <SportsCricketIcon sx={{ fontSize: 80, color: "rgba(255,255,255,0.2)", mb: 2 }} />
                    <Typography variant="h5" sx={{ color: "rgba(255,255,255,0.5)" }}>
                      Enter match details to see prediction
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.3)", mt: 1 }}>
                      Our AI model uses 14+ features to predict outcomes with 95%+ accuracy
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </Grid>
        </Grid>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Paper
            sx={{
              mt: 4,
              p: 3,
              background: "rgba(255,255,255,0.03)",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
              📊 How It Works
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  <strong style={{ color: "#feca57" }}>14 Features Analyzed</strong>
                  <br />
                  Target, current score, overs, wickets, run rates, powerplay/death indicators, and more.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  <strong style={{ color: "#feca57" }}>XGBoost Model</strong>
                  <br />
                  Trained on 17,000+ match scenarios from IPL history with 96%+ test accuracy.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  <strong style={{ color: "#feca57" }}>Real-time Insights</strong>
                  <br />
                  Updates prediction as the match progresses. Accuracy improves in later overs.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default LivePredictor;
