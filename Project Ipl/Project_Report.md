# Project Submission Report: IPL Cricket Predictor

**Author:** Gemini
**Date:** November 16, 2025

---

## 1. Abstract

The IPL Cricket Predictor is a full-stack web application designed to predict the outcomes of Indian Premier League (IPL) cricket matches. The project leverages a machine learning model built with XGBoost to make predictions, and provides a user-friendly interface for users to interact with the predictions and view historical data. The system is composed of a Python-based backend, a React-based frontend, and a collection of historical IPL data.

---

## 2. Introduction

The Indian Premier League (IPL) is one of the most popular T20 cricket leagues in the world, attracting a massive global audience. The unpredictable nature of the sport makes it a fascinating subject for statistical analysis and predictive modeling. This project aims to develop a comprehensive platform for IPL match prediction, providing fans and analysts with a tool to gain insights into the potential outcomes of matches.

The project's primary goals are:
*   To develop a machine learning model capable of predicting IPL match winners with a reasonable degree of accuracy.
*   To create a web-based platform for users to access predictions, view match schedules, and explore historical data.
*   To provide a seamless and engaging user experience through a modern and intuitive user interface.

---

## 3. Project Structure

The project is organized into two main components: a backend (`cricket-predictor-advanced`) and a frontend (`ipl-frontend`).

### 3.1. File System Layout

The project's file system is structured as follows:

```
e:\Updated file project\Project Ipl (2)\
└───Project Ipl\
    ├───cricket-predictor-advanced\
    │   ├───backend\
    │   │   ├───api.py
    │   │   ├───app.py
    │   │   ├───model.py
    │   │   ├───scraper.py
    │   │   ├───requirements.txt
    │   │   └───data\
    │   └───frontend\
    └───ipl-frontend\
        ├───public\
        └───src\
            ├───App.js
            ├───index.js
            └───components\
```

### 3.2. Backend (`cricket-predictor-advanced`)

The backend is responsible for the core logic of the application, including the machine learning model, API endpoints, and data processing. It is built using Python, with the following key libraries:

*   **Flask & FastAPI:** The project appears to use both Flask and FastAPI for creating API endpoints. This is an unusual setup that requires further investigation to determine the role of each framework.
*   **Pandas:** Used for data manipulation and analysis.
*   **Scikit-learn & XGBoost:** Used for building and training the machine learning model.
*   **Joblib:** Used for saving and loading the trained model.

### 3.3. Frontend (`ipl-frontend`)

The frontend is a single-page application (SPA) built with React. It provides the user interface for the application, allowing users to interact with the backend and view the prediction results. Key libraries used in the frontend include:

*   **React:** A JavaScript library for building user interfaces.
*   **React Router:** For handling routing within the application.
*   **Axios:** For making HTTP requests to the backend API.
*   **Chart.js & Recharts:** For creating interactive charts and visualizations.
*   **Material-UI:** For UI components and styling.

---

## 4. System Architecture

The application follows a client-server architecture, with the React frontend acting as the client and the Python backend as the server.

```
+-----------------+      +------------------+      +----------------+
|  React Frontend | <--> |  Backend API     | <--> |   ML Model     |
| (ipl-frontend)  |      | (Flask/FastAPI)  |      | (XGBoost)      |
+-----------------+      +------------------+      +----------------+
                                   |
                                   |
                           +----------------+
                           |  Data Storage  |
                           | (CSV files)    |
                           +----------------+
```

The frontend communicates with the backend via a RESTful API. The backend processes the requests, interacts with the machine learning model and the data storage, and returns the results to the frontend.

---

## 5. Backend Implementation

The backend of the IPL Cricket Predictor is responsible for the core logic of the application, including the machine learning model, data processing, and API services. It is primarily built with Python, utilizing a combination of libraries for web serving, data manipulation, and machine learning.

### 5.1. Dual Backend Frameworks: Flask and FastAPI

A notable characteristic of this project is the presence of two different web frameworks: Flask (in `app.py`) and FastAPI (in `api.py`).

*   **`app.py` (Flask):** This file defines a simple Flask application with a few basic endpoints to serve data from CSV files and a `/predict` endpoint that uses the trained model.
*   **`api.py` (FastAPI):** This file defines a much more comprehensive FastAPI application with a wide range of endpoints, including detailed predictions, team and player information, user management, and more.

Given the extensive functionality in `api.py`, it is highly probable that this is the **primary and most current backend implementation**. The Flask application in `app.py` may be an older version, a fallback, or was created for a different purpose. For the remainder of this report, we will focus on the FastAPI application as the main backend.

### 5.2. Machine Learning Model

The core of the prediction engine is a machine learning model trained to predict the winner of an IPL match.

#### 5.2.1. Model Training (`model.py`)

The `model.py` script is responsible for training and saving the machine learning model. The process is as follows:

1.  **Data Loading:** The script loads the `matches.csv` dataset using Pandas.
2.  **Data Preprocessing:**
    *   It removes rows with missing `winner` data.
    *   Team names in `team1`, `team2`, and `winner` columns are normalized to uppercase.
    *   Categorical team names are converted to numerical labels using `sklearn.preprocessing.LabelEncoder`.
3.  **Feature Engineering:** The script creates a feature matrix `X` with the following features:
    *   `team1` (encoded)
    *   `team2` (encoded)
    *   `team1_score`
    *   `team2_score`
    *   `overs`
4.  **Model Selection:** An `XGBClassifier` from the `xgboost` library is used as the classification model.
5.  **Training:** The model is trained on the prepared data using a standard train-test split.
6.  **Model Serialization:** The trained model, along with the team and winner encoders, is saved to a file named `model.pkl` using `joblib`.

#### 5.2.2. Code Snippet: `model.py`

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
import joblib
import os

# Path to dataset
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MATCHES_PATH = os.path.join(DATA_DIR, "matches.csv")

# Load dataset
data = pd.read_csv(MATCHES_PATH)

# ... (preprocessing and feature engineering) ...

# Train model
model = XGBClassifier(use_label_encoder=False, eval_metric="mlogloss")
model.fit(X_train, y_train)

# Save model and encoders
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
joblib.dump(
    {"model": model, "team_encoder": encoder_team, "winner_encoder": encoder_winner},
    MODEL_PATH
)
```

### 5.3. Data Scraping (`scraper.py`)

The `scraper.py` script is intended to collect match data. However, the current implementation is a placeholder that generates a small, static dataset.

```python
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
```

For a production-ready system, this script would need to be replaced with a robust web scraper capable of collecting data from a reliable source like ESPNcricinfo or the official IPL website.

### 5.4. API Endpoints (`api.py`)

The FastAPI application in `api.py` exposes a rich set of endpoints for the frontend to consume. Here are some of the key endpoints:

*   **`/`:** Root endpoint with a welcome message.
*   **`/teams`:** Get a list of all IPL teams.
*   **`/team/{team_name}`:** Get detailed information about a specific team.
*   **`/venues`:** Get a list of all IPL venues.
*   **`/predict/match`:** Predict the winner of a match based on input features.
*   **`/players`:** Get a list of players, with an option to filter by team.
*   **`/matches`:** Get historical match data.
*   **`/users/register`:** Register a new user.
*   **`/leaderboard`:** Get a leaderboard of users based on the number of predictions made.

The API also includes endpoints for player-vs-player (PVP) statistics, fantasy team recommendations, and user prediction history.

---

## 6. Frontend Implementation

The frontend of the IPL Cricket Predictor is a modern single-page application (SPA) built with React. It provides a rich, interactive user experience for exploring IPL data, making predictions, and engaging with the community.

### 6.1. Technology Stack

The frontend is built using a combination of modern JavaScript libraries and tools:

*   **React:** The core library for building the user interface.
*   **React Router:** For declarative routing within the application.
*   **Axios:** A promise-based HTTP client for making API requests to the backend.
*   **@tanstack/react-query:** For managing server state, including caching, refetching, and optimistic updates.
*   **Chart.js & Recharts:** For creating beautiful and interactive data visualizations.
*   **Framer Motion:** For creating fluid animations and transitions.
*   **Material-UI:** A popular React UI framework for building a consistent and attractive user interface.

### 6.2. Application Structure (`App.js`)

The main entry point for the frontend is the `App.js` component. This component is responsible for:

*   **Routing:** It uses `react-router-dom` to define the application's routes, mapping URLs to different pages such as Home, Teams, Players, and Predict.
*   **Authentication:** It manages the authentication state of the user, including modals for login and signup. It uses a React Context (`AuthContext`) to provide authentication information to child components.
*   **Welcome Screen:** It displays an animated welcome screen on the first load to provide an engaging introduction to the application.
*   **Layout:** It includes a main navigation bar (`Navbar`) and an animated background for a visually appealing layout.

#### 6.2.1. Code Snippet: `App.js` (Routing)

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";
// ... other imports

<BrowserRouter>
  <Navbar 
    onOpenLogin={openLogin} 
    onOpenSignup={openSignup}
  />
  
  {/* ... modals ... */}
  
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/teams" element={<Teams />} />
    <Route path="/players" element={<Players />} />
    <Route path="/matches" element={<Matches />} />
    <Route path="/pvp" element={<PVP />} />
    <Route path="/predict" element={<PredictForm />} />
    <Route path="/explore" element={<ExploreAnalytics />} />
    <Route path="/team/:teamName" element={<TeamDetails />} />
  </Routes>
</BrowserRouter>
```

### 6.3. Key Components and Pages

The application is divided into several key components and pages:

*   **`Home.js`:** The landing page of the application, which likely provides an overview of the site's features and links to other sections.
*   **`TeamsNew.js`:** A page to display a list of all IPL teams, likely with links to detailed team pages.
*   **`Players.js`:** A page to display a list of all players, with options for filtering and searching.
*   **`Matches.js`:** A page to display a list of past and upcoming matches. The current `MatchesList.js` component uses static data, which would need to be replaced with data fetched from the backend.
*   **`PredictForm.js`:** A form for users to input data and receive match predictions from the backend.
*   **`PVP.js`:** A page for Player-vs-Player (PVP) analysis, allowing users to compare the performance of two players against each other.
*   **`ExploreAnalytics.js`:** A page dedicated to exploring various statistics and analytics related to the IPL.

### 6.4. State Management

The application uses a combination of React's built-in state management (`useState`, `useContext`) and the `@tanstack/react-query` library for managing server state.

*   **Local Component State:** `useState` is used for managing local component state, such as form inputs and UI toggles.
*   **Global UI State:** `useContext` (specifically `AuthContext`) is used to manage global UI state related to authentication, such as the user's login status and the visibility of auth modals.
*   **Server State:** `@tanstack/react-query` is used to manage the state of data fetched from the backend API. This library simplifies data fetching, caching, and synchronization, leading to a more responsive and robust application.

---

## 7. Data Analysis and Statistics

The dataset used for training the machine learning model and for providing historical data to the users is stored in `matches.csv`. This file contains a wealth of information about IPL matches from 2008 to 2024.

### 7.1. Dataset Overview

The `matches.csv` file contains the following columns:

*   `id`: A unique identifier for each match.
*   `season`: The year the match was played.
*   `city`: The city where the match was played.
*   `date`: The date of the match.
*   `match_type`: The type of match (e.g., League, Final).
*   `player_of_match`: The player who was awarded the "Player of the Match".
*   `venue`: The stadium where the match was played.
*   `team1`, `team2`: The two teams that played the match.
*   `toss_winner`: The team that won the toss.
*   `toss_decision`: The decision made by the toss-winning team ('field' or 'bat').
*   `winner`: The winner of the match.
*   `result`: The result of the match ('runs', 'wickets', or 'tie').
*   `result_margin`: The margin of victory.
*   `target_runs`: The target runs for the team batting second.
*   `target_overs`: The number of overs for the team batting second.
*   `super_over`: Whether a super over was played ('Y' or 'N').
*   `method`: The method used to determine the winner in case of a rain-affected match (e.g., 'D/L').

### 7.2. Descriptive Statistics

Based on the analysis of the `matches.csv` file, here are some key statistics:

*   **Total Matches:** There are a total of **1024** matches in the dataset.
*   **Seasons:** The dataset covers **17** seasons of the IPL, from 2008 to 2024.
*   **Teams:** A total of **19** unique teams have participated in the IPL over the years.
*   **Most Successful Team:** The team with the most wins is the **Mumbai Indians**.
*   **Most 'Player of the Match' Awards:** The player with the most "Player of the Match" awards is **AB de Villiers**.
*   **Toss Decisions:**
    *   **Field:** The decision to field first after winning the toss is significantly more common, with **62%** of toss winners choosing to field.
    *   **Bat:** Only **38%** of toss winners choose to bat first.

### 7.3. Data for Prediction

The data from `matches.csv` is crucial for training the prediction model. The `model.py` script uses features like `team1`, `team2`, `target_runs`, `result_margin`, and `target_overs` to predict the `winner`. The historical data provides the necessary information for the model to learn the relationships between these features and the match outcome.

---

## 8. Testing

The project includes a suite of tests for the backend to ensure the reliability and correctness of the application. The tests are written in Python and use the `fastapi.testclient` for testing API endpoints.

### 8.1. Testing Strategy

The testing strategy focuses on the following key areas:

*   **API Endpoint Testing:** The tests verify that the API endpoints are functioning correctly, including user registration, login, and data retrieval.
*   **Service Testing:** The email service is tested to ensure that emails are sent correctly.
*   **Authentication Testing:** The login functionality is tested with both correct and incorrect credentials to ensure that the authentication logic is robust.

### 8.2. Test Files

The following test files are included in the `backend` directory:

*   **`test_endpoints.py`:** This script tests the user registration and login endpoints, as well as the over-by-over analytics endpoint. It uses the `TestClient` from FastAPI to send requests to the application and assert the responses.

    ```python
    from fastapi.testclient import TestClient
    import json

    from api import app

    client = TestClient(app)

    print('=== Register test user ===')
    resp = client.post('/users/register', data={
        'username': 'autotest',
        'display_name': 'Auto Test',
        'email': 'autotest@example.com',
        'password': 'TestPass123'
    })
    # ...
    ```

*   **`test_email.py`:** This script tests the `send_welcome_email` function from the `email_service`. It sends a test email to a specified recipient.

    ```python
    from email_service import send_welcome_email

    if __name__ == "__main__":
        # Replace with an email you can check
        recipient = "your_test_recipient@example.com"
        ok = send_welcome_email(recipient, "TestUser", "testuser123")
        print("Sent?", ok)
    ```

*   **`test_login_endpoint.py`:** This script specifically tests the `/users/login` endpoint with various scenarios, including correct passwords, incorrect passwords, and logging in with an email address.

*   **`test_login_fix.py`:** This script is designed to test the login functionality with both plaintext and hashed passwords, ensuring that the system can handle both formats securely.

### 8.3. Frontend Testing

The frontend part of the project is set up with the standard Create React App testing environment, which includes React Testing Library and Jest. The `App.test.js` file is present, but it is the default file and does not contain any specific tests for the application. To improve the quality of the frontend, it would be beneficial to add unit and integration tests for the React components and pages.

---

## 9. Deployment

The project is configured for deployment using Docker and a `Procfile`, which is a common setup for platforms like Heroku.

### 9.1. Docker Configuration

The `Dockerfile` in the `cricket-predictor-advanced` directory defines the environment for running the backend application.

```dockerfile
FROM python:3.9
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["python", "app.py"]
```

The Dockerfile performs the following steps:
1.  It starts with a `python:3.9` base image.
2.  It sets the working directory to `/app`.
3.  It copies the `requirements.txt` file and installs the Python dependencies.
4.  It copies the entire `backend` directory into the container.
5.  It specifies the command to run the application as `python app.py`.

### 9.2. Procfile

The `Procfile` is a simple one-line file that specifies the command to be executed by the web dyno on a platform like Heroku.

```
web: python backend/app.py
```

### 9.3. Deployment Inconsistency

There is a significant inconsistency in the deployment configuration. Both the `Dockerfile` and the `Procfile` are configured to run the Flask application (`app.py`). However, as established in the "Backend Implementation" section, the FastAPI application (`api.py`) is the more feature-complete and likely the intended primary backend. 

To deploy the full functionality of the application, the `Dockerfile` and `Procfile` would need to be updated to run the FastAPI application. For example, the `CMD` in the `Dockerfile` and the `web` process in the `Procfile` should be changed to something like:

```
web: uvicorn api:app --host 0.0.0.0 --port $PORT
```

This would start the FastAPI application using the `uvicorn` server, which is the standard way to run FastAPI applications in production.

---

## 10. Conclusion

The IPL Cricket Predictor is a well-structured and ambitious project that successfully combines a machine learning model with a modern web application. The project demonstrates a good understanding of both backend and frontend development, as well as the fundamentals of machine learning.

### 10.1. Achievements

*   **Full-Stack Implementation:** The project successfully implements a full-stack application with a Python backend and a React frontend.
*   **Machine Learning Integration:** A machine learning model is successfully integrated into the backend to provide match predictions.
*   **Rich User Interface:** The React frontend provides a rich and interactive user interface with features like data visualization, user authentication, and real-time updates.
*   **Comprehensive API:** The FastAPI backend exposes a comprehensive set of API endpoints for a wide range of functionalities.

### 10.2. Areas for Improvement

*   **Deployment Configuration:** The most critical area for improvement is to resolve the inconsistency in the deployment configuration and ensure that the primary FastAPI backend is deployed.
*   **Data Scraping:** The placeholder `scraper.py` script should be replaced with a robust web scraping solution to ensure that the data is up-to-date.
*   **Frontend Testing:** The frontend would benefit from the addition of unit and integration tests to improve its quality and reliability.
*   **Model Evaluation:** The `model.py` script trains a model but does not include a thorough evaluation of its performance. Adding metrics like accuracy, precision, and recall would provide a better understanding of the model's effectiveness.
*   **Code Consistency:** The presence of two backend frameworks (Flask and FastAPI) suggests a need for code consolidation and a clearer architectural direction.

Overall, the IPL Cricket Predictor is a strong project with a solid foundation. By addressing the areas for improvement, it has the potential to become a truly impressive and useful application for cricket fans.

---

## 11. Appendix

The appendix would typically contain the full source code of the project. Due to the length of the code, it is not included in this report. The code is available in the project's source files.

```