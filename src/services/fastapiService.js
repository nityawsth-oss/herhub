/**
 * HerHub FastAPI Backend Service Connector
 * Connects React frontend to FastAPI / Uvicorn server running on http://localhost:8000
 * Handles fallback gracefully if the Python backend is offline.
 */

const FASTAPI_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000/api/v1';

export async function checkFastAPIHealth() {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/health`, { method: 'GET' });
    if (!res.ok) return { online: false };
    const data = await res.json();
    return { online: true, data };
  } catch (err) {
    return { online: false, error: err.message };
  }
}

export async function dispatchFastAPISOS(sosData) {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/sos/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trigger_type: sosData.triggerType || 'navbar_bell',
        latitude: Number(sosData.lat || 28.6139),
        longitude: Number(sosData.lng || 77.2090),
        accuracy_meters: String(sosData.accuracy || '5m'),
        guardian_phone: sosData.guardianPhone || '+91 75240 72395',
        siren_decibels: Number(sosData.sirenDecibels || 105),
        status: 'active'
      })
    });
    if (!res.ok) throw new Error(`FastAPI SOS error: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend offline or unreachable, using local vault:', err.message);
    return null;
  }
}

export async function auditFastAPIVehicle(vehicleData) {
  try {
    const res = await fetch(`${FASTAPI_BASE_URL}/vehicle/audit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plate_number: vehicleData.plate,
        state_code: vehicleData.stateCode || 'UP',
        child_lock_hazard: Boolean(vehicleData.childLockHazard),
        child_lock_status: vehicleData.childLockHazard ? 'HAZARD (Active/Engaged)' : 'SAFE (Disengaged)',
        window_tint_compliance: vehicleData.tintCompliance || 'COMPLIANT (>70% Visible Light)'
      })
    });
    if (!res.ok) throw new Error(`FastAPI Vehicle audit error: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('FastAPI backend offline, falling back to local audit:', err.message);
    return null;
  }
}
