// ...existing code...
fetch("http://127.0.0.1:5000/matches")
  .then(response => response.json())
  .then(data => {
    let html = "<table border='1'><tr><th>Match</th><th>Winner</th></tr>";
    data.forEach(row => {
      html += `<tr><td>${row.team1} vs ${row.team2}</td><td>${row.winner}</td></tr>`;
    });
    html += "</table>";
    document.getElementById("stats").innerHTML = html;

    // If you want the Save button visible after a prediction is displayed, uncomment:
    // showSaveButton();
  })
  .catch(err => {
    console.error("Failed to load matches:", err);
  });

// show/hide and save handlers
function showSaveButton(){ document.getElementById('savePredictionBtn').style.display = 'inline-block'; }

document.getElementById('savePredictionBtn').addEventListener('click', savePrediction);

async function savePrediction(){
  const username = prompt("Enter username to save prediction under (no password)");
  if(!username) return;
  // Build payload from your UI state. Update these window.* variables where your prediction logic runs.
  const payload = {
    input: {
      team1: window.appTeam1 || "CSK",
      team2: window.appTeam2 || "MI",
      venue: window.appVenue || "Neutral",
      weather: window.appWeather || "Sunny",
      runsTeam1: parseInt(window.appRuns1 || 160),
      runsTeam2: parseInt(window.appRuns2 || 150),
      wicketsTeam1: parseInt(window.appW1 || 3),
      wicketsTeam2: parseInt(window.appW2 || 3),
    },
    result: window.latestPrediction || {}
  };

  try{
    const res = await fetch(`http://localhost:8000/users/${encodeURIComponent(username)}/predictions`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(data.ok){
      alert('Prediction saved');
    } else {
      alert('Save failed: ' + (data.error || JSON.stringify(data)));
    }
  }catch(err){
    console.error(err);
    alert('Error saving prediction — is backend running?');
  }
}
// After you render the prediction into the DOM, run:
function markPredictionRendered(){
  const el = document.getElementById('predictionCard') || document.querySelector('.prediction-card');
  if (el) el.classList.add('prediction-card');
  // optional: populate predDetails and predWinner if you have data object
  // document.getElementById('predDetails').textContent = JSON.stringify(window.latestPrediction || {}, null, 2);
}
// call markPredictionRendered() after rendering your prediction
// ...existing code...
window.addEventListener('DOMContentLoaded', ()=> {
  const saveBtn = document.getElementById('savePredictionBtn');
  if (saveBtn) saveBtn.addEventListener('click', savePrediction);
});

function showSaveButton(){ const b=document.getElementById('savePredictionBtn'); if(b) b.style.display='inline-block'; }

function markPredictionRendered(pred){
  const winnerEl = document.getElementById('predWinner');
  const detailsEl = document.getElementById('predDetails');
  if (winnerEl) winnerEl.textContent = 'Predicted Winner: ' + (pred.predicted_winner || pred.predictedWinner || '--');
  if (detailsEl) detailsEl.textContent = JSON.stringify(pred, null, 2);
  showSaveButton();
  window.latestPrediction = pred;
}

// call this from any place that receives a prediction
window.updateFromSimulator = markPredictionRendered;

async function savePrediction(){
  const username = prompt("Enter username to save prediction under (no password)");
  if (!username) return;
  const payload = { input: (window.latestPrediction?.input || {}), result: window.latestPrediction || {} };
  try {
    const res = await fetch(`http://127.0.0.1:8000/users/${encodeURIComponent(username)}/predictions`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.ok) alert('Saved');
    else alert('Save failed: ' + (data.error || JSON.stringify(data)));
  } catch (err) { console.error(err); alert('Save error'); }
}