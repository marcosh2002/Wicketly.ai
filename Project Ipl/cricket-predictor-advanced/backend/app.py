from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
from dotenv import load_dotenv
from db import load_csv_to_db, engine, SessionLocal
from sqlalchemy import text

load_dotenv()

app = Flask(__name__)
CORS(app)

# Paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

# Load model + encoder if exists
if os.path.exists(MODEL_PATH):
    obj = joblib.load(MODEL_PATH)
    model = obj.get("model", None)
    encoder = obj.get("encoder", None)
else:
    model = None
    encoder = None

# Initialize database on startup
try:
    load_csv_to_db()
except Exception as e:
    print(f"Database initialization error: {e}")

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
    try:
        df = pd.read_sql("SELECT * FROM players", engine)
        return df.to_dict(orient="records")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/matches")
def get_matches():
    try:
        df = pd.read_sql("SELECT * FROM matches", engine)
        return df.to_dict(orient="records")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/headtohead")
def get_headtohead():
    try:
        df = pd.read_sql("SELECT * FROM headtohead", engine)
        return df.to_dict(orient="records")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/news")
def get_news():
    try:
        df = pd.read_sql("SELECT * FROM news", engine)
        return df.to_dict(orient="records")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") != "production"
    app.run(host="0.0.0.0", port=port, debug=debug)
