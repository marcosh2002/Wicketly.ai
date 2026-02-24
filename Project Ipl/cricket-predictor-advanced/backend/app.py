from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import warnings
warnings.filterwarnings('ignore')

load_dotenv()

app = Flask(__name__)
CORS(app)

# Paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///cricket_local.db")

# For local development with SQLite, for Railway with PostgreSQL
if "postgresql" in DATABASE_URL:
    # PostgreSQL connection
    engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
    
    def init_db():
        """Initialize database tables from CSV"""
        try:
            # Check if tables exist
            conn = engine.raw_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'matches'
                );
            """)
            
            if not cursor.fetchone()[0]:
                print("Initializing PostgreSQL database...")
                # Load CSV files to PostgreSQL
                for csv_file in os.listdir(DATA_DIR):
                    if csv_file.endswith('.csv'):
                        try:
                            table_name = csv_file.replace('.csv', '')
                            df = pd.read_csv(os.path.join(DATA_DIR, csv_file))
                            df.to_sql(table_name, engine, if_exists='replace', index=False)
                            print(f"  ✓ Loaded {table_name}")
                        except Exception as e:
                            print(f"  ✗ Error loading {csv_file}: {e}")
                
            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Database init error: {e}")
else:
    # SQLite for local development
    engine = create_engine(DATABASE_URL)

# Load model + encoder
if os.path.exists(MODEL_PATH):
    try:
        obj = joblib.load(MODEL_PATH)
        model = obj.get("model", None)
        encoder = obj.get("encoder", None)
    except:
        model = None
        encoder = None
else:
    model = None
    encoder = None

# Initialize database on startup
init_db() if "postgresql" in DATABASE_URL else None

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
        if "postgresql" in DATABASE_URL:
            df = pd.read_sql("SELECT * FROM players LIMIT 1000", engine)
        else:
            df = pd.read_csv(os.path.join(DATA_DIR, "players.csv"))
        return df.to_dict(orient="records")
    except Exception as e:
        try:
            df = pd.read_csv(os.path.join(DATA_DIR, "players.csv"))
            return df.to_dict(orient="records")
        except Exception as csv_error:
            return jsonify({"error": f"DB error: {str(e)} | CSV fallback error: {str(csv_error)}"}), 500

@app.route("/matches")
def get_matches():
    try:
        if "postgresql" in DATABASE_URL:
            df = pd.read_sql("SELECT * FROM matches LIMIT 1000", engine)
        else:
            df = pd.read_csv(os.path.join(DATA_DIR, "matches.csv"))
        return df.to_dict(orient="records")
    except Exception as e:
        try:
            df = pd.read_csv(os.path.join(DATA_DIR, "matches.csv"))
            return df.to_dict(orient="records")
        except Exception as csv_error:
            return jsonify({"error": f"DB error: {str(e)} | CSV fallback error: {str(csv_error)}"}), 500

@app.route("/headtohead")
def get_headtohead():
    try:
        if "postgresql" in DATABASE_URL:
            df = pd.read_sql("SELECT * FROM headtohead LIMIT 1000", engine)
        else:
            df = pd.read_csv(os.path.join(DATA_DIR, "headtohead.csv"))
        return df.to_dict(orient="records")
    except Exception as e:
        try:
            df = pd.read_csv(os.path.join(DATA_DIR, "headtohead.csv"))
            return df.to_dict(orient="records")
        except Exception as csv_error:
            return jsonify({"error": f"DB error: {str(e)} | CSV fallback error: {str(csv_error)}"}), 500

@app.route("/news")
def get_news():
    try:
        if "postgresql" in DATABASE_URL:
            df = pd.read_sql("SELECT * FROM news LIMIT 1000", engine)
        else:
            df = pd.read_csv(os.path.join(DATA_DIR, "news.csv"))
        return df.to_dict(orient="records")
    except Exception as e:
        try:
            df = pd.read_csv(os.path.join(DATA_DIR, "news.csv"))
            return df.to_dict(orient="records")
        except Exception as csv_error:
            return jsonify({"error": f"DB error: {str(e)} | CSV fallback error: {str(csv_error)}"}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") != "production"
    app.run(host="0.0.0.0", port=port, debug=debug)
