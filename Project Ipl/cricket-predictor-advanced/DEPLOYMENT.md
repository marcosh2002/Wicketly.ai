# Railway Deployment Configuration

This project is configured for automatic deployment on Railway.app with Supabase PostgreSQL.

## Setup Instructions

### 1. Supabase Setup (Already Done ✓)
- PostgreSQL database created
- Connection string configured in `.env`

### 2. Railway.app Setup

1. Go to **railway.app** and sign up
2. Click **"Deploy from GitHub"**
3. Select your repository: **marcosh2002/Wicketly.ai**
4. Click **"Deploy Now"**

### 3. Environment Variables on Railway

Railway will automatically detect the `DATABASE_URL` from `.env` file.

1. In Railway Dashboard, go to your project
2. Click **"Variables"**
3. Add these variables:
   ```
   DATABASE_URL=postgresql://postgres:Jiko@95632002@db.jbgrchrnhhvzmnwsqtbs.supabase.co:5432/postgres
   FLASK_ENV=production
   DEBUG=False
   ```

### 4. Deploy

1. Push any commit to GitHub
2. Railway automatically builds and deploys
3. Your app goes LIVE at `https://wicketly-ai-production.up.railway.app`

### 5. Auto-Updates

Every time you push to GitHub:
- Railway automatically detects changes
- Builds the new version
- Deploys without downtime
- **No manual steps needed!**

## Testing Locally

```bash
cd backend
python app.py
```

Visit: `http://localhost:5000`

## API Endpoints

- `GET /` - Health check
- `POST /predict` - Make cricket predictions
- `GET /players` - Get all players
- `GET /matches` - Get all matches
- `GET /headtohead` - Get head-to-head data
- `GET /news` - Get news articles
