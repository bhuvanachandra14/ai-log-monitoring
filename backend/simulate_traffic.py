import time
import random
import requests
from datetime import datetime

API_URL = "http://localhost:8000/logs"

SERVICES = ["auth-service", "payment-gateway", "db-shard-01", "frontend-proxy", "recommendation-engine"]

# Templates for different log scenarios
NORMAL_LOGS = [
    ("INFO", "Health check passed"),
    ("INFO", "User login successful"),
    ("INFO", "Payment processed successfully"),
    ("INFO", "Cache refreshed"),
    ("INFO", "Request served in 45ms"),
    ("INFO", "Index updated"),
]

WARNINGS = [
    ("WARN", "High memory usage detected (85%)"),
    ("WARN", "Response time degraded (>500ms)"),
    ("WARN", "Rate limit approaching for user 123"),
    ("WARN", "Deprecated API usage detected"),
]

ERRORS = [
    ("ERROR", "Database connection timeout"),
    ("ERROR", "Payment provider returned 502 Bad Gateway"),
    ("ERROR", "NullPointerException in user_handler"),
    ("ERROR", "Disk space critical on /var/log"),
    ("ERROR", "Failed to send email notification"),
]

def send_log(level, service, message):
    try:
        response = requests.post(API_URL, json={
            "level": level,
            "service": service,
            "message": message
        })
        if response.status_code == 200:
            print(f"[{level}] Sent to {service}: {message}")
        else:
            print(f"FAILED ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"Failed to send log: {e}")

def run_simulation():
    print("🚀 Starting Traffic Simulation... Press Ctrl+C to stop.")
    
    while True:
        # 90% chance of normal behavior, 10% chance of an "Incident"
        if random.random() < 0.9:
            # Normal traffic pattern
            service = random.choice(SERVICES)
            # Weighted random choice: mostly INFO, some WARN, rare ERROR
            r = random.random()
            if r < 0.8:
                level, msg = random.choice(NORMAL_LOGS)
            elif r < 0.95:
                level, msg = random.choice(WARNINGS)
            else:
                level, msg = random.choice(ERRORS)
                
            send_log(level, service, msg)
            time.sleep(random.uniform(0.5, 2.0)) # Random delay between logs
        
        else:
            # INCIDENT MODE: Burst of errors!
            incident_service = random.choice(SERVICES)
            print(f"\n🔥 TRIGGERING INCIDENT ON {incident_service} 🔥\n")
            
            # Send a burst of 5-10 related errors
            for _ in range(random.randint(5, 10)):
                send_log("ERROR", incident_service, "Connection refused: upstream dependency unavailable")
                send_log("ERROR", incident_service, "Retry attempt failed")
                time.sleep(0.2) # Fast burst
            
            time.sleep(2) # Pausing after incident

if __name__ == "__main__":
    run_simulation()
