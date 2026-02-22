import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function PVP() {
  const [batsmen, setBatsmen] = useState([]);
  const [bowlers, setBowlers] = useState([]);
  const [batsman, setBatsman] = useState('');
  const [bowler, setBowler] = useState('');
  const [batsmanOptions, setBatsmanOptions] = useState([]);
  const [bowlerOptions, setBowlerOptions] = useState([]);
  const [batsmanValue, setBatsmanValue] = useState(null);
  const [bowlerValue, setBowlerValue] = useState(null);
  const [batsmanProfile, setBatsmanProfile] = useState(null);
  const [bowlerProfile, setBowlerProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/pvp/players')
      .then(res => {
        setBatsmen(res.data.batsmen || []);
        setBowlers(res.data.bowlers || []);
        // populate initial options so users see choices before typing
        const bi = (res.data.batsmen || []).map(n => ({ label: n, role: '', has_bowled: true, has_batted: true }));
        const bo = (res.data.bowlers || []).map(n => ({ label: n, role: '', has_bowled: true, has_batted: true }));
        setBatsmanOptions(bi);
        setBowlerOptions(bo);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  // async suggestions (debounced)
  const batsmanTimerRef = React.useRef(null);
  const bowlerTimerRef = React.useRef(null);

  const fetchSuggestions = (q, type = 'batsman') => {
    if (!q || q.length < 1) {
      if (type === 'batsman') setBatsmanOptions([]);
      else setBowlerOptions([]);
      return;
    }
    axios.get('http://127.0.0.1:8000/pvp/search', { params: { q, limit: 50, role: type } })
      .then(res => {
        const items = (res.data.results || []).map(r => ({ label: r.name, role: r.role, has_bowled: r.has_bowled, has_batted: r.has_batted }));
        if (type === 'batsman') setBatsmanOptions(items);
        else setBowlerOptions(items);
      })
      .catch(err => {
        console.error('suggestion error', err?.message || err);
      });
  };

  // fetch enriched player profile when selection changes
  useEffect(() => {
    if (!batsmanValue?.label) {
      setBatsmanProfile(null);
      return;
    }
    const name = batsmanValue.label;
    setBatsmanProfile({ loading: true });
    axios.get('http://127.0.0.1:8000/pvp/player', { params: { name } })
      .then(res => {
        setBatsmanProfile({ loading: false, data: res.data.profile });
      })
      .catch(err => {
        setBatsmanProfile({ loading: false, error: err?.response?.data?.detail || err.message });
      });
  }, [batsmanValue]);

  useEffect(() => {
    if (!bowlerValue?.label) {
      setBowlerProfile(null);
      return;
    }
    const name = bowlerValue.label;
    setBowlerProfile({ loading: true });
    axios.get('http://127.0.0.1:8000/pvp/player', { params: { name } })
      .then(res => {
        setBowlerProfile({ loading: false, data: res.data.profile });
      })
      .catch(err => {
        setBowlerProfile({ loading: false, error: err?.response?.data?.detail || err.message });
      });
  }, [bowlerValue]);

  const fetchPVP = () => {
    // use selected option objects (enforced selection)
    const batsmanName = batsmanValue?.label || '';
    const bowlerName = bowlerValue?.label || '';
    if (!batsmanName || !bowlerName) { setError('Please choose both players from the suggestions'); return; }
    if (batsmanName === bowlerName) { setError('Select two different players'); return; }
    if (!bowlerValue?.has_bowled) { setError('Selected player has not bowled in IPL matches'); return; }

    setLoading(true);
    setError(null);
    axios.get('http://127.0.0.1:8000/pvp', { params: { batsman: batsmanName, bowler: bowlerName } })
      .then(res => {
        setData(res.data.data || null);
        setLoading(false);
      })
      .catch(err => {
        setError(err?.response?.data?.detail || err.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: 28, background: 'transparent', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ color: '#0b2545' }}>Player vs Player (PVP) Matchups</h2>
        <p style={{ color: '#666' }}>Select a batsman and bowler to see historical matchup stats (2008–2024).</p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Autocomplete
              options={batsmanOptions}
              getOptionLabel={(opt) => opt.label || ''}
              value={batsmanValue}
              onChange={(e, newVal) => setBatsmanValue(newVal)}
              inputValue={batsman}
              onInputChange={(e, newInput) => {
                setBatsman(newInput);
                if (batsmanTimerRef.current) clearTimeout(batsmanTimerRef.current);
                batsmanTimerRef.current = setTimeout(() => fetchSuggestions(newInput, 'batsman'), 300);
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{option.label}</span>
                    <small style={{ color: '#666' }}>{option.role}</small>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Batsman" variant="outlined" fullWidth />
              )}
            />
          </div>

          <div style={{ flex: 1 }}>
            <Autocomplete
              options={bowlerOptions}
              getOptionLabel={(opt) => opt.label || ''}
              value={bowlerValue}
              onChange={(e, newVal) => setBowlerValue(newVal)}
              inputValue={bowler}
              onInputChange={(e, newInput) => {
                setBowler(newInput);
                if (bowlerTimerRef.current) clearTimeout(bowlerTimerRef.current);
                bowlerTimerRef.current = setTimeout(() => fetchSuggestions(newInput, 'bowler'), 300);
              }}
              renderOption={(props, option) => (
                <li {...props}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{option.label}</span>
                    <small style={{ color: '#666' }}>{option.role}</small>
                  </div>
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Select Bowler" variant="outlined" fullWidth />
              )}
            />
          </div>

          <button
            onClick={fetchPVP}
            disabled={!batsmanValue || !bowlerValue || loading}
            style={{ padding: '10px 16px', background: '#0072ff', color: '#fff', border: 'none', borderRadius: 6, opacity: (!batsmanValue || !bowlerValue || loading) ? 0.6 : 1, cursor: (!batsmanValue || !bowlerValue || loading) ? 'not-allowed' : 'pointer' }}
          >
            Compare
          </button>
        </div>

        {/* Selected player preview */}
        {(batsmanValue || bowlerValue) && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 8, minHeight: 56 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Batsman</div>
              {batsmanValue ? (
                <div style={{ fontWeight: 700 }}>{batsmanValue.label} <span style={{ fontWeight: 400, color: '#666' }}>— {batsmanValue.role}</span></div>
              ) : (
                <div style={{ color: '#999' }}>No batsman selected</div>
              )}
              {batsmanProfile && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  {batsmanProfile.loading && <div style={{ color: '#666' }}>Loading profile...</div>}
                  {batsmanProfile.error && <div style={{ color: '#b33' }}>{batsmanProfile.error}</div>}
                  {batsmanProfile.data && (
                    <div style={{ color: '#222' }}>
                      {batsmanProfile.data.runs_all_seasons !== undefined && <div>Runs (all seasons): <strong>{batsmanProfile.data.runs_all_seasons}</strong></div>}
                      {batsmanProfile.data.wickets_all_seasons !== undefined && <div>Wickets (all seasons): <strong>{batsmanProfile.data.wickets_all_seasons}</strong></div>}
                      {batsmanProfile.data.bowling_skill && <div>Bowling: <strong>{batsmanProfile.data.bowling_skill}</strong></div>}
                      {batsmanProfile.data.stats && Object.keys(batsmanProfile.data.stats).length > 0 && (
                        <div style={{ marginTop: 6 }}>
                          <div style={{ color: '#666' }}>Top stats:</div>
                          <ul style={{ margin: '6px 0 0 16px' }}>
                            {Object.entries(batsmanProfile.data.stats).slice(0,4).map(([k,v]) => <li key={k}>{k}: {v}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 8, minHeight: 56 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Bowler</div>
              {bowlerValue ? (
                <div style={{ fontWeight: 700 }}>{bowlerValue.label} <span style={{ fontWeight: 400, color: '#666' }}>— {bowlerValue.role}</span></div>
              ) : (
                <div style={{ color: '#999' }}>No bowler selected</div>
              )}
              {bowlerValue && !bowlerValue.has_bowled && (
                <div style={{ color: '#b33', marginTop: 6 }}>This player has no recorded deliveries in the dataset</div>
              )}
              {bowlerProfile && (
                <div style={{ marginTop: 8, fontSize: 13 }}>
                  {bowlerProfile.loading && <div style={{ color: '#666' }}>Loading profile...</div>}
                  {bowlerProfile.error && <div style={{ color: '#b33' }}>{bowlerProfile.error}</div>}
                  {bowlerProfile.data && (
                    <div style={{ color: '#222' }}>
                      {bowlerProfile.data.wickets_all_seasons !== undefined && <div>Wickets (all seasons): <strong>{bowlerProfile.data.wickets_all_seasons}</strong></div>}
                      {bowlerProfile.data.runs_all_seasons !== undefined && <div>Runs (all seasons): <strong>{bowlerProfile.data.runs_all_seasons}</strong></div>}
                      {bowlerProfile.data.bowling_skill && <div>Bowling: <strong>{bowlerProfile.data.bowling_skill}</strong></div>}
                      {bowlerProfile.data.stats && Object.keys(bowlerProfile.data.stats).length > 0 && (
                        <div style={{ marginTop: 6 }}>
                          <div style={{ color: '#666' }}>Top stats:</div>
                          <ul style={{ margin: '6px 0 0 16px' }}>
                            {Object.entries(bowlerProfile.data.stats).slice(0,4).map(([k,v]) => <li key={k}>{k}: {v}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick diagnostics */}
        <div style={{ marginBottom: 8, fontSize: 13, color: '#666' }}>
          <div>Suggestions: Batsman {batsmanOptions.length} | Bowler {bowlerOptions.length}</div>
          <div style={{ color: '#999' }}>If counts are zero, ensure backend `/pvp/search` or `/pvp/players` is reachable.</div>
        </div>

        {error && <div style={{ color: 'red', marginBottom: 12, padding: 12, background: '#ffe6e6', borderRadius: 8 }}>{error}</div>}

        {loading && <div style={{ textAlign: 'center', padding: 24, color: '#666' }}>Loading comparison results...</div>}

        {data && (
          <div style={{ marginTop: 18 }}>
            {/* Handle new aggregate CSV format */}
            {data.batsman_stats && data.bowler_stats && !data.balls_faced && (
              <div>
                <h3 style={{ marginTop: 0, color: '#0b2545' }}>📊 Career Statistics Comparison</h3>
                
                {/* Compatibility Insights */}
                {data.compatibility && (
                  <div style={{ background: '#e8f4f8', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#0b2545' }}>Matchup Analysis</h4>
                    {data.compatibility.insights && (
                      <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                        {(typeof data.compatibility.insights === 'string' 
                          ? data.compatibility.insights.split(' - ')
                          : data.compatibility.insights).map((insight, i) => (
                          <li key={i} style={{ color: '#333', marginBottom: 4 }}>{insight}</li>
                        ))}
                      </ul>
                    )}
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0072ff', marginTop: 8 }}>
                      {data.compatibility.overall_message}
                    </div>
                  </div>
                )}

                {/* Batsman Stats */}
                <div style={{ background: '#f0f8ff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#0b2545' }}>🏏 {data.batsman} (Batsman)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Total Runs</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#0072ff' }}>{data.batsman_stats.runs}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Matches</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.batsman_stats.matches}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Average</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.batsman_stats.average}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Strike Rate</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: data.batsman_stats.strike_rate > 130 ? '#00a86b' : '#666' }}>{data.batsman_stats.strike_rate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Centuries</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.batsman_stats.centuries}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Fifties</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.batsman_stats.fifties}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Fours</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.batsman_stats.fours}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Sixes</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#ff6b6b' }}>{data.batsman_stats.sixes}</div>
                    </div>
                  </div>
                  {data.batsman_stats.fastest_century_balls && (
                    <div style={{ marginTop: 12, fontSize: 13, color: '#333' }}>
                      ⚡ Fastest Century: <strong>{data.batsman_stats.fastest_century_balls} balls</strong>
                    </div>
                  )}
                  {data.batsman_stats.fastest_fifty_balls && (
                    <div style={{ fontSize: 13, color: '#333' }}>
                      ⚡ Fastest Fifty: <strong>{data.batsman_stats.fastest_fifty_balls} balls</strong>
                    </div>
                  )}
                </div>

                {/* Bowler Stats */}
                <div style={{ background: '#fff8f0', padding: 16, borderRadius: 8 }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#0b2545' }}>🎯 {data.bowler} (Bowler)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Total Wickets</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#ff6b6b' }}>{data.bowler_stats.wickets}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Matches</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.bowler_stats.matches}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Economy</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: data.bowler_stats.economy < 7 ? '#00a86b' : '#666' }}>{data.bowler_stats.economy}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Strike Rate</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.bowler_stats.strike_rate}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>Average</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.bowler_stats.average}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>4-Wkt Hauls</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{data.bowler_stats['4_wicket_hauls']}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#666' }}>5-Wkt Hauls</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: data.bowler_stats['5_wicket_hauls'] > 0 ? '#ff6b6b' : '#666' }}>{data.bowler_stats['5_wicket_hauls']}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Handle old ball-by-ball format (fallback) */}
            {data.balls_faced && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
                    <h4 style={{ margin: 0 }}>Balls Faced</h4>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{data.balls_faced}</div>
                  </div>
                  <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
                    <h4 style={{ margin: 0 }}>Runs</h4>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{data.runs}</div>
                  </div>
                  <div style={{ background: '#fff', padding: 16, borderRadius: 8 }}>
                    <h4 style={{ margin: 0 }}>Highest Score</h4>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{data.highest_single}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
                    <div style={{ color: '#666' }}>Fours</div>
                    <div style={{ fontWeight: 700 }}>{data.fours}</div>
                  </div>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
                    <div style={{ color: '#666' }}>Sixes</div>
                    <div style={{ fontWeight: 700 }}>{data.sixes}</div>
                  </div>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
                    <div style={{ color: '#666' }}>Dot Balls</div>
                    <div style={{ fontWeight: 700 }}>{data.dot_balls}</div>
                  </div>
                  <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
                    <div style={{ color: '#666' }}>Dismissals</div>
                    <div style={{ fontWeight: 700 }}>{data.dismissals}</div>
                  </div>
                </div>

                <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 8 }}>
                    <h4>Probabilities</h4>
                    <div>Out: {(data.probabilities.out * 100).toFixed(2)}%</div>
                    <div>Four: {(data.probabilities.four * 100).toFixed(2)}%</div>
                    <div>Six: {(data.probabilities.six * 100).toFixed(2)}%</div>
                    <div>Dot: {(data.probabilities.dot * 100).toFixed(2)}%</div>
                  </div>
                  <div style={{ flex: 1, background: '#fff', padding: 12, borderRadius: 8 }}>
                    <h4>Strike Rate</h4>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{data.strike_rate}</div>
                    <h4 style={{ marginTop: 12 }}>Phases</h4>
                    <div>Powerplay: {data.phases.powerplay.runs} runs ({data.phases.powerplay.balls} balls)</div>
                    <div>Middle: {data.phases.middle.runs} runs ({data.phases.middle.balls} balls)</div>
                    <div>Death: {data.phases.death.runs} runs ({data.phases.death.balls} balls)</div>
                  </div>
                </div>

                <div style={{ marginTop: 18, background: '#fff', padding: 12, borderRadius: 8 }}>
                  <h4>Highlights</h4>
                  {data.highlights.length === 0 ? <div style={{ color: '#666' }}>No highlights</div> : (
                    <ul>
                      {data.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>

                <div style={{ marginTop: 12 }}>
                  <h4>Dismissal Types</h4>
                  {Object.keys(data.dismissal_types).length === 0 ? <div style={{ color: '#666' }}>None recorded</div> : (
                    <ul>
                      {Object.entries(data.dismissal_types).map(([k,v]) => <li key={k}>{k}: {v}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
