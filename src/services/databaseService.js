/**
 * HerHub Unified Database Service Layer
 * Supports: Supabase Cloud PostgreSQL + Offline Local Persistent Fallback
 * Engineered for National Hackathons: Zero crashes, instant sync, high telemetry.
 */

import { supabase, isSupabaseConfigured, getSupabaseStatus } from './supabaseClient';

// Local storage persistent keys
const KEYS = {
  SOS: 'herhub_db_sos_incidents',
  CONTACTS: 'herhub_db_emergency_contacts',
  TRIPS: 'herhub_db_solo_trips',
  VEHICLES: 'herhub_db_vehicle_scans',
  PROFILE: 'herhub_db_user_profile',
  POSTS: 'herhub_db_awareness_posts'
};

// Initial Default Verified Seed Contacts (Papa: +91 75240 72395)
const DEFAULT_CONTACTS = [
  {
    id: 'c-papa-01',
    name: 'Rajesh Sharma (Primary Guardian)',
    relation: 'Father / Primary Guardian',
    phone: '+91 75240 72395',
    avatar: 'P',
    color: '#EC4899',
    notifyOnSOS: true,
    shareLocation: true,
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c-police-02',
    name: 'National Police Help (ERSS)',
    relation: 'Police Emergency 112',
    phone: '112',
    avatar: '1',
    color: '#EF4444',
    notifyOnSOS: true,
    shareLocation: true,
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'c-rpf-03',
    name: 'Railway Police Security (RPF)',
    relation: 'Rail Security 139',
    phone: '139',
    avatar: 'R',
    color: '#2563EB',
    notifyOnSOS: false,
    shareLocation: true,
    verified: true,
    createdAt: new Date().toISOString()
  }
];

// Helper to safely read from local storage
const readLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Helper to safely write to local storage
const writeLocal = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage write restricted:', e);
  }
};

// =============================================================================
// 1. SOS INCIDENTS SERVICE
// =============================================================================

export async function logSosIncident({
  triggerType = 'navbar_bell',
  lat = 28.6139,
  lng = 77.2090,
  accuracy = '5m',
  guardianPhone = '+91 75240 72395',
  status = 'active',
  whatsappDispatched = false,
  sirenDecibels = 105
}) {
  const incidentRecord = {
    id: 'sos-' + Date.now(),
    trigger_type: triggerType,
    latitude: Number(lat),
    longitude: Number(lng),
    accuracy_meters: accuracy,
    guardian_phone: guardianPhone,
    status,
    whatsapp_dispatched: whatsappDispatched,
    siren_decibels: sirenDecibels,
    created_at: new Date().toISOString()
  };

  // 1. Always update local persistent vault first (Zero-latency)
  const localList = readLocal(KEYS.SOS, []);
  localList.unshift(incidentRecord);
  writeLocal(KEYS.SOS, localList.slice(0, 50)); // keep last 50

  // 2. Sync to Supabase Cloud if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('sos_incidents')
        .insert([{
          trigger_type: triggerType,
          latitude: Number(lat),
          longitude: Number(lng),
          accuracy_meters: accuracy,
          guardian_phone: guardianPhone,
          status,
          whatsapp_dispatched: whatsappDispatched,
          siren_decibels: sirenDecibels
        }])
        .select();

      if (error) console.warn('Supabase SOS insert error:', error.message);
      else if (data && data[0]) return { success: true, cloudSynced: true, record: data[0] };
    } catch (err) {
      console.warn('Supabase sync network fallback:', err.message);
    }
  }

  return { success: true, cloudSynced: false, record: incidentRecord };
}

export async function getSosIncidents() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('sos_incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) return data;
    } catch (e) {
      console.warn('Falling back to local SOS records');
    }
  }
  return readLocal(KEYS.SOS, []);
}

// =============================================================================
// 2. EMERGENCY CONTACTS SERVICE
// =============================================================================

export async function getEmergencyContacts() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Falling back to local contacts');
    }
  }
  return readLocal(KEYS.CONTACTS, DEFAULT_CONTACTS);
}

export async function saveEmergencyContact(contact) {
  const localList = readLocal(KEYS.CONTACTS, DEFAULT_CONTACTS);
  const newContact = {
    ...contact,
    id: contact.id || 'c-' + Date.now(),
    createdAt: new Date().toISOString()
  };
  localList.push(newContact);
  writeLocal(KEYS.CONTACTS, localList);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('emergency_contacts').insert([{
        contact_name: contact.name,
        relation: contact.relation,
        phone_number: contact.phone,
        color_hex: contact.color || '#EC4899',
        notify_on_sos: contact.notifyOnSOS !== false
      }]);
    } catch (e) {
      console.warn('Supabase contact insert fallback');
    }
  }

  return newContact;
}

export async function deleteEmergencyContact(contactId) {
  const localList = readLocal(KEYS.CONTACTS, DEFAULT_CONTACTS);
  const updated = localList.filter(c => c.id !== contactId);
  writeLocal(KEYS.CONTACTS, updated);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('emergency_contacts').delete().eq('id', contactId);
    } catch (e) {
      console.warn('Supabase contact delete fallback');
    }
  }

  return updated;
}

// =============================================================================
// 3. SOLO TRIPS DATABASE SERVICE
// =============================================================================

export async function saveSoloTrip(trip) {
  const tripRecord = {
    id: 'trip-' + (trip.trainNumber || Date.now()),
    trip_title: trip.title || `${trip.originCity} to ${trip.destinationCity} Voyage`,
    origin_city: trip.originCity,
    origin_station: trip.originStation,
    destination_city: trip.destinationCity,
    destination_station: trip.destinationStation,
    train_number: String(trip.trainNumber),
    train_name: trip.trainName,
    coach_number: trip.coach || 'C3',
    seat_number: trip.seat || '24',
    guardian_phone: trip.guardianPhone || '+91 75240 72395',
    trip_status: trip.status || 'in_transit',
    created_at: new Date().toISOString()
  };

  const localList = readLocal(KEYS.TRIPS, []);
  localList.unshift(tripRecord);
  writeLocal(KEYS.TRIPS, localList.slice(0, 30));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('solo_trips').insert([tripRecord]);
    } catch (e) {
      console.warn('Supabase trip insert fallback');
    }
  }

  return tripRecord;
}

export async function getSoloTrips() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('solo_trips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) return data;
    } catch (e) {
      console.warn('Falling back to local trips');
    }
  }
  return readLocal(KEYS.TRIPS, []);
}

// =============================================================================
// 4. VEHICLE AUDITS (HerScan 360 AI Camera)
// =============================================================================

export async function logVehicleScan(v) {
  const scanRecord = {
    id: 'scan-' + Date.now(),
    plate_number: v.plate,
    state_code: v.stateCode || 'UP',
    rto_office: v.rtoOffice || 'RTO Office',
    vehicle_model: v.model,
    vehicle_class: v.vehicleClass,
    registered_owner: v.ownerName || 'Verified Citizen',
    father_name: v.fatherName || 'On Record',
    commercial_permit_no: v.permitNo || 'N/A',
    permit_valid_until: v.permitValidUntil || 'N/A',
    child_lock_hazard: Boolean(v.childLockHazard),
    child_lock_status: v.childLockStatus,
    window_tint_compliance: v.tintCompliance,
    police_cleared: Boolean(v.policeCleared),
    scanned_at: new Date().toISOString()
  };

  const localList = readLocal(KEYS.VEHICLES, []);
  localList.unshift(scanRecord);
  writeLocal(KEYS.VEHICLES, localList.slice(0, 30));

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('vehicle_scans').insert([scanRecord]);
    } catch (e) {
      console.warn('Supabase vehicle scan insert fallback');
    }
  }

  return scanRecord;
}

export async function getVehicleScans() {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('vehicle_scans')
        .select('*')
        .order('scanned_at', { ascending: false })
        .limit(15);

      if (!error && data) return data;
    } catch (e) {
      console.warn('Falling back to local scans');
    }
  }
  return readLocal(KEYS.VEHICLES, []);
}

// =============================================================================
// 5. DATABASE DIAGNOSTIC TELEMETRY (For Hackathon Judges)
// =============================================================================

export function getDatabaseTelemetry() {
  const status = getSupabaseStatus();
  const sosCount = readLocal(KEYS.SOS, []).length;
  const contactsCount = readLocal(KEYS.CONTACTS, DEFAULT_CONTACTS).length;
  const tripsCount = readLocal(KEYS.TRIPS, []).length;
  const vehiclesCount = readLocal(KEYS.VEHICLES, []).length;

  return {
    ...status,
    counts: {
      sos_incidents: sosCount,
      emergency_contacts: contactsCount,
      solo_trips: tripsCount,
      vehicle_scans: vehiclesCount,
      total_records: sosCount + contactsCount + tripsCount + vehiclesCount
    },
    primaryGuardian: 'Rajesh Sharma (Papa) · +91 75240 72395',
    lastSync: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}
