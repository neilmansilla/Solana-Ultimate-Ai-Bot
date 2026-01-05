import sys
import subprocess
import platform
import os

def install_requirements():
    system = platform.system()
    python_cmd = sys.executable

    req_file = ""
    if system == "Windows":
        req_file = "requirements_win.txt"
    elif system == "Darwin":
        req_file = "requirements_darwin.txt"

    if req_file and os.path.exists(req_file):
        try:
            subprocess.run([python_cmd, "-m", "pip", "install", "-r", req_file], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except subprocess.CalledProcessError:
            sys.exit(1)

if __name__ == "__main__":
    install_requirements()
