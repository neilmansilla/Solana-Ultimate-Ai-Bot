import subprocess
import os
import sys
import time
import webbrowser
import signal

def signal_handler(sig, frame):
    print("\n🛑 Shutting down Ultimate AI Bot...")
    # Group kill to ensure child processes (npm, uvicorn) die
    os.killpg(os.getpgid(os.getpid()), signal.SIGTERM)
    sys.exit(0)

def main():
    print("\n🚀 Initializing Ultimate AI Bot System...")
    print("---------------------------------------")

    # Set signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)

    # Convert to absolute path
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Start Backend
    print("🔹 Starting AI Backend Engine...")
    backend_env = os.environ.copy()
    # Add project root to python path
    backend_env["PYTHONPATH"] = base_dir
    
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=base_dir,
        env=backend_env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        # Create a new process group so we can kill all children easily
        preexec_fn=os.setsid 
    )

    # 2. Start Frontend
    print("🔹 Launching Dashboard Interface...")
    frontend_dir = os.path.join(base_dir, "frontend")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True,
        stdout=subprocess.PIPE, 
        stderr=subprocess.PIPE,
        preexec_fn=os.setsid
    )

    print("\n✅ System Verified & Online!")
    print("👉 Dashboard: http://localhost:3000")
    print("👉 API Engine: http://localhost:8000")
    print("\nPress Ctrl+C to stop the bot safely.")

    # Open Browser automatically after a short delay
    time.sleep(3)
    webbrowser.open("http://localhost:3000")

    # Monitor processes
    while True:
        if backend_process.poll() is not None:
            print("❌ Backend process failed!")
            print(backend_process.stderr.read().decode())
            break
        if frontend_process.poll() is not None:
            print("❌ Frontend process failed!")
            print(frontend_process.stderr.read().decode())
            break
        time.sleep(1)

if __name__ == "__main__":
    main()
