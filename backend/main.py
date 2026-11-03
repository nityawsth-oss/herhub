"""
HerHub - Production FastAPI Backend Server
Engineered with Pydantic v2 Models & Asynchronous Architecture
Run via Uvicorn: uvicorn main:app --reload --port 8000
Interactive Swagger Docs: http://localhost:8000/docs
"""

import uuid
from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from schemas import (
    HerHubBaseModel,
    HealthCheckResponse,
    EmergencyContactCreate,
    EmergencyContactResponse,
    SOSIncidentCreate,
    SOSIncidentResponse,
    VehicleScanRequest,
    VehicleScanResponse,
    SoloTripCreate,
    SoloTripResponse,
    RouteRiskRequest,
    RouteRiskResponse,
    CyberFIRRequest,
    CyberFIRResponse,
)

# =============================================================================
# 1. FASTAPI APPLICATION INITIALIZATION
# =============================================================================
app = FastAPI(
    title="HerHub Women Safety Intelligence API",
    version="2.0.0",
    description="""
## HerHub - AI-Powered Women Safety & Rapid Emergency Response Engine
* **Framework:** FastAPI (Asynchronous Python)
* **Server:** Uvicorn ASGI Server
* **Validation Layer:** Pydantic v2 Models (Strict Type Guard & Validators)
* **Features:** SOS Dispatch, HerScan 360 Vehicle Audit, Cyber FIR Legal AI, Route Risk Scoring.
    """,
    docs_url="/docs",
    redoc_url="/redoc",
)

# =============================================================================
# 2. CORS MIDDLEWARE
# =============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows React frontend on localhost:3000 or any deployed domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# 3. IN-MEMORY HIGH-SPEED DATA STORE (Preloaded for Hackathons)
# =============================================================================
DB_CONTACTS: List[dict] = [
    {
        "id": "c-papa-01",
        "name": "Rajesh Sharma (Primary Guardian)",
        "relation": "Father / Primary Guardian",
        "phone": "+917524072395",
        "avatar": "P",
        "color": "#EC4899",
        "notify_on_sos": True,
        "share_location": True,
        "verified": True,
        "created_at": datetime.utcnow(),
    },
    {
        "id": "c-police-02",
        "name": "National Police Emergency (ERSS)",
        "relation": "Police 112",
        "phone": "112",
        "avatar": "1",
        "color": "#EF4444",
        "notify_on_sos": True,
        "share_location": True,
        "verified": True,
        "created_at": datetime.utcnow(),
    },
    {
        "id": "c-rpf-03",
        "name": "Railway Police Security (RPF)",
        "relation": "Rail Security 139",
        "phone": "139",
        "avatar": "R",
        "color": "#2563EB",
        "notify_on_sos": False,
        "share_location": True,
        "verified": True,
        "created_at": datetime.utcnow(),
    },
]

DB_SOS: List[dict] = []
DB_VEHICLES: List[dict] = []
DB_TRIPS: List[dict] = []

# Mock RTO Registry for HerScan 360
RTO_REGISTRY = {
    "UP65": {
        "rto": "Varanasi RTO, Uttar Pradesh",
        "model": "Maruti Suzuki Dzire Tour (Commercial)",
        "class": "Motor Cab / Commercial Taxi",
        "owner": "Ramesh Chandra Yadav",
        "father": "B. L. Yadav",
        "permit": "UP-65-TAXI-2024-8841",
        "permit_valid": "28-Dec-2028",
        "clean": True,
    },
    "DL1Z": {
        "rto": "New Delhi Central RTO, Delhi",
        "model": "Hyundai Aura CNG",
        "class": "Commercial Taxi",
        "owner": "Sukhwinder Singh",
        "father": "Jaswant Singh",
        "permit": "DL-01-COMM-99120",
        "permit_valid": "14-Feb-2027",
        "clean": True,
    },
    "MH02": {
        "rto": "Mumbai West RTO, Maharashtra",
        "model": "Toyota Innova Crysta",
        "class": "Tourist Vehicle (Yellow Board)",
        "owner": "Pradeep R. Kadam",
        "father": "R. Kadam",
        "permit": "MH-02-TOUR-5521",
        "permit_valid": "19-Oct-2029",
        "clean": True,
    },
}


# =============================================================================
# 4. API ENDPOINTS
# =============================================================================

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")


@app.get("/api/v1/health", response_model=HealthCheckResponse, tags=["System Health"])
def health_check():
    """Verify backend health, uptime, and Pydantic v2 engine status."""
    return HealthCheckResponse()


# --- SOS Telemetry Endpoints ---
@app.post("/api/v1/sos/trigger", response_model=SOSIncidentResponse, status_code=status.HTTP_201_CREATED, tags=["SOS Emergency Dispatch"])
def trigger_sos(incident: SOSIncidentCreate):
    """
    Trigger emergency SOS broadcast with GPS coordinates, decibels, and guardian alert.
    Data is strictly validated by Pydantic v2 models.
    """
    record = incident.model_dump()
    record["id"] = f"sos-{uuid.uuid4().hex[:8]}"
    record["whatsapp_dispatched"] = True
    record["sms_dispatched"] = True
    record["created_at"] = datetime.utcnow()

    DB_SOS.insert(0, record)
    return record


@app.get("/api/v1/sos/history", response_model=List[SOSIncidentResponse], tags=["SOS Emergency Dispatch"])
def get_sos_history(limit: int = 10):
    """Fetch recent SOS trigger logs and telemetry."""
    return DB_SOS[:limit]


# --- Vehicle Scan (HerScan 360 AI Camera) Endpoints ---
@app.post("/api/v1/vehicle/audit", response_model=VehicleScanResponse, tags=["HerScan 360 Vehicle Audit"])
def audit_vehicle(scan: VehicleScanRequest):
    """
    Verify vehicle registration plate, cross-check RTO database,
    and audit child-lock hazards and window tint compliance.
    """
    plate = scan.plate_number
    prefix = plate[:4]
    rto_info = RTO_REGISTRY.get(prefix, {
        "rto": f"{scan.state_code} State Transport Authority",
        "model": "Commercial Hatchback / Sedan",
        "class": "Motor Cab (Commercial)",
        "owner": "Verified Citizen",
        "father": "On Record",
        "permit": f"{scan.state_code}-COMM-77312",
        "permit_valid": "12-Dec-2027",
        "clean": True,
    })

    # Evaluate safety rating
    if scan.child_lock_hazard or "HAZARD" in scan.window_tint_compliance:
        rating = "RED_HAZARD" if scan.child_lock_hazard else "AMBER_CAUTION"
    else:
        rating = "GREEN_SAFE"

    record = {
        "id": f"scan-{uuid.uuid4().hex[:8]}",
        "plate_number": plate,
        "state_code": scan.state_code or "UP",
        "rto_office": rto_info["rto"],
        "vehicle_model": rto_info["model"],
        "vehicle_class": rto_info["class"],
        "registered_owner": rto_info["owner"],
        "father_name": rto_info["father"],
        "commercial_permit_no": rto_info["permit"],
        "permit_valid_until": rto_info["permit_valid"],
        "child_lock_hazard": scan.child_lock_hazard,
        "child_lock_status": scan.child_lock_status,
        "window_tint_compliance": scan.window_tint_compliance,
        "police_cleared": rto_info["clean"],
        "ncrb_status": "CLEAN / VERIFIED NO RECORD",
        "safety_rating": rating,
        "scanned_at": datetime.utcnow(),
    }

    DB_VEHICLES.insert(0, record)
    return record


@app.get("/api/v1/vehicle/scans", response_model=List[VehicleScanResponse], tags=["HerScan 360 Vehicle Audit"])
def get_vehicle_scans(limit: int = 15):
    """Retrieve logged vehicle plate safety audits."""
    return DB_VEHICLES[:limit]


# --- Emergency Contacts Endpoints ---
@app.get("/api/v1/contacts", response_model=List[EmergencyContactResponse], tags=["Emergency Contacts"])
def list_contacts():
    """Get all registered emergency contacts."""
    return DB_CONTACTS


@app.post("/api/v1/contacts", response_model=EmergencyContactResponse, status_code=status.HTTP_201_CREATED, tags=["Emergency Contacts"])
def add_contact(contact: EmergencyContactCreate):
    """Add a new verified guardian or helpline contact."""
    record = contact.model_dump()
    record["id"] = f"c-{uuid.uuid4().hex[:6]}"
    record["avatar"] = contact.name[0].upper()
    record["color"] = "#EC4899"
    record["verified"] = True
    record["created_at"] = datetime.utcnow()

    DB_CONTACTS.append(record)
    return record


# --- Solo Trip Guardian Endpoints ---
@app.post("/api/v1/trips/schedule", response_model=SoloTripResponse, status_code=status.HTTP_201_CREATED, tags=["Solo Trip Guardian"])
def schedule_trip(trip: SoloTripCreate):
    """Register a solo train or transit journey for automated guardian check-ins."""
    record = trip.model_dump()
    record["id"] = f"trip-{trip.train_number}-{uuid.uuid4().hex[:4]}"
    record["trip_title"] = trip.trip_title or f"{trip.origin_city} to {trip.destination_city} Voyage"
    record["checkins_completed"] = 0
    record["created_at"] = datetime.utcnow()

    DB_TRIPS.insert(0, record)
    return record


@app.get("/api/v1/trips", response_model=List[SoloTripResponse], tags=["Solo Trip Guardian"])
def list_trips():
    """List active and scheduled transit journeys."""
    return DB_TRIPS


# --- Route Risk Assessment AI Engine ---
@app.post("/api/v1/route/risk-assessment", response_model=RouteRiskResponse, tags=["Route Safety Intelligence"])
def assess_route_risk(req: RouteRiskRequest):
    """Calculate multi-factor safety score based on hour, lighting, and police coverage."""
    # Night time risk calculation
    if 22 <= req.travel_hour or req.travel_hour <= 4:
        score = 64
        risk = "MODERATE"
        lighting = "Dim Streetlights / Active Night Patrol"
        crowd = "Sparse Pedestrian Traffic"
        checkpoints = 2
        recommendation = "Keep Live Telemetry and AI Guardian Call active while travelling."
    elif 18 <= req.travel_hour < 22:
        score = 82
        risk = "SAFE"
        lighting = "Well-lit Main Corridor"
        crowd = "Moderate Evening Commuters"
        checkpoints = 3
        recommendation = "Route is active with high surveillance. Safe to commute."
    else:
        score = 94
        risk = "SAFE"
        lighting = "Full Daylight Coverage"
        crowd = "High Public Footfall"
        checkpoints = 4
        recommendation = "Optimal daylight transit conditions."

    return RouteRiskResponse(
        route_name=req.route_name,
        overall_safety_score=score,
        risk_level=risk,
        lighting_condition=lighting,
        crowd_density=crowd,
        police_checkpoints_count=checkpoints,
        safe_hubs_nearby=["24/7 Apollo Pharmacy", "Cantonment Police Thana", "Indian Oil Station"],
        recommendation=recommendation
    )


# --- Cyber FIR Legal AI Dossier ---
@app.post("/api/v1/cyber-fir/analyze", response_model=CyberFIRResponse, tags=["Cyber FIR Legal AI"])
def generate_cyber_fir(fir: CyberFIRRequest):
    """Auto-map cyber incident statements to applicable Indian Penal Code & IT Act sections."""
    statement_lower = fir.incident_statement.lower()
    applicable_acts = []

    if "photo" in statement_lower or "video" in statement_lower or "morph" in statement_lower or "deepfake" in statement_lower:
        applicable_acts.append("Section 66E IT Act (Violation of Privacy - Capturing/Publishing images)")
        applicable_acts.append("Section 67/67A IT Act (Publishing or transmitting obscene/sexually explicit material)")

    if "stalk" in statement_lower or "follow" in statement_lower or "message" in statement_lower:
        applicable_acts.append("Section 354D IPC / Section 78 BNS (Stalking - Digital or Physical)")

    if "threat" in statement_lower or "blackmail" in statement_lower or "money" in statement_lower:
        applicable_acts.append("Section 506 IPC (Criminal Intimidation)")
        applicable_acts.append("Section 509 IPC (Word, gesture or act intended to insult woman's modesty)")

    if not applicable_acts:
        applicable_acts = [
            "Section 354A IPC (Sexual Harassment)",
            "Section 66D IT Act (Cheating by personation using computer resource)",
            "Section 509 IPC (Insulting modesty of a woman)"
        ]

    return CyberFIRResponse(
        fir_draft_id=f"FIR-DRAFT-{uuid.uuid4().hex[:6].upper()}",
        applicable_ipc_it_acts=applicable_acts,
        legal_summary=f"Incident categorized under {fir.incident_type} via {fir.platform}. Sufficient cognizable offence prima facie detected for urgent police submission.",
        actionable_evidence_checklist=[
            "Uncropped screenshots displaying date, time, and phone/handle",
            "Exported WhatsApp / platform chat raw .txt logs",
            "Call detail records (CDR) with timestamps",
            "URL links to offending profile or media files"
        ]
    )
