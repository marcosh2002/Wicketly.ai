# Database Backup Script for cricket_auth.db
# This script will create a timestamped backup of your cricket_auth.db file in a backups/ directory.

import os
import shutil
from datetime import datetime

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'cricket_auth.db')
BACKUP_DIR = os.path.join(BASE_DIR, 'backups')

# Ensure backup directory exists
os.makedirs(BACKUP_DIR, exist_ok=True)

def backup_db():
    if not os.path.exists(DB_FILE):
        print('Database file not found:', DB_FILE)
        return
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_file = os.path.join(BACKUP_DIR, f'cricket_auth_{timestamp}.db')
    shutil.copy2(DB_FILE, backup_file)
    print(f'Backup created: {backup_file}')

if __name__ == '__main__':
    backup_db()
