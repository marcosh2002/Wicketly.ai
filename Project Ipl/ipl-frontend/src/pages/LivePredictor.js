import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import API_BASE from "../config";

const IPL_TEAMS = [
  "Chennai Super Kings",
  "Mumbai Indians",
  "Royal Challengers Bengaluru",
  "Kolkata Knight Riders",
  "Sunrisers Hyderabad",
  "Rajasthan Royals",
  "Delhi Capitals",
  "Punjab Kings",
  "Gujarat Titans",
  "Lucknow Super Giants",
];

function LivePredictor() {
  const [form, setForm] = useState({
    battingTeam: "",
    bowlingTeam: "",
    target: "",
    currentScore: "",
    overs: "",
    wickets: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handlePredict = async () => {
    // Validation
    if (!form.battingTeam || !form.bowlingTeam || !form.target || !form.currentScore || !form.overs || !form.wickets) {
      setError("Please fill all fields");
      return;
    }

    if (form.battingTeam === form.bowlingTeam) {
      setError("Batting and bowling teams cannot be the same");
      return;
    }

    const target = parseInt(form.target);
    const currentScore = parseInt(form.currentScore);
    const overs = parseFloat(form.overs);
    const wickets = parseInt(form.wickets);

    if (target < 1 || target > 300) {
      setError("Target should be between 1-300");
      return;
    }

    if (currentScore < 0 || currentScore > target) {
      setError("Current score should be between 0 and target");
      return;
    }

    if (overs < 0.1 || overs > 20) {
      setError("Overs should be between 0.1-20");
      return;
    }

    if (wickets < 0 || wickets > 10) {
      setError("Wickets should be between 0-10");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE}/predict/live`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batting_team: form.battingTeam,
          bowling_team: form.bowlingTeam,
          target: target,
          current_score: currentScore,
          overs: overs,
          wickets: wickets,
        }),
      });

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      // Map API response to frontend expected fields
      const mappedResult = {
        chaser_wins: data.prediction === "Chasing team wins",
        predicted_winner: data.prediction === "Chasing team wins" ? form.battingTeam : form.bowlingTeam,
        chaser_win_prob: data.chaser_win_probability,
        defender_win_prob: data.defender_win_probability,
        confidence: Math.max(data.chaser_win_probability, data.defender_win_probability),
        analysis: data.analysis,
        match_state: data.match_state,
      };
      setResult(mappedResult);
    } catch (err) {
      setError("Failed to get prediction. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runsNeeded = form.target && form.currentScore ? parseInt(form.target) - parseInt(form.currentScore) : 0;
  const ballsRemaining = form.overs ? 120 - Math.floor(parseFloat(form.overs) * 6) : 0;
  const requiredRunRate = ballsRemaining > 0 ? (runsNeeded / (ballsRemaining / 6)).toFixed(2) : 0;
  const currentRunRate = form.overs && parseFloat(form.overs) > 0 ? (parseInt(form.currentScore || 0) / parseFloat(form.overs)).toFixed(2) : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 12,
        pb: 8,
        px: 2,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 2,
            fontWeight: 800,
            background: "linear-gradient(90deg, #ef4444, #f97316, #eab308)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          🔴 Live Match Predictor
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            mb: 4,
            color: "rgba(255,255,255,0.7)",
            fontSize: "1.1rem",
          }}
        >
          Enter current match state to predict winner in real-time
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Input Form */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: "rgba(30, 41, 59, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", mb: 3, fontWeight: 700 }}>
                <SportsCricketIcon sx={{ mr: 1, verticalAlign: "middle", color: "#ef4444" }} />
                Match State
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Batting Team (Chasing)"
                    name="battingTeam"
                    value={form.battingTeam}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "#ef4444" },
                      },
                      "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                    }}
                  >
                    {IPL_TEAMS.map((team) => (
                      <MenuItem key={team} value={team}>
                        {team}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Bowling Team (Defending)"
                    name="bowlingTeam"
                    value={form.bowlingTeam}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "#ef4444" },
                      },
                      "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                    }}
                  >
                    {IPL_TEAMS.map((team) => (
                      <MenuItem key={team} value={team}>
                        {team}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Target"
                    name="target"
                    type="number"
                    value={form.target}
                    onChange={handleChange}
                    placeholder="e.g., 180"
                    inputProps={{ min: 1, max: 300 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "#ef4444" },
                      },
                      "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Current Score"
                    name="currentScore"
                    type="number"
                    value={form.currentScore}
                    onChange={handleChange}
                    placeholder="e.g., 95"
                    inputProps={{ min: 0, max: 300 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "#ef4444" },
                      },
                      "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Overs Completed"
                    name="overs"
                    type="number"
                    value={form.overs}
                    onChange={handleChange}
                    placeholder="e.g., 12.3"
                    inputProps={{ min: 0, max: 20, step: 0.1 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "#ef4444" },
                      },
                      "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Wickets Lost"
                    name="wickets"
                    type="number"
                    value={form.wickets}
                    onChange={handleChange}
                    placeholder="e.g., 3"
                    inputProps={{ min: 0, max: 10 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "#ef4444" },
                      },
                      "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                    }}
                  />
                </Grid>
              </Grid>

              {error && (
                <Typography sx={{ color: "#ef4444", mt: 2, fontSize: "0.9rem" }}>
                  ⚠️ {error}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handlePredict}
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: "linear-gradient(90deg, #ef4444, #f97316)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  "&:hover": {
                    background: "linear-gradient(90deg, #dc2626, #ea580c)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "🎯 PREDICT WINNER"}
              </Button>
            </Paper>
          </Grid>

          {/* Live Stats & Results */}
          <Grid item xs={12} md={5}>
            {/* Current Stats */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                mb: 3,
                background: "rgba(30, 41, 59, 0.8)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", mb: 2, fontWeight: 700 }}>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: "middle", color: "#10b981" }} />
                Live Stats
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                    Runs Needed
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>
                    {runsNeeded || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                    Balls Remaining
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "1.5rem", fontWeight: 700 }}>
                    {ballsRemaining || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                    Current RR
                  </Typography>
                  <Typography sx={{ color: "#10b981", fontSize: "1.5rem", fontWeight: 700 }}>
                    {currentRunRate || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
                    Required RR
                  </Typography>
                  <Typography
                    sx={{
                      color: parseFloat(requiredRunRate) > 12 ? "#ef4444" : "#f97316",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {requiredRunRate || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Prediction Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${
                        result.chaser_wins ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"
                      }, rgba(30, 41, 59, 0.9))`,
                      border: `2px solid ${result.chaser_wins ? "#10b981" : "#ef4444"}`,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: "center",
                        color: result.chaser_wins ? "#10b981" : "#ef4444",
                        fontWeight: 800,
                        mb: 2,
                      }}
                    >
                      🏆 {result.predicted_winner}
                    </Typography>

                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "2rem",
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      {result.confidence?.toFixed(1) || Math.max(result.chaser_win_prob, result.defender_win_prob)?.toFixed(1)}% Confidence
                    </Typography>

                    <Box sx={{ px: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography sx={{ color: "#10b981", fontWeight: 600 }}>
                          {form.battingTeam?.split(" ").pop()}
                        </Typography>
                        <Typography sx={{ color: "#ef4444", fontWeight: 600 }}>
                          {form.bowlingTeam?.split(" ").pop()}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={result.chaser_win_prob || 50}
                        sx={{
                          height: 12,
                          borderRadius: 2,
                          backgroundColor: "#ef4444",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#10b981",
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
                          {result.chaser_win_prob?.toFixed(1)}%
                        </Typography>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
                          {result.defender_win_prob?.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}

export default LivePredictor;
