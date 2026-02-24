# 🏏 Wicketly.AI - Cricket Analytics & Prediction Platform

> **Let's Change The Cricket Future**
>
> An advanced AI-powered cricket analytics platform that provides real-time match predictions, player statistics, team analysis, and interactive match predictions for Indian Premier League (IPL) cricket.

---

## ⭐ Project Overview

**Wicketly.AI** is a comprehensive full-stack web application designed to revolutionize cricket analytics and predictions. Leveraging machine learning models and advanced data analysis, the platform delivers accurate match predictions, performance insights, and an engaging user experience for cricket enthusiasts and analysts worldwide.

The platform combines a modern React frontend with a robust Flask/FastAPI backend to deliver powerful cricket prediction capabilities powered by machine learning.

### 🏠 Homepage
![Wicketly.AI Homepage](docs/images/1hompage.png)

---

## ✨ Key Features

### 🎯 Core Features
- **AI-Powered Match Predictions** — Accurately predict match outcomes, winners, and win probabilities using advanced ML models
- **Real-Time Analytics** — Comprehensive player statistics, bowling economy rates, strike rates, and performance metrics
- **Interactive Match Input** — User-friendly interface to input match conditions and receive instant predictions
- **Live Leaderboards** — Track top scorers, bowlers, and team standings with real-time updates
- **Team Management** — Complete IPL franchises data with captains, coaches, and performance statistics
- **Player Performance Analysis** — Detailed batting averages, bowling figures, and historical performance trends
- **Match Highlights** — Video highlights and key moments from matches
- **Wicket Analysis** — Predictive analysis for expected wickets based on match conditions
- **Venue-Based Insights** — Stadium-specific performance data and home advantage analysis
- **Weather Integration** — Weather condition tracking and impact on match outcomes

### 🌟 Platform Capabilities
- **Multi-Format Cricket Support** — IPL Portal (Available Now), T20 Cricket (Coming Soon), ODI Cricket (Coming Soon)
- **Fan Community** — Connect with fellow cricket enthusiasts and share predictions
- **Mobile-Ready Design** — Responsive interface accessible on all devices
- **Performance Scoring** — Detailed performance metrics for all teams and players
- **User Authentication** — Secure login and personalized user profiles

![Why Choose Wicketly.AI?](docs/images/4features.png)

---

## 🏛️ System Architecture

### Architecture Overview
```
┌─────────────────────────────────────────────────────┐
│               Frontend Layer (React)                 │
│  ┌───────────────────────────────────────────────┐   │
│  │  • Match Prediction Interface                  │   │
│  │  • Teams & Players Visualization              │   │
│  │  • Real-time Leaderboards                     │   │
│  │  • User Profiles & Authentication             │   │
│  │  • Data Visualization (Charts & Analytics)    │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│          API Gateway Layer (Flask/FastAPI)          │
│  ┌───────────────────────────────────────────────┐   │
│  │  • REST API Endpoints                         │   │
│  │  • Authentication & Authorization             │   │
│  │  • Request Validation & Error Handling        │   │
│  │  • CORS Configuration                         │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│           Business Logic & ML Models                │
│  ┌───────────────────────────────────────────────┐   │
│  │  • Match Prediction Engine (XGBoost)          │   │
│  │  • Player Statistics Calculator               │   │
│  │  • Wicket Prediction Model                    │   │
│  │  • Performance Scoring Algorithm              │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│              Data Layer (Database)                  │
│  ┌───────────────────────────────────────────────┐   │
│  │  • Unified Database System (SQLAlchemy)       │   │
│  │  • Historical Match Data                      │   │
│  │  • Player Statistics                          │   │
│  │  • Team Information                           │   │
│  │  • User Profiles & Predictions                │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│            Data Sources & Services                  │
│  ┌───────────────────────────────────────────────┐   │
│  │  • Web Scraper (Cricket Data)                 │   │
│  │  • CSV Data Files (Historical Records)        │   │
│  │  • Email Service (Notifications)              │   │
│  │  • External APIs (Weather, Updates)           │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Component Details

#### Frontend Architecture
- **React 18.2** — UI Framework
- **Material-UI (MUI)** — Component Library
- **React Router** — Navigation & Routing
- **Axios** — HTTP Client
- **React Query (TanStack)** — Server State Management
- **Recharts & Chart.js** — Data Visualization
- **Framer Motion** — Animations

#### Backend Architecture
- **Flask** — Web Framework (Primary API)
- **FastAPI** — Async API Framework
- **SQLAlchemy** — ORM for Database
- **XGBoost** — ML Prediction Models
- **Scikit-learn** — Machine Learning Library
- **Pandas** — Data Processing

---

## 👩‍💻 Tech Stack

### Frontend Stack
- **Framework:** React 18.2.0
- **UI Library:** Material-UI (MUI) 7.3.2
- **Routing:** React Router DOM 7.9.1
- **HTTP Client:** Axios 1.12.2
- **State Management:** React Query (TanStack) 4.35.0
- **Visualization:** 
  - Recharts 3.2.1
  - Chart.js 4.5.0
  - React ChartJS 2 5.3.0
- **Animation:** Framer Motion 12.23.15
- **Icons:** Material-UI Icons 7.3.2
- **Utilities:** Lottie React 2.4.0
- **Build Tool:** React Scripts 5.0.1
- **Testing:** Jest + React Testing Library

### Backend Stack
- **Framework:** Flask + FastAPI
- **Async Server:** Uvicorn
- **Database ORM:** SQLAlchemy
- **Data Processing:** Pandas
- **Machine Learning:** 
  - XGBoost
  - Scikit-learn
  - Joblib (Model Serialization)
- **API Validation:** Pydantic
- **HTTP:** Requests
- **Email:** Email Validator + Custom Email Service
- **CORS:** Flask-CORS

### Database
- **System:** Unified Database System (SQLAlchemy)
- **Type:** SQL-based (PostgreSQL/MySQL compatible)

---

## 🛠️ Installation & Setup

### 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.x or higher) and npm
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **Git** (for version control)
- **Database:** PostgreSQL or MySQL (optional, for production)

### 🚀 Frontend Setup

```bash
# Navigate to frontend directory
cd Project\ Ipl/ipl-frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

The frontend will be available at `http://localhost:3000`

### 🔧 Backend Setup

```bash
# Navigate to backend directory
cd Project\ Ipl/cricket-predictor-advanced/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask API server
python app.py

# OR start FastAPI server
uvicorn api:app --reload
```

The backend API will be available at `http://localhost:5000` (Flask) or `http://localhost:8000` (FastAPI)

### 🔌 Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_APP=app.py
SECRET_KEY=your_secret_key_here

# Database Configuration
DATABASE_URL=sqlite:///cricket_predictor.db
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/cricket_db

# API Configuration
API_HOST=0.0.0.0
API_PORT=5000

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 📖 Usage Guide

### 🏠 Home Page
- Welcome screen with project overview
- Navigation to all major features
- Quick access to prediction and analytics

### 🎯 Match Prediction
**Path:** `localhost:3000/predict`

1. **Enter Match Details**
   - Select Team 1 and Team 2
   - Choose venue/stadium
   - Set weather conditions

2. **Enter Expected Runs**
   - Input Team 1 expected runs
   - Input Team 2 expected runs

3. **Expected Wickets**
   - Set expected wickets lost by each team
   - Set number of overs

4. **Get Prediction**
   - Click "PREDICT MATCH" to see AI prediction
   - View confidence level and detailed analysis
   - Analyze performance scores for both teams

![Match Prediction Interface](docs/images/2match-prediction.png)

### 👥 Teams Page
**Path:** `localhost:3000/teams`

- Browse all 8 IPL franchises:
  - Chennai Super Kings (CSK)
  - Mumbai Indians (MI)
  - Royal Challengers Bengaluru (RCB)
  - Kolkata Knight Riders (KKR)
  - Sunrisers Hyderabad (SRH)
  - Delhi Capitals (DC)
  - Punjab Kings (PBKS)
  - Rajasthan Royals (RR)
- View team captains and coach

![IPL Teams Page](docs/images/3teams-page.png)es
- See team statistics and titles won
- Access team-specific details

### 🏆 Players Page
**Path:** `localhost:3000/players`

- Search for specific players
- View player statistics
- Access historical performance data

### 📊 Analytics Features
- **AI-Powered Analytics** — Deep insights using machine learning
- **Prediction Engine** — Accurate match outcome predictions
- **Live Leaderboards** — Real-time rankings and standings
- **Match Highlights** — Key moments and statistics

---

## 📁 Project Structure

Project Ipl (2)/
└── docs/
    └── images/
        ├── 01-homepage.png
        ├── 02-match-prediction.png
        ├── 03-teams-page.png
        └── 04-features.png        Project Ipl (2)/
        └── docs/
            └── images/
                ├── 01-homepage.png
                ├── 02-match-prediction.png
                ├── 03-teams-page.png
                └── 04-features.png                Project Ipl (2)/
                └── docs/
                    └── images/
                        ├── 01-homepage.png
                        ├── 02-match-prediction.png
                        ├── 03-teams-page.png
                        └── 04-features.png```
Project Ipl/
├── README.md                                 # Main project documentation
├── SOLUTION_SUMMARY.md                       # Solution overview
├── UNIFIED_DATABASE_SYSTEM.md                # Database documentation
├── setup_advanced_project.py                 # Project setup script
│
├── cricket-predictor-advanced/
│   ├── Dockerfile                            # Docker configuration
│   ├── Procfile                              # Deployment configuration
│   │
│   ├── backend/
│   │   ├── app.py                           # Flask main application
│   │   ├── api.py                           # FastAPI endpoints
│   │   ├── model.py                         # ML model implementation
│   │   ├── scraper.py                       # Cricket data scraper
│   │   ├── merge_matches.py                 # Match data merger
│   │   ├── pvp_utils.py                     # Player vs Player utilities
│   │   ├── unified_db.py                    # Database connection
│   │   ├── email_service.py                 # Email notification service
│   │   ├── run_services.py                  # Service runner
│   │   ├── start_apis.py                    # API starter
│   │   ├── requirements.txt                 # Python dependencies
│   │   │
│   │   ├── data/                            # Historical cricket data
│   │   │   ├── Best Bowling Economy Innings - [Years].csv
│   │   │   ├── Best Bowling Strike Rate Innings - [Years].csv
│   │   │   └── ... (other statistical CSVs)
│   │   │
│   │   ├── scripts/                         # Utility scripts
│   │   └── tests/                           # Backend tests
│   │
│   └── ipl-frontend/
│       ├── package.json                     # Node dependencies
│       ├── public/                          # Static assets
│       │   ├── index.html                   # HTML entry point
│       │   ├── manifest.json                # PWA manifest
│       │   └── assets/                      # Images and media
│       │
│       └── src/
│           ├── App.js                       # Main app component
│           ├── index.js                     # React entry point
│           ├── App.css                      # Global styles
│           │
│           ├── pages/                       # Page components
│           │   ├── Home.js
│           │   ├── Matches.js
│           │   ├── Players.js
│           │   ├── Teams.js
│           │   ├── Predict.js
│           │   ├── Points.js
│           │   └── ... (other pages)
│           │
│           ├── components/                  # Reusable components
│           │   ├── Navigation
│           │   ├── Header
│           │   ├── Footer
│           │   ├── Cards
│           │   └── ... (other components)
│           │
│           ├── context/                     # React Context API
│           ├── hooks/                       # Custom hooks
│           ├── data/                        # Static data
│           └── tests/                       # Frontend tests

```

---

## 🎨 Website Features in Action

### 1. **Homepage - Welcome Landing**
- Prominent headline: "Welcome to Wicketly.AI"
- Tagline: "Let's Change The Cricket Future"
- Navigation menu with all features
- User profile section

### 2. **Match Prediction Interface**
- Input team selection dropdowns
- Stadium/venue selection
- Weather condition picker
- Expected runs input fields
- Expected wickets loss input
- Over selection
- Input summary display
- Two action buttons:
  - **PREDICT MATCH** — Get AI-powered prediction
  - **ANALYZE WICKETS** — Detailed wicket analysis
- Prediction results with:
  - Predicted winner with green badge
  - Win probability percentage
  - Performance scores for both teams
  - Confidence level indicator

### 3. **Teams Page**
- Grid layout of 8 IPL teams
- Each team card includes:
  - Team logo/branding
  - Team name
  - City/location
  - Captain name
  - Head coach
  - Number of titles won
  - Top scorers and bowlers
  - "View Details" button

### 4. **Features Section**
Six major feature cards:
- **📊 AI-Powered Analytics** — Advanced ML algorithms analyze cricket data
- **🎯 Prediction Engine** — Get match predictions and forecasts
- **👥 Fan Community** — Connect with fellow enthusiasts
- **🏆 Live Leaderboard** — Real-time player rankings
- **🎬 Match Highlights** — Video highlights and key moments
- **📱 Mobile App** — Coming Soon

### 5. **Cricket Formats**
Three format options:
- **IPL Portal** — Available Now (Full functionality)
- **T20 Cricket** — Coming Soon
- **ODI Cricket** — Coming Soon

---

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
cd ipl-frontend
npm start
```

**Terminal 2 - Backend (Flask):**
```bash
cd backend
python app.py
```

**Terminal 3 - Backend (FastAPI, Optional):**
```bash
cd backend
uvicorn api:app --reload
```

### Production Build

**Frontend:**
```bash
cd ipl-frontend
npm run build
# Serve build folder with a static server
```

**Backend:**
```bash
cd backend
# Set FLASK_ENV=production
gunicorn wsgi:app
```

---

## 🔌 API Endpoints

### Match Prediction API
- `POST /api/predict` — Get match prediction
- `POST /api/analyze-wickets` — Analyze expected wickets

### Team Management
- `GET /api/teams` — Get all IPL teams
- `GET /api/teams/<team_id>` — Get specific team details

### Player Statistics
- `GET /api/players` — Get all players
- `GET /api/players/<player_id>` — Get player details

### Match Data
- `GET /api/matches` — Get match history
- `POST /api/matches/merge` — Merge match data

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/wicketly-ai.git
   cd wicketly-ai
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, well-documented code
   - Follow existing code style
   - Add tests for new features

4. **Commit Your Changes**
   ```bash
   git commit -m "Add: Brief description of changes"
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Describe your changes in detail
   - Link any related issues
   - Ensure all tests pass

### Code Standards
- Follow PEP 8 for Python
- Follow ESLint for JavaScript/React
- Write meaningful commit messages
- Add comments for complex logic

---

## 🐛 Troubleshooting & Issues

### Common Issues

**Issue:** Port 3000 already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or run on different port
PORT=3001 npm start
```

**Issue:** Backend API not responding
- Ensure Flask/FastAPI server is running
- Check API URL in frontend environment
- Verify CORS is enabled in backend

**Issue:** Database connection error
- Check DATABASE_URL in .env file
- Ensure database server is running
- Verify credentials are correct

### Getting Help

If you encounter issues:
1. Check existing [Issues](https://github.com/yourusername/wicketly-ai/issues)
2. Review [Documentation](./SOLUTION_SUMMARY.md)
3. Create a new issue with:
   - Clear description of problem
   - Steps to reproduce
   - Error messages/logs
   - Your environment (OS, Node/Python versions)

---

## 📝 License

This project is distributed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---

## 🙏 Acknowledgments

- **Data Sources:**
  - Cricket statistics and historical data
  - IPL team information
  - Player performance metrics

- **Tools & Libraries:**
  - React & Material-UI teams
  - Flask & FastAPI communities
  - XGBoost & Scikit-learn maintainers

- **Contributors:**
  - All team members who contributed to this project
  - Community members providing feedback

---

## 📞 Contact & Support

- **Email:** support@wicketly.ai
- **Documentation:** See [docs](./SOLUTION_SUMMARY.md)
- **Report Issues:** [GitHub Issues](https://github.com/yourusername/wicketly-ai/issues)

---

## 🚀 Future Roadmap

- [ ] T20 Cricket Format Support
- [ ] ODI Cricket Format Support
- [ ] Mobile App (iOS & Android)
- [ ] Live Streaming Integration
- [ ] Advanced Player Analytics
- [ ] Team Statistics Dashboard
- [ ] Custom Predictions API
- [ ] Blockchain-based Leaderboards
- [ ] Multi-language Support
- [ ] Voice-based Predictions

---

<div align="center">

**Made with ❤️ for Cricket Enthusiasts**

⭐ If you find this project helpful, please consider giving it a star!

[GitHub](https://github.com/yourusername/wicketly-ai) • [Website](https://wicketly.ai) • [Issues](https://github.com/yourusername/wicketly-ai/issues)

</div>
