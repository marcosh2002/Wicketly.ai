import pandas as pd
from pathlib import Path
p = Path(__file__).resolve().parents[1] / 'data' / 'matches.csv'
print('matches.csv path:', p)
if not p.exists():
    print('File not found')
    raise SystemExit(1)
df = pd.read_csv(p, low_memory=False)
print('Columns:', df.columns.tolist())
for col in ['toss_decision','result_margin','toss_winner','team1','team2','id','winner']:
    print('\nColumn:', col)
    if col in df.columns:
        s = df[col]
        print('  Non-null count:', s.count(), ' Total rows:', len(s))
        try:
            print('  Sample values:', s.dropna().unique()[:10])
        except Exception as e:
            print('  Sample read error:', e)
    else:
        print('  Not present')
print('\nUnique toss_decision value counts:')
if 'toss_decision' in df.columns:
    print(df['toss_decision'].value_counts().head(20))
print('\nExample result_margin head:')
if 'result_margin' in df.columns:
    print(df['result_margin'].head(20))
