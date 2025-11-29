# === Base Image ===
FROM python:3.11-slim

# === Set working directory ===
WORKDIR /app

# === Install system deps ===
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# === Copy requirements first (for caching) ===
COPY requirements.txt .

# === Install Python deps ===
RUN pip install --no-cache-dir -r requirements.txt

# === Copy the app code ===
COPY . .

# === Expose FastAPI port ===
EXPOSE 8000

# === Start the server ===
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
