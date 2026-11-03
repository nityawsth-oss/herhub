"""
HerHub Pydantic v2 Data Models & Validation Schemas
Built for high-assurance Women Safety & Rapid Emergency Response.
Complies with Pydantic v2 syntax (ConfigDict, field_validator, type annotations).
"""

from datetime import datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict, field_validator
import re


# =============================================================================
# 1. BASE CONFIG
# =============================================================================
class HerHubBaseModel(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        str_strip_whitespace=True
    )


# =============================================================================
# 2. EMERGENCY CONTACT SCHEMAS
# =============================================================================
class EmergencyContactCreate(HerHubBaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name of emergency guardian")
    relation: str = Field(..., min_length=2, max_length=50, description="Relation to user (e.g. Father, Police)")
    phone: str = Field(..., description="Indian/International phone number with country code")
    notify_on_sos: bool = Field(default=True, description="Whether to dispatch SOS SMS/call")
    share_location: bool = Field(default=True, description="Whether to share live GPS coordinates")

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Strip spaces and hyphens
        cleaned = re.sub(r'[\s\-]', '', v)
        if not re.match(r'^(\+91|91|0)?[6-9]\d{9}$|^112$|^139$|^1091$', cleaned):
            raise ValueError("Phone number must be a valid 10-digit Indian number or emergency helpline (112, 139, 1091)")
        return cleaned


class EmergencyContactResponse(EmergencyContactCreate):
    id: str = Field(..., description="Unique contact identifier")
    avatar: str = Field(default="C")
    color: str = Field(default="#EC4899")
    verified: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# =============================================================================
# 3. SOS INCIDENT & TELEMETRY SCHEMAS
# =============================================================================
class SOSIncidentCreate(HerHubBaseModel):
    trigger_type: Literal[
        "navbar_bell", "voice_sentinel", "gesture", "solo_trip", "acoustic_signal", "hardware_trigger"
    ] = Field(default="navbar_bell", description="Mode used to trigger emergency")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="GPS Latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="GPS Longitude")
    accuracy_meters: str = Field(default="5m", description="GPS estimated accuracy radius")
    guardian_phone: str = Field(default="+91 75240 72395", description="Primary guardian phone to alert")
    siren_decibels: int = Field(default=105, ge=60, le=140, description="Acoustic alarm volume in dB")
    status: Literal["active", "dispatched", "resolved", "cancelled"] = Field(default="active")
    nearest_thana: Optional[str] = Field(default="Cantonment Police Station (112)")
    battery_level: Optional[int] = Field(default=90, ge=0, le=100)


class SOSIncidentResponse(SOSIncidentCreate):
    id: str = Field(..., description="Unique SOS incident case number")
    whatsapp_dispatched: bool = Field(default=True)
    sms_dispatched: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# =============================================================================
# 4. VEHICLE AUDIT & HERSCAN 360 SCHEMAS
# =============================================================================
class VehicleScanRequest(HerHubBaseModel):
    plate_number: str = Field(..., description="Vehicle registration plate number")
    state_code: Optional[str] = Field(default="UP", max_length=2)
    child_lock_hazard: bool = Field(default=False, description="Whether child lock is engaged on rear doors")
    child_lock_status: Literal["SAFE (Disengaged)", "HAZARD (Active/Engaged)", "UNKNOWN"] = Field(
        default="SAFE (Disengaged)"
    )
    window_tint_compliance: Literal["COMPLIANT (>70% Visible Light)", "HAZARD (<50% Dark Tint)", "UNKNOWN"] = Field(
        default="COMPLIANT (>70% Visible Light)"
    )

    @field_validator("plate_number")
    @classmethod
    def format_plate(cls, v: str) -> str:
        cleaned = re.sub(r'[^A-Za-z0-9]', '', v).upper()
        if len(cleaned) < 5 or len(cleaned) > 12:
            raise ValueError("Vehicle plate number must be between 5 and 12 alphanumeric characters")
        return cleaned


class VehicleScanResponse(HerHubBaseModel):
    id: str
    plate_number: str
    state_code: str
    rto_office: str
    vehicle_model: str
    vehicle_class: str
    registered_owner: str
    father_name: str
    commercial_permit_no: str
    permit_valid_until: str
    child_lock_hazard: bool
    child_lock_status: str
    window_tint_compliance: str
    police_cleared: bool
    ncrb_status: str
    safety_rating: Literal["GREEN_SAFE", "AMBER_CAUTION", "RED_HAZARD"]
    scanned_at: datetime = Field(default_factory=datetime.utcnow)


# =============================================================================
# 5. SOLO TRIP GUARDIAN SCHEMAS
# =============================================================================
class SoloTripCreate(HerHubBaseModel):
    trip_title: Optional[str] = None
    origin_city: str = Field(..., min_length=2)
    origin_station: str = Field(..., min_length=2)
    destination_city: str = Field(..., min_length=2)
    destination_station: str = Field(..., min_length=2)
    train_number: str = Field(..., min_length=3, max_length=10)
    train_name: str = Field(..., min_length=2)
    coach_number: str = Field(default="C3")
    seat_number: str = Field(default="24")
    guardian_phone: str = Field(default="+91 75240 72395")
    trip_status: Literal["scheduled", "in_transit", "safely_completed", "sos_triggered"] = Field(
        default="in_transit"
    )


class SoloTripResponse(SoloTripCreate):
    id: str
    checkins_completed: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# =============================================================================
# 6. ROUTE RISK ASSESSMENT SCHEMAS
# =============================================================================
class RouteRiskRequest(HerHubBaseModel):
    route_name: str = Field(..., min_length=3)
    origin: str = Field(..., min_length=2)
    destination: str = Field(..., min_length=2)
    travel_hour: int = Field(..., ge=0, le=23, description="Hour of the day (0-23)")
    is_solo: bool = Field(default=True)


class RouteRiskResponse(HerHubBaseModel):
    route_name: str
    overall_safety_score: int = Field(..., ge=0, le=100)
    risk_level: Literal["SAFE", "MODERATE", "HIGH_RISK"]
    lighting_condition: str
    crowd_density: str
    police_checkpoints_count: int
    safe_hubs_nearby: List[str]
    recommendation: str


# =============================================================================
# 7. CYBER FIR AI DOSSIER SCHEMAS
# =============================================================================
class CyberFIRRequest(HerHubBaseModel):
    incident_type: str = Field(..., description="e.g. Cyberstalking, Harassment, Threatening messages")
    suspect_handle_or_number: Optional[str] = None
    incident_statement: str = Field(..., min_length=10, description="Voice transcript or text details")
    platform: Literal["WhatsApp", "Instagram", "Telegram", "Phone Call", "Public Space", "Other"] = Field(
        default="WhatsApp"
    )


class CyberFIRResponse(HerHubBaseModel):
    fir_draft_id: str
    applicable_ipc_it_acts: List[str]
    legal_summary: str
    actionable_evidence_checklist: List[str]
    police_dispatch_readiness: bool = True
    drafted_at: datetime = Field(default_factory=datetime.utcnow)


# =============================================================================
# 8. SYSTEM HEALTH
# =============================================================================
class HealthCheckResponse(HerHubBaseModel):
    status: str = "online"
    service: str = "HerHub Women Safety Intelligence Backend"
    engine: str = "FastAPI 0.110+ & Uvicorn"
    pydantic_version: str = "v2"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
