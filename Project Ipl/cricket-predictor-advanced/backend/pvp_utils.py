import os
import pandas as pd
from functools import lru_cache
from typing import Dict, Any
import glob


@lru_cache(maxsize=1)
def load_ball_data() -> pd.DataFrame:
    """Load ball-by-ball CSV from data folder. Looks for common filenames."""
    base = os.path.join(os.path.dirname(__file__), "data")
    candidates = [
        os.path.join(base, "IPL Ball By Ball 2008 to 2024.csv"),
        os.path.join(base, "ipl_ball_by_ball_2008_2024.csv"),
        os.path.join(base, "ball_by_ball.csv"),
        os.path.join(base, "deliveries.csv"),
        os.path.join(base, "ball_by_ball_2008_2024.csv"),
    ]

    for path in candidates:
        if os.path.exists(path):
            # read with low_memory False to avoid dtype warnings
            df = pd.read_csv(path, low_memory=False)
            # normalize column names to lower-case stripped
            df.columns = [c.strip() for c in df.columns]
            return df

    # If no candidate found, raise FileNotFoundError
    raise FileNotFoundError("Ball-by-ball CSV not found in data folder. Expected filename like 'IPL Ball By Ball 2008 to 2024.csv'.")


def safe_get_column(df: pd.DataFrame, options):
    for opt in options:
        if opt in df.columns:
            return opt
    return None


def compute_pvp(batsman: str, bowler: str) -> Dict[str, Any]:
    """Compute Player-vs-Player statistics using ball-by-ball dataframe.

    Returns a dict with aggregated stats and contextual breakdowns.
    """
    df = load_ball_data()

    # Identify column names in various datasets
    batsman_col = safe_get_column(df, ["batsman", "batsman_name", "batsman_name "])
    bowler_col = safe_get_column(df, ["bowler", "bowler_name"])
    runs_col = safe_get_column(df, ["batsman_runs", "runs", "runs_off_bat"]) or "batsman_runs"
    dismissal_col = safe_get_column(df, ["dismissal_kind", "player_dismissed", "dismissal"])
    player_dismissed_col = safe_get_column(df, ["player_dismissed", "player_out"])
    match_id_col = safe_get_column(df, ["match_id", "match" , "id"]) or "match_id"
    over_col = safe_get_column(df, ["over", "overs", "inning"]) or "over"
    # extras identification
    wide_col = safe_get_column(df, ["wide", "is_wide"])  # may be boolean/0-1
    noball_col = safe_get_column(df, ["noball", "is_noball"])

    if batsman_col is None or bowler_col is None:
        raise ValueError("Could not find 'batsman' or 'bowler' columns in dataset")

    # Filter rows where batsman faced this bowler
    df_pair = df[(df[batsman_col].astype(str).str.strip().str.lower() == batsman.strip().lower()) &
                 (df[bowler_col].astype(str).str.strip().str.lower() == bowler.strip().lower())]

    # Total balls: exclude wides and no-balls if those columns exist
    if wide_col or noball_col:
        cond_wide = (df_pair[wide_col] == 1) if wide_col and wide_col in df_pair.columns else False
        cond_noball = (df_pair[noball_col] == 1) if noball_col and noball_col in df_pair.columns else False
        legal_balls = df_pair[~(cond_wide | cond_noball)]
        balls_faced = len(legal_balls)
    else:
        balls_faced = len(df_pair)

    # Runs scored by batsman off this bowler
    runs = df_pair[runs_col].astype(float).sum() if runs_col in df_pair.columns else 0

    # Count fours and sixes
    fours = int((df_pair[runs_col] == 4).sum()) if runs_col in df_pair.columns else 0
    sixes = int((df_pair[runs_col] == 6).sum()) if runs_col in df_pair.columns else 0

    # Dot balls
    dot_balls = int((df_pair[runs_col] == 0).sum()) if runs_col in df_pair.columns else 0

    # Dismissals by this bowler of this batsman
    dismissals = 0
    dismissal_types = {}
    if player_dismissed_col and player_dismissed_col in df_pair.columns and dismissal_col in df_pair.columns:
        # Cases where player_dismissed equals batsman
        dismissed_rows = df_pair[df_pair[player_dismissed_col].astype(str).str.strip().str.lower() == batsman.strip().lower()]
        dismissals = len(dismissed_rows)
        for kind in dismissed_rows[dismissal_col].fillna("unknown"):
            k = str(kind)
            dismissal_types[k] = dismissal_types.get(k, 0) + 1

    # Highest runs in a single match vs this bowler
    highest_single = 0
    if match_id_col in df_pair.columns and runs_col in df_pair.columns:
        grouped = df_pair.groupby(match_id_col)[runs_col].sum()
        if not grouped.empty:
            highest_single = int(grouped.max())

    # Pressure phase breakdown
    powerplay_mask = df_pair[over_col].astype(float).between(1, 6, inclusive="both") if over_col in df_pair.columns else None
    middle_mask = df_pair[over_col].astype(float).between(7, 15, inclusive="both") if over_col in df_pair.columns else None
    death_mask = df_pair[over_col].astype(float).between(16, 50, inclusive="both") if over_col in df_pair.columns else None

    def phase_stats(mask):
        if mask is None:
            return {"balls": 0, "runs": 0, "fours": 0, "sixes": 0}
        sub = df_pair[mask]
        b = len(sub)
        r = sub[runs_col].astype(float).sum() if runs_col in sub.columns else 0
        f = int((sub[runs_col] == 4).sum()) if runs_col in sub.columns else 0
        s = int((sub[runs_col] == 6).sum()) if runs_col in sub.columns else 0
        return {"balls": int(b), "runs": int(r), "fours": f, "sixes": s}

    powerplay = phase_stats(powerplay_mask)
    middle = phase_stats(middle_mask)
    death = phase_stats(death_mask)

    # Basic probabilities
    prob_out = (dismissals / balls_faced) if balls_faced > 0 else 0.0
    prob_four = (fours / balls_faced) if balls_faced > 0 else 0.0
    prob_six = (sixes / balls_faced) if balls_faced > 0 else 0.0
    prob_dot = (dot_balls / balls_faced) if balls_faced > 0 else 0.0
    prob_survive_over = ((balls_faced - dismissals) / balls_faced) if balls_faced > 0 else 0.0

    # Strike rate
    strike_rate = (runs / balls_faced * 100) if balls_faced > 0 else 0.0

    # Assemble highlights
    highlights = []
    if dismissals > 0:
        highlights.append(f"{bowler} dismissed {batsman} {dismissals} time(s)")
    if fours > 0 or sixes > 0:
        highlights.append(f"{batsman} hit {fours} fours and {sixes} sixes off {bowler}")
    if highest_single > 0:
        highlights.append(f"Highest score vs {bowler}: {highest_single}")

    result = {
        "batsman": batsman,
        "bowler": bowler,
        "balls_faced": int(balls_faced),
        "runs": int(runs),
        "fours": int(fours),
        "sixes": int(sixes),
        "dot_balls": int(dot_balls),
        "dismissals": int(dismissals),
        "dismissal_types": dismissal_types,
        "strike_rate": round(strike_rate, 2),
        "highest_single": int(highest_single),
        "probabilities": {
            "out": round(prob_out, 4),
            "four": round(prob_four, 4),
            "six": round(prob_six, 4),
            "dot": round(prob_dot, 4),
            "survive_over": round(prob_survive_over, 4)
        },
        "phases": {
            "powerplay": powerplay,
            "middle": middle,
            "death": death
        },
        "highlights": highlights
    }

    return result


def detect_player_role(name: str) -> str:
    """Detect approximate role for a player using the ball-by-ball dataset and players1.csv if available.

    Returns one of: 'Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper-batsman'
    """
    name_l = name.strip().lower()

    # 1) Prefer the aggregated catalog if available
    try:
        catalog = build_player_catalog()
        if name in catalog:
            return catalog[name].get('role', 'Unknown')
        # try matching normalized keys
        if name_l in (n.strip().lower() for n in catalog.keys()):
            for n in catalog.keys():
                if n.strip().lower() == name_l:
                    return catalog[n].get('role', 'Unknown')
    except Exception:
        # catalog build may fail silently; continue to other heuristics
        pass

    # 2) Try ball-by-ball if present (but do not raise if missing)
    batted = 0
    bowled = 0
    try:
        df = load_ball_data()
        batsman_col = safe_get_column(df, ["batsman", "batsman_name"])
        bowler_col = safe_get_column(df, ["bowler", "bowler_name"])
        if batsman_col and batsman_col in df.columns:
            try:
                batted = int((df[batsman_col].astype(str).str.strip().str.lower() == name_l).sum())
            except Exception:
                batted = 0
        if bowler_col and bowler_col in df.columns:
            try:
                bowled = int((df[bowler_col].astype(str).str.strip().str.lower() == name_l).sum())
            except Exception:
                bowled = 0
    except FileNotFoundError:
        # no ball-by-ball dataset — we'll fall back to players1.csv and catalog
        pass
    except Exception:
        pass

    # 3) Use players1.csv for bowling skill / runs hints
    base = os.path.join(os.path.dirname(__file__), "data")
    players_path = os.path.join(base, "players1.csv")
    bowling_skill = None
    runs_approx = 0
    if os.path.exists(players_path):
        try:
            pdf = pd.read_csv(players_path)
            # find best name column
            name_col = None
            for col in ['Player_Name', 'Player', 'Player Name', 'Player_Name ']:
                if col in pdf.columns:
                    name_col = col; break
            if name_col:
                row = pdf[pdf[name_col].astype(str).str.strip().str.lower() == name_l]
                if not row.empty:
                    if 'Bowling_Skill' in row.columns:
                        bowling_skill = str(row.iloc[0].get('Bowling_Skill') or '').strip()
                    for c in ['Runs', 'Total Runs', 'Runs_scored', 'Runs_Scored', 'Runs_All']:
                        if c in row.columns:
                            try:
                                runs_approx = int(row.iloc[0].get(c) or 0)
                            except Exception:
                                runs_approx = 0
                            break
        except Exception:
            pass

    # 4) Heuristics combining gathered signals
    if batted > 0 and bowled > 0:
        return 'All-rounder'
    if bowled > 0:
        return 'Bowler'
    if batted > 0:
        keeper_keywords = ['saha', 'pant', 'dhoni', 'bairstow', 'de kock', 'wade', 'buttler', 'malik', 'nicholas']
        if (bowling_skill is None or bowling_skill.upper() in ('', 'NULL', 'NAN')) and any(k in name_l for k in keeper_keywords):
            return 'Wicketkeeper-batsman'
        return 'Batsman'

    # use players1.csv hints
    if bowling_skill and bowling_skill.upper() not in ('', 'NULL', 'NAN'):
        if runs_approx > 0:
            return 'All-rounder'
        return 'Bowler'
    if runs_approx > 0:
        return 'Batsman'

    return 'Unknown'


def search_players(query: str = None, limit: int = 50):
    """Search batsmen and bowlers matching query and return simple profiles.

    Returns list of dicts: {name, role, has_batted, has_bowled}
    """
    df = load_ball_data()
    batsman_col = safe_get_column(df, ["batsman", "batsman_name"])
    bowler_col = safe_get_column(df, ["bowler", "bowler_name"])
    if batsman_col is None or bowler_col is None:
        raise ValueError('Dataset missing batsman/bowler columns')

    batsmen = df[batsman_col].dropna().astype(str).str.strip().unique().tolist()
    bowlers = df[bowler_col].dropna().astype(str).str.strip().unique().tolist()

    names = set(batsmen) | set(bowlers)
    q = (query or '').strip().lower()
    results = []
    for name in sorted(names):
        if q and q not in name.lower():
            continue
        has_batted = name in batsmen
        has_bowled = name in bowlers
        role = detect_player_role(name)
        results.append({"name": name, "role": role, "has_batted": has_batted, "has_bowled": has_bowled})
        if len(results) >= limit:
            break
    return results


@lru_cache(maxsize=1)
def build_player_catalog():
    """Build a lightweight player catalog from available aggregated CSVs under the 'IPL Dataset' folder.

    The catalog maps player name -> summary stats (career runs, wickets) and inferred role hints.
    This is used as a fallback when ball-by-ball data is unavailable.
    """
    base = os.path.join(os.path.dirname(__file__), "data")
    catalog = {}

    # attempt to load All Seasons Combined aggregated files
    asc_dir = os.path.join(base, "IPL Dataset", "IPL - Player Performance Dataset", "All Seasons Combined")
    if os.path.exists(asc_dir):
        # Most Runs All Seasons Combine.csv
        runs_path = os.path.join(asc_dir, "Most Runs All Seasons Combine.csv")
        if os.path.exists(runs_path):
            try:
                dr = pd.read_csv(runs_path)
                if 'Player' in dr.columns or 'Player Name' in dr.columns or 'Player_Name' in dr.columns:
                    name_col = 'Player' if 'Player' in dr.columns else ('Player Name' if 'Player Name' in dr.columns else 'Player_Name')
                    runs_col = None
                    for c in ['Runs','Total Runs','Runs_scored','Runs_Scored','Runs_All']:
                        if c in dr.columns:
                            runs_col = c; break
                    if runs_col is None:
                        # fallback to second numeric column
                        numeric_cols = dr.select_dtypes(include=['number']).columns
                        runs_col = numeric_cols[0] if len(numeric_cols)>0 else None
                    if runs_col:
                        for _, r in dr.iterrows():
                            name = str(r.get(name_col) or '').strip()
                            if not name: continue
                            runs = int(r.get(runs_col) or 0)
                            ent = catalog.get(name, {})
                            ent['runs_all_seasons'] = runs
                            catalog[name] = ent
            except Exception:
                pass

        # Most Wickets All Seasons Combine.csv
        wk_path = os.path.join(asc_dir, "Most Wickets All Seasons Combine.csv")
        if os.path.exists(wk_path):
            try:
                dw = pd.read_csv(wk_path)
                name_col = 'Player' if 'Player' in dw.columns else ('Player Name' if 'Player Name' in dw.columns else ('Player_Name' if 'Player_Name' in dw.columns else None))
                wickets_col = None
                for c in ['Wickets','Total Wickets','Wickets_All']:
                    if c in dw.columns:
                        wickets_col = c; break
                if wickets_col is None:
                    numeric_cols = dw.select_dtypes(include=['number']).columns
                    wickets_col = numeric_cols[0] if len(numeric_cols)>0 else None
                if name_col and wickets_col:
                    for _, r in dw.iterrows():
                        name = str(r.get(name_col) or '').strip()
                        if not name: continue
                        wk = int(r.get(wickets_col) or 0)
                        ent = catalog.get(name, {})
                        ent['wickets_all_seasons'] = wk
                        catalog[name] = ent
            except Exception:
                pass

    # fallback: parse other aggregated folders to enrich catalog (Most Runs / Most Wickets directories)
    dataset_root = os.path.join(base, "IPL Dataset", "IPL - Player Performance Dataset")
    if os.path.exists(dataset_root):
        # scan known files that include player names and simple metrics
        patterns = [
            os.path.join(dataset_root, '**', '*Most Runs*.csv'),
            os.path.join(dataset_root, '**', '*Most Wickets*.csv'),
            os.path.join(dataset_root, '**', '*Most Sixes*.csv'),
            os.path.join(dataset_root, '**', '*Most Fours*.csv')
        ]
        for pat in patterns:
            for path in glob.glob(pat, recursive=True):
                try:
                    df = pd.read_csv(path)
                    # heuristics: find a player name column and a numeric stat
                    potential_name = None
                    for col in ['Player','Player Name','Player_Name','Name']:
                        if col in df.columns:
                            potential_name = col; break
                    if not potential_name:
                        continue
                    num_cols = df.select_dtypes(include=['number']).columns
                    stat_col = num_cols[0] if len(num_cols)>0 else None
                    if not stat_col:
                        continue
                    for _, r in df.iterrows():
                        name = str(r.get(potential_name) or '').strip()
                        if not name: continue
                        val = int(r.get(stat_col) or 0)
                        ent = catalog.get(name, {})
                        # add generic stat bucket
                        bucket = ent.get('stats', {})
                        bucket_key = os.path.basename(path).replace('.csv','')
                        bucket[bucket_key] = int(val)
                        ent['stats'] = bucket
                        catalog[name] = ent
                except Exception:
                    continue

    # incorporate players1.csv bowling info if present
    players_path = os.path.join(base, 'players1.csv')
    if os.path.exists(players_path):
        try:
            pdf = pd.read_csv(players_path)
            for _, r in pdf.iterrows():
                name = str(r.get('Player_Name') or '').strip()
                if not name: continue
                ent = catalog.get(name, {})
                bowling_skill = str(r.get('Bowling_Skill') or '').strip()
                ent['bowling_skill'] = bowling_skill
                # mark common wicketkeepers explicitly to avoid mislabeling
                keeper_keywords = ['saha', 'pant', 'dhoni', 'bairstow', 'de kock', 'wade', 'buttler', 'malik', 'nicholas']
                name_l = name.strip().lower()
                if any(k in name_l for k in keeper_keywords):
                    ent['role'] = 'Wicketkeeper-batsman'
                catalog[name] = ent
        except Exception:
            pass

    # compute inferred role for catalog entries
    for name, ent in list(catalog.items()):
        role = ent.get('role')
        if not role:
            runs = ent.get('runs_all_seasons', 0)
            wk = ent.get('wickets_all_seasons', 0)
            bowling_skill = ent.get('bowling_skill', '')
            if wk > runs * 0.1 or (bowling_skill and bowling_skill.upper() != 'NULL'):
                if runs > 0 and wk > 0:
                    role = 'All-rounder'
                else:
                    role = 'Bowler' if wk > 0 else 'Batsman'
            else:
                role = 'Batsman' if runs > 0 else 'Unknown'
        ent['role'] = role
        catalog[name] = ent

    return catalog


def compute_pvp_from_aggregates(batsman: str, bowler: str) -> Dict[str, Any]:
    """Compute PVP stats from aggregated CSV datasets (Most Runs, Most Wickets, Economy, Strike Rate, etc.)."""
    base = os.path.join(os.path.dirname(__file__), "data")
    batsman_l = batsman.strip().lower()
    bowler_l = bowler.strip().lower()
    
    # Batsman stats
    batsman_runs = 0
    batsman_matches = 0
    batsman_avg = 0.0
    batsman_sr = 0.0
    batsman_hundreds = 0
    batsman_fifties = 0
    batsman_fours = 0
    batsman_sixes = 0
    batsman_fastest_century = None
    batsman_fastest_fifty = None
    
    # Bowler stats
    bowler_wickets = 0
    bowler_matches = 0
    bowler_economy = 0.0
    bowler_sr = 0.0
    bowler_avg = 0.0
    bowler_4w = 0
    bowler_5w = 0
    bowler_best_econ = None
    bowler_best_sr = None
    
    # Read Most Runs for batsman
    try:
        runs_path = os.path.join(base, "Most Runs All Seasons Combine.csv")
        if os.path.exists(runs_path):
            df_runs = pd.read_csv(runs_path)
            for col in ['Player', 'Player Name', 'Player_Name']:
                if col in df_runs.columns:
                    match_rows = df_runs[df_runs[col].astype(str).str.strip().str.lower() == batsman_l]
                    if not match_rows.empty:
                        row = match_rows.iloc[0]
                        batsman_runs = int(row.get('Runs', 0) or 0)
                        batsman_matches = int(row.get('Mat', 0) or 0)
                        batsman_avg = float(row.get('Avg', 0.0) or 0.0)
                        batsman_sr = float(row.get('SR', 0.0) or 0.0)
                        batsman_hundreds = int(row.get('100', 0) or 0)
                        batsman_fifties = int(row.get('50', 0) or 0)
                        batsman_fours = int(row.get('4s', 0) or 0)
                        batsman_sixes = int(row.get('6s', 0) or 0)
                    break
    except Exception:
        pass
    
    # Read Most Wickets for bowler
    try:
        wk_path = os.path.join(base, "Most Wickets All Seasons Combine.csv")
        if os.path.exists(wk_path):
            df_wk = pd.read_csv(wk_path)
            for col in ['Player', 'Player Name', 'Player_Name']:
                if col in df_wk.columns:
                    match_rows = df_wk[df_wk[col].astype(str).str.strip().str.lower() == bowler_l]
                    if not match_rows.empty:
                        row = match_rows.iloc[0]
                        bowler_wickets = int(row.get('Wkts', 0) or 0)
                        bowler_matches = int(row.get('Mat', 0) or 0)
                        bowler_economy = float(row.get('Econ', 0.0) or 0.0)
                        bowler_sr = float(row.get('SR', 0.0) or 0.0)
                        bowler_avg = float(row.get('Avg', 0.0) or 0.0)
                        bowler_4w = int(row.get('4w', 0) or 0)
                        bowler_5w = int(row.get('5w', 0) or 0)
                    break
    except Exception:
        pass
    
    # Read Fastest Centuries for batsman
    try:
        century_path = os.path.join(base, "Fastest Centuries All Seasons Combine.csv")
        if os.path.exists(century_path):
            df_century = pd.read_csv(century_path)
            for col in ['Player', 'Player Name', 'Player_Name']:
                if col in df_century.columns:
                    match_rows = df_century[df_century[col].astype(str).str.strip().str.lower() == batsman_l]
                    if not match_rows.empty:
                        row = match_rows.iloc[0]
                        # Try to extract balls faced for fastest century
                        if 'Balls' in row and row['Balls']:
                            batsman_fastest_century = int(row.get('Balls', 0) or 0)
                    break
    except Exception:
        pass
    
    # Read Fastest Fifties for batsman
    try:
        fifty_path = os.path.join(base, "Fastest Fifties All Seasons Combine.csv")
        if os.path.exists(fifty_path):
            df_fifty = pd.read_csv(fifty_path)
            for col in ['Player', 'Player Name', 'Player_Name']:
                if col in df_fifty.columns:
                    match_rows = df_fifty[df_fifty[col].astype(str).str.strip().str.lower() == batsman_l]
                    if not match_rows.empty:
                        row = match_rows.iloc[0]
                        if 'Balls' in row and row['Balls']:
                            batsman_fastest_fifty = int(row.get('Balls', 0) or 0)
                    break
    except Exception:
        pass
    
    # Read Best Bowling Economy for bowler
    try:
        econ_path = os.path.join(base, "Best Bowling Economy Per Innings All Seasons Combine.csv")
        if os.path.exists(econ_path):
            df_econ = pd.read_csv(econ_path)
            for col in ['Player', 'Player Name', 'Player_Name']:
                if col in df_econ.columns:
                    match_rows = df_econ[df_econ[col].astype(str).str.strip().str.lower() == bowler_l]
                    if not match_rows.empty:
                        row = match_rows.iloc[0]
                        if 'Economy' in row and row['Economy']:
                            bowler_best_econ = float(row.get('Economy', 0.0) or 0.0)
                    break
    except Exception:
        pass
    
    # Read Best Bowling Strike Rate for bowler
    try:
        sr_path = os.path.join(base, "Best Bowling Strike Rate Per Innings All Seasons Combine.csv")
        if os.path.exists(sr_path):
            df_sr = pd.read_csv(sr_path)
            for col in ['Player', 'Player Name', 'Player_Name']:
                if col in df_sr.columns:
                    match_rows = df_sr[df_sr[col].astype(str).str.strip().str.lower() == bowler_l]
                    if not match_rows.empty:
                        row = match_rows.iloc[0]
                        if 'Strike Rate' in row and row['Strike Rate']:
                            bowler_best_sr = float(row.get('Strike Rate', 0.0) or 0.0)
                    break
    except Exception:
        pass
    
    # Compute compatibility and insights
    insights = []
    
    # Batsman vs Bowler matchup insights
    if batsman_sr > 130 and bowler_economy < 7.5:
        insights.append(f"Aggressive batsman vs economical bowler - competitive matchup")
    elif batsman_sr < 110 and bowler_economy > 8.5:
        insights.append(f"Conservative batsman vs expensive bowler - advantage batsman")
    elif batsman_sr < 110 and bowler_economy < 7.0:
        insights.append(f"Conservative batsman vs tight bowler - advantage bowler")
    
    if batsman_hundreds > 0 and bowler_wickets > 10:
        insights.append(f"{batsman} has {batsman_hundreds} centuries vs {bowler}'s {bowler_wickets} career wickets")
    
    if bowler_sr < 16:
        insights.append(f"{bowler} is a high-pressure bowler (SR: {bowler_sr:.1f})")
    elif bowler_sr > 22:
        insights.append(f"{bowler} bowls with good economy but takes time to get wickets")
    
    result = {
        "batsman": batsman,
        "bowler": bowler,
        "batsman_stats": {
            "runs": batsman_runs,
            "matches": batsman_matches,
            "average": round(batsman_avg, 2),
            "strike_rate": round(batsman_sr, 2),
            "centuries": batsman_hundreds,
            "fifties": batsman_fifties,
            "fours": batsman_fours,
            "sixes": batsman_sixes,
            "fastest_century_balls": batsman_fastest_century,
            "fastest_fifty_balls": batsman_fastest_fifty
        },
        "bowler_stats": {
            "wickets": bowler_wickets,
            "matches": bowler_matches,
            "economy": round(bowler_economy, 2),
            "strike_rate": round(bowler_sr, 2),
            "average": round(bowler_avg, 2),
            "4_wicket_hauls": bowler_4w,
            "5_wicket_hauls": bowler_5w,
            "best_economy": bowler_best_econ,
            "best_strike_rate": bowler_best_sr
        },
        "compatibility": {
            "insights": insights,
            "overall_message": f"{batsman}'s SR ({batsman_sr:.1f}) vs {bowler}'s Economy ({bowler_economy:.2f}) - competitive matchup"
        }
    }
    
    return result


def get_player_profile(name: str) -> Dict[str, Any]:
    """Return an enriched player profile from the catalog if available."""
    catalog = build_player_catalog()
    n = name.strip()
    if n in catalog:
        out = dict(catalog[n])
        out['name'] = n
        return out

    # fallback to detect role and minimal info
    role = detect_player_role(n)
    return {"name": n, "role": role}
