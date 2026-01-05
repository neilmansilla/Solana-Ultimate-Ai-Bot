import sys
import io
import traceback

def execute_python_code(code: str) -> str:
    """
    Execute Python code safely and return the output.
    Captures stdout and stderr.
    """
    # Create string buffers to capture output
    stdout_buffer = io.StringIO()
    stderr_buffer = io.StringIO()
    
    # Save original stdout/stderr
    original_stdout = sys.stdout
    original_stderr = sys.stderr
    
    try:
        sys.stdout = stdout_buffer
        sys.stderr = stderr_buffer
        
        # Execute the code in a restricted global/local scope if needed
        # For now, we use a basic exec with a new dictionary
        exec_globals = {}
        exec(code, exec_globals)
        
        output = stdout_buffer.getvalue()
        errors = stderr_buffer.getvalue()
        
        result = ""
        if output:
            result += f"Output:\n{output}\n"
        if errors:
            result += f"Errors:\n{errors}\n"
        if not result:
            result = "Code executed successfully (no output)."
            
        return result
        
    except Exception:
        return f"Execution Error:\n{traceback.format_exc()}"
    finally:
        # Restore stdout/stderr
        sys.stdout = original_stdout
        sys.stderr = original_stderr
