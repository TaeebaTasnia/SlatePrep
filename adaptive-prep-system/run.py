"""
Start the FastAPI backend with environment variables loaded from .env
Run: python run.py
"""
import os
from pathlib import Path

# Load .env manually — no dotenv package needed
env_file = Path(__file__).parent / ".env"
if env_file.exists():
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())

if __name__ == "__main__":
    key = os.environ.get("GROQ_API_KEY", "")
    print(f"GROQ_API_KEY loaded: {'YES (' + key[:8] + '...)' if key else 'NO - check .env file'}")
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=False)
