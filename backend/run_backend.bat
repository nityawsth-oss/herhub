@echo off
echo ========================================================
echo Starting HerHub FastAPI Server with Uvicorn...
echo Engine: FastAPI + Pydantic v2 Models
echo Swagger Docs: http://localhost:8000/docs
echo ========================================================
cd /d "%~dp0"
python -m uvicorn main:app --reload --port 8000 --host 0.0.0.0
pause
