# HerHub Backend (FastAPI + Pydantic v2 + Uvicorn)

Production-grade asynchronous Python backend for **HerHub - Women Safety Intelligence Platform**.

## Tech Stack
- **Framework:** FastAPI 0.110+
- **Data Validation & Schemas:** Pydantic v2 (`ConfigDict`, `field_validator`, type annotations)
- **ASGI Server:** Uvicorn 0.28+
- **API Documentation:** Interactive Swagger UI (`/docs`) & ReDoc (`/redoc`)

## Quick Start (Terminal Setup)

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Start Uvicorn Server
```bash
uvicorn main:app --reload --port 8000
```
Or simply double-click `run_backend.bat`.

### 3. Open Interactive Swagger UI
Open your browser and visit:
👉 **http://localhost:8000/docs**

## Available API Endpoints
- `GET  /api/v1/health` - Backend health & Pydantic v2 engine status
- `POST /api/v1/sos/trigger` - Dispatch emergency SOS with GPS coordinates & telemetry
- `GET  /api/v1/sos/history` - View recent SOS incidents
- `POST /api/v1/vehicle/audit` - HerScan 360 AI vehicle plate & child lock inspection
- `GET  /api/v1/vehicle/scans` - List scanned vehicle records
- `GET  /api/v1/contacts` - List verified emergency guardians (112, 139, Papa)
- `POST /api/v1/contacts` - Add new guardian contact
- `POST /api/v1/trips/schedule` - Schedule solo transit/train journey
- `GET  /api/v1/trips` - Fetch transit tracking trips
- `POST /api/v1/route/risk-assessment` - Multi-factor route safety assessment engine
- `POST /api/v1/cyber-fir/analyze` - Legal AI mapping incident statements to IPC & IT Act sections
