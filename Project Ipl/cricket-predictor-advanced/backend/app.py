from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)

# Paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# Load model + encoder if exists
if os.path.exists(MODEL_PATH):
    obj = joblib.load(MODEL_PATH)
    model = obj.get("model", None)
    encoder = obj.get("encoder", None)
else:
    model = None
    encoder = None

# Load datasets
matches = pd.read_csv(os.path.join(DATA_DIR, "matches.csv"))
players = pd.read_csv(os.path.join(DATA_DIR, "players.csv"))
headtohead = pd.read_csv(os.path.join(DATA_DIR, "headtohead.csv"))
news = pd.read_csv(os.path.join(DATA_DIR, "news.csv"))

@app.route("/")
def home():
    return {"message": "Cricket Predictor API is running"}

@app.route("/predict", methods=["POST"])
def predict():
    if not model or not encoder:
        return jsonify({"error": "Model not trained"}), 500

    data = request.json
    features = [[
        data.get("runs", 0),
        data.get("wickets", 0),
        data.get("overs", 0)
    ]]

    # Predict encoded label
    y_pred_encoded = model.predict(features)[0]
    # Convert back to team name
    team_name = encoder.inverse_transform([y_pred_encoded])[0]

    return jsonify({"predicted_winner": team_name})

@app.route("/players")
def get_players():
    return players.to_dict(orient="records")

@app.route("/matches")
def get_matches():
    return matches.to_dict(orient="records")

@app.route("/headtohead")
def get_headtohead():
    return headtohead.to_dict(orient="records")

@app.route("/news")
def get_news():
    return news.to_dict(orient="records")

if __name__ == "__main__":
    app.run(debug=True)
