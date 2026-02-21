import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import pandas as pd

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def load_csv_to_db():
    """Load CSV data to PostgreSQL on first run"""
    import importlib.util
    
    DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
    
    # Create new connection for data loading
    conn = engine.raw_connection()
    cursor = conn.cursor()
    
    try:
        # Check if tables exist
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'matches'
            );
        """)
        
        if not cursor.fetchone()[0]:
            print("Loading CSV data to database...")
            
            # Load matches
            if os.path.exists(os.path.join(DATA_DIR, "matches.csv")):
                df = pd.read_csv(os.path.join(DATA_DIR, "matches.csv"))
                df.to_sql('matches', engine, if_exists='replace', index=False)
                print("✓ Loaded matches")
            
            # Load players
            if os.path.exists(os.path.join(DATA_DIR, "players.csv")):
                df = pd.read_csv(os.path.join(DATA_DIR, "players.csv"))
                df.to_sql('players', engine, if_exists='replace', index=False)
                print("✓ Loaded players")
            
            # Load headtohead
            if os.path.exists(os.path.join(DATA_DIR, "headtohead.csv")):
                df = pd.read_csv(os.path.join(DATA_DIR, "headtohead.csv"))
                df.to_sql('headtohead', engine, if_exists='replace', index=False)
                print("✓ Loaded headtohead")
            
            # Load news
            if os.path.exists(os.path.join(DATA_DIR, "news.csv")):
                df = pd.read_csv(os.path.join(DATA_DIR, "news.csv"))
                df.to_sql('news', engine, if_exists='replace', index=False)
                print("✓ Loaded news")
            
            conn.commit()
            print("Database initialization complete!")
        else:
            print("✓ Database already initialized")
    
    except Exception as e:
        print(f"Error loading data: {e}")
        conn.rollback()
    
    finally:
        cursor.close()
        conn.close()
