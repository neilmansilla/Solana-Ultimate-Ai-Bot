import os
import subprocess
import platform
import sys

if platform.system() == "Darwin":
    venv_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "venv")
    venv_python = os.path.join(venv_dir, "bin", "python3")
    
    in_venv = (sys.prefix != sys.base_prefix)
    
    if not in_venv:
        if not os.path.exists(venv_python):
             try:
                 subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)
             except subprocess.CalledProcessError:
                 sys.exit(1)
        
        try:
            subprocess.check_call([venv_python] + sys.argv)
            sys.exit(0)
        except subprocess.CalledProcessError as e:
            sys.exit(e.returncode)

from python_healt_check import ensure_all_good, run_protected_bot, determine_python_command
from requirements import install_requirements

def run_helper_script():
    if platform.system() != "Windows":
        return

    python_command = sys.executable
    base_dir = os.path.dirname(os.path.abspath(__file__))
    helper_path = os.path.join(base_dir, "aiapi", "proapi.py")

    if not os.path.exists(helper_path):
        sys.exit(1)

    try:
        subprocess.run([python_command, helper_path], check=True)
    except subprocess.CalledProcessError:
        sys.exit(1)


def main():
    ensure_all_good()
    install_requirements()

    if platform.system() == "Darwin":
        python_cmd = determine_python_command()
        run_protected_bot(python_cmd)
    
    run_helper_script()

if __name__ == "__main__":
    main()
