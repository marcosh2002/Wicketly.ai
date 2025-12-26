import pandas as pd

# Demo scraper (replace with real web scraping later)
def scrape_matches():
    data = [
        {"match_id": 1, "team1": "MI", "team2": "CSK", "team1_score": 180, "team2_score": 170, "overs": 20, "winner": "MI"},
        {"match_id": 2, "team1": "RCB", "team2": "KKR", "team1_score": 150, "team2_score": 152, "overs": 19, "winner": "KKR"},
    ]
    return pd.DataFrame(data)

if __name__ == "__main__":
    df = scrape_matches()
    df.to_csv("data/matches.csv", index=False)
    print("✅ Matches scraped and saved")
