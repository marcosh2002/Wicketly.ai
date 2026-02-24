#!/usr/bin/env python
"""
Persistent Login System - Startup Script
Automatically starts both the Main API and Auth API
"""

import subprocess
import time
import sys
import os

def start_apis():
    """Start both APIs in separate processes"""
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    print("=" * 60)
    print("STARTING PERSISTENT LOGIN SYSTEM")
    print("=" * 60)
    print()
    
    # Start Auth API (port 8001)
    print("[1/2] Starting Auth API (port 8001)...")
    auth_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "auth_db:app", "--host", "127.0.0.1", "--port", "8001"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(2)
    print("      ✓ Auth API started (PID: {})".format(auth_process.pid))
    print()
    
    # Start Main API (port 8000)
    print("[2/2] Starting Main API (port 8000)...")
    api_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "api:app", "--host", "127.0.0.1", "--port", "8000"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(2)
    print("      ✓ Main API started (PID: {})".format(api_process.pid))
    print()
    
    print("=" * 60)
    print("SUCCESS! Both APIs are running")
    print("=" * 60)
    print()
    print("Available at:")
    print("  • Main API:  http://127.0.0.1:8000")
    print("  • Auth API:  http://127.0.0.1:8001")
    print()
    print("Frontend login credentials:")
    print("  • Username: Marcosh69")
    print("  • Password: test")
    print()
    print("Press Ctrl+C to stop all services")
    print()
    
    try:
        # Keep processes alive
        while True:
            time.sleep(1)
            if auth_process.poll() is not None:
                print("ERROR: Auth API crashed!")
                api_process.terminate()
                sys.exit(1)
            if api_process.poll() is not None:
                print("ERROR: Main API crashed!")
                auth_process.terminate()
                sys.exit(1)
    except KeyboardInterrupt:
        print("\n" + "=" * 60)
        print("SHUTTING DOWN...")
        print("=" * 60)
        auth_process.terminate()
        api_process.terminate()
        auth_process.wait(timeout=5)
        api_process.wait(timeout=5)
        print("✓ All services stopped")
        sys.exit(0)

if __name__ == "__main__":
    start_apis()
