import random
import json
from pathlib import Path
import pandas as pd

# Ensure we can import the api module
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import api

DATA_DIR = Path(api.STORAGE_DIR)
PRED_FILE = DATA_DIR / 'predictions.json'
MATCHES_FILE = DATA_DIR / 'matches.csv'
USERS_FILE = DATA_DIR / 'users.json'

NUM = 200

weathers = ['Sunny', 'Hot', 'Rainy', 'Cloudy']

# Read matches
matches = []
if MATCHES_FILE.exists():
    try:
        matches = pd.read_csv(MATCHES_FILE).to_dict(orient='records')
    except Exception as e:
        print('Could not read matches.csv:', e)

# Read users to pick usernames
usernames = []
if USERS_FILE.exists():
    try:
        users = json.loads(USERS_FILE.read_text())
        usernames = [u.get('username') for u in users if u.get('username')]
    except Exception as e:
        print('Could not read users.json:', e)

if not usernames:
    usernames = ['testuser']

sim_preds = []
for i in range(NUM):
    if matches:
        m = random.choice(matches)
        team1 = str(m.get('team1') or 'Team A')
        team2 = str(m.get('team2') or 'Team B')
        venue = str(m.get('venue') or 'Neutral')
    else:
        team1 = f'Team{random.randint(1,8)}'
        team2 = f'Team{random.randint(1,8)}'
        venue = 'Neutral'

    runs1 = random.randint(80, 220)
    runs2 = random.randint(80, 220)
    wk1 = random.randint(0, 10)
    wk2 = random.randint(0, 10)
    weather = random.choice(weathers)
    username = random.choice(usernames)

    try:
        pred = api.predict_match(team1, team2, venue, weather, runs1, runs2, wk1, wk2)
    except Exception as e:
        # fallback: build a simple prediction dict
        prob = round(random.random() * 100, 2)
        pred = {
            'team1': team1,
            'team2': team2,
            'predicted_winner': team1 if prob >= 50 else team2,
            'team1_score': runs1,
            'team2_score': runs2,
            'winning_probability': prob,
            'confidence': 'Medium'
        }
    pred['username'] = username
    pred['match_id'] = m.get('id') if matches and m.get('id') else None
    pred['timestamp'] = pd.Timestamp.now().isoformat()
    sim_preds.append(pred)

# Write predictions.json
DATA_DIR.mkdir(parents=True, exist_ok=True)
with open(PRED_FILE, 'w', encoding='utf-8') as fh:
    json.dump(sim_preds, fh, indent=2)

print(f'Wrote {len(sim_preds)} simulated predictions to {PRED_FILE}')
