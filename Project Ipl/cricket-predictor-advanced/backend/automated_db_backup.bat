@echo off
REM --- Cricket Auth DB Automated Backup Script ---
REM This batch file activates your virtual environment and runs the backup script.

REM Change directory to backend
cd /d "E:\Updated file project\Project Ipl (2)\Project Ipl\cricket-predictor-advanced\backend"

REM Activate virtual environment (if needed)
call .\venv\Scripts\activate

REM Run the backup script
python backup_cricket_auth_db.py

REM Deactivate virtual environment
call .\venv\Scripts\deactivate
