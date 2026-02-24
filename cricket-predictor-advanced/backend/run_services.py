"""
Startup script to run both FastAPI services simultaneously

Usage:
    python run_services.py
    
This will start:
    - Main API on http://127.0.0.1:8000 (predictions, matches, etc.)
    - Auth DB API on http://127.0.0.1:8001 (user authentication & storage)
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def run_services():
    """Start both FastAPI services in parallel"""
    
    print("=" * 60)
    print("Cricket Prediction Services Startup")
    print("=" * 60)
    print()
    
    # Get backend directory
    backend_dir = Path(__file__).parent
    
    print(f"Backend Directory: {backend_dir}")
    print()
    
    # Check if required files exist
    api_file = backend_dir / "api.py"
    auth_db_file = backend_dir / "auth_db.py"
    
    if not api_file.exists():
        print(f"❌ Error: {api_file} not found")
        return False
    
    if not auth_db_file.exists():
        print(f"❌ Error: {auth_db_file} not found")
        return False
    
    print("✓ Found api.py")
    print("✓ Found auth_db.py")
    print()
    
    print("Starting services...")
    print()
    
    # Start Main API on port 8000
    print("📡 Starting Main API on http://127.0.0.1:8000")
    print("   (Predictions, Matches, Spin features)")
    try:
        main_api_process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "api:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
            cwd=str(backend_dir),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print("   ✓ Main API started (PID: {})".format(main_api_process.pid))
    except Exception as e:
        print(f"   ❌ Failed to start Main API: {e}")
        return False
    
    time.sleep(2)  # Wait for first service to start
    
    # Start Auth Database API on port 8001
    print()
    print("🔐 Starting Auth DB API on http://127.0.0.1:8001")
    print("   (User registration, login, token management)")
    try:
        auth_db_process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "auth_db:app", "--host", "127.0.0.1", "--port", "8001", "--reload"],
            cwd=str(backend_dir),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        print("   ✓ Auth DB API started (PID: {})".format(auth_db_process.pid))
    except Exception as e:
        print(f"   ❌ Failed to start Auth DB API: {e}")
        main_api_process.terminate()
        return False
    
    print()
    print("=" * 60)
    print("✅ Both services are running!")
    print("=" * 60)
    print()
    print("Available at:")
    print("  🌐 Main API:     http://127.0.0.1:8000")
    print("  📚 Main Docs:    http://127.0.0.1:8000/docs")
    print()
    print("  🔐 Auth API:     http://127.0.0.1:8001")
    print("  📚 Auth Docs:    http://127.0.0.1:8001/docs")
    print()
    print("Press Ctrl+C to stop all services...")
    print()
    
    try:
        # Keep processes running
        while True:
            time.sleep(1)
            if main_api_process.poll() is not None:
                print("❌ Main API crashed!")
                auth_db_process.terminate()
                break
            if auth_db_process.poll() is not None:
                print("❌ Auth DB API crashed!")
                main_api_process.terminate()
                break
    except KeyboardInterrupt:
        print()
        print("Shutting down services...")
        main_api_process.terminate()
        auth_db_process.terminate()
        print("✓ Services stopped")
        return True
    
    return False

if __name__ == "__main__":
    success = run_services()
    sys.exit(0 if success else 1)
