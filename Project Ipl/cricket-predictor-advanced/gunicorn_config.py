import os
import multiprocessing

# Bind to the PORT environment variable, default to 5000
bind = f"0.0.0.0:{os.getenv('PORT', 5000)}"

# Number of worker processes
workers = max(2, multiprocessing.cpu_count())

# Worker class
worker_class = "sync"

# Timeout
timeout = 60

# Max requests per worker
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "wicketly-api"
