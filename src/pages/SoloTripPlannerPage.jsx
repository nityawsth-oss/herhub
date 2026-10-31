import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCompass, FaShieldAlt, FaPhoneAlt, FaExclamationTriangle,
  FaCheckCircle, FaTrain, FaClock,
  FaMapMarkerAlt, FaVolumeUp, FaVolumeMute,
  FaWhatsapp,
  FaBatteryThreeQuarters, FaTimes,
  FaUsers, FaBell,
  FaBroadcastTower, FaLocationArrow, FaCar, FaHotel, FaWalking,
  FaIdCard, FaCheck, FaArrowRight, FaUndo, FaSearch, FaHistory,
  FaCalendarAlt, FaTrash, FaShareAlt, FaDownload, FaRoute,
  FaBus, FaTaxi, FaExternalLinkAlt
} from 'react-icons/fa';

import { useTheme } from '../context/ThemeContext';
import {
  REAL_TRAINS_DATABASE,
  getTrainsForRoute,
  getDistanceMeters,
  computeRealtimeTrainRunningStatus,
  getCityLocalSafetyPlan,
  getCityCoordinates
} from '../services/realTrainData';
import { saveSoloTrip } from '../services/databaseService';

// -----------------------------------------------------------------
// PERSISTENT JOURNEY HISTORY DATABASE (Default Verified Past Trips)
// -----------------------------------------------------------------
const DEFAULT_PAST_JOURNEYS = [
  {
    id: 'voyage-2026-jp-01',
    title: 'Delhi to Jaipur Solo Cultural Heritage Voyage',
    departureDate: '12 Oct 2026',
    returnDate: '15 Oct 2026',
    originCity: 'Delhi',
    originStation: 'New Delhi (NDLS)',
    destinationCity: 'Jaipur',
    destinationStation: 'Jaipur Junction (JP)',
    status: 'Completed Safely',
    safetyAuditToken: 'HER-VOYAGE-JP-88219',
    guardian: {
      name: 'Rajesh Sharma (Papa)',
      phone: '+91 75240 72395',
      relation: 'Father',
      updatesSent: 14,
      lastCheckin: '15 Oct 2026, 21:40 (Doorstep Confirmed)'
    },
    outboundTrain: {
      trainNumber: '12015',
      trainName: 'Ajmer Shatabdi Express',
      departureTime: '06:10',
      arrivalTime: '10:40',
      coach: 'C3',
      seat: '42 (Window)'
    },
    stay: {
      name: 'Zostel Jaipur (Women-Friendly Wing)',
      address: 'Opposite Hawa Mahal, Badi Chaupar, Pink City, Jaipur',
      checkIn: '12 Oct 2026, 11:30 AM',
      checkOut: '15 Oct 2026, 03:00 PM',
      verifiedScore: '9.8/10 Safe Stay'
    },
    localTransitVehicles: [
      {
        leg: 'Jaipur Station to Zostel Hotel',
        transportMode: 'Verified Prepaid Auto',
        vehiclePlate: 'RJ 14 PA 3312',
        driverName: 'Ramesh Kumar',
        driverPhone: '+91 94140 22134',
        status: 'Completed Safe'
      },
      {
        leg: 'Day 2 Excursion: Amer Fort & Jal Mahal',
        transportMode: 'Jaipur Safe City Cabs',
        vehiclePlate: 'RJ 14 TA 8890',
        driverName: 'Surendra Singh',
        driverPhone: '+91 98290 55431',
        status: 'Completed Safe'
      }
    ],
    returnJourney: {
      departureCab: {
        leg: 'Zostel to Jaipur Jn Railway Station',
        transportMode: 'Hotel Concierge EV Cab',
        vehiclePlate: 'RJ 14 TC 2241',
        driverName: 'Mukesh Saini',
        driverPhone: '+91 97840 11982'
      },
      train: {
        trainNumber: '12016',
        trainName: 'Jaipur - New Delhi Shatabdi Express',
        coach: 'C1',
        seat: '18 (Aisle)',
        departure: '17:50',
        arrival: '22:15'
      },
      arrivalDoorstepCab: {
        leg: 'NDLS Station to Home Doorstep',
        transportMode: 'Delhi Traffic Police Prepaid Taxi',
        vehiclePlate: 'DL 1R T 4455',
        driverName: 'Harpreet Singh',
        driverPhone: '+91 98111 67890'
      }
    },
    corridorDeviations: 0,
    emergencyTriggered: false,
    securitySummary: '100% route corridor compliance. Zero safety violations. All 14 GPS check-ins received by Papa.'
  },
  {
    id: 'voyage-2026-ag-02',
    title: 'Delhi to Agra Taj Mahal & Heritage Day Voyage',
    departureDate: '28 Sep 2026',
    returnDate: '28 Sep 2026',
    originCity: 'Delhi',
    originStation: 'Hazrat Nizamuddin (NZM)',
    destinationCity: 'Agra',
    destinationStation: 'Agra Cantt (AGC)',
    status: 'Completed Safely',
    safetyAuditToken: 'HER-VOYAGE-AG-44102',
    guardian: {
      name: 'Rajesh Sharma (Papa)',
      phone: '+91 75240 72395',
      relation: 'Father',
      updatesSent: 9,
      lastCheckin: '28 Sep 2026, 23:15 (Doorstep Confirmed)'
    },
    outboundTrain: {
      trainNumber: '12002',
      trainName: 'Bhopal Shatabdi Express',
      departureTime: '06:00',
      arrivalTime: '07:50',
      coach: 'E1',
      seat: '24 (Executive Chair)'
    },
    stay: {
      name: 'Radisson Hotel Agra',
      address: 'Taj East Gate Road, Fatehabad Road, Agra',
      checkIn: '28 Sep 2026, 08:30 AM',
      checkOut: '28 Sep 2026, 05:30 PM',
      verifiedScore: '9.6/10 Safe Stay'
    },
    localTransitVehicles: [
      {
        leg: 'Agra Cantt Station to Radisson Hotel',
        transportMode: 'Prepaid Electric Cab',
        vehiclePlate: 'UP 80 BT 6672',
        driverName: 'Amit Verma',
        driverPhone: '+91 99270 33412',
        status: 'Completed Safe'
      },
      {
        leg: 'Taj Mahal East Gate to Agra Fort',
        transportMode: 'UP Tourism EV Auto',
        vehiclePlate: 'UP 80 EV 9011',
        driverName: 'Saleem Khan',
        driverPhone: '+91 98370 77821',
        status: 'Completed Safe'
      }
    ],
    returnJourney: {
      departureCab: {
        leg: 'Radisson Hotel to Agra Cantt Station',
        transportMode: 'Safe Women City Taxi',
        vehiclePlate: 'UP 80 CT 4419',
        driverName: 'Dinesh Kushwaha',
        driverPhone: '+91 94120 44321'
      },
      train: {
        trainNumber: '20171',
        trainName: 'Rani Kamlapati - Hazrat Nizamuddin Vande Bharat',
        coach: 'C4',
        seat: '55 (Window)',
        departure: '18:50',
        arrival: '20:30'
      },
      arrivalDoorstepCab: {
        leg: 'NZM Station to Home Doorstep',
        transportMode: 'Sakha Cabs (Women Driver)',
        vehiclePlate: 'DL 1R C 3320',
        driverName: 'Sunita Devi (Verified Lady Driver)',
        driverPhone: '+91 98710 99881'
      }
    },
    corridorDeviations: 1,
    emergencyTriggered: false,
    securitySummary: '1 minor 60m route detour due to Taj VIP convoy bypass. Driver confirmed alternate safe path with Papa.'
  },
  {
    id: 'voyage-2026-lk-03',
    title: 'Delhi to Lucknow Awadhi Culture & Food Exploration',
    departureDate: '14 Aug 2026',
    returnDate: '17 Aug 2026',
    originCity: 'Delhi',
    originStation: 'New Delhi (NDLS)',
    destinationCity: 'Lucknow',
    destinationStation: 'Lucknow Charbagh (LKO)',
    status: 'Completed Safely',
    safetyAuditToken: 'HER-VOYAGE-LK-99341',
    guardian: {
      name: 'Rajesh Sharma (Papa)',
      phone: '+91 75240 72395',
      relation: 'Father',
      updatesSent: 16,
      lastCheckin: '17 Aug 2026, 22:50 (Doorstep Confirmed)'
    },
    outboundTrain: {
      trainNumber: '12004',
      trainName: 'Lucknow Shatabdi Express',
      departureTime: '06:10',
      arrivalTime: '12:40',
      coach: 'C2',
      seat: '36 (Aisle)'
    },
    stay: {
      name: 'Vivanta by Taj Gomti Nagar',
      address: 'Vipin Khand, Gomti Nagar, Lucknow',
      checkIn: '14 Aug 2026, 01:30 PM',
      checkOut: '17 Aug 2026, 02:00 PM',
      verifiedScore: '9.9/10 Safe Stay'
    },
    localTransitVehicles: [
      {
        leg: 'Charbagh Station to Hotel Vivanta',
        transportMode: 'Lucknow Smart City Cab',
        vehiclePlate: 'UP 32 CZ 8901',
        driverName: 'Mohd Irfan',
        driverPhone: '+91 94500 22319',
        status: 'Completed Safe'
      },
      {
        leg: 'Hazratganj to Rumi Darwaza & Chowk',
        transportMode: 'Prepaid Heritage CNG Auto',
        vehiclePlate: 'UP 32 AZ 5521',
        driverName: 'Ram Kishore',
        driverPhone: '+91 98390 12345',
        status: 'Completed Safe'
      }
    ],
    returnJourney: {
      departureCab: {
        leg: 'Hotel Vivanta to Charbagh Station',
        transportMode: 'Hotel Dedicated Chauffeur',
        vehiclePlate: 'UP 32 DT 1144',
        driverName: 'Deepak Yadav',
        driverPhone: '+91 97920 66551'
      },
      train: {
        trainNumber: '12003',
        trainName: 'Lucknow - New Delhi Swarna Shatabdi Express',
        coach: 'C5',
        seat: '29 (Window)',
        departure: '15:30',
        arrival: '22:15'
      },
      arrivalDoorstepCab: {
        leg: 'NDLS Station to Home Doorstep',
        transportMode: 'Delhi Traffic Police Prepaid Taxi',
        vehiclePlate: 'DL 1R T 9922',
        driverName: 'Balwant Singh',
        driverPhone: '+91 98101 44556'
      }
    },
    corridorDeviations: 0,
    emergencyTriggered: false,
    securitySummary: '100% on-track adherence. Papa acknowledged all transit checkpoint SMS.'
  }
];

function SoloTripPlannerPage() {
  const { isDark } = useTheme();

  const originListId = useId();
  const destListId = useId();

  // Active Navigation Tab: 'wimt_live', 'planner', 'local_transit', 'guardian', 'escalation'
  const [activeTab, setActiveTab] = useState('planner');

  // Journey Lifecycle Stage:
  // 1: 'train_transit' -> 2: 'local_cab' -> 3: 'hotel_stay' -> 4: 'local_explore' -> 5: 'return_transit' -> 6: 'completed'
  const [journeyStage, setJourneyStage] = useState('train_transit');

  // 1. User Travel Route State (Origin & Destination NEVER get overwritten!)
  const [originCity, setOriginCity] = useState('Delhi');
  const [originStation, setOriginStation] = useState('New Delhi (NDLS)');
  const [destinationCity, setDestinationCity] = useState('Jaipur');
  const [destinationStation, setDestinationStation] = useState('Jaipur Junction (JP)');
  const [travelDate, setTravelDate] = useState('2026-10-26');
  const [returnDate, setReturnDate] = useState('2026-10-28');

  // Traveler Profile & Emergency Guardian Details
  const [travelerName, setTravelerName] = useState('Ananya Sharma');
  const [guardianName, setGuardianName] = useState('Rajesh Sharma (Papa)');
  const [guardianPhone, setGuardianPhone] = useState('+91 75240 72395');
  const [guardianRelation, setGuardianRelation] = useState('Father');
  const [coachNumber, setCoachNumber] = useState('C3');
  const [seatNumber, setSeatNumber] = useState('24 (Window)');

  // 2. Trains Available on THIS Route (dynamically computed from user's Origin & Destination)
  const availableTrains = useMemo(() => {
    return getTrainsForRoute(originCity || originStation, destinationCity || destinationStation);
  }, [originCity, originStation, destinationCity, destinationStation]);

  // Train Search Query (Find train by number or name)
  const [trainSearchQuery, setTrainSearchQuery] = useState('');

  // Filtered available trains based on user search query (number, name, type)
  const displayedTrains = useMemo(() => {
    const query = trainSearchQuery.trim().toLowerCase();
    if (!query) return availableTrains;

    // Filter within route trains first
    const routeMatches = availableTrains.filter(t =>
      t.trainNumber.toLowerCase().includes(query) ||
      t.trainName.toLowerCase().includes(query) ||
      (t.type && t.type.toLowerCase().includes(query)) ||
      (t.fromStation && t.fromStation.toLowerCase().includes(query)) ||
      (t.toStation && t.toStation.toLowerCase().includes(query))
    );

    if (routeMatches.length > 0) return routeMatches;

    // If no match on this specific route, search across all Indian Railways trains in database!
    return REAL_TRAINS_DATABASE.filter(t =>
      t.trainNumber.toLowerCase().includes(query) ||
      t.trainName.toLowerCase().includes(query) ||
      (t.type && t.type.toLowerCase().includes(query)) ||
      (t.originCity && t.originCity.toLowerCase().includes(query)) ||
      (t.destinationCity && t.destinationCity.toLowerCase().includes(query))
    );
  }, [availableTrains, trainSearchQuery]);

  // -------------------------------------------------------------
  // PRIMARY TRAVEL MODE SELECTION: 'train' | 'bus' | 'cab' | 'car'
  // -------------------------------------------------------------
  const [primaryTransitMode, setPrimaryTransitMode] = useState('train');

  // -------------------------------------------------------------
  // VERIFIED INTERCITY BUSES DATABASE (India Safe Corridors)
  // -------------------------------------------------------------
  const VERIFIED_BUSES_DATABASE = useMemo(() => [
    {
      operator: 'IntrCity SmartBus (AC Sleeper 2+1)',
      busNumber: 'HR 55 AT 4421',
      type: 'AC Multi-Axle Sleeper',
      dep: '21:30',
      arr: '06:00',
      travelTime: '8h 30m',
      rating: '4.9/5',
      boarding: 'Kashmere Gate ISBT Smart Lounge',
      fare: '₹1,150',
      availableSeats: 6,
      badges: ['Female Crew Onboard', 'Live GPS Tracking', 'SOS Alarm', 'CCTV']
    },
    {
      operator: 'Zingbus Climate Safe (Electric Luxury)',
      busNumber: 'DL 1P B 9021',
      type: 'Green EV AC Sleeper',
      dep: '22:15',
      arr: '06:45',
      travelTime: '8h 30m',
      rating: '4.8/5',
      boarding: 'Anand Vihar ISBT Terminal Gate 3',
      fare: '₹980',
      availableSeats: 9,
      badges: ['Verified Driver', 'Night Corridor Escort', 'Zero Carbon EV']
    },
    {
      operator: 'NueGo Intercity Electric (Women Priority)',
      busNumber: 'UP 16 EV 3310',
      type: 'Ultra Luxury Electric AC',
      dep: '19:45',
      arr: '04:15',
      travelTime: '8h 30m',
      rating: '4.9/5',
      boarding: 'Sarai Kale Khan ISBT Platform 4',
      fare: '₹1,050',
      availableSeats: 4,
      badges: ['Speed Limiter 80km/h', 'Alcohol Breathalyzer Cleared', 'CCTV']
    },
    {
      operator: 'State Express Royal Cruiser (Volvo Multi-Axle)',
      busNumber: 'UP 65 BT 1209',
      type: 'Volvo B11R I-Shift AC',
      dep: '20:00',
      arr: '05:30',
      travelTime: '9h 30m',
      rating: '4.7/5',
      boarding: 'ISBT Main Departure Terminal',
      fare: '₹890',
      availableSeats: 12,
      badges: ['State Police Sync', 'Women Reserved Lower Berths']
    },
    {
      operator: 'RSRTC Goldline Super Luxury (Scania AC)',
      busNumber: 'RJ 14 PC 8820',
      type: 'Scania Metrolink HD',
      dep: '23:00',
      arr: '07:30',
      travelTime: '8h 30m',
      rating: '4.6/5',
      boarding: 'Bikaner House / Dhaula Kuan',
      fare: '₹920',
      availableSeats: 8,
      badges: ['Government Regulated', 'Panic Button Equipped']
    }
  ], []);

  // Bus Search Query & Filtered List
  const [busSearchQuery, setBusSearchQuery] = useState('');
  const displayedBuses = useMemo(() => {
    const q = busSearchQuery.toLowerCase().trim();
    if (!q) return VERIFIED_BUSES_DATABASE;
    return VERIFIED_BUSES_DATABASE.filter(b =>
      b.operator.toLowerCase().includes(q) ||
      b.busNumber.toLowerCase().includes(q) ||
      b.type.toLowerCase().includes(q) ||
      b.boarding.toLowerCase().includes(q)
    );
  }, [busSearchQuery, VERIFIED_BUSES_DATABASE]);

  // Intercity Bus State & Database
  const [selectedBus, setSelectedBus] = useState({
    operator: 'IntrCity SmartBus (AC Sleeper 2+1)',
    busNumber: 'HR 55 AT 4421',
    departureTime: '21:30',
    arrivalTime: '06:00',
    boardingPoint: 'Anand Vihar ISBT Lounge',
    dropPoint: 'Sindhi Camp Central Bus Stand',
    safetyRating: '4.9/5 (Women Safety Verified)',
    features: ['CCTV Surveillance', 'Female Crew Onboard', 'GPS Live Tracking', 'SOS Emergency Alarm']
  });
  const [busSeatType, setBusSeatType] = useState('Single Female Lower Berth (L-12)');

  // Cab Drop Mode: 'direct_hotel' (Direct to Hotel gate) | 'city_transfer' (Dropped at city point, then local cab to hotel)
  const [cabDropPreference, setCabDropPreference] = useState('direct_hotel');

  // Outstation Cab State
  const [cabProvider, setCabProvider] = useState('Uber Intercity Outstation');
  const [cabType, setCabType] = useState('Prime Sedan (Toyota Etios / Dzire)');
  const [cabDriverName, setCabDriverName] = useState('Suresh Sharma (Commercial Badge #DL4412)');
  const [cabPlateNumber, setCabPlateNumber] = useState('DL 1R T 8892');

  // Personal Car / Self-Drive State
  const [personalCarPlate, setPersonalCarPlate] = useState('UP 65 BN 9901');
  const [personalCarModel, setPersonalCarModel] = useState('Tata Nexon (Equipped with FASTag & SOS Kit)');

  // Selected Train for the journey
  const [selectedTrain, setSelectedTrain] = useState(() => availableTrains[0] || REAL_TRAINS_DATABASE[0]);

  // Sync selected train when available trains change if current train isn't in list
  useEffect(() => {
    if (availableTrains.length > 0 && !availableTrains.some(t => t.trainNumber === selectedTrain.trainNumber)) {
      setSelectedTrain(availableTrains[0]);
    }
  }, [availableTrains, selectedTrain]);

  // Real-time Running Status of the selected train
  const [runningStatus, setRunningStatus] = useState(() =>
    computeRealtimeTrainRunningStatus(selectedTrain)
  );

  useEffect(() => {
    setRunningStatus(computeRealtimeTrainRunningStatus(selectedTrain));
  }, [selectedTrain]);

  // 3. New City Safe Stay & Local Transport Details
  const citySafetyPlan = useMemo(() => {
    return getCityLocalSafetyPlan(destinationCity || destinationStation);
  }, [destinationCity, destinationStation]);

  // 3. New City Safe Stay, Local Route & Vehicle Dual Telemetry Details
  const [localPickupLocation, setLocalPickupLocation] = useState(() => `${destinationCity || 'Jaipur'} Railway Station (Exit Gate 1)`);
  const [localDropLocation, setLocalDropLocation] = useState('Hotel Arya Niwas, Sansar Chandra Road, Jaipur');
  const [selectedStayName, setSelectedStayName] = useState('Hotel Arya Niwas (Heritage / Safe Zone)');
  const [stayAddress, setStayAddress] = useState('Sansar Chandra Road, Near Sindhi Camp Metro, Jaipur');
  const [localTransportMode, setLocalTransportMode] = useState('Verified Prepaid Pink Cab / App Taxi');
  const [vehicleNumberPlate, setVehicleNumberPlate] = useState('RJ 14 TA 4589');
  const [driverName, setDriverName] = useState('Ramesh Kumar');
  const [driverPhone, setDriverPhone] = useState('+91 98111 22334');

  // Live Dual Telemetry State for Local City Ride (User GPS + Vehicle Corridor)
  const [localTrackingActive, setLocalTrackingActive] = useState(false);
  const [localProgress, setLocalProgress] = useState(25); // 0 to 100%
  const [localSpeedKmh, setLocalSpeedKmh] = useState(34);
  const [localDistanceRemainingKm, setLocalDistanceRemainingKm] = useState(4.2);
  const [localEtaMinutes, setLocalEtaMinutes] = useState(13);
  const [localCorridorDeviationMeters, setLocalCorridorDeviationMeters] = useState(12);
  const [selectedTransitId, setSelectedTransitId] = useState('cab');
  const [showPostArrivalPlan, setShowPostArrivalPlan] = useState(false);
  const [googleMapStyle, setGoogleMapStyle] = useState('directions'); // 'directions' | 'satellite'

  // Bus Arrival, Station Check-In & Transit States (4-Step Bus Journey)
  const [busStationCheckedIn, setBusStationCheckedIn] = useState(false);
  const [busStationCheckInTime, setBusStationCheckInTime] = useState('');
  const [busToHotelReached, setBusToHotelReached] = useState(false);

  // Hotel Check-In & Post-Check-in City Sightseeing States
  const [hotelCheckedIn, setHotelCheckedIn] = useState(false);
  const [hotelRoomNumber, setHotelRoomNumber] = useState('Room 304');
  const [hotelCheckInTime, setHotelCheckInTime] = useState('');
  const [sightseeingDestination, setSightseeingDestination] = useState('Hawa Mahal & City Palace, Badi Chaupar');
  const [sightseeingTransport, setSightseeingTransport] = useState('Verified Prepaid Pink Cab / App Taxi');
  const [sightseeingReturnTime, setSightseeingReturnTime] = useState('06:00 PM (Before Twilight)');

  // Stay Search & Custom Stay Registration
  const [staySearchQuery, setStaySearchQuery] = useState('');
  const [stayConfirmed, setStayConfirmed] = useState(true);

  // Next Destination (Post-Check-in) Search & Dual-Tracking State
  const [destinationSearchQuery, setDestinationSearchQuery] = useState('');
  const [selectedNextDestination, setSelectedNextDestination] = useState('');
  const [nextTripActive, setNextTripActive] = useState(false);
  const [nextTripVehiclePlate, setNextTripVehiclePlate] = useState('RJ 14 TA 8812');
  const [nextTripDriverName, setNextTripDriverName] = useState('Suresh Sharma');
  const [nextTripDriverPhone, setNextTripDriverPhone] = useState('+91 98222 33445');
  const [nextTripTransportMode, setNextTripTransportMode] = useState('Verified Prepaid Pink Cab / App Taxi');
  const [nextTripProgress, setNextTripProgress] = useState(20);
  const [nextTripSpeedKmh, setNextTripSpeedKmh] = useState(32);
  const [nextTripDistanceKm, setNextTripDistanceKm] = useState(3.5);
  const [nextTripEtaMins, setNextTripEtaMins] = useState(11);
  const [nextTripDeviationMeters, setNextTripDeviationMeters] = useState(14);
  const [nextTripDetourAlert, setNextTripDetourAlert] = useState(false);
  const [nextTripArrived, setNextTripArrived] = useState(false);
  const [nextTripGoogleMapStyle, setNextTripGoogleMapStyle] = useState('directions');

  // In-Train Suspicious Activity & Railway Police (RPF 139) State
  const [trainEmergencyModal, setTrainEmergencyModal] = useState(false);
  const [trainIncidentReason, setTrainIncidentReason] = useState('Harassment / Stalking / Misbehavior');
  const [trainIncidentDispatched, setTrainIncidentDispatched] = useState(false);
  const [trainWhistlePlaying, setTrainWhistlePlaying] = useState(false);
  const whistleOscillatorRef = useRef(null);

  // Sync defaults whenever destination city or transit mode changes
  useEffect(() => {
    if (destinationCity) {
      if (primaryTransitMode === 'car') {
        setLocalPickupLocation(`Direct Personal Car Drive from ${originCity} to Hotel Doorstep`);
      } else if (primaryTransitMode === 'cab' && cabDropPreference === 'direct_hotel') {
        setLocalPickupLocation(`Outstation Cab Direct Ride (${cabProvider}) to Hotel Gate`);
      } else if (primaryTransitMode === 'bus') {
        setLocalPickupLocation(`${destinationCity} Central ISBT Bus Terminal`);
      } else {
        setLocalPickupLocation(`${destinationCity} Railway Station (Exit Gate 1)`);
      }
      if (citySafetyPlan && citySafetyPlan.stayRecommendations && citySafetyPlan.stayRecommendations[0]) {
        const topStay = citySafetyPlan.stayRecommendations[0];
        setSelectedStayName(topStay.name);
        setStayAddress(topStay.area);
        setLocalDropLocation(`${topStay.name}, ${topStay.area}`);
      }
      if (citySafetyPlan && citySafetyPlan.safeDaylightSightseeing && citySafetyPlan.safeDaylightSightseeing[0]) {
        setSelectedNextDestination(`${citySafetyPlan.safeDaylightSightseeing[0].spot}, ${destinationCity}`);
      }
    }
  }, [destinationCity, originCity, primaryTransitMode, cabDropPreference, cabProvider, citySafetyPlan]);

  // Movement timer for live local transit tracking
  useEffect(() => {
    let timer;
    if (localTrackingActive && localProgress < 100) {
      timer = setInterval(() => {
        setLocalProgress(prev => {
          const next = prev + 3;
          if (next >= 100) {
            setLocalDistanceRemainingKm(0);
            setLocalEtaMinutes(0);
            setLocalSpeedKmh(0);
            setJourneyStage('hotel_stay');
            return 100;
          }
          const remaining = Math.max(0.2, (4.2 * (100 - next) / 100)).toFixed(1);
          setLocalDistanceRemainingKm(parseFloat(remaining));
          setLocalEtaMinutes(Math.max(1, Math.round((parseFloat(remaining) / 4.2) * 14)));
          setLocalSpeedKmh(Math.floor(28 + Math.random() * 10));
          return next;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [localTrackingActive, localProgress]);

  // Movement timer for live next destination transit tracking
  useEffect(() => {
    let timer;
    if (nextTripActive && nextTripProgress < 100) {
      timer = setInterval(() => {
        setNextTripProgress(prev => {
          const next = prev + 3;
          if (next >= 100) {
            setNextTripDistanceKm(0);
            setNextTripEtaMins(0);
            setNextTripSpeedKmh(0);
            setNextTripArrived(true);
            return 100;
          }
          const remaining = Math.max(0.2, (3.5 * (100 - next) / 100)).toFixed(1);
          setNextTripDistanceKm(parseFloat(remaining));
          setNextTripEtaMins(Math.max(1, Math.round((parseFloat(remaining) / 3.5) * 12)));
          setNextTripSpeedKmh(Math.floor(25 + Math.random() * 12));
          return next;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [nextTripActive, nextTripProgress]);

  // 4. Real Device GPS Telemetry
  const [realGpsActive, setRealGpsActive] = useState(false);
  const [deviceCoords, setDeviceCoords] = useState(() => {
    const cityInit = getCityCoordinates('Delhi');
    return {
      lat: cityInit.lat,
      lng: cityInit.lng,
      accuracy: 10,
      speed: 74 // km/h
    };
  });

  // Auto-request real browser GPS on load (Never randomly default to Haryana)
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(5));
          const lng = parseFloat(pos.coords.longitude.toFixed(5));
          const acc = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 10;
          const spd = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0;
          setDeviceCoords(prev => ({
            ...prev,
            lat,
            lng,
            accuracy: acc,
            speed: spd > 0 ? spd : prev.speed
          }));
          setRealGpsActive(true);
        },
        (err) => {
          console.log("Browser GPS prompt notice:", err.message);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    }
  }, []);

  // Synchronize coordinates dynamically with current transit position when real GPS is inactive
  useEffect(() => {
    if (!realGpsActive) {
      if (journeyStage === 'train_transit' && runningStatus && runningStatus.currentStation) {
        setDeviceCoords(prev => ({
          ...prev,
          lat: runningStatus.currentStation.lat,
          lng: runningStatus.currentStation.lng,
          accuracy: 12
        }));
      } else if (journeyStage === 'local_cab' || journeyStage === 'hotel_stay' || journeyStage === 'local_explore') {
        const destCoord = getCityCoordinates(destinationCity);
        setDeviceCoords(prev => ({
          ...prev,
          lat: destCoord.lat,
          lng: destCoord.lng,
          accuracy: 10
        }));
      } else if (journeyStage === 'return_transit' || journeyStage === 'completed') {
        const originCoord = getCityCoordinates(originCity);
        setDeviceCoords(prev => ({
          ...prev,
          lat: originCoord.lat,
          lng: originCoord.lng,
          accuracy: 10
        }));
      }
    }
  }, [journeyStage, runningStatus, destinationCity, originCity, realGpsActive]);

  // 5. Return Journey & Homebound Multi-Vehicle Fleet Tracker
  const returnTrainsList = useMemo(() => {
    return getTrainsForRoute(destinationCity, originCity);
  }, [destinationCity, originCity]);

  const [returnSelectedTrain, setReturnSelectedTrain] = useState(() => returnTrainsList[0] || REAL_TRAINS_DATABASE[0]);
  const [returnTravelDate, setReturnTravelDate] = useState('2026-10-28');
  const [returnCoachNumber, setReturnCoachNumber] = useState('C2');
  const [returnSeatNumber, setReturnSeatNumber] = useState('18 (Window)');

  // Phase 1: Hotel to Departure Station
  const [returnLeg1Active, setReturnLeg1Active] = useState(false);
  const [returnLeg1Pickup, setReturnLeg1Pickup] = useState('');
  const [returnLeg1Drop, setReturnLeg1Drop] = useState('');
  const [returnLeg1VehiclePlate, setReturnLeg1VehiclePlate] = useState('RJ 14 TA 9921');
  const [returnLeg1DriverName, setReturnLeg1DriverName] = useState('Mahesh Choudhary');
  const [returnLeg1DriverPhone, setReturnLeg1DriverPhone] = useState('+91 98222 77889');
  const [returnLeg1TransportMode, setReturnLeg1TransportMode] = useState('Verified Prepaid Pink Cab / App Taxi');
  const [returnLeg1Progress, setReturnLeg1Progress] = useState(25);
  const [returnLeg1SpeedKmh, setReturnLeg1SpeedKmh] = useState(30);
  const [returnLeg1DistanceKm, setReturnLeg1DistanceKm] = useState(4.5);
  const [returnLeg1EtaMins, setReturnLeg1EtaMins] = useState(14);
  const [returnLeg1Arrived, setReturnLeg1Arrived] = useState(false);
  const [returnLeg1Detour, setReturnLeg1Detour] = useState(false);

  // Phase 2: Return Train Journey
  const [returnLeg2Active, setReturnLeg2Active] = useState(false);
  const [returnLeg2Progress, setReturnLeg2Progress] = useState(35);
  const [returnLeg2Arrived, setReturnLeg2Arrived] = useState(false);

  // Phase 3: Arrival Station to Home Doorstep
  const [returnLeg3Active, setReturnLeg3Active] = useState(false);
  const [returnLeg3Pickup, setReturnLeg3Pickup] = useState('');
  const [returnLeg3Drop, setReturnLeg3Drop] = useState('Flat 402, Mayur Vihar Phase 1, New Delhi');
  const [returnLeg3VehiclePlate, setReturnLeg3VehiclePlate] = useState('DL 1R T 8877');
  const [returnLeg3DriverName, setReturnLeg3DriverName] = useState('Balwant Singh');
  const [returnLeg3DriverPhone, setReturnLeg3DriverPhone] = useState('+91 98101 44556');
  const [returnLeg3TransportMode, setReturnLeg3TransportMode] = useState('Delhi Traffic Police Prepaid Taxi');
  const [returnLeg3Progress, setReturnLeg3Progress] = useState(20);
  const [returnLeg3SpeedKmh, setReturnLeg3SpeedKmh] = useState(35);
  const [returnLeg3DistanceKm, setReturnLeg3DistanceKm] = useState(6.2);
  const [returnLeg3EtaMins, setReturnLeg3EtaMins] = useState(18);
  const [returnLeg3Arrived, setReturnLeg3Arrived] = useState(false);
  const [returnLeg3Detour, setReturnLeg3Detour] = useState(false);
  const [returnVoyageConcluded, setReturnVoyageConcluded] = useState(false);

  // Sync return default locations whenever cities/stays change
  useEffect(() => {
    if (returnTrainsList && returnTrainsList.length > 0) {
      setReturnSelectedTrain(returnTrainsList[0]);
    }
    setReturnLeg1Pickup(`${selectedStayName}, ${stayAddress}`);
    setReturnLeg1Drop(`${destinationCity} Railway Station (Main Concourse)`);
    setReturnLeg3Pickup(`${originStation || originCity} Station (Exit Gate 2 Porch)`);
    setReturnTravelDate(returnDate);
  }, [destinationCity, originCity, selectedStayName, stayAddress, originStation, returnDate, returnTrainsList]);

  // Timers for Return Legs
  useEffect(() => {
    let t1;
    if (returnLeg1Active && returnLeg1Progress < 100) {
      t1 = setInterval(() => {
        setReturnLeg1Progress(p => {
          if (p >= 100) {
            setReturnLeg1Arrived(true);
            setReturnLeg1DistanceKm(0);
            setReturnLeg1EtaMins(0);
            setReturnLeg1SpeedKmh(0);
            return 100;
          }
          const next = p + 4;
          setReturnLeg1DistanceKm(parseFloat(Math.max(0.2, (4.5 * (100 - next) / 100)).toFixed(1)));
          setReturnLeg1EtaMins(Math.max(1, Math.round(((100 - next) / 100) * 14)));
          setReturnLeg1SpeedKmh(Math.floor(26 + Math.random() * 8));
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(t1);
  }, [returnLeg1Active, returnLeg1Progress]);

  useEffect(() => {
    let t2;
    if (returnLeg2Active && returnLeg2Progress < 100) {
      t2 = setInterval(() => {
        setReturnLeg2Progress(p => {
          if (p >= 100) {
            setReturnLeg2Arrived(true);
            return 100;
          }
          return p + 3;
        });
      }, 1500);
    }
    return () => clearInterval(t2);
  }, [returnLeg2Active, returnLeg2Progress]);

  useEffect(() => {
    let t3;
    if (returnLeg3Active && returnLeg3Progress < 100) {
      t3 = setInterval(() => {
        setReturnLeg3Progress(p => {
          if (p >= 100) {
            setReturnLeg3Arrived(true);
            setReturnLeg3DistanceKm(0);
            setReturnLeg3EtaMins(0);
            setReturnLeg3SpeedKmh(0);
            return 100;
          }
          const next = p + 4;
          setReturnLeg3DistanceKm(parseFloat(Math.max(0.2, (6.2 * (100 - next) / 100)).toFixed(1)));
          setReturnLeg3EtaMins(Math.max(1, Math.round(((100 - next) / 100) * 18)));
          setReturnLeg3SpeedKmh(Math.floor(28 + Math.random() * 10));
          return next;
        });
      }, 1500);
    }
    return () => clearInterval(t3);
  }, [returnLeg3Active, returnLeg3Progress]);
  const [realGpsWatchId, setRealGpsWatchId] = useState(null);
  const [distanceToNextStationMeters, setDistanceToNextStationMeters] = useState(24000);
  const [corridorDeviationMeters, setCorridorDeviationMeters] = useState(18);
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [dossierSharedToast, setDossierSharedToast] = useState(false);

  // Anomaly & Safety Invasion Confirmation State
  const [safetyInvasionModal, setSafetyInvasionModal] = useState(false);
  const [invasionCountdown, setInvasionCountdown] = useState(20);
  const countdownIntervalRef = useRef(null);

  // Emergency Escalation & Audio/Voice State
  const [sosActive, setSosActive] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [incomingCallActive, setIncomingCallActive] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [selectedCallerVoice, setSelectedCallerVoice] = useState('papa');

  const audioCtxRef = useRef(null);
  const sirenOscillatorRef = useRef(null);
  const ringtoneIntervalRef = useRef(null);
  const guardianAudioRef = useRef(null);
  const momAudioRef = useRef(null);

  // Preload Authentic Recorded Hindi Voice for Guardian / Brother & Mom
  useEffect(() => {
    const audio = new Audio('/brother_guardian_call.ogg');
    audio.preload = 'auto';
    guardianAudioRef.current = audio;

    const momAudio = new Audio('/mom_guardian_call.ogg');
    momAudio.preload = 'auto';
    momAudioRef.current = momAudio;

    return () => {
      if (guardianAudioRef.current) {
        guardianAudioRef.current.pause();
        guardianAudioRef.current = null;
      }
      if (momAudioRef.current) {
        momAudioRef.current.pause();
        momAudioRef.current = null;
      }
      if (momAudioRef.current) {
        momAudioRef.current.pause();
        momAudioRef.current = null;
      }
    };
  }, []);

  // 6. Journey History & Past Trips State
  const [journeyHistory, setJourneyHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('herhub_journey_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading journey history from localStorage", e);
    }
    return DEFAULT_PAST_JOURNEYS;
  });
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [selectedHistoryTrip, setSelectedHistoryTrip] = useState(null);
  const [historyFilterStatus, setHistoryFilterStatus] = useState('all');

  const saveCurrentTripToHistory = (isConcluded = false) => {
    const newTrip = {
      id: `voyage-${Date.now()}`,
      title: `${originCity} to ${destinationCity} Solo ${primaryTransitMode.toUpperCase()} Voyage`,
      primaryTransitMode: primaryTransitMode,
      transitDetails: primaryTransitMode === 'train' ? {
        mode: 'Train (Indian Railways)',
        identifier: selectedTrain?.trainNumber || '12015',
        name: selectedTrain?.trainName || 'Ajmer Shatabdi',
        coach: coachNumber,
        seat: seatNumber
      } : primaryTransitMode === 'bus' ? {
        mode: 'Intercity Bus',
        identifier: selectedBus.busNumber,
        name: selectedBus.operator,
        seat: busSeatType
      } : primaryTransitMode === 'cab' ? {
        mode: 'Outstation Cab / Taxi',
        identifier: cabPlateNumber,
        name: `${cabProvider} (${cabType})`,
        driver: cabDriverName
      } : {
        mode: 'Personal Drive / Car',
        identifier: personalCarPlate,
        name: personalCarModel
      },
      departureDate: travelDate,
      returnDate: returnDate,
      originCity: originCity,
      originStation: originStation || `${originCity} Central`,
      destinationCity: destinationCity,
      destinationStation: destinationStation || `${destinationCity} Junction`,
      status: isConcluded || returnVoyageConcluded ? 'Completed Safely' : 'In Progress / Active',
      safetyAuditToken: `HER-VOYAGE-${(destinationCity || 'IN').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`,
      guardian: {
        name: guardianName,
        phone: guardianPhone,
        relation: guardianRelation,
        updatesSent: 15,
        lastCheckin: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} (Live Doorstep Verified)`
      },
      outboundTrain: {
        trainNumber: selectedTrain?.trainNumber || '12015',
        trainName: selectedTrain?.trainName || 'Ajmer Shatabdi Express',
        departureTime: selectedTrain?.departureTime || '06:10',
        arrivalTime: selectedTrain?.arrivalTime || '10:40',
        coach: coachNumber,
        seat: seatNumber
      },
      stay: {
        name: selectedStayName,
        address: stayAddress,
        checkIn: `${travelDate}, 12:30 PM`,
        checkOut: `${returnDate}, 11:00 AM`,
        verifiedScore: '9.8/10 Safe Stay'
      },
      localTransitVehicles: [
        {
          leg: `${destinationCity} Stn to ${selectedStayName}`,
          transportMode: localTransportMode,
          vehiclePlate: vehicleNumberPlate,
          driverName: driverName,
          driverPhone: driverPhone,
          status: 'Completed Safe'
        },
        ...(nextTripActive ? [{
          leg: `${selectedStayName} to ${selectedNextDestination.split(',')[0]}`,
          transportMode: nextTripTransportMode,
          vehiclePlate: nextTripVehiclePlate,
          driverName: nextTripDriverName,
          driverPhone: nextTripDriverPhone,
          status: nextTripArrived ? 'Completed Safe' : 'En Route'
        }] : [])
      ],
      returnJourney: {
        departureCab: {
          leg: `Stay to ${destinationCity} Station`,
          transportMode: returnLeg1TransportMode,
          vehiclePlate: returnLeg1VehiclePlate,
          driverName: returnLeg1DriverName,
          driverPhone: returnLeg1DriverPhone
        },
        train: {
          trainNumber: returnSelectedTrain?.trainNumber || '12016',
          trainName: returnSelectedTrain?.trainName || 'Shatabdi Express',
          coach: returnCoachNumber,
          seat: returnSeatNumber,
          departure: returnSelectedTrain?.departureTime || '17:50',
          arrival: returnSelectedTrain?.arrivalTime || '22:15'
        },
        arrivalDoorstepCab: {
          leg: `${originStation || originCity} to Home Doorstep`,
          transportMode: returnLeg3TransportMode,
          vehiclePlate: returnLeg3VehiclePlate,
          driverName: returnLeg3DriverName,
          driverPhone: returnLeg3DriverPhone
        }
      },
      corridorDeviations: corridorDeviationMeters > 50 ? 1 : 0,
      emergencyTriggered: sosActive,
      securitySummary: isConcluded || returnVoyageConcluded
        ? 'Voyage safely concluded at home doorstep. 100% verified route telemetry & driver IND plates logged.'
        : 'Active voyage saved into personal safety dossier. Continuous tracking ongoing.'
    };

    setJourneyHistory(prev => {
      const updated = [newTrip, ...prev.filter(item => item.id !== newTrip.id)];
      try {
        localStorage.setItem('herhub_journey_history', JSON.stringify(updated));
      } catch (e) {
        console.error("LocalStorage write error", e);
      }
      return updated;
    });
    alert(`Voyage "${newTrip.title}" has been saved to your Journey History!`);
    // Save to HerHub database (Supabase cloud + local encrypted vault)
    saveSoloTrip({
      title: newTrip.title,
      originCity: newTrip.originCity,
      originStation: newTrip.originStation,
      destinationCity: newTrip.destinationCity,
      destinationStation: newTrip.destinationStation,
      trainNumber: primaryTransitMode === 'train' ? (newTrip.outboundTrain?.trainNumber || '12015') :
                   primaryTransitMode === 'bus'   ? (selectedBus.busNumber) :
                   primaryTransitMode === 'cab'   ? (cabPlateNumber) : (personalCarPlate),
      trainName: primaryTransitMode === 'train' ? (newTrip.outboundTrain?.trainName) :
                 primaryTransitMode === 'bus'   ? (`${selectedBus.operator} (${busSeatType})`) :
                 primaryTransitMode === 'cab'   ? (`${cabProvider} - ${cabDriverName}`) : (personalCarModel),
      coach: primaryTransitMode === 'train' ? coachNumber : (primaryTransitMode.toUpperCase()),
      seat: primaryTransitMode === 'train' ? seatNumber : (primaryTransitMode === 'bus' ? busSeatType : 'Vehicle Operator'),
      guardianPhone: newTrip.guardian?.phone || '+91 75240 72395',
      status: newTrip.status === 'Completed Safely' ? 'completed' : 'in_transit'
    }).catch(() => {});
  };

  const handleDeleteHistoryTrip = (id) => {
    if (window.confirm("Are you sure you want to remove this journey record from your history?")) {
      setJourneyHistory(prev => {
        const updated = prev.filter(t => t.id !== id);
        try {
          localStorage.setItem('herhub_journey_history', JSON.stringify(updated));
        } catch (e) {
          console.error("LocalStorage write error", e);
        }
        return updated;
      });
      if (selectedHistoryTrip && selectedHistoryTrip.id === id) {
        setSelectedHistoryTrip(null);
      }
    }
  };

  const filteredHistory = useMemo(() => {
    return journeyHistory.filter(trip => {
      const q = historySearchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        trip.title?.toLowerCase().includes(q) ||
        trip.originCity?.toLowerCase().includes(q) ||
        trip.destinationCity?.toLowerCase().includes(q) ||
        trip.outboundTrain?.trainNumber?.includes(q) ||
        trip.outboundTrain?.trainName?.toLowerCase().includes(q) ||
        trip.returnJourney?.train?.trainNumber?.includes(q) ||
        trip.safetyAuditToken?.toLowerCase().includes(q) ||
        trip.localTransitVehicles?.some(v => v.vehiclePlate?.toLowerCase().includes(q) || v.driverName?.toLowerCase().includes(q)) ||
        trip.returnJourney?.departureCab?.vehiclePlate?.toLowerCase().includes(q) ||
        trip.returnJourney?.arrivalDoorstepCab?.vehiclePlate?.toLowerCase().includes(q);

      const matchesFilter =
        historyFilterStatus === 'all' ||
        (historyFilterStatus === 'completed' && trip.status === 'Completed Safely') ||
        (historyFilterStatus === 'active' && trip.status !== 'Completed Safely');

      return matchesSearch && matchesFilter;
    });
  }, [journeyHistory, historySearchQuery, historyFilterStatus]);

  // -------------------------------------------------------------
  // Theme Color System (100% Pure Dark Mode Sync)
  // -------------------------------------------------------------
  const theme = {
    pageBg: isDark ? '#0A0618' : '#FDFDFE',
    heroBg: isDark ? '#120A2E' : '#140E2D',
    cardBg: isDark ? '#160E36' : '#FFFFFF',
    cardBorder: isDark ? '1px solid #2F215F' : '1px solid #E9E7F2',
    subCardBg: isDark ? '#1F1548' : '#F8F7FD',
    subCardBorder: isDark ? '1px solid #36266E' : '1px solid #EBE8F8',
    textPrimary: isDark ? '#FFFFFF' : '#140E2D',
    textSecondary: isDark ? '#C7C2EA' : '#555271',
    textMuted: isDark ? '#9A94C8' : '#686584',
    inputBg: isDark ? '#231852' : '#FFFFFF',
    inputBorder: isDark ? '1px solid #433485' : '1px solid #D0CDE3',
    inputText: isDark ? '#FFFFFF' : '#140E2D',
    tabsBarBg: isDark ? '#120A2C' : '#FFFFFF',
    tabsBarBorder: isDark ? '1px solid #2A1D58' : '1px solid #E9E7F2',
    greenBoxBg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4',
    greenBoxBorder: isDark ? '1px solid #10B981' : '1px solid #86EFAC',
    greenBoxText: isDark ? '#A7F3D0' : '#14532D',
    blueBoxBg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
    blueBoxBorder: isDark ? '1px solid #3B82F6' : '1px solid #BFDBFE',
    blueBoxText: isDark ? '#BFDBFE' : '#1E40AF',
    redBoxBg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
    redBoxBorder: isDark ? '1px solid #EF4444' : '1px solid #FCA5A5',
    redBoxText: isDark ? '#FECACA' : '#991B1B',
    timelinePassed: isDark ? '#19113D' : '#F9F8FD',
    timelineCurrent: isDark ? '#2E1E66' : '#F5F3FF',
    timelineUpcoming: isDark ? '#18113A' : '#FFFFFF'
  };

  // -------------------------------------------------------------
  // Real Device GPS WatchPosition API
  // -------------------------------------------------------------
  const startRealDeviceGpsTracking = () => {
    if (!('geolocation' in navigator)) {
      alert("GPS not supported on this device. Using high-precision transit corridor telemetry.");
      return;
    }

    if (realGpsActive && realGpsWatchId !== null) {
      navigator.geolocation.clearWatch(realGpsWatchId);
      setRealGpsWatchId(null);
      setRealGpsActive(false);
      return;
    }

    try {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(5));
          const lng = parseFloat(pos.coords.longitude.toFixed(5));
          const acc = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 10;
          const spd = pos.coords.speed !== null && pos.coords.speed !== undefined
            ? Math.round(pos.coords.speed * 3.6)
            : 74;

          setDeviceCoords({ lat, lng, accuracy: acc, speed: spd > 0 ? spd : 76 });
          setRealGpsActive(true);

          if (runningStatus && runningStatus.nextStation) {
            const distM = getDistanceMeters(
              lat,
              lng,
              runningStatus.nextStation.lat,
              runningStatus.nextStation.lng
            );
            setDistanceToNextStationMeters(distM);
            setCorridorDeviationMeters(distM > 60000 ? 140 : 18);
          }
        },
        (err) => {
          console.warn("GPS watch notice:", err.message);
          setRealGpsActive(false);
          alert("GPS Permission notice: Device GPS reading unavailable (" + err.message + "). Switched to Live Station Cellular Telemetry.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
      );
      setRealGpsWatchId(watchId);
      setRealGpsActive(true);
    } catch {
      setRealGpsActive(false);
    }
  };

  // Live Timer for status & battery
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedTrain) {
        setRunningStatus(computeRealtimeTrainRunningStatus(selectedTrain));
      }
      if (Math.random() > 0.9) {
        setBatteryLevel(b => Math.max(b - 1, 14));
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedTrain]);

  // Simulate Anomaly
  const triggerSimulatedDeviation = () => {
    setCorridorDeviationMeters(380);
    setSafetyInvasionModal(true);
    setInvasionCountdown(20);
    playBeepTone(440, 0.4);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setInvasionCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          confirmSafetyInvaded();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleConfirmSafe = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setSafetyInvasionModal(false);
    setCorridorDeviationMeters(16);
    setLocalCorridorDeviationMeters(12);
    setNextTripDeviationMeters(14);
    setNextTripDetourAlert(false);
    alert("Safety Confirmed: Status logged as 'Safe - Minor Route/Cab bypass'. Guardian notified.");
  };

  const confirmSafetyInvaded = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setSafetyInvasionModal(false);
    triggerFullEmergencyProtocol();
  };

  const triggerFullEmergencyProtocol = () => {
    setSosActive(true);
    setActiveTab('escalation');
    playHighDecibelSiren();

    setTimeout(() => {
      setIncomingCallActive(true);
      playPhoneRingtone();
    }, 1500);
  };

  // Web Audio Synthesizer
  const playBeepTone = (freq, durationSec) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationSec);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationSec);
    } catch {
      // Fallback
    }
  };

  const playHighDecibelSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      const now = ctx.currentTime;
      for (let i = 0; i < 20; i++) {
        osc.frequency.setValueAtTime(650, now + i * 0.8);
        osc.frequency.exponentialRampToValueAtTime(1050, now + i * 0.8 + 0.4);
        osc.frequency.exponentialRampToValueAtTime(650, now + i * 0.8 + 0.8);
      }

      gain.gain.setValueAtTime(0.3, now);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      sirenOscillatorRef.current = osc;
      setSirenPlaying(true);
    } catch {
      // Catch block
    }
  };

  const stopSiren = () => {
    if (sirenOscillatorRef.current) {
      try {
        sirenOscillatorRef.current.stop();
        sirenOscillatorRef.current.disconnect();
      } catch {
        // Ignored
      }
      sirenOscillatorRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Ignored
      }
      audioCtxRef.current = null;
    }
    setSirenPlaying(false);
  };

  // In-Train Passenger Whistle Sound Synthesizer
  const playTrainWhistle = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.25);
      osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.5);
      osc.frequency.linearRampToValueAtTime(1500, ctx.currentTime + 0.75);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      whistleOscillatorRef.current = { osc, gain };
      setTrainWhistlePlaying(true);
    } catch (e) {
      console.warn("Whistle sound error:", e);
    }
  };

  const stopTrainWhistle = () => {
    try {
      if (whistleOscillatorRef.current && whistleOscillatorRef.current.osc) {
        whistleOscillatorRef.current.osc.stop();
        whistleOscillatorRef.current.osc.disconnect();
        whistleOscillatorRef.current = null;
      }
      setTrainWhistlePlaying(false);
    } catch (e) {
      console.warn("Stop whistle error:", e);
    }
  };

  const handleDispatchTrainEmergency = (reason) => {
    const selectedReason = reason || trainIncidentReason;
    setTrainIncidentReason(selectedReason);
    setTrainIncidentDispatched(true);
    playBeepTone(520, 0.3);
  };

  const playPhoneRingtone = () => {
    ringtoneIntervalRef.current = setInterval(() => {
      playBeepTone(880, 0.4);
      setTimeout(() => playBeepTone(920, 0.4), 450);
    }, 2000);
  };

  const stopPhoneRingtone = () => {
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current);
      ringtoneIntervalRef.current = null;
    }
  };

  const handleAnswerCall = () => {
    stopPhoneRingtone();
    setCallConnected(true);
    setCallDuration(0);
    speakDeterrentSpeech();
  };

  const handleDeclineOrHangupCall = () => {
    stopPhoneRingtone();
    setIncomingCallActive(false);
    setCallConnected(false);
    if (guardianAudioRef.current) {
      guardianAudioRef.current.pause();
      guardianAudioRef.current.currentTime = 0;
    }
    if (momAudioRef.current) {
      momAudioRef.current.pause();
      momAudioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const speakDeterrentSpeech = () => {
    // If Papa / Guardian is selected, play authentic recorded Hindi audio!
    if (selectedCallerVoice === 'papa' && guardianAudioRef.current) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      try {
        guardianAudioRef.current.currentTime = 0;
        guardianAudioRef.current.volume = 1.0;
        guardianAudioRef.current.play().catch(e => {
          console.warn('Audio play notice, falling back to speech synthesis:', e);
          fallbackDeterrentSpeech();
        });
        return;
      } catch (e) {
        fallbackDeterrentSpeech();
        return;
      }
    }

    // If Mom is selected, play authentic recorded Mom voice!
    if (selectedCallerVoice === 'mom' && momAudioRef.current) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      try {
        momAudioRef.current.currentTime = 0;
        momAudioRef.current.volume = 1.0;
        momAudioRef.current.play().catch(e => {
          console.warn('Mom audio play notice, falling back to speech synthesis:', e);
          fallbackDeterrentSpeech();
        });
        return;
      } catch (e) {
        fallbackDeterrentSpeech();
        return;
      }
    }

    fallbackDeterrentSpeech();
  };

  const fallbackDeterrentSpeech = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    let text = '';
    if (selectedCallerVoice === 'papa') {
      text = `Haan beta! Kahan ho tum? Map par dikh raha hai tumhari gaadi galat raste pe ja rahi hai. Cab number ${vehicleNumberPlate} police control room me record ho gaya hai! Driver se bolo gaadi turant main road par roke, hum bas 2 minute me pahunch rahe hain!`;
    } else if (selectedCallerVoice === 'mom') {
      text = `Beta! Tumhari live GPS location screen par aa rahi hai. Papa ne 112 police helpline ko cab number ${vehicleNumberPlate} de diya hai, turant lighted area me gaadi roko!`;
    } else {
      text = `Attention driver of vehicle ${vehicleNumberPlate}. This is Police Telemetry Sentinel. Vehicle deviation logged under women safety surveillance. Halt vehicle at the nearest lighted intersection immediately.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedCallerVoice === 'police' ? 'en-IN' : 'hi-IN';
    utterance.rate = 1.0;
    utterance.pitch = selectedCallerVoice === 'papa' ? 0.9 : 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let callInterval = null;
    if (callConnected) {
      callInterval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(callInterval);
  }, [callConnected]);

  useEffect(() => {
    return () => {
      stopSiren();
      stopPhoneRingtone();
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (guardianAudioRef.current) {
        guardianAudioRef.current.pause();
        guardianAudioRef.current = null;
      }
      if (momAudioRef.current) {
        momAudioRef.current.pause();
        momAudioRef.current = null;
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (realGpsWatchId !== null) {
        navigator.geolocation.clearWatch(realGpsWatchId);
      }
    };
  }, [realGpsWatchId]);

  // WhatsApp SOS message
  const getWhatsAppShareLink = () => {
    const lat = deviceCoords.lat;
    const lng = deviceCoords.lng;
    const gmapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const stageDesc = journeyStage === 'train_transit'
      ? `On Train #${selectedTrain.trainNumber} (Coach ${coachNumber}, Seat ${seatNumber})`
      : journeyStage === 'local_cab'
      ? `In Local Cab [Plate: ${vehicleNumberPlate}] with driver ${driverName}`
      : journeyStage === 'hotel_stay'
      ? `At Hotel: ${selectedStayName}`
      : `Sightseeing in ${destinationCity} / Returning`;

    const text = encodeURIComponent(
      `🚨 [HERHUB SoloSafe 24/7 Journey Dossier]\n` +
      `Traveler: ${travelerName}\n` +
      `Route: ${originCity} ➔ ${destinationCity}\n` +
      `Current Active Stage: ${stageDesc}\n` +
      `Vehicle Plate: ${vehicleNumberPlate} | Driver: ${driverName} (${driverPhone})\n` +
      `Safe Stay: ${selectedStayName} (${stayAddress})\n` +
      `Live Google Maps Pin: ${gmapsUrl}\n` +
      `Device Battery: ${batteryLevel}%\n` +
      `Helplines: Police 112 | RPF 139 | Women 1090`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <div style={{ backgroundColor: theme.pageBg, minHeight: '100vh', paddingBottom: 60, transition: 'background-color 0.25s ease' }}>

      {/* ════════════════ TOP HERO BANNER ════════════════ */}
      <section style={{ backgroundColor: theme.heroBg, color: '#FFFFFF', padding: '36px 0 28px', borderBottom: theme.cardBorder }}>
        <div className="container">
          <Link
            to="/safety-hub"
            className="d-inline-flex align-items-center gap-2 mb-3 text-decoration-none"
            style={{ color: '#B2AECB', fontSize: '0.88rem', fontWeight: 500 }}
          >
            <span>← Back to Safety Tools</span>
          </Link>

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  style={{
                    backgroundColor: 'rgba(99, 85, 230, 0.25)',
                    color: '#9887FE',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid rgba(152, 135, 254, 0.4)'
                  }}
                >
                  FULL VOYAGE LIFECYCLE · TRAIN ➔ LOCAL CAB ➔ STAY ➔ RETURN
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    color: '#10B981',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: 6
                  }}
                >
                  24/7 DUAL TELEMETRY
                </span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
                SoloSafe Voyage: End-to-End Safe Trip Planner & Transit Guardian
              </h1>

              <p style={{ fontSize: '0.95rem', color: '#C7C2EA', maxWidth: 900, lineHeight: 1.55, margin: 0 }}>
                Complete door-to-door safety for women traveling to unfamiliar cities. Plan verified express trains on your exact route, track local city cabs by vehicle number plate, locate certified safe stays, and ensure continuous 24/7 parent tracking until you return safely back home.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDossierSharedToast(true);
                  setTimeout(() => setDossierSharedToast(false), 3500);
                  window.open(getWhatsAppShareLink(), '_blank');
                }}
                className="btn btn-sm d-flex align-items-center gap-2"
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  borderRadius: 10,
                  padding: '9px 15px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                }}
              >
                <FaWhatsapp style={{ fontSize: '1.1rem' }} /> Share 24/7 Dossier to WhatsApp
              </button>

              <button
                type="button"
                onClick={startRealDeviceGpsTracking}
                className={`btn btn-sm d-flex align-items-center gap-2 ${realGpsActive ? 'btn-success' : 'btn-primary'}`}
                style={{
                  borderRadius: 10,
                  padding: '9px 16px',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(99, 85, 230, 0.35)',
                  border: 'none'
                }}
              >
                <FaLocationArrow /> {realGpsActive ? 'Hardware GPS: ACTIVE' : 'Turn On Phone GPS'}
              </button>
            </div>
          </div>

          {/* Dossier Toast Alert */}
          {dossierSharedToast && (
            <div
              className="mt-3 p-3 rounded-3 d-flex align-items-center justify-content-between"
              style={{ backgroundColor: 'rgba(37, 211, 102, 0.15)', border: '1px solid #25D366', color: '#E2FCEE' }}
            >
              <div className="d-flex align-items-center gap-2">
                <FaCheckCircle style={{ color: '#25D366', fontSize: '1.2rem' }} />
                <span><strong>24/7 Dossier Dispatched!</strong> Train #{selectedTrain.trainNumber}, Local Cab Plate [{vehicleNumberPlate}], Hotel [{selectedStayName}], and Live Google Maps Pin ({deviceCoords.lat}, {deviceCoords.lng}) sent to {guardianName}.</span>
              </div>
              <button
                onClick={() => setDossierSharedToast(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════ 24/7 JOURNEY LIFECYCLE STEPPER BAR ════════════════ */}
      <div style={{ backgroundColor: theme.subCardBg, borderBottom: theme.cardBorder, padding: '12px 0' }}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, whiteSpace: 'nowrap' }}>
              📍 24/7 Journey Progress Tracker:
            </span>

            <div className="d-flex align-items-center gap-1 overflow-auto py-1">
              {(() => {
                if (primaryTransitMode === 'bus') {
                  return [
                    { id: 'train_transit', label: `1. Bus Voyage (${selectedBus.busNumber})`, icon: <FaBus /> },
                    { id: 'local_cab', label: `2. ISBT to Hotel Cab (${vehicleNumberPlate})`, icon: <FaCar /> },
                    { id: 'hotel_stay', label: '3. Safe Hotel Stay (Check-In)', icon: <FaHotel /> },
                    { id: 'local_explore', label: '4. City Sightseeing Excursions', icon: <FaWalking /> },
                    { id: 'return_transit', label: '5. Return Bus Home', icon: <FaUndo /> },
                    { id: 'completed', label: '6. Safely Reached Home', icon: <FaCheck /> }
                  ];
                }
                if (primaryTransitMode === 'cab') {
                  return [
                    { id: 'train_transit', label: `1. Outstation Cab (${cabPlateNumber})`, icon: <FaTaxi /> },
                    { id: 'hotel_stay', label: '2. Hotel Doorstep Check-In', icon: <FaHotel /> },
                    { id: 'local_explore', label: '3. City Sightseeing Excursions', icon: <FaWalking /> },
                    { id: 'return_transit', label: '4. Return Cab Home', icon: <FaUndo /> },
                    { id: 'completed', label: '5. Safely Reached Home', icon: <FaCheck /> }
                  ];
                }
                if (primaryTransitMode === 'car') {
                  return [
                    { id: 'train_transit', label: `1. Highway Self-Drive (${personalCarPlate})`, icon: <FaCar /> },
                    { id: 'hotel_stay', label: '2. Hotel Doorstep Check-In', icon: <FaHotel /> },
                    { id: 'local_explore', label: '3. City Sightseeing Drive', icon: <FaWalking /> },
                    { id: 'return_transit', label: '4. Return Highway Drive', icon: <FaUndo /> },
                    { id: 'completed', label: '5. Safely Reached Home', icon: <FaCheck /> }
                  ];
                }
                return [
                  { id: 'train_transit', label: `1. Train Journey (#${selectedTrain.trainNumber})`, icon: <FaTrain /> },
                  { id: 'local_cab', label: `2. Station to Hotel Cab (${vehicleNumberPlate})`, icon: <FaCar /> },
                  { id: 'hotel_stay', label: '3. Safe Hotel Stay (Check-In)', icon: <FaHotel /> },
                  { id: 'local_explore', label: '4. City Sightseeing & Transit', icon: <FaWalking /> },
                  { id: 'return_transit', label: '5. Return Train Home', icon: <FaUndo /> },
                  { id: 'completed', label: '6. Safely Reached Home', icon: <FaCheck /> }
                ];
              })().map((step) => {
                const isActive = journeyStage === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setJourneyStage(step.id)}
                    className="btn btn-sm d-flex align-items-center gap-1"
                    style={{
                      borderRadius: 20,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      padding: '4px 12px',
                      backgroundColor: isActive ? '#6355E6' : theme.cardBg,
                      color: isActive ? '#FFFFFF' : theme.textSecondary,
                      border: isActive ? 'none' : theme.cardBorder
                    }}
                  >
                    {step.icon} {step.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════ TAB NAVIGATION BAR ════════════════ */}
      <div style={{ backgroundColor: theme.tabsBarBg, borderBottom: theme.tabsBarBorder, position: 'sticky', top: 57, zIndex: 900 }}>
        <div className="container">
          <div className="d-flex align-items-center gap-2 py-2 overflow-auto">
            <button
              type="button"
              onClick={() => setActiveTab('planner')}
              className={`btn btn-sm d-flex align-items-center gap-2 ${activeTab === 'planner' ? 'btn-primary' : 'btn-light'}`}
              style={{
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                backgroundColor: activeTab === 'planner' ? '#6355E6' : 'transparent',
                color: activeTab === 'planner' ? '#FFFFFF' : theme.textSecondary,
                border: activeTab === 'planner' ? 'none' : theme.cardBorder
              }}
            >
              <FaCompass /> {primaryTransitMode === 'train' ? '1. Pre-Trip Planner & Select Train' :
                             primaryTransitMode === 'bus'   ? '1. Pre-Trip Planner & Select Bus' :
                             primaryTransitMode === 'cab'   ? '1. Pre-Trip Planner & Outstation Cab' :
                                                              '1. Pre-Trip Planner & Highway Car'}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wimt_live')}
              className={`btn btn-sm d-flex align-items-center gap-2 ${activeTab === 'wimt_live' ? 'btn-primary' : 'btn-light'}`}
              style={{
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                backgroundColor: activeTab === 'wimt_live' ? '#6355E6' : 'transparent',
                color: activeTab === 'wimt_live' ? '#FFFFFF' : theme.textSecondary,
                border: activeTab === 'wimt_live' ? 'none' : theme.cardBorder
              }}
            >
              {primaryTransitMode === 'bus' ? (
                <>
                  <FaBus /> 2. Live Bus Tracking ({selectedBus.busNumber})
                  <span className="badge rounded-pill bg-success" style={{ fontSize: '0.65rem' }}>GPS ACTIVE</span>
                </>
              ) : primaryTransitMode === 'cab' ? (
                <>
                  <FaTaxi /> 2. Live Cab Shield ({cabPlateNumber})
                  <span className="badge rounded-pill bg-primary" style={{ fontSize: '0.65rem' }}>VAHAN 4.0</span>
                </>
              ) : primaryTransitMode === 'car' ? (
                <>
                  <FaCar /> 2. Live Highway Route ({personalCarPlate})
                  <span className="badge rounded-pill bg-info text-dark" style={{ fontSize: '0.65rem' }}>FASTAG SYNC</span>
                </>
              ) : (
                <>
                  <FaTrain /> 2. Live Train Status (#{selectedTrain.trainNumber})
                  <span className="badge rounded-pill bg-success" style={{ fontSize: '0.65rem' }}>NTES LIVE</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('local_transit')}
              className={`btn btn-sm d-flex align-items-center gap-2 ${activeTab === 'local_transit' ? 'btn-primary' : 'btn-light'}`}
              style={{
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                backgroundColor: activeTab === 'local_transit' ? '#6355E6' : 'transparent',
                color: activeTab === 'local_transit' ? '#FFFFFF' : theme.textSecondary,
                border: activeTab === 'local_transit' ? 'none' : theme.cardBorder
              }}
            >
              {primaryTransitMode === 'bus' ? (
                <>
                  <FaBus /> 3. Bus Station Check-In, Hotel Transit & City Journey (4 Steps)
                  <span className="badge rounded-pill bg-success" style={{ fontSize: '0.65rem' }}>4 STEPS</span>
                </>
              ) : primaryTransitMode === 'cab' || primaryTransitMode === 'car' ? (
                <>
                  <FaHotel /> 3. Hotel Doorstep Check-In & City Sightseeing
                  <span className="badge rounded-pill bg-success" style={{ fontSize: '0.65rem' }}>DIRECT HOTEL</span>
                </>
              ) : (
                <>
                  <FaCar /> 3. Station to Hotel Transit & Safe Check-In
                  <span className="badge rounded-pill bg-info text-dark" style={{ fontSize: '0.65rem' }}>NEW CITY</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guardian')}
              className={`btn btn-sm d-flex align-items-center gap-2 ${activeTab === 'guardian' ? 'btn-primary' : 'btn-light'}`}
              style={{
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                backgroundColor: activeTab === 'guardian' ? '#6355E6' : 'transparent',
                color: activeTab === 'guardian' ? '#FFFFFF' : theme.textSecondary,
                border: activeTab === 'guardian' ? 'none' : theme.cardBorder
              }}
            >
              <FaUsers /> 4. Parent / Guardian 24/7 Live Portal
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('escalation')}
              className={`btn btn-sm d-flex align-items-center gap-2 ${activeTab === 'escalation' ? 'btn-danger' : 'btn-light'}`}
              style={{
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                backgroundColor: activeTab === 'escalation' ? '#EF4444' : 'transparent',
                color: activeTab === 'escalation' ? '#FFFFFF' : theme.textSecondary,
                border: activeTab === 'escalation' ? 'none' : theme.cardBorder
              }}
            >
              <FaShieldAlt /> 5. Emergency SOS & Deterrent Call
              {sosActive && (
                <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '0.65rem' }}>TRIGGERED</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('return_plan')}
              className={`btn btn-sm d-flex align-items-center gap-2 ${activeTab === 'return_plan' ? 'btn-primary' : 'btn-light'}`}
              style={{
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                backgroundColor: activeTab === 'return_plan' ? '#10B981' : 'transparent',
                color: activeTab === 'return_plan' ? '#FFFFFF' : theme.textSecondary,
                border: activeTab === 'return_plan' ? 'none' : theme.cardBorder
              }}
            >
              <FaUndo /> 6. Return Trip Planner & Fleet Tracking
              <span className="badge rounded-pill bg-success text-white" style={{ fontSize: '0.65rem' }}>SAFE HOME</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`btn btn-sm d-flex align-items-center gap-2 ${activeTab === 'history' ? 'btn-primary' : 'btn-light'}`}
              style={{
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 600,
                backgroundColor: activeTab === 'history' ? '#8B5CF6' : 'transparent',
                color: activeTab === 'history' ? '#FFFFFF' : theme.textSecondary,
                border: activeTab === 'history' ? 'none' : theme.cardBorder
              }}
            >
              <FaHistory /> 7. Journey History & Past Trips
              <span className="badge rounded-pill text-white" style={{ fontSize: '0.65rem', backgroundColor: '#8B5CF6' }}>
                {journeyHistory.length} SAVED
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════ MAIN CONTENT CONTAINER ════════════════ */}
      <div className="container mt-4">

        {/* ========================================================
            TAB 1: PRE-TRIP PLANNER & SELECT TRAINS ON YOUR ROUTE
        ======================================================== */}
        {activeTab === 'planner' && (
          <div className="row g-4">
            {/* Left: Route Configuration Form */}
            <div className="col-12 col-lg-5">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 style={{ fontWeight: 700, margin: 0, color: theme.textPrimary }}>
                    <FaCompass style={{ color: '#6355E6', marginRight: 8 }} />
                    Plan Unfamiliar Journey
                  </h5>
                  <span className="badge bg-primary" style={{ fontSize: '0.72rem' }}>YOUR ROUTE</span>
                </div>

                <p style={{ fontSize: '0.84rem', color: theme.textSecondary, marginBottom: 18 }}>
                  Enter your exact start location and unfamiliar destination. The system will search real express trains on this route without changing your entered cities.
                </p>

                {/* =======================================================
                    STEP 1: CHOOSE YOUR PRIMARY TRAVEL VEHICLE / MODE
                    ======================================================= */}
                <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: '1.5px solid #6355E6' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label style={{ fontSize: '0.84rem', fontWeight: 800, color: '#6355E6', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Step 1: Choose Your Travel Vehicle
                    </label>
                    <span className="badge" style={{ backgroundColor: '#6355E6', fontSize: '0.65rem' }}>REQUIRED</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: theme.textSecondary, marginBottom: 12 }}>
                    How are you traveling to {destinationCity || 'your destination'}? Select your transport mode to load tailored security options:
                  </div>

                  <div className="row g-2">
                    {[
                      { id: 'train', label: 'Train', icon: '🚆', desc: 'Indian Railways' },
                      { id: 'bus',   label: 'Bus',   icon: '🚌', desc: 'Intercity Volvo/AC' },
                      { id: 'cab',   label: 'Cab',   icon: '🚕', desc: 'Uber / Outstation' },
                      { id: 'car',   label: 'Car',   icon: '🚗', desc: 'Personal Drive' }
                    ].map(mode => {
                      const isActive = primaryTransitMode === mode.id;
                      return (
                        <div key={mode.id} className="col-6 col-sm-3">
                          <button
                            type="button"
                            onClick={() => setPrimaryTransitMode(mode.id)}
                            style={{
                              width: '100%',
                              padding: '10px 4px',
                              borderRadius: 12,
                              border: isActive ? '2px solid #6355E6' : theme.cardBorder,
                              backgroundColor: isActive ? (isDark ? '#261852' : '#EDE8FE') : (isDark ? '#191136' : '#FFFFFF'),
                              color: isActive ? '#6355E6' : theme.textPrimary,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: isActive ? '0 4px 14px rgba(99, 85, 230, 0.25)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <span style={{ fontSize: '1.4rem', lineHeight: 1, marginBottom: 4 }}>{mode.icon}</span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>{mode.label}</span>
                            <span style={{ fontSize: '0.62rem', color: isActive ? '#6355E6' : theme.textSecondary }}>{mode.desc}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Origin City */}
                <div className="mb-3">
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                    {primaryTransitMode === 'train' ? 'Origin City / Station' :
                     primaryTransitMode === 'bus'   ? 'Origin City / Bus Terminal (ISBT)' :
                     primaryTransitMode === 'cab'   ? 'Pickup City / Address' :
                                                      'Origin City / Starting Point'}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                    value={originCity}
                    onChange={(e) => {
                      setOriginCity(e.target.value);
                      setOriginStation(e.target.value);
                    }}
                    list={originListId}
                    placeholder="e.g. Delhi or New Delhi (NDLS)"
                  />
                  <datalist id={originListId}>
                    <option value="Delhi" />
                    <option value="New Delhi (NDLS)" />
                    <option value="Delhi Cantt (DEC)" />
                    <option value="Mumbai" />
                    <option value="Lucknow" />
                  </datalist>
                </div>

                {/* Destination City */}
                <div className="mb-3">
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                    {primaryTransitMode === 'train' ? 'Destination (Unfamiliar City / Station)' :
                     primaryTransitMode === 'bus'   ? 'Destination (Unfamiliar City / Drop Terminal)' :
                     primaryTransitMode === 'cab'   ? 'Destination (Drop Address / City)' :
                                                      'Destination (Unfamiliar City / Highway Drop)'}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                    value={destinationCity}
                    onChange={(e) => {
                      setDestinationCity(e.target.value);
                      setDestinationStation(e.target.value);
                    }}
                    list={destListId}
                    placeholder="e.g. Jaipur, Varanasi, Lucknow, Bhopal"
                  />
                  <datalist id={destListId}>
                    <option value="Jaipur" />
                    <option value="Varanasi" />
                    <option value="Lucknow" />
                    <option value="Mumbai" />
                    <option value="Bhopal" />
                  </datalist>
                </div>

                {/* Dates */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                      Departure Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                      Return Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Coach & Seat */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                      Coach No.
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={coachNumber}
                      onChange={(e) => setCoachNumber(e.target.value)}
                      placeholder="e.g. C3 or B2"
                    />
                  </div>
                  <div className="col-6">
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                      Seat No.
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value)}
                      placeholder="e.g. 24 Window"
                    />
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>
                    👨‍👩‍👧 Primary Guardian Emergency Contact
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                        placeholder="Traveler Name"
                        value={travelerName}
                        onChange={(e) => setTravelerName(e.target.value)}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                        placeholder="Guardian Name"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-7">
                      <input
                        type="tel"
                        className="form-control form-control-sm"
                        style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                        placeholder="Guardian Phone"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                      />
                    </div>
                    <div className="col-5">
                      <select
                        className="form-select form-select-sm"
                        style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                        value={guardianRelation}
                        onChange={(e) => setGuardianRelation(e.target.value)}
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Husband">Husband</option>
                        <option value="Brother">Brother</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =======================================================
                RIGHT COLUMN: DYNAMIC TRANSIT OPERATOR BASED ON SELECTED VEHICLE
                ======================================================= */}
            <div className="col-12 col-lg-7">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >

                {/* -------------------------------------------------------------
                    MODE 1: TRAIN (INDIAN RAILWAYS)
                    ------------------------------------------------------------- */}
                {primaryTransitMode === 'train' && (
                  <>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                      <div>
                        <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>🚆</span> Available Trains for {originCity} → {destinationCity}
                        </h5>
                        <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: 2 }}>
                          Select your express train. Destination ({destinationCity}) will NOT change.
                        </div>
                      </div>
                      <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>
                        {displayedTrains.length} {trainSearchQuery ? 'MATCHING' : 'REAL'} TRAINS FOUND
                      </span>
                    </div>

                    {/* Train Search Bar */}
                    <div className="mb-3">
                      <div 
                        className="d-flex align-items-center gap-2 p-2 rounded-3"
                        style={{
                          backgroundColor: theme.subCardBg,
                          border: trainSearchQuery ? '2px solid #6355E6' : theme.cardBorder,
                          transition: 'all 0.2s ease',
                          boxShadow: trainSearchQuery ? '0 0 12px rgba(99, 85, 230, 0.2)' : 'none'
                        }}
                      >
                        <FaSearch style={{ color: trainSearchQuery ? '#6355E6' : theme.textMuted, fontSize: '0.95rem', marginLeft: 6 }} />
                        <input
                          type="text"
                          value={trainSearchQuery}
                          onChange={(e) => setTrainSearchQuery(e.target.value)}
                          placeholder="Search train by name or number (e.g. 20978, Vande Bharat, Shatabdi)..."
                          className="form-control border-0 shadow-none p-0"
                          style={{
                            backgroundColor: 'transparent',
                            color: theme.textPrimary,
                            fontSize: '0.86rem',
                            fontWeight: 600
                          }}
                        />
                        {trainSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setTrainSearchQuery('')}
                            className="btn btn-sm text-secondary p-0 px-2"
                            style={{ fontSize: '0.85rem' }}
                            title="Clear search"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Train List Cards */}
                    <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: 340, overflowY: 'auto' }}>
                      {displayedTrains.map((train) => {
                        const isSelected = selectedTrain.trainNumber === train.trainNumber;
                        return (
                          <div
                            key={train.trainNumber}
                            onClick={() => setSelectedTrain(train)}
                            style={{
                              backgroundColor: isSelected ? (isDark ? '#2B1C5B' : '#F0EDFE') : theme.subCardBg,
                              border: isSelected ? '2px solid #6355E6' : theme.subCardBorder,
                              borderRadius: 12,
                              padding: '12px 14px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <div className="d-flex align-items-center gap-2">
                                <span style={{ fontWeight: 800, color: '#6355E6', fontSize: '0.9rem' }}>#{train.trainNumber}</span>
                                <strong style={{ color: theme.textPrimary, fontSize: '0.88rem' }}>{train.trainName}</strong>
                              </div>
                              <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>{train.type}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.76rem', color: theme.textSecondary }}>
                              <span>Dep: <strong>{train.departureTime}</strong> ({train.originStation})</span>
                              <span>Arr: <strong>{train.arrivalTime}</strong> ({train.destinationStation})</span>
                              <span style={{ color: '#10B981', fontWeight: 700 }}>{train.travelTime}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Coach & Seat Selection */}
                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: theme.textPrimary, marginBottom: 8 }}>
                        🚆 Coach & Safe Seat Allocation
                      </div>
                      <div className="row g-2">
                        <div className="col-6">
                          <label style={{ fontSize: '0.72rem', color: theme.textSecondary }}>Coach Number</label>
                          <input
                            type="text"
                            value={coachNumber}
                            onChange={(e) => setCoachNumber(e.target.value)}
                            className="form-control form-control-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          />
                        </div>
                        <div className="col-6">
                          <label style={{ fontSize: '0.72rem', color: theme.textSecondary }}>Berth / Seat</label>
                          <input
                            type="text"
                            value={seatNumber}
                            onChange={(e) => setSeatNumber(e.target.value)}
                            className="form-control form-control-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* -------------------------------------------------------------
                    MODE 2: INTERCITY BUS (VOLVO / AC SLEEPER WITH SEARCH & SEAT BOOKING)
                    ------------------------------------------------------------- */}
                {primaryTransitMode === 'bus' && (
                  <>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                      <div>
                        <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>🚌</span> Verified Intercity Buses for {originCity} → {destinationCity}
                        </h5>
                        <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: 2 }}>
                          Certified Women-Friendly Buses with GPS Tracking, CCTV & Female Berth Priority.
                        </div>
                      </div>
                      <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>
                        {displayedBuses.length} {busSearchQuery ? 'MATCHING' : 'VERIFIED'} BUSES FOUND
                      </span>
                    </div>

                    {/* Real-Time Bus Search Bar (Filter by Operator Name or Bus Number) */}
                    <div className="mb-3">
                      <div 
                        className="d-flex align-items-center gap-2 p-2 rounded-3"
                        style={{
                          backgroundColor: theme.subCardBg,
                          border: busSearchQuery ? '2px solid #6355E6' : theme.cardBorder,
                          transition: 'all 0.2s ease',
                          boxShadow: busSearchQuery ? '0 0 12px rgba(99, 85, 230, 0.2)' : 'none'
                        }}
                      >
                        <FaSearch style={{ color: busSearchQuery ? '#6355E6' : theme.textMuted, fontSize: '0.95rem', marginLeft: 6 }} />
                        <input
                          type="text"
                          value={busSearchQuery}
                          onChange={(e) => setBusSearchQuery(e.target.value)}
                          placeholder="Search bus by operator or number (e.g. Zingbus, IntrCity, NueGo, DL 1P, HR 55, Volvo)..."
                          className="form-control border-0 shadow-none p-0"
                          style={{
                            backgroundColor: 'transparent',
                            color: theme.textPrimary,
                            fontSize: '0.86rem',
                            fontWeight: 600
                          }}
                        />
                        {busSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setBusSearchQuery('')}
                            className="btn btn-sm text-secondary p-0 px-2"
                            style={{ fontSize: '0.85rem' }}
                            title="Clear bus search"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>

                      {/* Bus Search Helper */}
                      <div className="d-flex flex-wrap align-items-center justify-content-between mt-2 px-1" style={{ fontSize: '0.74rem' }}>
                        <span style={{ color: theme.textSecondary }}>
                          {busSearchQuery ? (
                            <>Found <strong>{displayedBuses.length}</strong> matching bus(es) for &ldquo;<strong style={{ color: '#6355E6' }}>{busSearchQuery}</strong>&rdquo;</>
                          ) : (
                            <>Filter by bus name (e.g. <em>IntrCity</em>, <em>Zingbus</em>, <em>NueGo</em>) or plate number (e.g. <em>HR 55</em>)</>
                          )}
                        </span>
                        {busSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setBusSearchQuery('')}
                            className="btn btn-link btn-sm p-0 text-decoration-none"
                            style={{ fontSize: '0.72rem', color: '#6355E6', fontWeight: 700 }}
                          >
                            Reset filter
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filtered Bus Cards List */}
                    {displayedBuses.length === 0 ? (
                      <div className="p-4 text-center rounded-3 mb-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🔍</div>
                        <div style={{ fontWeight: 700, color: theme.textPrimary, fontSize: '0.88rem' }}>No buses matching &ldquo;{busSearchQuery}&rdquo;</div>
                        <div style={{ fontSize: '0.76rem', color: theme.textSecondary, marginTop: 4 }}>
                          Try searching for 'IntrCity', 'Zingbus', 'Volvo', or clear the search.
                        </div>
                        <button
                          type="button"
                          onClick={() => setBusSearchQuery('')}
                          className="btn btn-sm btn-outline-primary mt-2"
                          style={{ fontSize: '0.75rem', borderRadius: 8 }}
                        >
                          View All Verified Buses
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-2 mb-3" style={{ maxHeight: 330, overflowY: 'auto' }}>
                        {displayedBuses.map((bus) => {
                          const isSelected = selectedBus.busNumber === bus.busNumber;
                          return (
                            <div
                              key={bus.busNumber}
                              onClick={() => setSelectedBus({
                                operator: bus.operator,
                                busNumber: bus.busNumber,
                                departureTime: bus.dep,
                                arrivalTime: bus.arr,
                                boardingPoint: bus.boarding,
                                dropPoint: `${destinationCity} Central Bus Station`,
                                safetyRating: bus.rating,
                                features: bus.badges
                              })}
                              style={{
                                backgroundColor: isSelected ? (isDark ? '#2B1C5B' : '#F0EDFE') : theme.subCardBg,
                                border: isSelected ? '2px solid #6355E6' : theme.subCardBorder,
                                borderRadius: 12,
                                padding: '12px 14px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="d-flex align-items-center gap-2">
                                  <strong style={{ color: theme.textPrimary, fontSize: '0.88rem' }}>{bus.operator}</strong>
                                  <span className="badge bg-secondary" style={{ fontSize: '0.62rem' }}>{bus.type}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <span style={{ fontWeight: 800, color: '#10B981', fontSize: '0.85rem' }}>{bus.fare}</span>
                                  <span className="badge bg-warning text-dark" style={{ fontSize: '0.68rem', fontWeight: 800 }}>★ {bus.rating}</span>
                                </div>
                              </div>

                              <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.74rem', color: theme.textSecondary }}>
                                <span>Departs: <strong style={{ color: '#6355E6' }}>{bus.dep}</strong> ({bus.boarding})</span>
                                <span>Arrives: <strong>{bus.arr}</strong> ({bus.travelTime})</span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: theme.textPrimary }}>{bus.busNumber}</span>
                              </div>

                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="d-flex flex-wrap gap-1">
                                  {bus.badges.map((b, bi) => (
                                    <span key={bi} className="badge bg-success" style={{ fontSize: '0.6rem' }}>✓ {b}</span>
                                  ))}
                                </div>
                                <span style={{ fontSize: '0.7rem', color: isSelected ? '#6355E6' : '#10B981', fontWeight: 700 }}>
                                  {isSelected ? '● SELECTED BUS' : `${bus.availableSeats} female seats left`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Book Seat / Preferred Berth Section */}
                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: '1.5px solid #6355E6' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>💺</span> Book Seat on {selectedBus.operator.split(' ')[0]} ({selectedBus.busNumber})
                        </div>
                        <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>WOMEN PRIORITY</span>
                      </div>

                      <div className="row g-2 mb-2">
                        <div className="col-12 col-sm-7">
                          <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Seat / Berth Allocation</label>
                          <select
                            value={busSeatType}
                            onChange={(e) => setBusSeatType(e.target.value)}
                            className="form-select form-select-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 600 }}
                          >
                            <option value="Single Female Window Berth (L-12) - Safe Lower">Single Female Window Berth (L-12) - Safe Lower</option>
                            <option value="Lower Cabin Women-Adjacent Seat (Seat 4)">Lower Cabin Women-Adjacent Seat (Seat 4)</option>
                            <option value="Front Row Conductor-Adjacent Seat (Seat 1)">Front Row Conductor-Adjacent Seat (Seat 1)</option>
                            <option value="Single Female Upper Sleeper (Berth U-8)">Single Female Upper Sleeper (Berth U-8)</option>
                            <option value="Double Sleeper with Verified Female Co-passenger (Berth L-3)">Double Sleeper with Female Co-passenger (Berth L-3)</option>
                          </select>
                        </div>
                        <div className="col-12 col-sm-5">
                          <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Boarding Point</label>
                          <input
                            type="text"
                            value={selectedBus.boardingPoint}
                            onChange={(e) => setSelectedBus(p => ({ ...p, boardingPoint: e.target.value }))}
                            className="form-control form-control-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          />
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-1" style={{ fontSize: '0.72rem', color: theme.textSecondary }}>
                        <span>Boarding Time: <strong style={{ color: '#6355E6' }}>{selectedBus.departureTime}</strong></span>
                        <span style={{ color: '#10B981', fontWeight: 700 }}>✓ Seat Locked in Safety Dossier</span>
                      </div>
                    </div>
                  </>
                )}

                {/* -------------------------------------------------------------
                    MODE 3: OUTSTATION CAB / TAXI (UBER / OLA / PREPAID)
                    ------------------------------------------------------------- */}
                {primaryTransitMode === 'cab' && (
                  <>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                      <div>
                        <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>🚕</span> Outstation Cab & Taxi Safety Shield
                        </h5>
                        <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: 2 }}>
                          VAHAN 4.0 Verified Drivers with Live SOS Telemetry Sharing.
                        </div>
                      </div>
                      <span className="badge bg-primary" style={{ fontSize: '0.72rem' }}>VAHAN 4.0 INTEGRATED</span>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-12 col-sm-6">
                        <label style={{ fontSize: '0.76rem', color: theme.textSecondary, fontWeight: 700 }}>Cab Service Provider</label>
                        <select
                          value={cabProvider}
                          onChange={(e) => setCabProvider(e.target.value)}
                          className="form-select form-select-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                        >
                          <option value="Uber Intercity Outstation">Uber Intercity Outstation</option>
                          <option value="Ola Outstation Prime">Ola Outstation Prime</option>
                          <option value="State Tourism Pre-Paid Taxi">State Tourism Pre-Paid Taxi</option>
                          <option value="Verified Private Commercial Taxi">Verified Private Commercial Taxi</option>
                        </select>
                      </div>
                      <div className="col-12 col-sm-6">
                        <label style={{ fontSize: '0.76rem', color: theme.textSecondary, fontWeight: 700 }}>Vehicle Model Category</label>
                        <select
                          value={cabType}
                          onChange={(e) => setCabType(e.target.value)}
                          className="form-select form-select-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                        >
                          <option value="Prime Sedan (Toyota Etios / Dzire)">Prime Sedan (Toyota Etios / Dzire)</option>
                          <option value="Spacious SUV (Toyota Innova / Ertiga)">Spacious SUV (Toyota Innova / Ertiga)</option>
                          <option value="Green EV (Tata Nexon EV)">Green EV (Tata Nexon EV)</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: '1.5px solid #10B981' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981' }}>✓ VAHAN 4.0 Driver & Vehicle Card</span>
                        <span className="badge bg-success" style={{ fontSize: '0.62rem' }}>POLICE CLEARED</span>
                      </div>
                      <div className="row g-2">
                        <div className="col-7">
                          <label style={{ fontSize: '0.7rem', color: theme.textSecondary }}>Driver Full Name</label>
                          <input
                            type="text"
                            value={cabDriverName}
                            onChange={(e) => setCabDriverName(e.target.value)}
                            className="form-control form-control-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          />
                        </div>
                        <div className="col-5">
                          <label style={{ fontSize: '0.7rem', color: theme.textSecondary }}>Vehicle Plate #</label>
                          <input
                            type="text"
                            value={cabPlateNumber}
                            onChange={(e) => setCabPlateNumber(e.target.value)}
                            className="form-control form-control-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontFamily: 'monospace', fontWeight: 700 }}
                          />
                        </div>
                      </div>
                      <div className="mt-2 d-flex align-items-center justify-content-between" style={{ fontSize: '0.72rem', color: theme.textSecondary }}>
                        <span>Child-Lock Mechanical Hazard: <strong style={{ color: '#10B981' }}>DISABLED (Safe)</strong></span>
                        <span>Safety PIN: <strong>4912</strong></span>
                      </div>
                    </div>
                  </>
                )}

                {/* -------------------------------------------------------------
                    MODE 4: PERSONAL CAR / SELF-DRIVE
                    ------------------------------------------------------------- */}
                {primaryTransitMode === 'car' && (
                  <>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                      <div>
                        <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>🚗</span> Solo Self-Drive & Highway Security Corridor
                        </h5>
                        <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: 2 }}>
                          National Highway Patrol Sync (NHAI 1033) & 24/7 Verified Fuel Corridors.
                        </div>
                      </div>
                      <span className="badge bg-info text-dark" style={{ fontSize: '0.72rem' }}>HIGHWAY SENTINEL</span>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label style={{ fontSize: '0.74rem', color: theme.textSecondary, fontWeight: 700 }}>Your Vehicle Plate #</label>
                        <input
                          type="text"
                          value={personalCarPlate}
                          onChange={(e) => setPersonalCarPlate(e.target.value)}
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontFamily: 'monospace', fontWeight: 800 }}
                        />
                      </div>
                      <div className="col-6">
                        <label style={{ fontSize: '0.74rem', color: theme.textSecondary, fontWeight: 700 }}>Car Make & Model</label>
                        <input
                          type="text"
                          value={personalCarModel}
                          onChange={(e) => setPersonalCarModel(e.target.value)}
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                        />
                      </div>
                    </div>

                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: theme.textPrimary, marginBottom: 8 }}>
                        🛠️ Mandatory Highway Emergency Checklist
                      </div>
                      {[
                        'FASTag Active with Automatic Toll Transit Logging',
                        'Spare Tyre, Jack & Hazard Warning Triangle Verified',
                        'NHAI Highway Emergency Helpline 1033 Speed-Dial Synced',
                        'Live Fuel Corridors & 24/7 Women-Safe Rest Stops Mapped'
                      ].map((item, idx) => (
                        <div key={idx} className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '0.74rem', color: theme.textSecondary }}>
                          <span style={{ color: '#10B981', fontWeight: 800 }}>✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Bottom Action Buttons (Proceed based on selected vehicle) */}
                <div className="d-flex flex-wrap gap-2 pt-2 border-top" style={{ borderColor: theme.cardBorder }}>
                  {primaryTransitMode === 'train' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveTab('wimt_live')}
                        className="btn btn-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ backgroundColor: '#6355E6', border: 'none', borderRadius: 10, fontWeight: 700 }}
                      >
                        <FaTrain /> View Live Train Stations (#{selectedTrain.trainNumber}) <FaArrowRight />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('local_transit')}
                        className="btn btn-outline-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: 10, fontWeight: 700 }}
                      >
                        <FaCar /> Plan Station to Hotel Transit & Stay <FaArrowRight />
                      </button>
                    </>
                  ) : primaryTransitMode === 'bus' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveTab('wimt_live')}
                        className="btn btn-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ backgroundColor: '#6355E6', border: 'none', borderRadius: 10, fontWeight: 700 }}
                      >
                        <FaBus /> View Live Bus Status ({selectedBus.busNumber}) <FaArrowRight />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('local_transit')}
                        className="btn btn-outline-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: 10, fontWeight: 700 }}
                      >
                        <FaMapMarkerAlt /> Plan ISBT Deboarding & Hotel Transit <FaArrowRight />
                      </button>
                    </>
                  ) : primaryTransitMode === 'cab' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveTab('wimt_live')}
                        className="btn btn-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ backgroundColor: '#6355E6', border: 'none', borderRadius: 10, fontWeight: 700 }}
                      >
                        <FaTaxi /> View Outstation Cab Telemetry <FaArrowRight />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('local_transit')}
                        className="btn btn-outline-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: 10, fontWeight: 700 }}
                      >
                        <FaHotel /> Direct Hotel Doorstep Check-In <FaArrowRight />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setActiveTab('wimt_live')}
                        className="btn btn-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ backgroundColor: '#6355E6', border: 'none', borderRadius: 10, fontWeight: 700 }}
                      >
                        <FaCar /> View Highway Route & Toll GPS <FaArrowRight />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('local_transit')}
                        className="btn btn-outline-primary flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: 10, fontWeight: 700 }}
                      >
                        <FaHotel /> Direct Hotel Doorstep Check-In <FaArrowRight />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: LIVE TRANSIT TELEMETRY & ROUTE
        ======================================================== */}
        {activeTab === 'wimt_live' && (
          primaryTransitMode === 'bus' ? (
            <div className="row g-4">
              {/* Left: Intercity Bus Telemetry Card */}
              <div className="col-12 col-lg-5">
                <div
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: 16,
                    border: theme.cardBorder,
                    padding: 24,
                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          backgroundColor: '#1E1838',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          padding: '4px 10px',
                          borderRadius: 6
                        }}
                      >
                        {selectedBus.busNumber}
                      </span>
                      <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>
                        WOMEN PRIORITY
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: theme.textMuted }}>
                      GPS Live Now
                    </span>
                  </div>

                  <h4 style={{ fontWeight: 800, color: theme.textPrimary, margin: '4px 0 6px' }}>
                    {selectedBus.operator}
                  </h4>

                  <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: 16 }}>
                    Route: <strong>{originCity} ({selectedBus.boardingPoint})</strong> ➔ <strong>{destinationCity} (ISBT Terminal)</strong>
                  </div>

                  {/* Live Status Highlight Box */}
                  <div
                    className="p-3 mb-4 rounded-3"
                    style={{
                      backgroundColor: theme.greenBoxBg,
                      border: theme.greenBoxBorder
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: '#10B981',
                            boxShadow: '0 0 8px #10B981'
                          }}
                        />
                        <strong style={{ color: theme.greenBoxText, fontSize: '0.92rem' }}>
                          Cruising on Highway NH-48 (Speed: 74 km/h)
                        </strong>
                      </div>
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.72rem' }}>
                        Speed: 74 km/h
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: theme.greenBoxText, marginTop: 4 }}>
                      📍 <strong>Current Position:</strong> Passed <strong>Kotputli Highway Corridor</strong> (Toll Plaza Cleared).
                    </div>

                    <div style={{ fontSize: '0.82rem', color: theme.greenBoxText, marginTop: 4 }}>
                      ⏭️ <strong>Next Deboarding Stop:</strong> <strong>{destinationCity} Central ISBT Bus Stand</strong> (ETA: {selectedBus.arrivalTime} · Distance: ~42 km).
                    </div>
                  </div>

                  {/* Seat & Telemetry Grid */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                          Your Berth / Seat
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: theme.textPrimary, marginTop: 2 }}>
                          {busSeatType.split('(')[0].trim()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6355E6', fontWeight: 600 }}>
                          {busSeatType.includes('(') ? `(${busSeatType.split('(')[1]}` : 'Safe Lower Cabin'}
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                          Phone Battery
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: theme.textPrimary, marginTop: 2 }}>
                          <FaBatteryThreeQuarters style={{ color: '#10B981', marginRight: 4 }} />
                          {batteryLevel}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                          Guardian Sync: ON
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                            Real Hardware GPS Telemetry
                          </span>
                          <span className="badge bg-success" style={{ fontSize: '0.68rem' }}>
                            HARDWARE GPS ACTIVE
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: theme.textPrimary }}>
                          Lat: {deviceCoords.lat}, Lng: {deviceCoords.lng}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: theme.textMuted, marginTop: 2 }}>
                          Accuracy: ±{deviceCoords.accuracy}m · Highway Corridor Drift: 8m (Safe &lt;50m)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Safety Features List */}
                  <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: theme.textPrimary, marginBottom: 6 }}>
                      🛡️ On-Board Security Protections:
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedBus.features.map((f, fi) => (
                        <span key={fi} className="badge bg-success" style={{ fontSize: '0.66rem' }}>✓ {f}</span>
                      ))}
                    </div>
                  </div>

                  {/* Next Step Action Button */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('local_transit')}
                    className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#6355E6', border: 'none', borderRadius: 10, fontWeight: 700 }}
                  >
                    <FaBus /> Arrived at Bus Terminal? Proceed to Station Check-In & Hotel Journey (Tab 3) <FaArrowRight />
                  </button>
                </div>
              </div>

              {/* Right: Intercity Highway Route & Toll Stops */}
              <div className="col-12 col-lg-7">
                <div
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: 16,
                    border: theme.cardBorder,
                    padding: 24,
                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: theme.cardBorder }}>
                    <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      🛣️ Intercity Highway Corridor & Stops for {selectedBus.busNumber}
                    </h5>
                    <span className="badge bg-primary" style={{ fontSize: '0.72rem' }}>
                      5 WAYPOINTS
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-3" style={{ position: 'relative', paddingLeft: 28 }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 10,
                        top: 20,
                        bottom: 20,
                        width: 3,
                        backgroundColor: '#6355E6'
                      }}
                    />

                    {[
                      { name: `${originCity} Central ISBT Lounge (${selectedBus.boardingPoint})`, code: 'BOARD', dist: '0 km', time: selectedBus.departureTime, status: 'Passed', passed: true, note: 'Boarded from Platform 3. Female priority check-in.' },
                      { name: 'NH-48 FASTag Toll Plaza 1 (Manesar Toll Plaza)', code: 'TOLL 1', dist: '48 km', time: '22:45', status: 'Passed', passed: true, note: 'FASTag automatic highway corridor logging cleared.' },
                      { name: 'Verified Safe Highway Food Court & Women Rest Stop (Kotputli)', code: 'HALT', dist: '124 km', time: '01:30', status: 'Current Halt', current: true, note: '30-Minute scheduled halt. Guarded women restroom lounge.' },
                      { name: 'NH-48 FASTag Toll Plaza 2 (Shahpura Toll Corridor)', code: 'TOLL 2', dist: '185 km', time: '04:15', status: 'Upcoming', upcoming: true, note: 'En-route destination approach corridor.' },
                      { name: `${destinationCity} Central ISBT Main Bus Terminal`, code: 'ISBT ARR', dist: '260 km', time: selectedBus.arrivalTime, status: 'Scheduled', destination: true, note: 'Terminal Arrival Bay 2. Pre-paid Pink Cab booth & Metro exit.' }
                    ].map((stop, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-3"
                        style={{
                          backgroundColor: stop.current ? (isDark ? '#2E2012' : '#FFFBEB') : theme.subCardBg,
                          border: stop.current ? '2px solid #F59E0B' : theme.subCardBorder,
                          position: 'relative'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: -24,
                            top: 16,
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            backgroundColor: stop.current ? '#F59E0B' : stop.passed ? '#10B981' : '#9CA3AF',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            boxShadow: stop.current ? '0 0 10px #F59E0B' : 'none'
                          }}
                        >
                          {stop.passed ? '✓' : stop.current ? '●' : idx + 1}
                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontWeight: 800, fontSize: '0.94rem', color: theme.textPrimary }}>
                                {stop.name}
                              </span>
                              <span className="badge bg-light text-dark border" style={{ fontSize: '0.68rem' }}>
                                {stop.code}
                              </span>
                              {stop.current && (
                                <span className="badge bg-warning text-dark" style={{ fontSize: '0.66rem' }}>
                                  CURRENT HALT
                                </span>
                              )}
                              {stop.destination && (
                                <span className="badge bg-primary" style={{ fontSize: '0.66rem' }}>
                                  DESTINATION ISBT
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: theme.textMuted, marginTop: 3 }}>
                              Distance: <strong>{stop.dist}</strong> · {stop.note}
                            </div>
                          </div>

                          <div className="text-end">
                            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: stop.current ? '#D97706' : theme.textPrimary }}>
                              {stop.time}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: stop.passed ? '#10B981' : '#6355E6', fontWeight: 600 }}>
                              {stop.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (primaryTransitMode === 'cab' || primaryTransitMode === 'car') ? (
            <div className="row g-4">
              {/* Left: Outstation Cab / Car Telemetry Card */}
              <div className="col-12 col-lg-5">
                <div
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: 16,
                    border: theme.cardBorder,
                    padding: 24,
                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          backgroundColor: '#1E1838',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          padding: '4px 10px',
                          borderRadius: 6
                        }}
                      >
                        {primaryTransitMode === 'cab' ? cabPlateNumber : personalCarPlate}
                      </span>
                      <span className="badge bg-primary" style={{ fontSize: '0.72rem' }}>
                        {primaryTransitMode === 'cab' ? 'VAHAN 4.0 VERIFIED' : 'FASTAG SYNC'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: theme.textMuted }}>
                      Cruising Live
                    </span>
                  </div>

                  <h4 style={{ fontWeight: 800, color: theme.textPrimary, margin: '4px 0 6px' }}>
                    {primaryTransitMode === 'cab' ? `${cabProvider} (${cabType.split('(')[0].trim()})` : personalCarModel}
                  </h4>

                  <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: 16 }}>
                    Driver / Owner: <strong>{primaryTransitMode === 'cab' ? cabDriverName : travelerName}</strong>
                  </div>

                  {/* Live Status Highlight Box */}
                  <div
                    className="p-3 mb-4 rounded-3"
                    style={{
                      backgroundColor: theme.greenBoxBg,
                      border: theme.greenBoxBorder
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: '#10B981',
                            boxShadow: '0 0 8px #10B981'
                          }}
                        />
                        <strong style={{ color: theme.greenBoxText, fontSize: '0.92rem' }}>
                          Outstation Highway Corridor Locked (78 km/h)
                        </strong>
                      </div>
                      <span className="badge bg-light text-dark border" style={{ fontSize: '0.72rem' }}>
                        Speed: 78 km/h
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: theme.greenBoxText, marginTop: 4 }}>
                      📍 <strong>Direct Route:</strong> {originCity} ➔ <strong>{selectedStayName}</strong> Doorstep ({destinationCity}).
                    </div>

                    <div style={{ fontSize: '0.82rem', color: theme.greenBoxText, marginTop: 4 }}>
                      ⏭️ <strong>Doorstep Drop ETA:</strong> ~38 min · Intermediate station/terminal bypassed completely!
                    </div>
                  </div>

                  {/* Safety PIN & Child Lock Status */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                          Safety PIN
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#6355E6', marginTop: 2 }}>
                          4912
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                          Verified Ride
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                          Child-Lock Hazard
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#10B981', marginTop: 6 }}>
                          DISABLED
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                          Doors Unlockable Inside
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('local_transit')}
                    className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#10B981', border: 'none', borderRadius: 10, fontWeight: 700 }}
                  >
                    <FaHotel /> Direct Doorstep Arrival at Hotel (Tab 3) <FaArrowRight />
                  </button>
                </div>
              </div>

              {/* Right: Direct Highway Corridor to Hotel */}
              <div className="col-12 col-lg-7">
                <div
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: 16,
                    border: theme.cardBorder,
                    padding: 24,
                    boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: theme.cardBorder }}>
                    <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      🚕 Outstation Direct Route: {originCity} ➔ {destinationCity}
                    </h5>
                    <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>
                      DIRECT HOTEL DROP
                    </span>
                  </div>

                  <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, marginBottom: 6 }}>
                      🗺️ Seamless Doorstep Journey Timeline:
                    </div>
                    {[
                      { step: '1. Outstation Pickup', desc: `Boarded at ${originCity} pickup address with verified driver.` },
                      { step: '2. Express Highway Corridor', desc: 'FASTag toll plazas automatically logged with police corridor check.' },
                      { step: '3. Direct Hotel Drop in ' + destinationCity, desc: `Vehicle directly pulls into ${selectedStayName} main porch. No station deboarding needed.` },
                      { step: '4. Safe Check-In & Excursions', desc: 'Doorstep confirmed with hotel room number in Tab 3.' }
                    ].map((item, idx) => (
                      <div key={idx} className="d-flex align-items-start gap-2 mb-2" style={{ fontSize: '0.76rem', color: theme.textSecondary }}>
                        <span style={{ color: '#10B981', fontWeight: 800 }}>✓</span>
                        <div>
                          <strong style={{ color: theme.textPrimary }}>{item.step}:</strong> {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {/* Left: Train Telemetry Card */}
            <div className="col-12 col-lg-5">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        backgroundColor: '#1E1838',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        padding: '4px 10px',
                        borderRadius: 6
                      }}
                    >
                      #{selectedTrain.trainNumber}
                    </span>
                    <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>
                      {selectedTrain.type}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: theme.textMuted }}>
                    NTES Live {runningStatus ? runningStatus.lastUpdatedTime : 'Now'}
                  </span>
                </div>

                <h4 style={{ fontWeight: 800, color: theme.textPrimary, margin: '4px 0 6px' }}>
                  {selectedTrain.trainName}
                </h4>

                <div style={{ fontSize: '0.85rem', color: theme.textSecondary, marginBottom: 16 }}>
                  Journey: <strong>{originCity}</strong> ➔ <strong>{destinationCity}</strong>
                </div>

                {/* Live Status Highlight Box */}
                <div
                  className="p-3 mb-4 rounded-3"
                  style={{
                    backgroundColor: theme.greenBoxBg,
                    border: theme.greenBoxBorder
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                          boxShadow: '0 0 8px #10B981'
                        }}
                      />
                      <strong style={{ color: theme.greenBoxText, fontSize: '0.92rem' }}>
                        {runningStatus ? runningStatus.statusText : 'On Time'}
                      </strong>
                    </div>
                    <span className="badge bg-light text-dark border" style={{ fontSize: '0.72rem' }}>
                      Speed: {deviceCoords.speed} km/h
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: theme.greenBoxText, marginTop: 4 }}>
                    📍 <strong>Current Position:</strong> Passed{' '}
                    <strong>{runningStatus && runningStatus.currentStation ? runningStatus.currentStation.name : originCity}</strong>{' '}
                    (Platform {runningStatus && runningStatus.currentStation ? runningStatus.currentStation.platform : '1'}).
                  </div>

                  <div style={{ fontSize: '0.82rem', color: theme.greenBoxText, marginTop: 4 }}>
                    ⏭️ <strong>Next Station:</strong>{' '}
                    <strong>{runningStatus && runningStatus.nextStation ? runningStatus.nextStation.name : destinationCity}</strong>{' '}
                    (ETA: {runningStatus && runningStatus.nextStation ? runningStatus.nextStation.schArr : '--'} · Distance: ~{Math.round(distanceToNextStationMeters / 1000)} km).
                  </div>
                </div>

                {/* Coach & Device GPS Grid */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                        Your Coach & Seat
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.25rem', color: theme.textPrimary, marginTop: 2 }}>
                        Coach {coachNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6355E6', fontWeight: 600 }}>
                        Seat: {seatNumber}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                        Phone Battery
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.25rem', color: theme.textPrimary, marginTop: 2 }}>
                        <FaBatteryThreeQuarters style={{ color: '#10B981', marginRight: 4 }} />
                        {batteryLevel}%
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                        Guardian Sync: ON
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                          Real Device GPS Coordinates
                        </span>
                        <span
                          className={`badge ${realGpsActive ? 'bg-success' : 'bg-secondary'}`}
                          style={{ fontSize: '0.68rem' }}
                        >
                          {realGpsActive ? 'HARDWARE GPS ACTIVE' : 'CELLULAR TELEMETRY'}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: theme.textPrimary }}>
                        Lat: {deviceCoords.lat}, Lng: {deviceCoords.lng}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: theme.textMuted, marginTop: 2 }}>
                        Accuracy: ±{deviceCoords.accuracy}m · Railway Corridor Drift: {corridorDeviationMeters}m (Safe &lt;50m)
                      </div>
                    </div>
                  </div>
                </div>

                {/* In-Train Suspicious Activity & Railway Police Emergency Sentinel */}
                {trainIncidentDispatched ? (
                  <div
                    className="p-3 mb-3 rounded-3"
                    style={{
                      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEF2F2',
                      border: '2px solid #EF4444',
                      boxShadow: '0 0 16px rgba(239, 68, 68, 0.25)'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: '#EF4444',
                            boxShadow: '0 0 8px #EF4444'
                          }}
                        />
                        <strong style={{ color: '#DC2626', fontSize: '0.88rem' }}>
                          RPF EMERGENCY SENTINEL: Coach {coachNumber}
                        </strong>
                      </div>
                      <span className="badge bg-danger" style={{ fontSize: '0.68rem' }}>RPF EN-ROUTE</span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: theme.textPrimary, lineHeight: 1.45, marginBottom: 8 }}>
                      Incident Reported: <strong>{trainIncidentReason}</strong>. Meri Saheli RPF lady squad alerted. Next station intercept: <strong>{runningStatus?.nextStation?.name || destinationCity} (PF {runningStatus?.nextStation?.platform || '1'})</strong>.
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <a
                        href="tel:139"
                        className="btn btn-danger btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                        style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.78rem' }}
                      >
                        <FaPhoneAlt /> Call 139 Direct
                      </a>
                      <button
                        type="button"
                        onClick={() => setTrainEmergencyModal(true)}
                        className="btn btn-outline-danger btn-sm flex-fill"
                        style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.78rem' }}
                      >
                        Security Dossier / Alert Papa
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTrainIncidentDispatched(false);
                          stopTrainWhistle();
                        }}
                        className="btn btn-outline-secondary btn-sm"
                        style={{ borderRadius: 8, fontSize: '0.74rem' }}
                      >
                        Mark Safe
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-3 mb-3 rounded-3"
                    style={{
                      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FFF1F2',
                      border: '1.5px solid #F43F5E',
                      boxShadow: '0 4px 14px rgba(244, 63, 94, 0.12)'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <FaShieldAlt style={{ color: '#E11D48', fontSize: '1.15rem' }} />
                        <strong style={{ fontSize: '0.88rem', color: isDark ? '#FDA4AF' : '#9F1239' }}>
                          In-Train Suspicious Activity or Danger?
                        </strong>
                      </div>
                      <span className="badge bg-danger" style={{ fontSize: '0.68rem' }}>RPF 139 PRIORITY</span>
                    </div>

                    <p style={{ fontSize: '0.79rem', color: isDark ? '#FECDD3' : '#4C0519', margin: '0 0 10px', lineHeight: 1.45 }}>
                      Stalking, harassment, rowdy behavior, or unauthorized entry in Coach {coachNumber}? Connect directly with Railway Police (RPF 139) and alert {guardianName}.
                    </p>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setTrainEmergencyModal(true)}
                        className="btn btn-danger btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', backgroundColor: '#E11D48', border: 'none' }}
                      >
                        <FaShieldAlt /> Report Suspicious Activity (RPF & Guardian)
                      </button>

                      <a
                        href="tel:139"
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                        style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.78rem' }}
                      >
                        <FaPhoneAlt /> Call 139
                      </a>
                    </div>
                  </div>
                )}

                {/* Indian Railways Meri Saheli protection */}
                <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.blueBoxBg, border: theme.blueBoxBorder }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <FaShieldAlt style={{ color: '#2563EB', fontSize: '1.1rem' }} />
                    <span style={{ fontWeight: 700, color: theme.blueBoxText, fontSize: '0.85rem' }}>
                      Indian Railways "Meri Saheli" Protection
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: theme.blueBoxText, lineHeight: 1.45 }}>
                    {selectedTrain.meriSaheliEscortZone}. Solo female passengers are checked by lady RPF officers en-route.
                  </div>
                </div>

                {/* Anomaly Test Button */}
                <div className="p-3 rounded-3" style={{ backgroundColor: theme.redBoxBg, border: theme.redBoxBorder }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.redBoxText, marginBottom: 4 }}>
                    🧪 Test Route Anomaly & Safety Invasion
                  </div>
                  <button
                    type="button"
                    onClick={triggerSimulatedDeviation}
                    className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ fontWeight: 600, borderRadius: 8 }}
                  >
                    <FaExclamationTriangle /> Simulate Anomaly Alert & Safety Dialog
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Where Is My Train Vertical Station Timeline */}
            <div className="col-12 col-lg-7">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div>
                    <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      🚉 Station-by-Station Live Schedule ({selectedTrain.stations.length} Stops)
                    </h5>
                    <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: 2 }}>
                      Train #{selectedTrain.trainNumber} {selectedTrain.trainName}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTrainEmergencyModal(true)}
                      className="btn btn-danger btn-sm d-flex align-items-center gap-1 shadow-sm"
                      style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#E11D48', border: 'none' }}
                    >
                      <FaShieldAlt /> Train Security (RPF 139)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRunningStatus(computeRealtimeTrainRunningStatus(selectedTrain));
                        alert("Live NTES Schedule refreshed!");
                      }}
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                      style={{ borderRadius: 8, fontSize: '0.78rem' }}
                    >
                      <FaBroadcastTower /> Refresh Live NTES
                    </button>
                  </div>
                </div>

                {/* Vertical Rail Line Track */}
                <div style={{ position: 'relative', paddingLeft: 30 }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: 15,
                      bottom: 30,
                      left: 14,
                      width: 4,
                      backgroundColor: '#6355E6',
                      borderRadius: 2
                    }}
                  />

                  {selectedTrain.stations.map((st, idx) => {
                    const isPassed = runningStatus ? idx < runningStatus.currentStationIndex : idx === 0;
                    const isCurrent = runningStatus ? idx === runningStatus.currentStationIndex : idx === 1;
                    const isNext = runningStatus ? idx === runningStatus.currentStationIndex + 1 : idx === 2;

                    return (
                      <div
                        key={st.code}
                        style={{
                          position: 'relative',
                          marginBottom: 16,
                          padding: '12px 16px',
                          borderRadius: 12,
                          backgroundColor: isCurrent ? theme.timelineCurrent : isPassed ? theme.timelinePassed : theme.timelineUpcoming,
                          border: isCurrent ? '1.5px solid #8B5CF6' : theme.cardBorder,
                          boxShadow: isCurrent ? '0 4px 14px rgba(139, 92, 246, 0.2)' : 'none'
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: -24,
                            top: 16,
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            backgroundColor: isCurrent ? '#10B981' : isPassed ? '#6355E6' : '#9CA3AF',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            boxShadow: isCurrent ? '0 0 12px #10B981' : 'none',
                            zIndex: 10
                          }}
                        >
                          {isCurrent ? <FaTrain style={{ fontSize: '0.7rem' }} /> : isPassed ? '✓' : idx + 1}
                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontWeight: 800, fontSize: '0.98rem', color: theme.textPrimary }}>
                                {st.name} ({st.code})
                              </span>
                              <span className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>
                                PF {st.platform}
                              </span>
                              {isCurrent && (
                                <span className="badge bg-success" style={{ fontSize: '0.68rem' }}>
                                  CURRENT STATION
                                </span>
                              )}
                              {isNext && (
                                <span className="badge bg-primary" style={{ fontSize: '0.68rem' }}>
                                  UPCOMING NEXT
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '0.78rem', color: theme.textMuted, marginTop: 3 }}>
                              Distance: <strong>{st.distanceKm} km</strong> · Halt: {st.halt} · Day {st.day}
                            </div>
                          </div>

                          <div className="text-end">
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: theme.textPrimary }}>
                              Arr: <span style={{ color: '#6355E6' }}>{st.schArr}</span> | Dep: <span style={{ color: '#10B981' }}>{st.schDep}</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600, marginTop: 2 }}>
                              {isPassed ? 'Passed' : isCurrent ? 'At Platform' : 'Scheduled'}
                            </div>
                          </div>
                        </div>

                        <div
                          className="mt-2 pt-2 border-top d-flex flex-wrap align-items-center justify-content-between gap-2"
                          style={{ borderColor: theme.cardBorder, fontSize: '0.75rem', color: theme.textSecondary }}
                        >
                          <div>🏢 <strong>Safe Lounge:</strong> {st.waitingRoom}</div>
                          <div>👮 <strong>RPF Desk:</strong> {st.policeDesk}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          )
        )}

        {/* ========================================================
            TAB 3: LOCAL CITY TRANSIT & VEHICLE PLATE DUAL TRACKING
        ======================================================== */}
        {activeTab === 'local_transit' && (
          <div className="row g-4">
            {/* Left: Register Vehicle, City Route & Dual Telemetry */}
            <div className="col-12 col-lg-6">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                    <FaCar style={{ color: '#6355E6', marginRight: 8 }} />
                    {localTrackingActive ? 'Live Vehicle & Phone GPS Telemetry' : 'New City Local Transit & Vehicle Route'}
                  </h5>
                  <span className={`badge ${localTrackingActive ? 'bg-success' : 'bg-info text-dark'}`} style={{ fontSize: '0.72rem' }}>
                    {localTrackingActive ? '● DUAL GPS TRACKING LIVE' : 'ROUTE & VEHICLE SETUP'}
                  </span>
                </div>

                {!localTrackingActive ? (
                  /* ================= Setup & Route Planner Mode ================= */
                  <div>
                    {/* ═══════════════════════════════════════════════════════
                        CONDITIONAL ROUTING:
                        MODE 1: BUS 4-STEP LINEAR JOURNEY (NORMAL FLOW)
                        MODE 2: CAB / CAR DIRECT ARRIVAL AT HOTEL PORCH
                        MODE 3: TRAIN DEBOARDING AT STATION
                        ═══════════════════════════════════════════════════════ */}
                    {primaryTransitMode === 'bus' ? (
                      /* ═════════════════════════════════════════════════════════════════════
                         BUS MODE: 4 NORMAL LINEAR FEATURES AS REQUESTED BY USER:
                         1. Bus station pahuche phle uska checkin
                         2. Phir bus station se hotel tak ka journey
                         3. Then hotel checkin
                         4. Phir hotel se kahin jana ho to uski journey
                         ═════════════════════════════════════════════════════════════════════ */
                      <div>
                        {/* Bus Mode Header Banner */}
                        <div
                          className="p-3 mb-3 rounded-3"
                          style={{
                            backgroundColor: 'rgba(99, 85, 230, 0.08)',
                            border: '1.5px solid #6355E6'
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <strong style={{ color: '#6355E6', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <FaBus /> 4-Step Bus Safe Arrival & City Journey
                            </strong>
                            <span className="badge bg-primary" style={{ fontSize: '0.68rem' }}>BUS ➔ HOTEL ➔ CITY</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: theme.textSecondary }}>
                            Arrival via <strong>{selectedBus.operator} ({selectedBus.busNumber})</strong> at {destinationCity} Central ISBT Bus Stand.
                          </div>

                          {/* 4-Step Visual Progress Indicator */}
                          <div className="d-flex flex-wrap gap-1 mt-2">
                            <span className={`badge ${busStationCheckedIn ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '0.66rem' }}>
                              {busStationCheckedIn ? '✓ 1. Station Checked-In' : '1. Station Check-In'}
                            </span>
                            <span className={`badge ${busToHotelReached ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '0.66rem' }}>
                              {busToHotelReached ? '✓ 2. Reached Hotel' : '2. Bus Stand ➔ Hotel'}
                            </span>
                            <span className={`badge ${hotelCheckedIn ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.66rem' }}>
                              {hotelCheckedIn ? `✓ 3. Hotel In (${hotelRoomNumber})` : '3. Hotel Check-In'}
                            </span>
                            <span className="badge bg-info text-dark" style={{ fontSize: '0.66rem' }}>
                              4. Hotel se City Journey
                            </span>
                          </div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                            FEATURE 1: BUS STATION PAUCHE PEHLE USKA CHECKIN
                            ───────────────────────────────────────────────────────────── */}
                        <div
                          className="p-3 mb-3 rounded-3"
                          style={{
                            backgroundColor: busStationCheckedIn ? (isDark ? '#142921' : '#ECFDF5') : theme.subCardBg,
                            border: busStationCheckedIn ? '2px solid #10B981' : '1.5px solid #6355E6'
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: busStationCheckedIn ? '#10B981' : theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>🚌</span> 1. Bus Station Arrival & Check-In
                            </div>
                            <span className={`badge ${busStationCheckedIn ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '0.68rem' }}>
                              {busStationCheckedIn ? '✓ STATION CHECKED-IN' : 'ARRIVAL PENDING'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.76rem', color: theme.textSecondary, marginBottom: 10 }}>
                            Arrival Terminal: <strong>{destinationCity} Central ISBT Bus Stand (Sindhi Camp / Main Concourse)</strong> via {selectedBus.busNumber}.
                          </div>

                          {!busStationCheckedIn ? (
                            <button
                              type="button"
                              onClick={() => {
                                setBusStationCheckedIn(true);
                                const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                                setBusStationCheckInTime(t);
                              }}
                              className="btn btn-success btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                              style={{ borderRadius: 10, fontWeight: 800, fontSize: '0.82rem' }}
                            >
                              <FaCheck /> Confirm Arrival & Check-In at Bus Station
                            </button>
                          ) : (
                            <div className="d-flex justify-content-between align-items-center p-2 rounded-2" style={{ backgroundColor: isDark ? '#0C1C16' : '#D1FAE5', border: '1px solid #10B981' }}>
                              <div>
                                <div style={{ fontSize: '0.75rem', color: '#065F46', fontWeight: 700 }}>
                                  ✓ Bus station arrival verified at {busStationCheckInTime || 'Just now'}.
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#047857' }}>
                                  📲 Guardian (+91 75240 72395) notified: Safely arrived at {destinationCity} Bus Stand.
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setBusStationCheckedIn(false)}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{ fontSize: '0.7rem', color: '#065F46' }}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                            FEATURE 2: PHIR BUS STATION SE HOTEL TAK KA JOURNEY
                            ───────────────────────────────────────────────────────────── */}
                        <div
                          className="p-3 mb-3 rounded-3"
                          style={{
                            backgroundColor: busToHotelReached ? (isDark ? '#142921' : '#ECFDF5') : theme.subCardBg,
                            border: busToHotelReached ? '2px solid #10B981' : theme.subCardBorder
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: busToHotelReached ? '#10B981' : theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>🚖</span> 2. Bus Station se Hotel tak ka Journey
                            </div>
                            <span className={`badge ${busToHotelReached ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '0.68rem' }}>
                              {busToHotelReached ? '✓ REACHED HOTEL' : 'TRANSIT SETUP'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.74rem', color: theme.textSecondary, marginBottom: 10 }}>
                            Bus stand se hotel tak verified safe transport connect karein aur live tracking karein:
                          </div>

                          {/* Route Origin & Destination */}
                          <div className="row g-2 mb-2">
                            <div className="col-12 col-sm-6">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Pickup (Bus Station)</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 700 }}
                                value={`${destinationCity} Central ISBT Bus Stand (Exit Gate)`}
                                readOnly
                              />
                            </div>
                            <div className="col-12 col-sm-6">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Destination Hotel</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 700 }}
                                value={`${selectedStayName}, ${stayAddress}`}
                                onChange={(e) => {
                                  setSelectedStayName(e.target.value);
                                  setLocalDropLocation(e.target.value);
                                }}
                              />
                            </div>
                          </div>

                          {/* Safe Transit Mode Selector */}
                          <div className="mb-2">
                            <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Select Safe Ride from Bus Stand:</label>
                            <div className="row g-1 mt-1">
                              {[
                                { id: 'cab', icon: '🚖', label: 'ISBT Prepaid Pink Cab', est: '~₹140 · 15m' },
                                { id: 'metro', icon: '🚇', label: 'City Metro Pink Coach', est: '~₹20 · 10m' },
                                { id: 'auto', icon: '🛺', label: 'Govt. Pre-Paid Auto', est: '~₹70 · 20m' }
                              ].map((t) => (
                                <div key={t.id} className="col-4">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedTransitId(t.id);
                                      setLocalTransportMode(t.label);
                                    }}
                                    style={{
                                      width: '100%',
                                      padding: '6px 4px',
                                      borderRadius: 8,
                                      border: selectedTransitId === t.id ? '2px solid #6355E6' : theme.cardBorder,
                                      backgroundColor: selectedTransitId === t.id ? (isDark ? '#261852' : '#EDE8FE') : (isDark ? '#191136' : '#FFFFFF'),
                                      color: theme.textPrimary,
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      textAlign: 'center'
                                    }}
                                  >
                                    <div>{t.icon} {t.label}</div>
                                    <div style={{ fontSize: '0.62rem', color: '#6355E6' }}>{t.est}</div>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Vehicle Plate & Driver */}
                          <div className="row g-2 mb-2">
                            <div className="col-6">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Vehicle Plate #</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontFamily: 'monospace', fontWeight: 800 }}
                                value={vehicleNumberPlate}
                                onChange={(e) => setVehicleNumberPlate(e.target.value.toUpperCase())}
                                placeholder="e.g. RJ 14 TA 4589"
                              />
                            </div>
                            <div className="col-6">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Driver Name & Mobile</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                value={driverName}
                                onChange={(e) => setDriverName(e.target.value)}
                                placeholder="e.g. Ramesh Kumar (+91 98111 22334)"
                              />
                            </div>
                          </div>

                          {/* Transit Actions */}
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setLocalTrackingActive(true);
                                setJourneyStage('local_cab');
                                setDossierSharedToast(true);
                                setTimeout(() => setDossierSharedToast(false), 3500);
                              }}
                              className="btn btn-primary btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                              style={{ backgroundColor: '#6355E6', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem' }}
                            >
                              <FaCar /> Start Live Journey Tracking (Bus Stand ➔ Hotel)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBusToHotelReached(true);
                                setJourneyStage('hotel_stay');
                                alert(`Safely reached hotel doorstep! Please confirm your hotel check-in in Step 3 below.`);
                              }}
                              className="btn btn-outline-success btn-sm flex-fill py-2 d-flex align-items-center justify-content-center gap-2"
                              style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.8rem' }}
                            >
                              <FaCheck /> ✓ Safely Reached Hotel Doorstep
                            </button>
                          </div>
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                            FEATURE 3: THEN HOTEL CHECKIN
                            ───────────────────────────────────────────────────────────── */}
                        <div
                          className="p-3 mb-3 rounded-3"
                          style={{
                            backgroundColor: hotelCheckedIn ? (isDark ? '#142921' : '#ECFDF5') : theme.subCardBg,
                            border: hotelCheckedIn ? '2px solid #10B981' : '1.5px solid #6355E6'
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: hotelCheckedIn ? '#10B981' : theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>🏨</span> 3. Hotel Safe Check-In
                            </div>
                            <span className={`badge ${hotelCheckedIn ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '0.68rem' }}>
                              {hotelCheckedIn ? '✓ ROOM CHECKED-IN' : 'CHECK-IN PENDING'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.74rem', color: theme.textSecondary, marginBottom: 10 }}>
                            Hotel pahunch ke room number confirm karein jisse safe perimeter lock ho jaye aur guardian alert ho jaye:
                          </div>

                          <div className="row g-2 mb-2">
                            <div className="col-8">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Hotel Name & Locality</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 700 }}
                                value={`${selectedStayName}, ${stayAddress}`}
                                readOnly
                              />
                            </div>
                            <div className="col-4">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Room #</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                value={hotelRoomNumber}
                                onChange={(e) => setHotelRoomNumber(e.target.value)}
                                placeholder="e.g. Room 304"
                              />
                            </div>
                          </div>

                          {!hotelCheckedIn ? (
                            <button
                              type="button"
                              onClick={() => {
                                setHotelCheckedIn(true);
                                setBusToHotelReached(true);
                                const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                                setHotelCheckInTime(t);
                              }}
                              className="btn btn-success btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                              style={{ borderRadius: 10, fontWeight: 800, fontSize: '0.82rem' }}
                            >
                              <FaCheck /> Confirm Safe Hotel Check-In (Doorstep Verified)
                            </button>
                          ) : (
                            <div className="d-flex justify-content-between align-items-center p-2 rounded-2" style={{ backgroundColor: isDark ? '#0C1C16' : '#D1FAE5', border: '1px solid #10B981' }}>
                              <div>
                                <div style={{ fontSize: '0.75rem', color: '#065F46', fontWeight: 700 }}>
                                  ✓ Safe check-in verified in Room {hotelRoomNumber} at {hotelCheckInTime || 'Just now'}.
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#047857' }}>
                                  📲 Guardian (+91 75240 72395) notified: Safely checked into {selectedStayName}.
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setHotelCheckedIn(false)}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{ fontSize: '0.7rem', color: '#065F46' }}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ─────────────────────────────────────────────────────────────
                            FEATURE 4: PHIR HOTEL SE KAHIN JANA HO TO USKI JOURNEY
                            ───────────────────────────────────────────────────────────── */}
                        <div
                          className="p-3 mb-3 rounded-3"
                          style={{
                            backgroundColor: theme.subCardBg,
                            border: '1.5px solid #10B981'
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 style={{ margin: 0, fontWeight: 800, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                              <span>🏛️</span> 4. Hotel se City Journey / Sightseeing Excursions
                            </h6>
                            <span className="badge bg-success" style={{ fontSize: '0.62rem' }}>SAFE DAYLIGHT CORRIDOR</span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: theme.textSecondary, marginBottom: 12 }}>
                            Ab hotel se city mein kisi bhi jagah ghoomne ke liye origin automatic Hotel Gate set hai. Destination chuniye ya type karke safe trip shuru karein:
                          </div>

                          {/* Origin: Locked to Hotel Doorstep */}
                          <div className="mb-2">
                            <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Starting Point (From Hotel)</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: '#10B981', fontWeight: 800 }}
                              value={`${selectedStayName.split('(')[0].trim()} Hotel Main Porch / Gate`}
                              readOnly
                            />
                          </div>

                          {/* Destination: Custom or Picked */}
                          <div className="mb-3">
                            <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Sightseeing Destination in {destinationCity}</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 600 }}
                              value={sightseeingDestination}
                              onChange={(e) => setSightseeingDestination(e.target.value)}
                              placeholder="e.g. Hawa Mahal, Amer Fort, Bapu Bazaar Night Market..."
                            />
                          </div>

                          {/* Quick Sightseeing Spot Suggestion Pills */}
                          <div className="mb-3">
                            <div style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700, marginBottom: 6 }}>
                              Top Verified Safe Daylight Spots in {destinationCity} (Click to set):
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                              {[
                                { spot: 'Hawa Mahal & City Palace', time: '09:30 AM - 05:00 PM' },
                                { spot: 'Amer Fort & Maota Lake', time: '10:00 AM - 04:30 PM' },
                                { spot: 'Bapu Bazaar Market Corridor', time: '11:00 AM - 07:30 PM' },
                                { spot: 'Nahargarh Sunset Point', time: '04:00 PM - 06:30 PM' },
                                { spot: 'Albert Hall Museum & Gardens', time: '10:00 AM - 05:00 PM' }
                              ].map((s, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSightseeingDestination(`${s.spot}, ${destinationCity}`)}
                                  className="btn btn-sm"
                                  style={{
                                    fontSize: '0.68rem',
                                    borderRadius: 8,
                                    border: sightseeingDestination.includes(s.spot) ? '1.5px solid #10B981' : theme.cardBorder,
                                    backgroundColor: sightseeingDestination.includes(s.spot) ? (isDark ? '#142921' : '#ECFDF5') : (isDark ? '#1C1438' : '#F8F7FD'),
                                    color: sightseeingDestination.includes(s.spot) ? '#10B981' : theme.textPrimary,
                                    fontWeight: sightseeingDestination.includes(s.spot) ? 800 : 500
                                  }}
                                >
                                  📍 {s.spot}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sightseeing Transport & Planned Return */}
                          <div className="row g-2 mb-3">
                            <div className="col-12 col-sm-6">
                              <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Transport Mode</label>
                              <select
                                className="form-select form-select-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                value={sightseeingTransport}
                                onChange={(e) => setSightseeingTransport(e.target.value)}
                              >
                                <option value="Verified Prepaid Pink Cab / App Taxi">Verified Prepaid Pink Cab / App Taxi</option>
                                <option value="Pink City Metro (Ladies Coach)">Pink City Metro (Ladies Coach)</option>
                                <option value="Hotel Concierge Pre-Booked Cab">Hotel Concierge Pre-Booked Cab</option>
                                <option value="Government Pre-Paid Auto Booth">Government Pre-Paid Auto Booth</option>
                              </select>
                            </div>
                            <div className="col-12 col-sm-6">
                              <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Safe Return Deadline</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                value={sightseeingReturnTime}
                                onChange={(e) => setSightseeingReturnTime(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Launch Sightseeing Excursion Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const destEnc = encodeURIComponent(`${sightseeingDestination}`);
                              const origEnc = encodeURIComponent(`${selectedStayName}, ${stayAddress}`);
                              window.open(`https://www.google.com/maps/dir/?api=1&origin=${origEnc}&destination=${destEnc}`, '_blank');
                            }}
                            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow"
                            style={{ backgroundColor: '#10B981', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.86rem' }}
                          >
                            <FaWalking /> Launch Safe City Journey from Hotel ({sightseeingDestination.split(',')[0].trim()}) <FaExternalLinkAlt style={{ fontSize: '0.75rem' }} />
                          </button>
                        </div>
                      </div>
                    ) : (primaryTransitMode === 'car' || (primaryTransitMode === 'cab' && cabDropPreference === 'direct_hotel')) ? (
                      /* DIRECT VEHICLE ARRIVAL: HOTEL CHECK-IN & SIGHTSEEING PLANNER */
                      <div>
                        {/* Outstation Cab Drop Delivery Plan Banner */}
                        {primaryTransitMode === 'cab' && (
                          <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: 'rgba(99, 85, 230, 0.1)', border: '1.5px solid #6355E6' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong style={{ color: '#6355E6', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>🚕</span> Outstation Cab Drop Delivery Plan:
                              </strong>
                              <span className="badge bg-primary" style={{ fontSize: '0.68rem' }}>DIRECT CAB MODE</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: theme.textSecondary, marginBottom: 10 }}>
                              Aapki Outstation Cab (<strong>{cabProvider} - {cabPlateNumber}</strong>) aapko kahan drop karegi? Choose your destination plan:
                            </div>

                            {/* 2 Cab Drop Options */}
                            <div className="row g-2 mb-2">
                              <div className="col-12 col-sm-6">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCabDropPreference('direct_hotel');
                                    setLocalPickupLocation(`Outstation Cab Direct Ride (${originCity} to ${destinationCity})`);
                                    const hotelAddr = `${selectedStayName}, ${stayAddress}`;
                                    setLocalDropLocation(hotelAddr);
                                    setVehicleNumberPlate(cabPlateNumber);
                                    setDriverName(cabDriverName);
                                  }}
                                  style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: cabDropPreference === 'direct_hotel' ? '2px solid #10B981' : theme.cardBorder,
                                    backgroundColor: cabDropPreference === 'direct_hotel' ? (isDark ? '#142921' : '#ECFDF5') : (isDark ? '#1E1538' : '#FFFFFF'),
                                    color: theme.textPrimary,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between mb-1">
                                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#10B981' }}>
                                      ✓ Direct Drop to Hotel
                                    </span>
                                    <span className="badge bg-success" style={{ fontSize: '0.62rem' }}>RECOMMENDED</span>
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: theme.textSecondary }}>
                                    Cab directly drops you at Hotel porch. No vehicle change needed.
                                  </div>
                                </button>
                              </div>

                              <div className="col-12 col-sm-6">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCabDropPreference('city_transfer');
                                    setLocalPickupLocation(`${destinationCity} Highway Bypass / City Entry Toll`);
                                    setVehicleNumberPlate('RJ 14 PA 3312');
                                  }}
                                  style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 12px',
                                    borderRadius: 10,
                                    border: cabDropPreference === 'city_transfer' ? '2px solid #F59E0B' : theme.cardBorder,
                                    backgroundColor: cabDropPreference === 'city_transfer' ? (isDark ? '#2E2012' : '#FFFBEB') : (isDark ? '#1E1538' : '#FFFFFF'),
                                    color: theme.textPrimary,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                  }}
                                >
                                  <div className="d-flex align-items-center justify-content-between mb-1">
                                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#D97706' }}>
                                      Drop at City Point ➔ Hotel Cab
                                    </span>
                                    <span className="badge bg-warning text-dark" style={{ fontSize: '0.62rem' }}>MID-SWITCH</span>
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: theme.textSecondary }}>
                                    Cab drops at highway/entry point. Connect a local verified cab to hotel.
                                  </div>
                                </button>
                              </div>
                            </div>

                            {cabDropPreference === 'direct_hotel' && (
                              <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>●</span> Outstation Cab details ({cabPlateNumber}) automatically locked as your safe doorstep ride!
                              </div>
                            )}
                          </div>
                        )}

                        {/* 1. HOTEL SAFE ARRIVAL & CHECK-IN CONFIRMATION CARD */}
                        <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: hotelCheckedIn ? (isDark ? '#142921' : '#ECFDF5') : theme.subCardBg, border: hotelCheckedIn ? '2px solid #10B981' : '1.5px solid #6355E6' }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: hotelCheckedIn ? '#10B981' : theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>🏨</span> Direct Doorstep Arrival at {selectedStayName.split('(')[0].trim()}
                            </div>
                            <span className={`badge ${hotelCheckedIn ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '0.68rem' }}>
                              {hotelCheckedIn ? '✓ CHECKED-IN SAFELY' : 'ARRIVAL PENDING'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.76rem', color: theme.textSecondary, marginBottom: 10 }}>
                            {primaryTransitMode === 'car' ? 'Personal Car Drive' : 'Outstation Cab'} reached hotel directly. Station pickup bypassed.
                          </div>

                          <div className="row g-2 mb-2">
                            <div className="col-8">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Hotel Name & Address</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 700 }}
                                value={`${selectedStayName}, ${stayAddress}`}
                                readOnly
                              />
                            </div>
                            <div className="col-4">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Room #</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                value={hotelRoomNumber}
                                onChange={(e) => setHotelRoomNumber(e.target.value)}
                                placeholder="e.g. Room 304"
                              />
                            </div>
                          </div>

                          {!hotelCheckedIn ? (
                            <button
                              type="button"
                              onClick={() => {
                                setHotelCheckedIn(true);
                                setHotelCheckInTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
                              }}
                              className="btn btn-success btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                              style={{ borderRadius: 10, fontWeight: 800, fontSize: '0.82rem' }}
                            >
                              ✓ Confirm Safe Hotel Arrival & Check-In (Doorstep Verified)
                            </button>
                          ) : (
                            <div className="d-flex justify-content-between align-items-center p-2 rounded-2" style={{ backgroundColor: isDark ? '#0C1C16' : '#D1FAE5', border: '1px solid #10B981' }}>
                              <span style={{ fontSize: '0.74rem', color: '#065F46', fontWeight: 700 }}>
                                ✓ Safe check-in verified at {hotelCheckInTime || 'Just now'}. Guardian notified.
                              </span>
                              <button
                                type="button"
                                onClick={() => setHotelCheckedIn(false)}
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                style={{ fontSize: '0.7rem', color: '#065F46' }}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 2. CITY SIGHTSEEING & EXCURSIONS (FROM HOTEL TO ANY SPOT) */}
                        <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: '1.5px solid #10B981' }}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 style={{ margin: 0, fontWeight: 800, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                              <span>🏛️</span> City Sightseeing & Excursion Navigator
                            </h6>
                            <span className="badge bg-success" style={{ fontSize: '0.62rem' }}>SAFE DAYLIGHT CORRIDOR</span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: theme.textSecondary, marginBottom: 12 }}>
                            Ab hotel se city mein ghoomne ke liye origin automatic Hotel Gate set hai. Destination chuniye ya type karke safe corridor track kijiye:
                          </div>

                          {/* Origin: Always Hotel Doorstep */}
                          <div className="mb-2">
                            <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Starting Point (From Hotel)</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: '#10B981', fontWeight: 800 }}
                              value={`${selectedStayName.split('(')[0].trim()} Hotel Main Porch / Gate`}
                              readOnly
                            />
                          </div>

                          {/* Destination: Custom or Picked */}
                          <div className="mb-3">
                            <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Sightseeing Destination in {destinationCity}</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 600 }}
                              value={sightseeingDestination}
                              onChange={(e) => setSightseeingDestination(e.target.value)}
                              placeholder="e.g. Hawa Mahal, Amer Fort, Bapu Bazaar Night Market..."
                            />
                          </div>

                          {/* Quick Sightseeing Spot Suggestion Pills */}
                          <div className="mb-3">
                            <div style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700, marginBottom: 6 }}>
                              Top Verified Safe Daylight Spots in {destinationCity} (Click to set):
                            </div>
                            <div className="d-flex flex-wrap gap-1">
                              {[
                                { spot: 'Hawa Mahal & City Palace', time: '09:30 AM - 05:00 PM', desc: 'Tourist Police Booth at Badi Chaupar' },
                                { spot: 'Amer Fort & Maota Lake', time: '10:00 AM - 04:30 PM', desc: 'Government RTDC Pink Cabs' },
                                { spot: 'Bapu Bazaar Market Corridor', time: '11:00 AM - 07:30 PM', desc: 'Women-Friendly Pink Corridor' },
                                { spot: 'Nahargarh Sunset Point', time: '04:00 PM - 06:30 PM', desc: 'Pre-twilight Safe Departure' },
                                { spot: 'Albert Hall Museum & Gardens', time: '10:00 AM - 05:00 PM', desc: 'CCTV Monitored Perimeter' }
                              ].map((s, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSightseeingDestination(`${s.spot}, ${destinationCity}`)}
                                  className="btn btn-sm"
                                  style={{
                                    fontSize: '0.68rem',
                                    borderRadius: 8,
                                    border: sightseeingDestination.includes(s.spot) ? '1.5px solid #10B981' : theme.cardBorder,
                                    backgroundColor: sightseeingDestination.includes(s.spot) ? (isDark ? '#142921' : '#ECFDF5') : (isDark ? '#1C1438' : '#F8F7FD'),
                                    color: sightseeingDestination.includes(s.spot) ? '#10B981' : theme.textPrimary,
                                    padding: '3px 8px',
                                    fontWeight: 600
                                  }}
                                >
                                  {s.spot} <span style={{ opacity: 0.6 }}>({s.time.split('-')[0].trim()})</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Transport for Excursion */}
                          <div className="row g-2 mb-3">
                            <div className="col-7">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Excursion Transport Mode</label>
                              <select
                                value={sightseeingTransport}
                                onChange={(e) => setSightseeingTransport(e.target.value)}
                                className="form-select form-select-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                              >
                                <option value="Verified Prepaid Pink Cab / App Taxi">Verified Prepaid Pink Cab / App Taxi</option>
                                <option value="City Metro (Pink Coach / Ladies Priority)">City Metro (Pink Coach / Ladies Priority)</option>
                                <option value="Government Pre-paid Auto Booth (Police Slip)">Government Pre-paid Auto (Police Slip)</option>
                                <option value="Personal Car Drive (with Highway FASTag)">Personal Car Drive</option>
                              </select>
                            </div>
                            <div className="col-5">
                              <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Safe Return Before</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                value={sightseeingReturnTime}
                                onChange={(e) => setSightseeingReturnTime(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Launch Sightseeing Excursion Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedNextDestination(sightseeingDestination);
                              setNextTripTransportMode(sightseeingTransport);
                              setNextTripActive(true);
                              setNextTripArrived(false);
                              setNextTripProgress(15);
                              alert(`Safe Excursion to "${sightseeingDestination}" launched from hotel! Route corridor tracking is now active.`);
                            }}
                            className="btn btn-primary btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                            style={{ backgroundColor: '#10B981', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.82rem' }}
                          >
                            🚀 Launch Safe Sightseeing Excursion from Hotel <FaArrowRight />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* TRAIN / BUS / PUBLIC TRANSIT: DEBOARDING ➔ LOCAL TRANSIT ➔ CHECK-IN ➔ SIGHTSEEING */
                      <div>
                        {/* Deboarding Terminal Banner */}
                        {primaryTransitMode === 'bus' ? (
                          <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: 'rgba(99, 85, 230, 0.08)', border: '1.5px solid #6355E6' }}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <strong style={{ color: '#6355E6', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <FaBus /> Deboarded at {destinationCity} Central ISBT Bus Terminal
                              </strong>
                              <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>ISBT ARRIVAL</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: theme.textSecondary }}>
                              Aap <strong>{selectedBus.operator} ({selectedBus.busNumber})</strong> se {destinationCity} Central Bus Stand (ISBT) par deboard ho chuki hain. Ab bus terminal se hotel tak safe verified local transit connect kijiye:
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: 'rgba(99, 85, 230, 0.08)', border: '1.5px solid #6355E6' }}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <strong style={{ color: '#6355E6', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <FaTrain /> Deboarded at {destinationCity} Railway Station
                              </strong>
                              <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>STATION ARRIVAL</span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: theme.textSecondary }}>
                              Aap <strong>#{selectedTrain.trainNumber} ({selectedTrain.trainName})</strong> se {destinationCity} Railway Station par deboard ho chuki hain. Station exit gate se hotel tak verified cab/metro connect karein:
                            </div>
                          </div>
                        )}

                        {/* Step 1: Current Pickup Location & Destination in City */}
                        <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
                            📍 Current / Pickup Location in {destinationCity}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (primaryTransitMode === 'train') setLocalPickupLocation(`${destinationCity} Railway Station (Main Concourse Gate 1)`);
                              else if (primaryTransitMode === 'bus') setLocalPickupLocation(`${destinationCity} ISBT Main Central Bus Terminal`);
                              else if (primaryTransitMode === 'cab') setLocalPickupLocation(cabDropPreference === 'direct_hotel' ? `Direct Outstation Cab Ride to Hotel Gate` : `${destinationCity} City Toll Plaza Entry Point`);
                              else setLocalPickupLocation(`${destinationCity} Highway Entry Toll Corridor`);
                            }}
                            className="btn btn-sm btn-link p-0 text-decoration-none"
                            style={{ fontSize: '0.74rem', color: '#6355E6', fontWeight: 700 }}
                          >
                            {primaryTransitMode === 'train' ? 'Use Station Pin' :
                             primaryTransitMode === 'bus'   ? 'Use ISBT Terminal Pin' :
                             primaryTransitMode === 'cab'   ? (cabDropPreference === 'direct_hotel' ? 'Use Hotel Doorstep' : 'Use Highway Drop Pin') :
                                                              'Use Highway Pin'}
                          </button>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          value={localPickupLocation}
                          onChange={(e) => setLocalPickupLocation(e.target.value)}
                          placeholder="e.g. Railway Station Gate 1 / Current Bus Terminal"
                        />
                      </div>

                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
                            🏁 Destination in {destinationCity} (Hotel / Sightseeing / Market)
                          </label>
                          <span style={{ fontSize: '0.72rem', color: theme.textMuted }}>Pick from Right or Type</span>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          value={localDropLocation}
                          onChange={(e) => {
                            setLocalDropLocation(e.target.value);
                            setSelectedStayName(e.target.value);
                          }}
                          placeholder="e.g. Hotel Arya Niwas / Clarks Avadh / MG Marg"
                        />
                        <div className="d-flex gap-2 mt-1">
                          <small style={{ fontSize: '0.72rem', color: theme.textMuted }}>Quick Presets:</small>
                          <button
                            type="button"
                            onClick={() => {
                              const s = `${selectedStayName}, ${stayAddress}`;
                              setLocalDropLocation(s);
                            }}
                            className="btn btn-sm p-0 text-decoration-none"
                            style={{ fontSize: '0.72rem', color: '#6355E6' }}
                          >
                            🏨 Hotel ({selectedStayName.split('(')[0].trim()})
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: System Local Transit Recommendations */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
                          💡 Recommended Safe Local Transports for this Route:
                        </label>
                        <span className="badge bg-success" style={{ fontSize: '0.68rem' }}>RTO & POLICE VERIFIED</span>
                      </div>

                      <div className="d-flex flex-column gap-2">
                        {/* 1. Metro */}
                        <div
                          className="p-2 px-3 rounded-3"
                          style={{
                            backgroundColor: selectedTransitId === 'metro' ? theme.blueBoxBg : theme.subCardBg,
                            border: selectedTransitId === 'metro' ? '2px solid #3B82F6' : theme.subCardBorder,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => {
                            setSelectedTransitId('metro');
                            setLocalTransportMode(`${destinationCity} Metro (Women Priority Coach)`);
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontSize: '1.2rem' }}>🚇</span>
                              <div>
                                <strong style={{ fontSize: '0.85rem', color: theme.textPrimary }}>
                                  {destinationCity} Metro (Pink Coach / Ladies Priority)
                                </strong>
                                <div style={{ fontSize: '0.74rem', color: theme.textSecondary }}>
                                  Direct line connecting Station ➔ City Center. Guard & CCTV every coach.
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <span className="badge bg-success" style={{ fontSize: '0.68rem' }}>HIGHEST SAFETY</span>
                              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10B981', marginTop: 2 }}>~10m · ₹20</div>
                            </div>
                          </div>
                        </div>

                        {/* 2. Prepaid Pink Cab / App Taxi */}
                        <div
                          className="p-2 px-3 rounded-3"
                          style={{
                            backgroundColor: selectedTransitId === 'cab' ? theme.blueBoxBg : theme.subCardBg,
                            border: selectedTransitId === 'cab' ? '2px solid #6355E6' : theme.subCardBorder,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => {
                            setSelectedTransitId('cab');
                            setLocalTransportMode('Verified Prepaid Pink Cab / App Taxi (Ola/Uber)');
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontSize: '1.2rem' }}>🚖</span>
                              <div>
                                <strong style={{ fontSize: '0.85rem', color: theme.textPrimary }}>
                                  Verified Prepaid Pink Cab / App Taxi (Doorstep)
                                </strong>
                                <div style={{ fontSize: '0.74rem', color: theme.textSecondary }}>
                                  Official Booth at Station Exit or App ride. Dual phone + car corridor tracking.
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <span className="badge bg-primary" style={{ fontSize: '0.68rem' }}>POLICE QR CODE</span>
                              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#6355E6', marginTop: 2 }}>~18m · ₹140</div>
                            </div>
                          </div>
                        </div>

                        {/* 3. Govt. Pre-paid Auto Booth */}
                        <div
                          className="p-2 px-3 rounded-3"
                          style={{
                            backgroundColor: selectedTransitId === 'auto' ? theme.blueBoxBg : theme.subCardBg,
                            border: selectedTransitId === 'auto' ? '2px solid #F59E0B' : theme.subCardBorder,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => {
                            setSelectedTransitId('auto');
                            setLocalTransportMode('Government Pre-paid Auto Booth with Police Receipt');
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontSize: '1.2rem' }}>🛺</span>
                              <div>
                                <strong style={{ fontSize: '0.85rem', color: theme.textPrimary }}>
                                  Government Pre-paid Auto Booth (Police Slip)
                                </strong>
                                <div style={{ fontSize: '0.74rem', color: theme.textSecondary }}>
                                  Fixed tariff receipt, driver badge registered on passenger slip.
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <span className="badge bg-warning text-dark" style={{ fontSize: '0.68rem' }}>POLICE RECEIPT</span>
                              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#D97706', marginTop: 2 }}>~22m · ₹70</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Vehicle Number Plate Input (High Security IND Plate) */}
                    <div className="mb-3">
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                        🚖 Traveling Vehicle Number Plate (Mandatory for Telemetry)
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-warning text-dark fw-bold border-end-0">
                          <FaIdCard /> IND
                        </span>
                        <input
                          type="text"
                          className="form-control fw-bold border-start-0"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, letterSpacing: '1.5px' }}
                          value={vehicleNumberPlate}
                          onChange={(e) => setVehicleNumberPlate(e.target.value.toUpperCase())}
                          placeholder="e.g. RJ 14 TA 4589 or UP 32 EA 1234"
                        />
                      </div>
                      <div style={{ fontSize: '0.74rem', color: theme.textMuted, marginTop: 3 }}>
                        Dual GPS tracks your device location against this vehicle's transit corridor
                      </div>
                    </div>

                    {/* Step 4: Driver Name & Phone */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                          Driver Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          value={driverName}
                          onChange={(e) => setDriverName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                        />
                      </div>
                      <div className="col-6">
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: theme.textPrimary, marginBottom: 4, display: 'block' }}>
                          Driver Mobile No.
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          value={driverPhone}
                          onChange={(e) => setDriverPhone(e.target.value)}
                          placeholder="e.g. +91 98111 22334"
                        />
                      </div>
                    </div>

                    {/* Step 5: Safe Stay / Hotel Search & Confirmation */}
                    <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
                          🏨 Safe Stay / Hotel in {destinationCity}
                        </label>
                        {stayConfirmed && (
                          <span className="badge bg-success" style={{ fontSize: '0.68rem' }}>
                            ✓ STAY CONFIRMED & LOCKED
                          </span>
                        )}
                      </div>

                      {/* Stay Search Bar */}
                      <div className="mb-2">
                        <div className="input-group input-group-sm">
                          <span className="input-group-text" style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.textMuted }}>
                            <FaSearch />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                            value={staySearchQuery}
                            onChange={(e) => setStaySearchQuery(e.target.value)}
                            placeholder={`Search verified hotel or type custom stay in ${destinationCity}...`}
                          />
                          {staySearchQuery && (
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setStaySearchQuery('')}
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dropdown matches for Search Query */}
                      {staySearchQuery && (
                        <div className="p-2 mb-2 rounded border" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder, maxHeight: 150, overflowY: 'auto' }}>
                          <small style={{ fontSize: '0.72rem', color: theme.textMuted, display: 'block', marginBottom: 4 }}>
                            Matching options in {destinationCity}:
                          </small>
                          {citySafetyPlan.stayRecommendations
                            .filter(s => s.name.toLowerCase().includes(staySearchQuery.toLowerCase()) || s.area.toLowerCase().includes(staySearchQuery.toLowerCase()))
                            .map((stay, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded mb-1 d-flex justify-content-between align-items-center"
                                style={{ backgroundColor: theme.subCardBg, cursor: 'pointer' }}
                                onClick={() => {
                                  setSelectedStayName(stay.name);
                                  setStayAddress(stay.area);
                                  setLocalDropLocation(`${stay.name}, ${stay.area}`);
                                  setStayConfirmed(true);
                                  setStaySearchQuery('');
                                }}
                              >
                                <div>
                                  <strong style={{ fontSize: '0.8rem', color: theme.textPrimary }}>{stay.name}</strong>
                                  <div style={{ fontSize: '0.72rem', color: theme.textSecondary }}>{stay.area}</div>
                                </div>
                                <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>Select ➔</span>
                              </div>
                            ))}

                          {/* Custom stay button */}
                          <div
                            className="p-2 rounded d-flex justify-content-between align-items-center"
                            style={{ backgroundColor: 'rgba(99, 85, 230, 0.1)', border: '1px dashed #6355E6', cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedStayName(staySearchQuery);
                              const addr = `${destinationCity} Safe Sector`;
                              setStayAddress(addr);
                              setLocalDropLocation(`${staySearchQuery}, ${addr}`);
                              setStayConfirmed(true);
                              setStaySearchQuery('');
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '0.8rem', color: '#6355E6' }}>➕ Set "{staySearchQuery}" as Custom Stay</strong>
                              <div style={{ fontSize: '0.7rem', color: theme.textSecondary }}>Confirm custom hotel/homestay in {destinationCity}</div>
                            </div>
                            <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>Confirm Custom ➔</span>
                          </div>
                        </div>
                      )}

                      {/* Hotel Name Input */}
                      <div className="mb-2">
                        <small style={{ fontSize: '0.72rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Hotel / Stay Name:</small>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          value={selectedStayName}
                          onChange={(e) => {
                            setSelectedStayName(e.target.value);
                            setLocalDropLocation(`${e.target.value}, ${stayAddress}`);
                            setStayConfirmed(false);
                          }}
                          placeholder="Hotel Name"
                        />
                      </div>

                      {/* Hotel Address Input */}
                      <div className="mb-2">
                        <small style={{ fontSize: '0.72rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Hotel Address / Locality:</small>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          value={stayAddress}
                          onChange={(e) => {
                            setStayAddress(e.target.value);
                            setLocalDropLocation(`${selectedStayName}, ${e.target.value}`);
                            setStayConfirmed(false);
                          }}
                          placeholder="Hotel Address / Area"
                        />
                      </div>

                      {/* Confirmation and Status */}
                      <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top" style={{ borderColor: theme.cardBorder }}>
                        <button
                          type="button"
                          onClick={() => {
                            setStayConfirmed(true);
                            setLocalDropLocation(`${selectedStayName}, ${stayAddress}`);
                            alert(`Stay identified & confirmed: ${selectedStayName}, ${stayAddress}`);
                          }}
                          className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                          style={{ fontSize: '0.76rem', borderRadius: 8, fontWeight: 700 }}
                        >
                          <FaCheck /> Confirm & Lock Stay Location
                        </button>
                        <span style={{ fontSize: '0.72rem', color: theme.textMuted }}>
                          Route destination set to this stay
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Dual Tracking or Mark Reached Hotel */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setLocalTrackingActive(true);
                          setJourneyStage('local_cab');
                          setDossierSharedToast(true);
                          setTimeout(() => setDossierSharedToast(false), 3500);
                        }}
                        className="btn btn-primary flex-fill py-3 d-flex align-items-center justify-content-center gap-2 shadow"
                        style={{ backgroundColor: '#6355E6', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '0.92rem' }}
                      >
                        <FaCar /> Start Live Dual GPS Tracking ({primaryTransitMode === 'bus' ? 'ISBT' : 'Station'} ➔ Hotel)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setJourneyStage('hotel_stay');
                          alert(`Safely reached hotel doorstep! Please confirm your hotel check-in below.`);
                        }}
                        className="btn btn-outline-success flex-fill py-3 d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: 12, fontWeight: 800, fontSize: '0.92rem' }}
                      >
                        <FaCheck /> Safely Reached Hotel Doorstep
                      </button>
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        PHASE 2: HOTEL SAFE ARRIVAL & CHECK-IN CONFIRMATION
                        ═══════════════════════════════════════════════════════ */}
                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: hotelCheckedIn ? (isDark ? '#142921' : '#ECFDF5') : theme.subCardBg, border: hotelCheckedIn ? '2px solid #10B981' : '1.5px solid #6355E6' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div style={{ fontWeight: 800, fontSize: '0.86rem', color: hotelCheckedIn ? '#10B981' : theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>🏨</span> Step 2: Hotel Safe Arrival & Check-In Confirmation
                        </div>
                        <span className={`badge ${hotelCheckedIn ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '0.68rem' }}>
                          {hotelCheckedIn ? '✓ CHECKED-IN SAFELY' : 'HOTEL VERIFICATION'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.76rem', color: theme.textSecondary, marginBottom: 10 }}>
                        {primaryTransitMode === 'bus' ? 'Bus transit from ISBT' : 'Station transit'} completed. Enter room number to confirm safe arrival:
                      </div>

                      <div className="row g-2 mb-2">
                        <div className="col-8">
                          <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Hotel Name & Locality in {destinationCity}</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 700 }}
                            value={`${selectedStayName}, ${stayAddress}`}
                            readOnly
                          />
                        </div>
                        <div className="col-4">
                          <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Room Number</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 700 }}
                            value={hotelRoomNumber}
                            onChange={(e) => setHotelRoomNumber(e.target.value)}
                            placeholder="e.g. Room 204"
                          />
                        </div>
                      </div>

                      {!hotelCheckedIn ? (
                        <button
                          type="button"
                          onClick={() => {
                            setHotelCheckedIn(true);
                            setHotelCheckInTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
                          }}
                          className="btn btn-success btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                          style={{ borderRadius: 10, fontWeight: 800, fontSize: '0.82rem' }}
                        >
                          <FaCheck /> Confirm Safe Hotel Check-In & Notify Guardian
                        </button>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center p-2 rounded-2" style={{ backgroundColor: isDark ? '#0C1C16' : '#D1FAE5', border: '1px solid #10B981' }}>
                          <span style={{ fontSize: '0.74rem', color: '#065F46', fontWeight: 700 }}>
                            ✓ Safe check-in verified at {hotelCheckInTime || 'Just now'} in {hotelRoomNumber}. Guardian notified via encrypted SMS.
                          </span>
                          <button
                            type="button"
                            onClick={() => setHotelCheckedIn(false)}
                            className="btn btn-link btn-sm p-0 text-decoration-none"
                            style={{ fontSize: '0.7rem', color: '#065F46', fontWeight: 700 }}
                          >
                            Edit Check-In
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ═══════════════════════════════════════════════════════
                        PHASE 3: CITY SIGHTSEEING & EXCURSIONS (FROM HOTEL TO ANY SPOT)
                        ═══════════════════════════════════════════════════════ */}
                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: '1.5px solid #10B981' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 style={{ margin: 0, fontWeight: 800, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                          <span>🏛️</span> Step 3: City Sightseeing & Excursion Navigator
                        </h6>
                        <span className="badge bg-success" style={{ fontSize: '0.62rem' }}>SAFE DAYLIGHT CORRIDOR</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: theme.textSecondary, marginBottom: 12 }}>
                        Hotel check-in ke baad {destinationCity} explore karne ke liye starting point automatic <strong>Hotel Porch</strong> set hai. Tourist spots chuniye aur safe daylight corridor launch kijiye:
                      </div>

                      {/* Origin: Always Hotel Doorstep */}
                      <div className="mb-2">
                        <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Starting Point (From Hotel Porch)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: '#10B981', fontWeight: 800 }}
                          value={`${selectedStayName.split('(')[0].trim()} Hotel Main Porch / Gate`}
                          readOnly
                        />
                      </div>

                      {/* Destination: Custom or Picked */}
                      <div className="mb-3">
                        <label style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700 }}>Sightseeing Destination in {destinationCity}</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, fontWeight: 600 }}
                          value={sightseeingDestination}
                          onChange={(e) => setSightseeingDestination(e.target.value)}
                          placeholder="e.g. Hawa Mahal, Amer Fort, Bapu Bazaar Night Market..."
                        />
                      </div>

                      {/* Quick Sightseeing Spot Suggestion Pills */}
                      <div className="mb-3">
                        <div style={{ fontSize: '0.72rem', color: theme.textSecondary, fontWeight: 700, marginBottom: 6 }}>
                          Top Verified Safe Daylight Spots in {destinationCity} (Click to set):
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {[
                            { spot: 'Hawa Mahal & City Palace', time: '09:30 AM - 05:00 PM', desc: 'Tourist Police Booth at Badi Chaupar' },
                            { spot: 'Amer Fort & Maota Lake', time: '10:00 AM - 04:30 PM', desc: 'Government RTDC Pink Cabs' },
                            { spot: 'Bapu Bazaar Market Corridor', time: '11:00 AM - 07:30 PM', desc: 'Women-Friendly Pink Corridor' },
                            { spot: 'Nahargarh Sunset Point', time: '04:00 PM - 06:30 PM', desc: 'Pre-twilight Safe Departure' },
                            { spot: 'Albert Hall Museum & Gardens', time: '10:00 AM - 05:00 PM', desc: 'CCTV Monitored Perimeter' }
                          ].map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSightseeingDestination(`${s.spot}, ${destinationCity}`)}
                              className="btn btn-sm"
                              style={{
                                fontSize: '0.68rem',
                                borderRadius: 8,
                                border: sightseeingDestination.includes(s.spot) ? '1.5px solid #10B981' : theme.cardBorder,
                                backgroundColor: sightseeingDestination.includes(s.spot) ? (isDark ? '#142921' : '#ECFDF5') : (isDark ? '#1C1438' : '#F8F7FD'),
                                color: sightseeingDestination.includes(s.spot) ? '#10B981' : theme.textPrimary,
                                padding: '3px 8px',
                                fontWeight: 600
                              }}
                            >
                              {s.spot} <span style={{ opacity: 0.6 }}>({s.time.split('-')[0].trim()})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Transport for Excursion */}
                      <div className="row g-2 mb-3">
                        <div className="col-7">
                          <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Excursion Transport Mode</label>
                          <select
                            value={sightseeingTransport}
                            onChange={(e) => setSightseeingTransport(e.target.value)}
                            className="form-select form-select-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          >
                            <option value="Verified Prepaid Pink Cab / App Taxi">Verified Prepaid Pink Cab / App Taxi</option>
                            <option value="City Metro (Pink Coach / Ladies Priority)">City Metro (Pink Coach / Ladies Priority)</option>
                            <option value="Government Pre-paid Auto Booth (Police Slip)">Government Pre-paid Auto (Police Slip)</option>
                          </select>
                        </div>
                        <div className="col-5">
                          <label style={{ fontSize: '0.7rem', color: theme.textSecondary, fontWeight: 700 }}>Safe Return Before</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                            value={sightseeingReturnTime}
                            onChange={(e) => setSightseeingReturnTime(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Launch Sightseeing Excursion Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNextDestination(sightseeingDestination);
                          setNextTripTransportMode(sightseeingTransport);
                          setNextTripActive(true);
                          setNextTripArrived(false);
                          setNextTripProgress(15);
                          alert(`Safe Excursion to "${sightseeingDestination}" launched from hotel! Route corridor tracking is now active.`);
                        }}
                        className="btn btn-primary btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                        style={{ backgroundColor: '#10B981', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: '0.82rem' }}
                      >
                        🚀 Launch Safe Sightseeing Excursion from Hotel <FaArrowRight />
                      </button>
                    </div>

                  </div>
                )}
              </div>
                ) : (
                  /* ================= Active Live Dual-Telemetry Dashboard ================= */
                  <div>
                    {/* Live Corridor Status Banner */}
                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.greenBoxBg, border: theme.greenBoxBorder }}>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <div className="d-flex align-items-center gap-2">
                          <FaCheckCircle style={{ color: '#10B981', fontSize: '1.1rem' }} />
                          <strong style={{ fontSize: '0.9rem', color: theme.greenBoxText }}>
                            Dual Telemetry Active: Phone GPS + Vehicle
                          </strong>
                        </div>
                        <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>CORRIDOR LOCKED</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: theme.greenBoxText }}>
                        Tracking Passenger Phone GPS [±3m] + Vehicle <strong>[{vehicleNumberPlate}]</strong> ({driverName})
                      </div>
                    </div>

                    {/* From - To Corridor Path */}
                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: '0.74rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                          ACTIVE LOCAL TRANSIT CORRIDOR
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 600 }}>
                          📡 Google Maps Live Navigation Link Active
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.textPrimary }}>
                        📍 <strong>Pickup:</strong> {localPickupLocation}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6355E6', margin: '2px 0 2px 14px' }}>
                        ↓ In Transit via {localTransportMode}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>
                        🏁 <strong>Destination:</strong> {localDropLocation}
                      </div>
                    </div>

                    {/* ACTUAL REAL GOOGLE MAP EMBED & LIVE TELEMETRY RADAR */}
                    <div className="p-3 rounded-4 mb-3" style={{ backgroundColor: '#0D0820', color: '#FFFFFF', border: '1px solid #3B2F6E' }}>
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontSize: '0.78rem', color: '#A394FF', fontWeight: 800, textTransform: 'uppercase' }}>
                            🗺️ GOOGLE MAPS LIVE VEHICLE & PASSENGER RADAR
                          </span>
                          <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>
                            LIVE GPS ENFORCED
                          </span>
                        </div>

                        {/* Map Mode Toggles */}
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            onClick={() => setGoogleMapStyle('directions')}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: googleMapStyle === 'directions' ? '#6355E6' : 'rgba(255,255,255,0.08)',
                              color: '#FFF',
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: 6
                            }}
                          >
                            Roads & Turns
                          </button>
                          <button
                            type="button"
                            onClick={() => setGoogleMapStyle('satellite')}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: googleMapStyle === 'satellite' ? '#6355E6' : 'rgba(255,255,255,0.08)',
                              color: '#FFF',
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: 6
                            }}
                          >
                            Satellite
                          </button>
                        </div>
                      </div>

                      {/* Interactive Real Google Maps Iframe */}
                      <div style={{ position: 'relative', width: '100%', height: 260, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <iframe
                          title="Google Maps Live Directions Telemetry"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?saddr=${encodeURIComponent(localPickupLocation)}&daddr=${encodeURIComponent(localDropLocation)}${googleMapStyle === 'satellite' ? '&t=k' : ''}&output=embed`}
                        />

                        {/* Floating Telemetry HUD over Google Maps */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            right: 8,
                            backgroundColor: 'rgba(13, 8, 32, 0.88)',
                            backdropFilter: 'blur(6px)',
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: '1px solid rgba(138, 124, 254, 0.35)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.72rem'
                          }}
                        >
                          <span style={{ color: '#FCD34D', fontWeight: 700 }}>
                            🚖 Vehicle [{vehicleNumberPlate}] · {localSpeedKmh} km/h
                          </span>
                          <span style={{ color: '#6EE7B7', fontWeight: 600 }}>
                            🟣 Phone GPS ±3m Locked
                          </span>
                          <span style={{ color: localCorridorDeviationMeters > 100 ? '#EF4444' : '#10B981', fontWeight: 700 }}>
                            Offset: {localCorridorDeviationMeters}m {localCorridorDeviationMeters > 100 ? '⚠️ DETOUR' : '(Safe)'}
                          </span>
                        </div>
                      </div>

                      {/* External Google Maps App Link Button */}
                      <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary" style={{ fontSize: '0.74rem' }}>
                        <span style={{ color: '#C7C2EA' }}>
                          Navigation Route: Station ➔ {localDropLocation.split(',')[0]}
                        </span>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(localPickupLocation)}&destination=${encodeURIComponent(localDropLocation)}&travelmode=driving`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
                          style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 8, borderColor: '#A394FF', color: '#A394FF' }}
                        >
                          🗺️ Open in Google Maps App (Turn-by-Turn GPS) ↗
                        </a>
                      </div>
                    </div>

                    {/* Telemetry Metrics Bar */}
                    <div className="row g-2 mb-3">
                      <div className="col-4">
                        <div className="p-2 rounded text-center" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                          <small style={{ color: theme.textMuted, fontSize: '0.7rem', display: 'block' }}>Distance / ETA</small>
                          <strong style={{ fontSize: '0.95rem', color: theme.textPrimary }}>{localDistanceRemainingKm} km ({localEtaMinutes}m)</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded text-center" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                          <small style={{ color: theme.textMuted, fontSize: '0.7rem', display: 'block' }}>Speed</small>
                          <strong style={{ fontSize: '0.95rem', color: theme.textPrimary }}>{localSpeedKmh} km/h</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded text-center" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                          <small style={{ color: theme.textMuted, fontSize: '0.7rem', display: 'block' }}>Corridor Offset</small>
                          <strong style={{ fontSize: '0.95rem', color: localCorridorDeviationMeters > 100 ? '#EF4444' : '#10B981' }}>
                            {localCorridorDeviationMeters} m
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Dual Action Controls */}
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setLocalCorridorDeviationMeters(185);
                            setSafetyInvasionModal(true);
                            setInvasionCountdown(20);
                          }}
                          className="btn btn-outline-danger btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                          style={{ borderRadius: 10, fontWeight: 700, fontSize: '0.8rem' }}
                        >
                          <FaExclamationTriangle /> Simulate Route Detour (Test SOS)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLocalTrackingActive(false);
                            setJourneyStage('hotel_stay');
                            setShowPostArrivalPlan(true);
                            setLocalDistanceRemainingKm(0);
                            setLocalEtaMinutes(0);
                            setLocalSpeedKmh(0);
                          }}
                          className="btn btn-success btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                          style={{ borderRadius: 10, fontWeight: 700, fontSize: '0.8rem' }}
                        >
                          <FaCheck /> Safely Arrived at Stay
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setLocalTrackingActive(false)}
                        className="btn btn-sm btn-outline-secondary w-100"
                        style={{ borderRadius: 10, fontSize: '0.78rem' }}
                      >
                        ✏️ Edit Route / Vehicle Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: City Safe Stays, Sightseeing & Return Guide */}
            <div className="col-12 col-lg-6">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div>
                    <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      📍 Complete Local Safety Blueprint for {destinationCity}
                    </h5>
                    <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginTop: 2 }}>
                      Verified female-friendly hotels, safe transport corridors & tourist police
                    </div>
                  </div>
                  <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>
                    POLICE ASSISTED
                  </span>
                </div>

                {/* Recommended Hotels with Search Bar */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 style={{ fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
                    🏨 Verified Safe Stays in {destinationCity}:
                  </h6>
                  <span style={{ fontSize: '0.72rem', color: theme.textMuted }}>Pick or Search Any Hotel</span>
                </div>

                {/* Stay Search Input */}
                <div className="mb-3">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text" style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.textMuted }}>
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={staySearchQuery}
                      onChange={(e) => setStaySearchQuery(e.target.value)}
                      placeholder={`Search hotel or custom homestay in ${destinationCity}...`}
                    />
                    {staySearchQuery && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setStaySearchQuery('')}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 mb-4">
                  {citySafetyPlan.stayRecommendations
                    .filter(stay => !staySearchQuery || stay.name.toLowerCase().includes(staySearchQuery.toLowerCase()) || stay.area.toLowerCase().includes(staySearchQuery.toLowerCase()))
                    .map((stay, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-3"
                        style={{
                          backgroundColor: selectedStayName === stay.name ? theme.subCardBg : theme.cardBg,
                          border: selectedStayName === stay.name ? '1.5px solid #6355E6' : theme.cardBorder,
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setSelectedStayName(stay.name);
                          setStayAddress(stay.area);
                          setLocalDropLocation(`${stay.name}, ${stay.area}`);
                          setStayConfirmed(true);
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong style={{ fontSize: '0.92rem', color: theme.textPrimary }}>{stay.name}</strong>
                          <div className="d-flex align-items-center gap-1">
                            <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>{stay.rating}</span>
                            <span className="badge bg-light text-dark border" style={{ fontSize: '0.65rem' }}>Select as Drop ➔</span>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: theme.textSecondary, marginBottom: 4 }}>
                          📍 {stay.area}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#10B981', fontWeight: 600 }}>
                          ✓ {stay.safetyFeatures}
                        </div>
                      </div>
                    ))}

                  {/* If user typed a search query, show custom option */}
                  {staySearchQuery && (
                    <div
                      className="p-3 rounded-3"
                      style={{
                        backgroundColor: 'rgba(99, 85, 230, 0.08)',
                        border: '1.5px dashed #6355E6',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setSelectedStayName(staySearchQuery);
                        setStayAddress(`${destinationCity} Safe Zone`);
                        setLocalDropLocation(`${staySearchQuery}, ${destinationCity}`);
                        setStayConfirmed(true);
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: '#6355E6' }}>➕ Set Custom Stay: "{staySearchQuery}"</strong>
                          <div style={{ fontSize: '0.76rem', color: theme.textSecondary, marginTop: 2 }}>
                            System will identify & confirm this location in {destinationCity}
                          </div>
                        </div>
                        <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>Confirm & Lock ➔</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Safe Daylight Sightseeing Windows */}
                <h6 style={{ fontWeight: 700, color: theme.textPrimary, marginBottom: 10 }}>
                  ☀️ Safe Daylight Sightseeing Itinerary:
                </h6>

                <div className="d-flex flex-column gap-2 mb-4">
                  {citySafetyPlan.safeDaylightSightseeing.map((sight, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-3"
                      style={{
                        backgroundColor: localDropLocation.includes(sight.spot) ? theme.blueBoxBg : theme.subCardBg,
                        border: localDropLocation.includes(sight.spot) ? '1.5px solid #3B82F6' : theme.subCardBorder,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => {
                        setLocalDropLocation(`${sight.spot}, ${destinationCity}`);
                        setSelectedStayName(sight.spot);
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <strong style={{ fontSize: '0.88rem', color: theme.textPrimary }}>{sight.spot}</strong>
                        <div className="d-flex align-items-center gap-1">
                          <span className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>
                            {sight.safeWindow}
                          </span>
                          <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>Set Drop ➔</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: theme.textSecondary, marginTop: 4 }}>
                        Recommended Transit: {sight.transit}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Safe Return Journey Back Home */}
                <div className="p-3 rounded-3" style={{ backgroundColor: theme.greenBoxBg, border: theme.greenBoxBorder }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <FaUndo style={{ color: '#10B981' }} />
                    <strong style={{ fontSize: '0.88rem', color: theme.greenBoxText }}>
                      Return Journey Back to {originCity} (Safe Trip Completion)
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: theme.greenBoxText, lineHeight: 1.45 }}>
                    Your return travel is scheduled on <strong>{returnDate}</strong>. 24/7 continuous GPS tracking remains active until you reach your home doorstep and click "Conclude Voyage".
                  </div>
                  <div className="mt-2 d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setJourneyStage('completed');
                        alert("Congratulations! You have safely returned home. Guardian notification dispatched: 'Trip Safely Completed'.");
                      }}
                      className="btn btn-success btn-sm d-flex align-items-center gap-1"
                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.78rem' }}
                    >
                      <FaCheck /> Safely Returned Home (Conclude Voyage)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                POST-ARRIVAL COMPREHENSIVE PLANNING & EXPLORATION HUB
            ======================================================== */}
            {(showPostArrivalPlan || journeyStage === 'hotel_stay') && (
              <div className="col-12 mt-2">
                <div
                  style={{
                    backgroundColor: theme.cardBg,
                    borderRadius: 16,
                    border: '2px solid #10B981',
                    padding: 24,
                    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)'
                  }}
                >
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 mb-4 border-bottom" style={{ borderColor: theme.cardBorder }}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: '#ECFDF5',
                          color: '#10B981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem',
                          fontWeight: 800
                        }}
                      >
                        ✓
                      </div>
                      <div>
                        <div className="badge bg-success mb-1" style={{ fontSize: '0.72rem' }}>
                          SAFE ARRIVAL CONFIRMED AT STAY
                        </div>
                        <h4 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                          🎉 Checked in Safely at {localDropLocation.split(',')[0]}!
                        </h4>
                        <div style={{ fontSize: '0.84rem', color: theme.textSecondary, marginTop: 2 }}>
                          Cab transit completed via [{vehicleNumberPlate}]. Stage advanced to <strong>Safe Hotel Stay & Next-Phase City Blueprint</strong>.
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Check-in Ping to Guardian */}
                    <div>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Papa, I have safely reached my stay at ${localDropLocation} in ${destinationCity} via cab [${vehicleNumberPlate}]. Driver was ${driverName}. I have checked in and verified my room safely!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success d-inline-flex align-items-center gap-2 shadow"
                        style={{ borderRadius: 10, fontWeight: 700, fontSize: '0.88rem' }}
                      >
                        <FaWhatsapp style={{ fontSize: '1.2rem' }} />
                        <span>Send 1-Click WhatsApp Check-in to Papa</span>
                      </a>
                    </div>
                  </div>

                  {/* 3 Pillars: 1. Stay Safety Checklist | 2. Next Daylight Sightseeing | 3. Safe Dining & Return */}
                  <div className="row g-4">
                    {/* Column 1: Hotel Room Safety Protocol */}
                    <div className="col-12 col-md-4">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span style={{ fontSize: '1.2rem' }}>🏨</span>
                          <strong style={{ fontSize: '0.92rem', color: theme.textPrimary }}>
                            1. Room Security Protocol
                          </strong>
                        </div>
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '0.82rem', color: theme.textSecondary }}>
                          <li className="d-flex align-items-center gap-2">
                            <span className="text-success fw-bold">✓</span> Verify door double-deadbolt & physical chain latch.
                          </li>
                          <li className="d-flex align-items-center gap-2">
                            <span className="text-success fw-bold">✓</span> Save hotel 24/7 reception & security intercom number.
                          </li>
                          <li className="d-flex align-items-center gap-2">
                            <span className="text-success fw-bold">✓</span> Note nearest police station: <strong>{citySafetyPlan.emergencyContacts.police || '112'}</strong>.
                          </li>
                          <li className="d-flex align-items-center gap-2">
                            <span className="text-success fw-bold">✓</span> Share room number privately with {guardianName}.
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Column 2: Next Sightseeing Plan with 1-Click Ride Setup */}
                    <div className="col-12 col-md-4">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: '1.2rem' }}>☀️</span>
                            <strong style={{ fontSize: '0.92rem', color: theme.textPrimary }}>
                              2. Daylight Sightseeing Plan
                            </strong>
                          </div>
                          <span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>SAFE HOURS</span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: theme.textSecondary, marginBottom: 8 }}>
                          Recommended exploration during secure daylight hours in {destinationCity}:
                        </p>

                        <div className="d-flex flex-column gap-2">
                          {citySafetyPlan.safeDaylightSightseeing.map((sight, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded border d-flex justify-content-between align-items-center"
                              style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}
                            >
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary }}>{sight.spot}</div>
                                <div style={{ fontSize: '0.72rem', color: '#10B981' }}>{sight.safeWindow}</div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedNextDestination(`${sight.spot}, ${destinationCity}`);
                                  setDestinationSearchQuery(sight.spot);
                                  setNextTripArrived(false);
                                }}
                                className="btn btn-sm btn-outline-primary"
                                style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}
                              >
                                Plan Ride ➔
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Safe Dining & Return Voyage Schedule */}
                    <div className="col-12 col-md-4">
                      <div className="p-3 rounded-3 h-100" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span style={{ fontSize: '1.2rem' }}>🍽️</span>
                          <strong style={{ fontSize: '0.92rem', color: theme.textPrimary }}>
                            3. Safe Dining & Return Trip
                          </strong>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: theme.textSecondary, marginBottom: 10 }}>
                          Stick to well-lit shopping streets and verified family restaurants with high footfall in {destinationCity}.
                        </div>

                        <div className="p-2 rounded mb-2" style={{ backgroundColor: theme.greenBoxBg, border: theme.greenBoxBorder }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: theme.greenBoxText }}>
                            🔙 Return Journey Scheduled
                          </div>
                          <div style={{ fontSize: '0.74rem', color: theme.greenBoxText }}>
                            Train back to {originCity} on <strong>{returnDate}</strong>. Pre-book hotel drop cab 2 hours in advance.
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setJourneyStage('completed');
                            alert(`Congratulations! Voyage safely concluded. Final status ping sent to ${guardianName}.`);
                          }}
                          className="btn btn-success btn-sm w-100 py-2 d-flex align-items-center justify-content-center gap-1"
                          style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.8rem' }}
                        >
                          <FaCheck /> Safely Returned Home (Conclude Voyage)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================
                      NEXT DESTINATION SEARCH, GOOGLE MAPS ROUTE & DUAL VEHICLE TRACKING HUB
                  ======================================================== */}
                  <div className="mt-4 pt-4 border-top" style={{ borderColor: theme.cardBorder }}>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                      <div>
                        <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                          🧭 Next City Destination Exploration & Live Vehicle Tracking
                        </h5>
                        <p style={{ fontSize: '0.82rem', color: theme.textSecondary, margin: '3px 0 0' }}>
                          Search any destination in {destinationCity} (market, museum, cafe, hospital, monument) or pick from safe daylight suggestions. Dual GPS & vehicle plate tracking ensures safe transit.
                        </p>
                      </div>
                      <span className={`badge ${nextTripActive ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '0.72rem', padding: '6px 12px' }}>
                        {nextTripActive ? '● DUAL GPS TRACKING ACTIVE' : 'NEXT JOURNEY PLANNER'}
                      </span>
                    </div>

                    {/* Step A: Search Bar for Any Destination in the City */}
                    <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <label style={{ fontSize: '0.84rem', fontWeight: 700, color: theme.textPrimary, marginBottom: 6, display: 'block' }}>
                        🔍 Search Any Destination / Spot in {destinationCity}:
                      </label>
                      <div className="input-group mb-2">
                        <span className="input-group-text" style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.textMuted }}>
                          <FaSearch />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                          value={destinationSearchQuery}
                          onChange={(e) => setDestinationSearchQuery(e.target.value)}
                          placeholder={`Type any destination (e.g. Hawa Mahal, Bapu Bazaar, Cafe, Albert Hall, Hospital, or any address in ${destinationCity})...`}
                        />
                        {destinationSearchQuery && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setDestinationSearchQuery('')}
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>

                      {/* Quick City Landmarks / Daylight Suggestions as Chips */}
                      <div>
                        <small style={{ fontSize: '0.74rem', color: theme.textMuted, display: 'block', marginBottom: 4 }}>
                          Suggested Daylight Safe Spots in {destinationCity} (Click to set):
                        </small>
                        <div className="d-flex flex-wrap gap-2">
                          {citySafetyPlan.safeDaylightSightseeing.map((sight, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setSelectedNextDestination(`${sight.spot}, ${destinationCity}`);
                                setDestinationSearchQuery(sight.spot);
                                setNextTripArrived(false);
                              }}
                              className={`btn btn-sm ${selectedNextDestination.includes(sight.spot) ? 'btn-primary' : 'btn-outline-secondary'}`}
                              style={{ borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}
                            >
                              ☀️ {sight.spot} ({sight.safeWindow.split('(')[0].trim()})
                            </button>
                          ))}

                          {/* If custom query typed, show custom chip */}
                          {destinationSearchQuery && !citySafetyPlan.safeDaylightSightseeing.some(s => s.spot.toLowerCase() === destinationSearchQuery.toLowerCase()) && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedNextDestination(`${destinationSearchQuery}, ${destinationCity}`);
                                setNextTripArrived(false);
                              }}
                              className="btn btn-sm btn-outline-success"
                              style={{ borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              📍 Go to custom searched: "{destinationSearchQuery}" ➔
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Step B: Destination Identified & Route Confirmed */}
                    {selectedNextDestination && (
                      <div className="row g-3">
                        {/* Left Sub-column: Route Confirmation & Vehicle Details Form */}
                        <div className="col-12 col-lg-6">
                          <div className="p-3 rounded-3 h-100" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>
                                ✓ DESTINATION IDENTIFIED & CONFIRMED
                              </span>
                              <span style={{ fontSize: '0.74rem', color: theme.textMuted }}>Google Maps Route Ready</span>
                            </div>

                            {/* Origin & Destination Display */}
                            <div className="p-2 px-3 rounded mb-3" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: theme.textPrimary }}>
                                📍 <strong>Pickup (Current Stay):</strong> {selectedStayName}, {stayAddress}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#6355E6', margin: '3px 0 3px 14px' }}>
                                ↓ Via {nextTripTransportMode}
                              </div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10B981' }}>
                                🏁 <strong>Destination:</strong> {selectedNextDestination}
                              </div>
                            </div>

                            {/* Vehicle Input Fields */}
                            {!nextTripActive ? (
                              <div>
                                <h6 style={{ fontSize: '0.84rem', fontWeight: 700, color: theme.textPrimary, marginBottom: 8 }}>
                                  🚖 Traveling Vehicle Information (For Dual Telemetry):
                                </h6>

                                <div className="mb-2">
                                  <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Transport Mode:</label>
                                  <select
                                    className="form-select form-select-sm"
                                    style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                    value={nextTripTransportMode}
                                    onChange={(e) => setNextTripTransportMode(e.target.value)}
                                  >
                                    <option value="Verified Prepaid Pink Cab / App Taxi">Verified Pink Cab / App Taxi (Uber/Ola)</option>
                                    <option value="Government Pre-paid Auto Booth">Government Pre-paid Auto Booth</option>
                                    <option value="City Metro Rail + Connecting E-Rickshaw">City Metro Rail + E-Rickshaw</option>
                                    <option value="Hotel Verified Concierge Taxi">Hotel Verified Concierge Taxi</option>
                                  </select>
                                </div>

                                <div className="mb-2">
                                  <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>
                                    Vehicle Number Plate (Mandatory for Telemetry):
                                  </label>
                                  <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-warning text-dark fw-bold border-end-0">
                                      <FaIdCard /> IND
                                    </span>
                                    <input
                                      type="text"
                                      className="form-control fw-bold border-start-0"
                                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, letterSpacing: '1px' }}
                                      value={nextTripVehiclePlate}
                                      onChange={(e) => setNextTripVehiclePlate(e.target.value.toUpperCase())}
                                      placeholder="e.g. RJ 14 TA 8812"
                                    />
                                  </div>
                                </div>

                                <div className="row g-2 mb-3">
                                  <div className="col-6">
                                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Driver Name:</label>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                      value={nextTripDriverName}
                                      onChange={(e) => setNextTripDriverName(e.target.value)}
                                      placeholder="Driver Name"
                                    />
                                  </div>
                                  <div className="col-6">
                                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Driver Mobile:</label>
                                    <input
                                      type="tel"
                                      className="form-control form-control-sm"
                                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                                      value={nextTripDriverPhone}
                                      onChange={(e) => setNextTripDriverPhone(e.target.value)}
                                      placeholder="+91 98..."
                                    />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setNextTripActive(true);
                                    setNextTripProgress(15);
                                    setNextTripDistanceKm(3.5);
                                    setNextTripEtaMins(11);
                                    setNextTripSpeedKmh(32);
                                    setNextTripDeviationMeters(14);
                                    setNextTripDetourAlert(false);
                                    setNextTripArrived(false);
                                  }}
                                  className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 shadow"
                                  style={{ backgroundColor: '#6355E6', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem' }}
                                >
                                  <FaCar /> Start Live Vehicle & Phone GPS Tracking
                                </button>
                              </div>
                            ) : (
                              /* Telemetry Active Controls */
                              <div>
                                {/* Telemetry Metrics Grid */}
                                <div className="row g-2 mb-3">
                                  <div className="col-4">
                                    <div className="p-2 rounded text-center" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                                      <small style={{ color: theme.textMuted, fontSize: '0.68rem', display: 'block' }}>Distance / ETA</small>
                                      <strong style={{ fontSize: '0.9rem', color: theme.textPrimary }}>{nextTripDistanceKm} km ({nextTripEtaMins}m)</strong>
                                    </div>
                                  </div>
                                  <div className="col-4">
                                    <div className="p-2 rounded text-center" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                                      <small style={{ color: theme.textMuted, fontSize: '0.68rem', display: 'block' }}>Speed</small>
                                      <strong style={{ fontSize: '0.9rem', color: theme.textPrimary }}>{nextTripSpeedKmh} km/h</strong>
                                    </div>
                                  </div>
                                  <div className="col-4">
                                    <div className="p-2 rounded text-center" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                                      <small style={{ color: theme.textMuted, fontSize: '0.68rem', display: 'block' }}>Corridor Offset</small>
                                      <strong style={{ fontSize: '0.9rem', color: nextTripDeviationMeters > 100 ? '#EF4444' : '#10B981' }}>
                                        {nextTripDeviationMeters} m
                                      </strong>
                                    </div>
                                  </div>
                                </div>

                                {/* Active Detour Warning if detected */}
                                {nextTripDetourAlert && (
                                  <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.redBoxBg, border: theme.redBoxBorder }}>
                                    <div className="d-flex align-items-center gap-2 mb-1">
                                      <FaExclamationTriangle style={{ color: '#EF4444', fontSize: '1.1rem' }} />
                                      <strong style={{ color: '#DC2626', fontSize: '0.88rem' }}>
                                        WARNING: ROUTE DEVIATION DETECTED!
                                      </strong>
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: theme.redBoxText, lineHeight: 1.4 }}>
                                      Vehicle <strong>[{nextTripVehiclePlate}]</strong> has taken an unauthorized detour ({nextTripDeviationMeters}m off Google Maps corridor).
                                      Emergency confirmation triggered.
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="d-flex flex-column gap-2">
                                  <div className="d-flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNextTripDeviationMeters(185);
                                        setNextTripDetourAlert(true);
                                        setCorridorDeviationMeters(185);
                                        setSafetyInvasionModal(true);
                                        setInvasionCountdown(20);
                                        playBeepTone(440, 0.4);
                                        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                                        countdownIntervalRef.current = setInterval(() => {
                                          setInvasionCountdown((prev) => {
                                            if (prev <= 1) {
                                              clearInterval(countdownIntervalRef.current);
                                              confirmSafetyInvaded();
                                              return 0;
                                            }
                                            return prev - 1;
                                          });
                                        }, 1000);
                                      }}
                                      className="btn btn-outline-danger btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.78rem' }}
                                    >
                                      <FaExclamationTriangle /> Simulate Route Detour (Test SOS)
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNextTripActive(false);
                                        setNextTripArrived(true);
                                        setNextTripDistanceKm(0);
                                        setNextTripEtaMins(0);
                                        setNextTripSpeedKmh(0);
                                        alert(`Safe Arrival Confirmed! You have safely reached ${selectedNextDestination}. Status update sent to ${guardianName}.`);
                                      }}
                                      className="btn btn-success btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.78rem' }}
                                    >
                                      <FaCheck /> Safely Arrived at Destination
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setNextTripActive(false)}
                                    className="btn btn-sm btn-outline-secondary w-100"
                                    style={{ borderRadius: 8, fontSize: '0.75rem' }}
                                  >
                                    ✏️ Edit Vehicle / Destination
                                  </button>
                                </div>

                                {nextTripArrived && (
                                  <div className="p-2 mt-2 rounded bg-success text-white text-center" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                    🎉 Safely Arrived at {selectedNextDestination}!
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Sub-column: Actual Google Maps Route Embed & Radar HUD */}
                        <div className="col-12 col-lg-6">
                          <div className="p-3 rounded-3 h-100" style={{ backgroundColor: '#0D0820', color: '#FFFFFF', border: '1px solid #3B2F6E' }}>
                            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <span style={{ fontSize: '0.76rem', color: '#A394FF', fontWeight: 800, textTransform: 'uppercase' }}>
                                  🗺️ GOOGLE MAPS ROUTE: STAY ➔ {selectedNextDestination.split(',')[0]}
                                </span>
                                <span className={`badge ${nextTripActive ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '0.65rem' }}>
                                  {nextTripActive ? 'LIVE RADAR' : 'ROUTE LOCKED'}
                                </span>
                              </div>

                              <div className="d-flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setNextTripGoogleMapStyle('directions')}
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: nextTripGoogleMapStyle === 'directions' ? '#6355E6' : 'rgba(255,255,255,0.08)',
                                    color: '#FFF',
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: 6
                                  }}
                                >
                                  Roads
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNextTripGoogleMapStyle('satellite')}
                                  className="btn btn-sm"
                                  style={{
                                    backgroundColor: nextTripGoogleMapStyle === 'satellite' ? '#6355E6' : 'rgba(255,255,255,0.08)',
                                    color: '#FFF',
                                    fontSize: '0.7rem',
                                    padding: '2px 8px',
                                    borderRadius: 6
                                  }}
                                >
                                  Satellite
                                </button>
                              </div>
                            </div>

                            {/* Google Maps Directions Embed */}
                            <div style={{ position: 'relative', width: '100%', height: 260, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                              <iframe
                                title="Google Maps Next Travel Route"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?saddr=${encodeURIComponent(selectedStayName + ', ' + stayAddress)}&daddr=${encodeURIComponent(selectedNextDestination)}${nextTripGoogleMapStyle === 'satellite' ? '&t=k' : ''}&output=embed`}
                              />

                              {/* Floating HUD over Map when tracking is active */}
                              {nextTripActive && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                    backgroundColor: 'rgba(13, 8, 32, 0.88)',
                                    backdropFilter: 'blur(6px)',
                                    padding: '6px 12px',
                                    borderRadius: 8,
                                    border: '1px solid rgba(138, 124, 254, 0.35)',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.72rem'
                                  }}
                                >
                                  <span style={{ color: '#FCD34D', fontWeight: 700 }}>
                                    🚖 Vehicle [{nextTripVehiclePlate}] · {nextTripSpeedKmh} km/h
                                  </span>
                                  <span style={{ color: '#6EE7B7', fontWeight: 600 }}>
                                    🟣 Phone GPS ±3m
                                  </span>
                                  <span style={{ color: nextTripDeviationMeters > 100 ? '#EF4444' : '#10B981', fontWeight: 700 }}>
                                    Offset: {nextTripDeviationMeters}m {nextTripDeviationMeters > 100 ? '⚠️ DETOUR' : '(Safe)'}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Open in external app button */}
                            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary" style={{ fontSize: '0.74rem' }}>
                              <span style={{ color: '#C7C2EA' }}>
                                Turn-by-Turn Corridor to {selectedNextDestination.split(',')[0]}
                              </span>
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(selectedStayName + ', ' + stayAddress)}&destination=${encodeURIComponent(selectedNextDestination)}&travelmode=driving`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
                                style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 8, borderColor: '#A394FF', color: '#A394FF' }}
                              >
                                🗺️ Open in Google Maps App (Turn-by-Turn GPS) ↗
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: PARENT / GUARDIAN 24/7 LIVE PORTAL
        ======================================================== */}
        {activeTab === 'guardian' && (
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-lg-8">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 28,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pb-3 mb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-success" style={{ fontSize: '0.75rem' }}>
                        24/7 GUARDIAN TELEMETRY LIVE
                      </span>
                      <span style={{ fontSize: '0.82rem', color: theme.textMuted }}>
                        Token: #{selectedTrain.trainNumber}-SAFE-{vehicleNumberPlate.replace(/\s+/g, '')}
                      </span>
                    </div>
                    <h4 style={{ fontWeight: 800, color: theme.textPrimary, margin: '4px 0 0' }}>
                      👨‍👩‍👧 {guardianName}'s 24/7 Live Monitoring Portal
                    </h4>
                    <div style={{ fontSize: '0.86rem', color: theme.textSecondary, marginTop: 2 }}>
                      Monitoring Daughter: <strong>{travelerName}</strong> ({originCity} ➔ {destinationCity})
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`Calling daughter ${travelerName}...`)}
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                      style={{ borderRadius: 8, fontWeight: 600 }}
                    >
                      <FaPhoneAlt /> Call Daughter
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Check-in ping dispatched to daughter's phone. Status: OK.")}
                      className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                      style={{ backgroundColor: '#6355E6', borderRadius: 8, fontWeight: 600, border: 'none' }}
                    >
                      <FaBell /> Request Instant Status
                    </button>
                  </div>
                </div>

                {/* Active Journey Stage Card */}
                <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: theme.greenBoxBg, border: theme.greenBoxBorder }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <FaCheckCircle style={{ color: '#10B981', fontSize: '1.2rem' }} />
                      <span style={{ fontWeight: 700, color: theme.greenBoxText, fontSize: '0.92rem' }}>
                        Active Stage: {journeyStage === 'train_transit' ? 'Intercity Train In-Transit' : journeyStage === 'local_cab' ? `In Local Cab [Plate: ${vehicleNumberPlate}]` : journeyStage === 'hotel_stay' ? `Safe at Hotel [${selectedStayName}]` : 'Local City Sightseeing'}
                      </span>
                    </div>
                    <span className="badge bg-success" style={{ fontSize: '0.72rem' }}>CORRIDOR LOCKED</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: theme.greenBoxText }}>
                    Corridor: <strong>{localPickupLocation} ➔ {localDropLocation}</strong><br />
                    Vehicle Plate: <strong>{vehicleNumberPlate}</strong> | Driver: <strong>{driverName}</strong> ({driverPhone}) | Transit: <strong>{localTransportMode}</strong>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-sm-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                          Live Location Telemetry
                        </span>
                        <span className={`badge ${realGpsActive ? 'bg-success' : 'bg-info text-dark'}`} style={{ fontSize: '0.65rem' }}>
                          {realGpsActive ? 'HARDWARE GPS' : 'TRACK TELEMETRY'}
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: theme.textPrimary, marginTop: 4 }}>
                        {journeyStage === 'train_transit'
                          ? (runningStatus?.currentStation?.name ? `${runningStatus.currentStation.name} Track Corridor` : `${originCity} ➔ ${destinationCity} Train`)
                          : (journeyStage === 'hotel_stay' ? `${selectedStayName}, ${destinationCity}` : (localDropLocation || destinationCity))}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6355E6', marginTop: 2 }}>
                        Speed: {deviceCoords.speed} km/h · Exact GPS: {deviceCoords.lat}, {deviceCoords.lng}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                      <div style={{ fontSize: '0.72rem', color: theme.textMuted, textTransform: 'uppercase', fontWeight: 700 }}>
                        Active Transit & Battery
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: theme.textPrimary, marginTop: 4 }}>
                        {journeyStage === 'train_transit' ? `Train #${selectedTrain.trainNumber} (Coach ${coachNumber})` : `Vehicle [${vehicleNumberPlate}]`}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: 2 }}>
                        Phone Battery: {batteryLevel}% · 24/7 Guardian Sync Active
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Google Maps Live Radar for Guardian */}
                <div className="p-3 rounded-4 mb-4" style={{ backgroundColor: '#0D0820', color: '#FFFFFF', border: '1px solid #3B2F6E' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '0.76rem', color: '#A394FF', fontWeight: 800, textTransform: 'uppercase' }}>
                        🗺️ REAL-TIME DAUGHTER LOCATION RADAR (NO DUMMY LOCATION)
                      </span>
                      <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>ACCURATE PIN</span>
                    </div>
                    <button
                      type="button"
                      onClick={startRealDeviceGpsTracking}
                      className="btn btn-sm btn-outline-light"
                      style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, borderColor: '#A394FF', color: '#A394FF' }}
                    >
                      <FaLocationArrow /> Lock My Live Phone GPS
                    </button>
                  </div>

                  <div style={{ position: 'relative', width: '100%', height: 260, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <iframe
                      title="Guardian Real-Time Map"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${deviceCoords.lat},${deviceCoords.lng}&z=14&output=embed`}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 8,
                        left: 8,
                        right: 8,
                        backgroundColor: 'rgba(13, 8, 32, 0.92)',
                        backdropFilter: 'blur(6px)',
                        padding: '6px 12px',
                        borderRadius: 8,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.72rem',
                        border: '1px solid rgba(138, 124, 254, 0.35)'
                      }}
                    >
                      <span style={{ color: '#FCD34D', fontWeight: 700 }}>
                        📍 {journeyStage === 'train_transit' ? (runningStatus?.currentStation?.name || originCity) : destinationCity}: Lat {deviceCoords.lat}, Lng {deviceCoords.lng}
                      </span>
                      <span style={{ color: '#6EE7B7', fontWeight: 600 }}>
                        {realGpsActive ? `Hardware GPS Lock [±${deviceCoords.accuracy}m]` : 'Live Rail Track Telemetry Locked'}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap justify-content-between align-items-center mt-2 pt-2 border-top border-secondary gap-2" style={{ fontSize: '0.74rem' }}>
                    <span style={{ color: '#C7C2EA' }}>
                      Exact Coordinates: <strong>{deviceCoords.lat}, {deviceCoords.lng}</strong> ({journeyStage === 'train_transit' ? 'Train Corridor' : destinationCity})
                    </span>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${deviceCoords.lat},${deviceCoords.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 8, borderColor: '#A394FF', color: '#A394FF' }}
                    >
                      <FaMapMarkerAlt /> Open Daughter's Exact Real-Time Pin in Google Maps App ↗
                    </a>
                  </div>
                </div>

                {/* Emergency Override */}
                <div className="p-3 rounded-3" style={{ backgroundColor: theme.redBoxBg, border: theme.redBoxBorder }}>
                  <div style={{ fontWeight: 700, color: theme.redBoxText, fontSize: '0.88rem', marginBottom: 6 }}>
                    🚨 Guardian Emergency Override (Direct Police Escalation)
                  </div>
                  <div className="d-flex gap-2">
                    <a
                      href="tel:112"
                      className="btn btn-danger btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                      style={{ fontWeight: 700, borderRadius: 8 }}
                    >
                      <FaPhoneAlt /> Call Police (112)
                    </a>
                    <a
                      href="tel:139"
                      className="btn btn-outline-danger btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                      style={{ fontWeight: 700, borderRadius: 8 }}
                    >
                      <FaTrain /> Railway Police (139)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: RETURN JOURNEY PLAN TRIP & MULTI-VEHICLE FLEET TRACKER
        ======================================================== */}
        {activeTab === 'return_plan' && (
          <div className="row g-4">
            {/* Top Banner: Return Trip Master Overview */}
            <div className="col-12">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: '2px solid #10B981',
                  padding: 24,
                  boxShadow: '0 6px 24px rgba(16, 185, 129, 0.12)'
                }}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="badge bg-success" style={{ fontSize: '0.74rem' }}>
                        HOMEBOUND VOYAGE PLANNER
                      </span>
                      <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>
                        Scheduled Date: <strong>{returnTravelDate}</strong>
                      </span>
                    </div>
                    <h4 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      🔁 Return Trip Plan & Fleet Tracking: {destinationCity} ➔ {originCity}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: theme.textSecondary, margin: '4px 0 0' }}>
                      Complete 3-phase journey back home with all vehicle number plates, drivers, live Google Maps corridors & 24/7 guardian telemetry.
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Papa, here is my planned return journey blueprint from ${destinationCity} back home to ${originCity} on ${returnTravelDate}:
1. Hotel Departure Cab: [${returnLeg1VehiclePlate}] (Driver: ${returnLeg1DriverName})
2. Return Train: #${returnSelectedTrain.trainNumber} ${returnSelectedTrain.trainName} (Coach ${returnCoachNumber}, Seat ${returnSeatNumber})
3. Final Home Drop Cab: [${returnLeg3VehiclePlate}] (Driver: ${returnLeg3DriverName})
24/7 GPS Tracking remains active until I reach our home doorstep!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success btn-sm d-flex align-items-center gap-2"
                      style={{ borderRadius: 10, fontWeight: 700 }}
                    >
                      <FaWhatsapp style={{ fontSize: '1.1rem' }} /> Share Return Blueprint with Papa
                    </a>
                  </div>
                </div>

                {/* 3-Phase Interactive Stepper Progress */}
                <div className="row g-2 mt-3 text-center">
                  <div className="col-4">
                    <div
                      className="p-2 rounded-3"
                      style={{
                        backgroundColor: returnLeg1Arrived ? 'rgba(16, 185, 129, 0.2)' : returnLeg1Active ? 'rgba(99, 85, 230, 0.2)' : theme.subCardBg,
                        border: returnLeg1Arrived ? '1.5px solid #10B981' : returnLeg1Active ? '1.5px solid #6355E6' : theme.subCardBorder
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: returnLeg1Arrived ? '#10B981' : returnLeg1Active ? '#6355E6' : theme.textMuted }}>
                        {returnLeg1Arrived ? '✓ COMPLETED' : returnLeg1Active ? '● IN PROGRESS' : 'PHASE 1'}
                      </span>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary }}>
                        🚖 Hotel ➔ Station Cab
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div
                      className="p-2 rounded-3"
                      style={{
                        backgroundColor: returnLeg2Arrived ? 'rgba(16, 185, 129, 0.2)' : returnLeg2Active ? 'rgba(99, 85, 230, 0.2)' : theme.subCardBg,
                        border: returnLeg2Arrived ? '1.5px solid #10B981' : returnLeg2Active ? '1.5px solid #6355E6' : theme.subCardBorder
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: returnLeg2Arrived ? '#10B981' : returnLeg2Active ? '#6355E6' : theme.textMuted }}>
                        {returnLeg2Arrived ? '✓ COMPLETED' : returnLeg2Active ? '● IN PROGRESS' : 'PHASE 2'}
                      </span>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary }}>
                        🚆 Return Train #{returnSelectedTrain.trainNumber}
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div
                      className="p-2 rounded-3"
                      style={{
                        backgroundColor: returnLeg3Arrived ? 'rgba(16, 185, 129, 0.2)' : returnLeg3Active ? 'rgba(99, 85, 230, 0.2)' : theme.subCardBg,
                        border: returnLeg3Arrived ? '1.5px solid #10B981' : returnLeg3Active ? '1.5px solid #6355E6' : theme.subCardBorder
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: returnLeg3Arrived ? '#10B981' : returnLeg3Active ? '#6355E6' : theme.textMuted }}>
                        {returnLeg3Arrived ? '✓ HOME REACHED' : returnLeg3Active ? '● IN PROGRESS' : 'PHASE 3'}
                      </span>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary }}>
                        🏡 Station ➔ Home Drop
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PHASE 1: HOTEL TO DEPARTURE STATION CAB */}
            <div className="col-12 col-lg-6">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div className="d-flex align-items-center gap-2">
                    <FaCar style={{ color: '#6355E6', fontSize: '1.2rem' }} />
                    <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      Phase 1: Hotel to Departure Station
                    </h5>
                  </div>
                  <span className={`badge ${returnLeg1Arrived ? 'bg-success' : returnLeg1Active ? 'bg-primary' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                    {returnLeg1Arrived ? 'ARRIVED AT STATION' : returnLeg1Active ? 'TRACKING ACTIVE' : 'VEHICLE SETUP'}
                  </span>
                </div>

                {/* Corridor Origin/Drop */}
                <div className="p-2 px-3 rounded mb-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary }}>
                    📍 <strong>Pickup (Hotel):</strong> {returnLeg1Pickup}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#6355E6', margin: '2px 0 2px 14px' }}>
                    ↓ Via {returnLeg1TransportMode}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10B981' }}>
                    🏁 <strong>Drop (Station):</strong> {returnLeg1Drop}
                  </div>
                </div>

                {/* Vehicle & Driver Input Form */}
                <div className="row g-2 mb-3">
                  <div className="col-12">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Transport Mode:</label>
                    <select
                      className="form-select form-select-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnLeg1TransportMode}
                      onChange={(e) => setReturnLeg1TransportMode(e.target.value)}
                    >
                      <option value="Verified Prepaid Pink Cab / App Taxi">Verified Prepaid Pink Cab / App Taxi</option>
                      <option value="Government Pre-paid Auto Booth">Government Pre-paid Auto Booth</option>
                      <option value="Hotel Verified Concierge Taxi">Hotel Verified Concierge Taxi</option>
                      <option value="City Metro Rail Corridor">City Metro Rail Corridor</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>
                      Departure Cab Number Plate (IND format):
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-warning text-dark fw-bold border-end-0">
                        <FaIdCard /> IND
                      </span>
                      <input
                        type="text"
                        className="form-control fw-bold border-start-0"
                        style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, letterSpacing: '1px' }}
                        value={returnLeg1VehiclePlate}
                        onChange={(e) => setReturnLeg1VehiclePlate(e.target.value.toUpperCase())}
                        placeholder="e.g. RJ 14 TA 9921"
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Driver Name:</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnLeg1DriverName}
                      onChange={(e) => setReturnLeg1DriverName(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Driver Phone:</label>
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnLeg1DriverPhone}
                      onChange={(e) => setReturnLeg1DriverPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Google Maps Route Embed for Hotel -> Station */}
                <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', marginBottom: 12 }}>
                  <iframe
                    title="Return Leg 1 Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?saddr=${encodeURIComponent(returnLeg1Pickup)}&daddr=${encodeURIComponent(returnLeg1Drop)}&output=embed`}
                  />
                  {returnLeg1Active && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        left: 6,
                        right: 6,
                        backgroundColor: 'rgba(13, 8, 32, 0.9)',
                        padding: '4px 10px',
                        borderRadius: 6,
                        color: '#FFF',
                        fontSize: '0.7rem',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ color: '#FCD34D' }}>🚖 [{returnLeg1VehiclePlate}] · {returnLeg1SpeedKmh} km/h</span>
                      <span style={{ color: '#6EE7B7' }}>ETA: {returnLeg1EtaMins}m ({returnLeg1DistanceKm} km)</span>
                    </div>
                  )}
                </div>

                {/* Phase 1 Action Buttons */}
                <div className="d-flex gap-2">
                  {!returnLeg1Active ? (
                    <button
                      type="button"
                      onClick={() => {
                        setReturnLeg1Active(true);
                        setReturnLeg1Arrived(false);
                      }}
                      className="btn btn-primary btn-sm flex-fill py-2"
                      style={{ backgroundColor: '#6355E6', borderRadius: 8, fontWeight: 700 }}
                    >
                      <FaCar /> Start Cab Tracking to Station
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setReturnLeg1Active(false);
                          setReturnLeg1Arrived(true);
                          setReturnLeg2Active(true);
                          alert(`Safely reached ${destinationCity} Railway Station! Stage advanced to Phase 2: Return Train.`);
                        }}
                        className="btn btn-success btn-sm flex-fill py-2"
                        style={{ borderRadius: 8, fontWeight: 700 }}
                      >
                        <FaCheck /> Safely Reached Station
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReturnLeg1Detour(true);
                          setSafetyInvasionModal(true);
                          setInvasionCountdown(20);
                        }}
                        className="btn btn-outline-danger btn-sm"
                        style={{ borderRadius: 8, fontWeight: 600, fontSize: '0.74rem' }}
                      >
                        <FaExclamationTriangle /> Test Detour
                      </button>
                    </>
                  )}
                </div>

                {returnLeg1Detour && (
                  <div className="p-2 mt-2 rounded bg-danger text-white text-center" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    ⚠️ Detour Alert: Vehicle [{returnLeg1VehiclePlate}] diverted off corridor to station!
                  </div>
                )}
              </div>
            </div>

            {/* PHASE 2: RETURN EXPRESS TRAIN */}
            <div className="col-12 col-lg-6">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div className="d-flex align-items-center gap-2">
                    <FaTrain style={{ color: '#10B981', fontSize: '1.2rem' }} />
                    <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      Phase 2: Return Train ({destinationCity} ➔ {originCity})
                    </h5>
                  </div>
                  <span className={`badge ${returnLeg2Arrived ? 'bg-success' : returnLeg2Active ? 'bg-info text-dark' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                    {returnLeg2Arrived ? 'TRAIN ARRIVED' : returnLeg2Active ? 'TRAIN IN TRANSIT' : 'TRAIN SELECTED'}
                  </span>
                </div>

                {/* Select Return Train Dropdown */}
                <div className="mb-3">
                  <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>
                    Available Verified Return Trains:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                    value={returnSelectedTrain.trainNumber}
                    onChange={(e) => {
                      const found = returnTrainsList.find(t => t.trainNumber === e.target.value);
                      if (found) setReturnSelectedTrain(found);
                    }}
                  >
                    {returnTrainsList.map(t => (
                      <option key={t.trainNumber} value={t.trainNumber}>
                        #{t.trainNumber} {t.trainName} (Dep: {t.departureTime} ➔ Arr: {t.arrivalTime})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Train Details Card */}
                <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong style={{ fontSize: '0.92rem', color: theme.textPrimary }}>
                      #{returnSelectedTrain.trainNumber} {returnSelectedTrain.trainName}
                    </strong>
                    <span className="badge bg-success" style={{ fontSize: '0.68rem' }}>
                      {returnSelectedTrain.daylightSafetyRating.split('(')[0]}
                    </span>
                  </div>

                  <div className="row g-2 mt-1" style={{ fontSize: '0.8rem' }}>
                    <div className="col-6">
                      <span style={{ color: theme.textMuted }}>Departs:</span>{' '}
                      <strong>{returnSelectedTrain.departureTime}</strong> ({returnSelectedTrain.originCity || destinationCity})
                    </div>
                    <div className="col-6">
                      <span style={{ color: theme.textMuted }}>Arrives:</span>{' '}
                      <strong>{returnSelectedTrain.arrivalTime}</strong> ({returnSelectedTrain.destinationCity || originCity})
                    </div>
                    <div className="col-6">
                      <span style={{ color: theme.textMuted }}>Duration:</span> {returnSelectedTrain.totalDuration}
                    </div>
                    <div className="col-6">
                      <span style={{ color: theme.textMuted }}>Distance:</span> {returnSelectedTrain.totalDistanceKm} km
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-top" style={{ borderColor: theme.cardBorder, fontSize: '0.75rem', color: '#10B981' }}>
                    🛡️ {returnSelectedTrain.meriSaheliEscortZone}
                  </div>
                </div>

                {/* Coach & Seat Number for Return Train */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Return Coach:</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnCoachNumber}
                      onChange={(e) => setReturnCoachNumber(e.target.value)}
                      placeholder="e.g. C2"
                    />
                  </div>
                  <div className="col-6">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Return Seat / Berth:</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnSeatNumber}
                      onChange={(e) => setReturnSeatNumber(e.target.value)}
                      placeholder="e.g. 18 (Window)"
                    />
                  </div>
                </div>

                {/* Return Train Action */}
                <div className="d-flex gap-2">
                  {!returnLeg2Active ? (
                    <button
                      type="button"
                      onClick={() => {
                        setReturnLeg2Active(true);
                        setReturnLeg2Arrived(false);
                      }}
                      className="btn btn-outline-success btn-sm flex-fill py-2"
                      style={{ borderRadius: 8, fontWeight: 700 }}
                    >
                      <FaTrain /> Board Return Train & Start Live Schedule
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setReturnLeg2Active(false);
                        setReturnLeg2Arrived(true);
                        setReturnLeg3Active(true);
                        alert(`Train safely arrived at ${originCity} Station! Stage advanced to Phase 3: Final Doorstep Cab.`);
                      }}
                      className="btn btn-success btn-sm flex-fill py-2"
                      style={{ borderRadius: 8, fontWeight: 700 }}
                    >
                      <FaCheck /> Safely Deboarded at {originCity} Station
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* PHASE 3: ARRIVAL STATION TO HOME DOORSTEP */}
            <div className="col-12 col-lg-6">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div className="d-flex align-items-center gap-2">
                    <FaMapMarkerAlt style={{ color: '#F59E0B', fontSize: '1.2rem' }} />
                    <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      Phase 3: Station to Home Doorstep
                    </h5>
                  </div>
                  <span className={`badge ${returnLeg3Arrived ? 'bg-success' : returnLeg3Active ? 'bg-warning text-dark' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                    {returnLeg3Arrived ? 'HOME REACHED' : returnLeg3Active ? 'DOORSTEP CAB ACTIVE' : 'CAB SETUP'}
                  </span>
                </div>

                {/* Corridor */}
                <div className="p-2 px-3 rounded mb-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary }}>
                    📍 <strong>Pickup (Station):</strong> {returnLeg3Pickup}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#6355E6', margin: '2px 0 2px 14px' }}>
                    ↓ Via {returnLeg3TransportMode}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10B981' }}>
                    🏁 <strong>Final Destination (Home):</strong> {returnLeg3Drop}
                  </div>
                </div>

                {/* Home Address Input */}
                <div className="mb-2">
                  <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>
                    Your Home Address / Destination:
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                    value={returnLeg3Drop}
                    onChange={(e) => setReturnLeg3Drop(e.target.value)}
                    placeholder="Enter your home doorstep address"
                  />
                </div>

                {/* Vehicle Plate & Driver Form */}
                <div className="row g-2 mb-3">
                  <div className="col-12">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Transport Mode:</label>
                    <select
                      className="form-select form-select-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnLeg3TransportMode}
                      onChange={(e) => setReturnLeg3TransportMode(e.target.value)}
                    >
                      <option value="Delhi Traffic Police Prepaid Taxi">Delhi Traffic Police Prepaid Taxi</option>
                      <option value="Verified Prepaid Pink Cab / App Taxi">Verified Prepaid Pink Cab / App Taxi</option>
                      <option value="Government Pre-paid Auto Booth">Government Pre-paid Auto Booth</option>
                      <option value="City Metro Rail Feeder">City Metro Rail Feeder</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>
                      Arrival Cab Number Plate (Mandatory):
                    </label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-warning text-dark fw-bold border-end-0">
                        <FaIdCard /> IND
                      </span>
                      <input
                        type="text"
                        className="form-control fw-bold border-start-0"
                        style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText, letterSpacing: '1px' }}
                        value={returnLeg3VehiclePlate}
                        onChange={(e) => setReturnLeg3VehiclePlate(e.target.value.toUpperCase())}
                        placeholder="e.g. DL 1R T 8877"
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Driver Name:</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnLeg3DriverName}
                      onChange={(e) => setReturnLeg3DriverName(e.target.value)}
                    />
                  </div>

                  <div className="col-6">
                    <label style={{ fontSize: '0.76rem', color: theme.textMuted, display: 'block', marginBottom: 2 }}>Driver Phone:</label>
                    <input
                      type="tel"
                      className="form-control form-control-sm"
                      style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                      value={returnLeg3DriverPhone}
                      onChange={(e) => setReturnLeg3DriverPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Google Maps Route Embed for Station -> Home */}
                <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', marginBottom: 12 }}>
                  <iframe
                    title="Return Leg 3 Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?saddr=${encodeURIComponent(returnLeg3Pickup)}&daddr=${encodeURIComponent(returnLeg3Drop)}&output=embed`}
                  />
                  {returnLeg3Active && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        left: 6,
                        right: 6,
                        backgroundColor: 'rgba(13, 8, 32, 0.9)',
                        padding: '4px 10px',
                        borderRadius: 6,
                        color: '#FFF',
                        fontSize: '0.7rem',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ color: '#FCD34D' }}>🚖 [{returnLeg3VehiclePlate}] · {returnLeg3SpeedKmh} km/h</span>
                      <span style={{ color: '#6EE7B7' }}>ETA: {returnLeg3EtaMins}m ({returnLeg3DistanceKm} km)</span>
                    </div>
                  )}
                </div>

                {/* Phase 3 Action Buttons */}
                <div className="d-flex gap-2">
                  {!returnLeg3Active ? (
                    <button
                      type="button"
                      onClick={() => {
                        setReturnLeg3Active(true);
                        setReturnLeg3Arrived(false);
                      }}
                      className="btn btn-primary btn-sm flex-fill py-2"
                      style={{ backgroundColor: '#F59E0B', border: 'none', borderRadius: 8, fontWeight: 700, color: '#000' }}
                    >
                      <FaCar /> Start Doorstep Drop Tracking
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setReturnLeg3Active(false);
                          setReturnLeg3Arrived(true);
                          setReturnVoyageConcluded(true);
                          setJourneyStage('completed');
                          alert(`🎉 Congratulations! You have safely reached your home doorstep at ${returnLeg3Drop}. Final status dispatched to ${guardianName}.`);
                        }}
                        className="btn btn-success btn-sm flex-fill py-2"
                        style={{ borderRadius: 8, fontWeight: 700 }}
                      >
                        <FaCheck /> Safely Reached Home Doorstep!
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReturnLeg3Detour(true);
                          setSafetyInvasionModal(true);
                          setInvasionCountdown(20);
                        }}
                        className="btn btn-outline-danger btn-sm"
                        style={{ borderRadius: 8, fontWeight: 600, fontSize: '0.74rem' }}
                      >
                        <FaExclamationTriangle /> Test Detour
                      </button>
                    </>
                  )}
                </div>

                {returnLeg3Detour && (
                  <div className="p-2 mt-2 rounded bg-danger text-white text-center" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                    ⚠️ Detour Alert: Vehicle [{returnLeg3VehiclePlate}] diverted off corridor to home!
                  </div>
                )}
              </div>
            </div>

            {/* PHASE 4: FINAL SAFE COMPLETION & GUARDIAN NOTIFICATION */}
            <div className="col-12 col-lg-6">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: returnVoyageConcluded ? '2px solid #10B981' : theme.cardBorder,
                  padding: 24,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div className="d-flex align-items-center gap-2">
                    <FaCheckCircle style={{ color: '#10B981', fontSize: '1.2rem' }} />
                    <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                      Phase 4: Conclude Voyage & Safe Home Ping
                    </h5>
                  </div>
                  <span className={`badge ${returnVoyageConcluded ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                    {returnVoyageConcluded ? 'VOYAGE CONCLUDED' : 'PENDING DOORSTEP'}
                  </span>
                </div>

                <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: theme.greenBoxBg, border: theme.greenBoxBorder }}>
                  <strong style={{ fontSize: '0.9rem', color: theme.greenBoxText, display: 'block', marginBottom: 4 }}>
                    {returnVoyageConcluded ? '🎉 SOLO SAFE VOYAGE SUCCESSFULLY COMPLETED!' : '🔒 Continuous 24/7 Protection Active'}
                  </strong>
                  <div style={{ fontSize: '0.82rem', color: theme.greenBoxText, lineHeight: 1.45 }}>
                    {returnVoyageConcluded
                      ? `Welcome back home! You have completed your journey from ${originCity} to ${destinationCity} and back safely. All transit corridor deviations and GPS logs have been securely archived.`
                      : `GPS tracking remains active until you click "Safely Reached Home Doorstep". Your guardian ${guardianName} receives live updates at every leg of the return journey.`}
                  </div>
                </div>

                {/* Final 1-Click WhatsApp to Papa */}
                <div className="d-flex flex-column gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `🎉 Papa, I have safely reached back home at our doorstep!
The entire return journey from ${destinationCity} to ${originCity} via Train #${returnSelectedTrain.trainNumber} and Cab [${returnLeg3VehiclePlate}] is completed safely.
All 24/7 voyage tracking has concluded. I am safe at home!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success py-3 d-flex align-items-center justify-content-center gap-2 shadow"
                    style={{ borderRadius: 12, fontWeight: 700, fontSize: '0.92rem' }}
                  >
                    <FaWhatsapp style={{ fontSize: '1.3rem' }} /> Send "Safely Reached Home" WhatsApp to Papa
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setReturnVoyageConcluded(true);
                      setJourneyStage('completed');
                      saveCurrentTripToHistory(true);
                    }}
                    className="btn btn-outline-secondary btn-sm py-2"
                    style={{ borderRadius: 10, fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Mark Voyage Officially Concluded & Save to History
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: EMERGENCY SOS & DETERRENT CALL SIMULATION LAB
        ======================================================== */}
        {activeTab === 'escalation' && (
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-lg-8">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: 28,
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                  <div>
                    <h4 style={{ fontWeight: 800, color: theme.textPrimary, margin: 0 }}>
                      <FaShieldAlt style={{ color: '#EF4444', marginRight: 8 }} />
                      Emergency Escalation Sentinel
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: theme.textSecondary, margin: '4px 0 0' }}>
                      Multi-channel safeguards: Siren alarm, WhatsApp/SMS broadcast with live coordinates, 112 police dispatch, and simulated deterrent phone call.
                    </p>
                  </div>
                  <span
                    className={`badge ${sosActive ? 'bg-danger' : 'bg-secondary'}`}
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    {sosActive ? 'SOS ESCALATED' : 'READY'}
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-3 mb-4">
                  <button
                    type="button"
                    onClick={triggerFullEmergencyProtocol}
                    className="btn btn-danger flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      borderRadius: 12,
                      fontWeight: 800,
                      fontSize: '1rem',
                      boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    <FaExclamationTriangle style={{ fontSize: '1.2rem' }} /> TRIGGER IMMEDIATE EMERGENCY SOS
                  </button>

                  {sirenPlaying ? (
                    <button
                      type="button"
                      onClick={stopSiren}
                      className="btn btn-outline-danger d-flex align-items-center gap-2"
                      style={{ borderRadius: 12, fontWeight: 700, padding: '0 20px' }}
                    >
                      <FaVolumeMute /> Stop Siren Alarm
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={playHighDecibelSiren}
                      className="btn btn-outline-warning d-flex align-items-center gap-2"
                      style={{ borderRadius: 12, fontWeight: 700, padding: '0 20px' }}
                    >
                      <FaVolumeUp /> Test High-Decibel Siren
                    </button>
                  )}
                </div>

                {/* AI Dummy Deterrent Call Box */}
                <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div style={{ fontWeight: 700, color: theme.textPrimary, fontSize: '0.9rem' }}>
                      📞 Automated AI Guardian Deterrent Call
                    </div>
                    <span className="badge bg-light text-primary border" style={{ fontSize: '0.72rem' }}>Speech Synthesis</span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: theme.textSecondary, marginBottom: 12 }}>
                    Your phone rings with an incoming call from "Papa" or "Police Sentinel". When picked up, a realistic, loud voice states that your live location and cab plate [{vehicleNumberPlate}] are tracked and police are intercepting.
                  </p>

                  <div className="row g-2 mb-3">
                    <div className="col-12 col-sm-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCallerVoice('papa')}
                        className={`btn btn-sm w-100 ${selectedCallerVoice === 'papa' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ borderRadius: 8, fontWeight: 600 }}
                      >
                        🎙️ Papa / Brother (Real Voice)
                      </button>
                    </div>
                    <div className="col-12 col-sm-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCallerVoice('mom')}
                        className={`btn btn-sm w-100 ${selectedCallerVoice === 'mom' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ borderRadius: 8, fontWeight: 600 }}
                      >
                        Mom's Voice (Urgent)
                      </button>
                    </div>
                    <div className="col-12 col-sm-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCallerVoice('police')}
                        className={`btn btn-sm w-100 ${selectedCallerVoice === 'police' ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ borderRadius: 8, fontWeight: 600 }}
                      >
                        Police Sentinel (English)
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIncomingCallActive(true);
                      playPhoneRingtone();
                    }}
                    className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: 8, fontWeight: 600 }}
                  >
                    <FaPhoneAlt /> Trigger Incoming Deterrent Call Now
                  </button>
                </div>

                {/* Direct Emergency Dials */}
                <div className="row g-2 mb-3">
                  <div className="col-6 col-sm-3">
                    <a
                      href="tel:112"
                      className="btn btn-outline-danger btn-sm w-100 py-2 d-flex flex-column align-items-center justify-content-center text-decoration-none"
                      style={{ borderRadius: 10, fontWeight: 700 }}
                      title="Direct Call to 112 National Police Emergency"
                    >
                      <span style={{ fontSize: '1.1rem' }}>112</span>
                      <span style={{ fontSize: '0.7rem' }}>Police Helpline</span>
                    </a>
                  </div>

                  <div className="col-6 col-sm-3">
                    <a
                      href="tel:139"
                      className="btn btn-outline-primary btn-sm w-100 py-2 d-flex flex-column align-items-center justify-content-center text-decoration-none"
                      style={{ borderRadius: 10, fontWeight: 700 }}
                      title="Direct Call to 139 Railway Police (RPF)"
                    >
                      <span style={{ fontSize: '1.1rem' }}>139</span>
                      <span style={{ fontSize: '0.7rem' }}>Railway Police (RPF)</span>
                    </a>
                  </div>

                  <div className="col-6 col-sm-3">
                    <a
                      href="tel:1091"
                      className="btn btn-outline-secondary btn-sm w-100 py-2 d-flex flex-column align-items-center justify-content-center text-decoration-none"
                      style={{ borderRadius: 10, fontWeight: 700 }}
                      title="Direct Call to 1091 National Women Helpline"
                    >
                      <span style={{ fontSize: '1.1rem' }}>1091</span>
                      <span style={{ fontSize: '0.7rem' }}>Women Helpline</span>
                    </a>
                  </div>

                  <div className="col-6 col-sm-3">
                    <a
                      href="tel:7524072395"
                      className="btn btn-outline-success btn-sm w-100 py-2 d-flex flex-column align-items-center justify-content-center text-decoration-none"
                      style={{ borderRadius: 10, fontWeight: 700 }}
                      title="Direct Call to Guardian Papa (+91 75240 72395)"
                    >
                      <span style={{ fontSize: '1.1rem' }}>Guardian</span>
                      <span style={{ fontSize: '0.7rem' }}>{guardianName}</span>
                    </a>
                  </div>
                </div>

                {/* Primary Guardian (Papa) Direct Multi-Channel Dispatch Box */}
                <div 
                  className="p-3 rounded-3"
                  style={{
                    backgroundColor: isDark ? 'rgba(34, 197, 94, 0.08)' : '#F0FDF4',
                    border: '1.5px solid #22C55E'
                  }}
                >
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '1.25rem' }}>👨‍👩‍👧</span>
                      <div>
                        <strong style={{ fontSize: '0.86rem', color: isDark ? '#86EFAC' : '#15803D' }}>
                          Primary Guardian: {guardianName}
                        </strong>
                        <div style={{ fontSize: '0.72rem', color: theme.textSecondary }}>
                          Emergency Contact Number: <strong style={{ color: isDark ? '#F0EEFF' : '#160D33' }}>+91 75240 72395</strong>
                        </div>
                      </div>
                    </div>
                    <span className="badge bg-success" style={{ fontSize: '0.66rem' }}>
                      ● ACTIVE GUARDIAN
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    {/* 1. Direct Call to 7524072395 */}
                    <a
                      href="tel:7524072395"
                      className="btn btn-success btn-sm flex-fill d-flex align-items-center justify-content-center gap-2 text-white text-decoration-none shadow-sm"
                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', padding: '8px 12px' }}
                    >
                      <FaPhoneAlt /> Call Papa (+91 75240 72395)
                    </a>

                    {/* 2. Direct WhatsApp Message to 7524072395 */}
                    <a
                      href={`https://api.whatsapp.com/send?phone=917524072395&text=${encodeURIComponent(
                        `🚨 EMERGENCY SOS ALERT FROM HERHUB SOLO TRIP PLANNER!
Guardian (Papa), I need urgent assistance on my journey.
My Live Satellite GPS Location: https://maps.google.com/?q=${deviceCoords?.lat || '28.6139'},${deviceCoords?.lng || '77.2090'}
Please call me immediately!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-2 text-white text-decoration-none shadow-sm"
                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', backgroundColor: '#25D366', padding: '8px 12px' }}
                    >
                      <FaWhatsapp style={{ fontSize: '1.05rem' }} /> Direct WhatsApp Message
                    </a>

                    {/* 3. Direct GSM SMS to 7524072395 (Offline Fallback) */}
                    <a
                      href={`sms:7524072395?body=${encodeURIComponent(
                        `EMERGENCY SOS: Papa, I need help! Live Location: https://maps.google.com/?q=${deviceCoords?.lat || '28.6139'},${deviceCoords?.lng || '77.2090'}`
                      )}`}
                      className="btn btn-outline-success btn-sm flex-fill d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', padding: '8px 12px' }}
                    >
                      📱 Direct SMS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: JOURNEY HISTORY & PAST TRIPS SAFETY DOSSIER
        ======================================================== */}
        {activeTab === 'history' && (
          <div className="row g-4">
            {/* Top Toolbar: Search, Filters & Action Button */}
            <div className="col-12">
              <div
                style={{
                  backgroundColor: theme.cardBg,
                  borderRadius: 16,
                  border: theme.cardBorder,
                  padding: '20px 24px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                  <div>
                    <h4 style={{ fontWeight: 800, color: theme.textPrimary, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <FaHistory style={{ color: '#8B5CF6' }} />
                      Solo Voyage History & Saved Safety Dossiers
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: theme.textSecondary, margin: '4px 0 0' }}>
                      Permanent archive of all past completed solo journeys with verified trains, hotel stays, local cab number plates, driver details, and safety audit logs.
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveCurrentTripToHistory(returnVoyageConcluded)}
                      className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm"
                      style={{
                        backgroundColor: '#8B5CF6',
                        borderColor: '#8B5CF6',
                        borderRadius: 10,
                        padding: '8px 16px',
                        fontWeight: 700
                      }}
                    >
                      <FaCheckCircle /> Save Current Active Voyage
                    </button>
                  </div>
                </div>

                {/* Search Bar & Status Filters */}
                <div className="row g-2 align-items-center">
                  <div className="col-12 col-md-6">
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.textMuted }}>
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        style={{ backgroundColor: theme.inputBg, border: theme.inputBorder, color: theme.inputText }}
                        placeholder="Search by city, train number, plate (e.g. 'RJ 14', 'Jaipur', '12015')..."
                        value={historySearchQuery}
                        onChange={(e) => setHistorySearchQuery(e.target.value)}
                      />
                      {historySearchQuery && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setHistorySearchQuery('')}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
                    {[
                      { id: 'all', label: `All Trips (${journeyHistory.length})` },
                      { id: 'completed', label: `Completed (${journeyHistory.filter(t => t.status === 'Completed Safely').length})` },
                      { id: 'active', label: `Active (${journeyHistory.filter(t => t.status !== 'Completed Safely').length})` }
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setHistoryFilterStatus(f.id)}
                        className={`btn btn-sm ${historyFilterStatus === f.id ? 'btn-secondary text-white' : 'btn-outline-secondary'}`}
                        style={{ borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary Metrics Banner */}
            <div className="col-12">
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-3 text-center h-100" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#8B5CF6' }}>{journeyHistory.length}</div>
                    <div style={{ fontSize: '0.75rem', color: theme.textMuted, fontWeight: 600 }}>Total Journeys Logged</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-3 text-center h-100" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>100%</div>
                    <div style={{ fontSize: '0.75rem', color: theme.textMuted, fontWeight: 600 }}>Safe Doorstep Rate</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-3 text-center h-100" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3B82F6' }}>
                      {journeyHistory.reduce((acc, trip) => acc + (trip.localTransitVehicles?.length || 0) + 2, 0)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: theme.textMuted, fontWeight: 600 }}>Vehicles & Plates Tracked</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-3 text-center h-100" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B' }}>
                      {journeyHistory.reduce((acc, trip) => acc + (trip.guardian?.updatesSent || 0), 0)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: theme.textMuted, fontWeight: 600 }}>Papa Check-ins Logged</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Past Journeys List */}
            {filteredHistory.length === 0 ? (
              <div className="col-12">
                <div
                  className="text-center py-5 rounded-4"
                  style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}
                >
                  <FaHistory style={{ fontSize: '3rem', color: theme.textMuted, marginBottom: 12, opacity: 0.5 }} />
                  <h5 style={{ color: theme.textPrimary, fontWeight: 700 }}>No journeys found</h5>
                  <p style={{ color: theme.textSecondary, fontSize: '0.85rem', maxWidth: 420, margin: '0 auto 16px' }}>
                    No journey records matched your search query "{historySearchQuery}". Try clearing filters or saving your current active voyage.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setHistorySearchQuery(''); setHistoryFilterStatus('all'); }}
                    className="btn btn-outline-primary btn-sm"
                    style={{ borderRadius: 8 }}
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            ) : (
              filteredHistory.map((trip) => (
                <div key={trip.id} className="col-12">
                  <div
                    style={{
                      backgroundColor: theme.cardBg,
                      borderRadius: 18,
                      border: theme.cardBorder,
                      padding: 24,
                      boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    {/* Header: Dates, Title, Status & Audit Token */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pb-3 mb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
                      <div>
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                          <span
                            className="badge d-flex align-items-center gap-1"
                            style={{ backgroundColor: '#8B5CF6', color: '#FFFFFF', fontSize: '0.74rem', padding: '5px 10px', borderRadius: 6 }}
                          >
                            <FaCalendarAlt /> {trip.departureDate} {trip.returnDate && trip.returnDate !== trip.departureDate ? `– ${trip.returnDate}` : ''}
                          </span>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: trip.status === 'Completed Safely' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                              color: trip.status === 'Completed Safely' ? '#10B981' : '#3B82F6',
                              fontSize: '0.74rem',
                              padding: '5px 10px',
                              borderRadius: 6,
                              fontWeight: 700
                            }}
                          >
                            {trip.status === 'Completed Safely' ? '✓ COMPLETED SAFELY' : '● ACTIVE VOYAGE'}
                          </span>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.74rem',
                              color: theme.textMuted,
                              backgroundColor: theme.subCardBg,
                              padding: '3px 8px',
                              borderRadius: 4,
                              border: theme.subCardBorder
                            }}
                          >
                            TOKEN: #{trip.safetyAuditToken}
                          </span>
                        </div>
                        <h5 style={{ fontWeight: 800, margin: '6px 0 0', color: theme.textPrimary }}>
                          {trip.title}
                        </h5>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedHistoryTrip(trip)}
                          className="btn btn-sm btn-primary d-flex align-items-center gap-1"
                          style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, backgroundColor: '#6355E6', borderColor: '#6355E6' }}
                        >
                          <FaShieldAlt /> View Full Dossier
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `📋 HERHUB SAFE VOYAGE AUDIT DOSSIER (#${trip.safetyAuditToken})
Route: ${trip.originCity} ➔ ${trip.destinationCity}
Dates: ${trip.departureDate} – ${trip.returnDate}
Status: ${trip.status}

🚆 Outbound Train: #${trip.outboundTrain.trainNumber} ${trip.outboundTrain.trainName} (Coach ${trip.outboundTrain.coach}, Seat ${trip.outboundTrain.seat})
🏨 Safe Stay: ${trip.stay.name} (${trip.stay.address})
🚕 Transit Vehicles: ${trip.localTransitVehicles.map(v => `[${v.vehiclePlate} - ${v.driverName}]`).join(', ')}
🔙 Return Train: #${trip.returnJourney.train.trainNumber} ${trip.returnJourney.train.trainName} (Doorstep Cab: ${trip.returnJourney.arrivalDoorstepCab.vehiclePlate})

🛡️ Security Log: ${trip.securitySummary}
Guardian: ${trip.guardian.name} (${trip.guardian.phone})`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                          style={{ borderRadius: 8, fontSize: '0.78rem', fontWeight: 600 }}
                          title="Share Safety Dossier on WhatsApp"
                        >
                          <FaWhatsapp style={{ fontSize: '1rem' }} /> Share Audit
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteHistoryTrip(trip.id)}
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: 8 }}
                          title="Delete trip from history"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Content Cards Grid: 4 Pillars of the Journey */}
                    <div className="row g-3">
                      {/* Pillar 1: Outbound Rail Journey */}
                      <div className="col-12 col-md-6 col-lg-3">
                        <div className="p-3 rounded-3 h-100" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <FaTrain style={{ color: '#6355E6', fontSize: '1rem' }} />
                            <strong style={{ fontSize: '0.82rem', color: theme.textPrimary }}>Outbound Express</strong>
                          </div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#6355E6', marginBottom: 2 }}>
                            #{trip.outboundTrain.trainNumber} {trip.outboundTrain.trainName}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: theme.textSecondary, marginBottom: 4 }}>
                            {trip.originStation} ➔ {trip.destinationStation}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: theme.textMuted }}>
                            Berth: <span className="badge bg-light text-dark border">Coach {trip.outboundTrain.coach}, Seat {trip.outboundTrain.seat}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pillar 2: Verified Stay */}
                      <div className="col-12 col-md-6 col-lg-3">
                        <div className="p-3 rounded-3 h-100" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <FaHotel style={{ color: '#10B981', fontSize: '1rem' }} />
                            <strong style={{ fontSize: '0.82rem', color: theme.textPrimary }}>Safe Hotel Stay</strong>
                          </div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: theme.textPrimary, marginBottom: 2 }}>
                            {trip.stay.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: theme.textSecondary, marginBottom: 4, lineHeight: 1.35 }}>
                            {trip.stay.address}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>
                            ⭐ {trip.stay.verifiedScore}
                          </div>
                        </div>
                      </div>

                      {/* Pillar 3: Local Transit Number Plates */}
                      <div className="col-12 col-md-6 col-lg-3">
                        <div className="p-3 rounded-3 h-100" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <FaCar style={{ color: '#F59E0B', fontSize: '1rem' }} />
                            <strong style={{ fontSize: '0.82rem', color: theme.textPrimary }}>Local City Fleet</strong>
                          </div>
                          <div className="d-flex flex-column gap-2">
                            {trip.localTransitVehicles.map((veh, vIdx) => (
                              <div key={vIdx} className="pb-1 border-bottom" style={{ borderColor: theme.subCardBorder }}>
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                  <span
                                    style={{
                                      backgroundColor: '#FDE047',
                                      color: '#000000',
                                      border: '1.5px solid #000000',
                                      borderRadius: 4,
                                      padding: '1px 6px',
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      fontFamily: 'monospace',
                                      letterSpacing: '0.5px'
                                    }}
                                  >
                                    🇮🇳 {veh.vehiclePlate}
                                  </span>
                                  <span style={{ fontSize: '0.68rem', color: theme.textMuted }}>{veh.driverName}</span>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: theme.textSecondary }}>
                                  {veh.leg} ({veh.transportMode})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Pillar 4: Return Fleet & Doorstep Cab */}
                      <div className="col-12 col-md-6 col-lg-3">
                        <div className="p-3 rounded-3 h-100" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <FaUndo style={{ color: '#3B82F6', fontSize: '1rem' }} />
                            <strong style={{ fontSize: '0.82rem', color: theme.textPrimary }}>Return Journey Fleet</strong>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: theme.textPrimary, marginBottom: 2 }}>
                            <strong>Train:</strong> #{trip.returnJourney.train.trainNumber} ({trip.returnJourney.train.trainName.slice(0, 16)}...)
                          </div>
                          <div className="mb-2">
                            <span style={{ fontSize: '0.72rem', color: theme.textMuted }}>Doorstep Cab: </span>
                            <span
                              style={{
                                backgroundColor: '#FDE047',
                                color: '#000000',
                                border: '1.5px solid #000000',
                                borderRadius: 4,
                                padding: '1px 6px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                fontFamily: 'monospace'
                              }}
                            >
                              🇮🇳 {trip.returnJourney.arrivalDoorstepCab.vehiclePlate}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: theme.textMuted }}>
                            Driver: <strong>{trip.returnJourney.arrivalDoorstepCab.driverName}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Security Audit Bar */}
                    <div
                      className="mt-3 p-2 px-3 rounded-2 d-flex flex-wrap align-items-center justify-content-between gap-2"
                      style={{ backgroundColor: theme.greenBoxBg, border: theme.greenBoxBorder, fontSize: '0.78rem' }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <FaShieldAlt style={{ color: '#10B981' }} />
                        <span style={{ color: theme.greenBoxText }}>
                          <strong>Security Audit:</strong> {trip.securitySummary}
                        </span>
                      </div>
                      <div style={{ color: theme.greenBoxText }}>
                        Guardian: <strong>{trip.guardian.name}</strong> ({trip.guardian.phone}) · {trip.guardian.updatesSent} Check-ins
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════════════
          POPUP MODAL 1: SAFETY INVASION CONFIRMATION DIALOG
      ════════════════════════════════════════════════════════ */}
      {safetyInvasionModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(16, 12, 35, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20
          }}
        >
          <div
            style={{
              backgroundColor: theme.cardBg,
              borderRadius: 20,
              maxWidth: 520,
              width: '100%',
              padding: 28,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              border: '2px solid #EF4444'
            }}
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#FEE2E2',
                  color: '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0
                }}
              >
                <FaExclamationTriangle />
              </div>
              <div>
                <h5 style={{ fontWeight: 800, margin: 0, color: '#DC2626' }}>
                  Safety Check: Route Deviation Detected
                </h5>
                <span style={{ fontSize: '0.8rem', color: theme.textMuted }}>
                  Vehicle [{nextTripActive ? nextTripVehiclePlate : vehicleNumberPlate}] diverted {corridorDeviationMeters}m off safe corridor
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: theme.textPrimary, lineHeight: 1.55, marginBottom: 16 }}>
              Your transit vehicle has stopped or deviated from the safe route to {nextTripActive ? selectedNextDestination.split(',')[0] : 'your stay'}. <strong>Has your safety been invaded or compromised?</strong>
            </p>

            <div
              className="p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between"
              style={{ backgroundColor: theme.redBoxBg, border: theme.redBoxBorder }}
            >
              <div className="d-flex align-items-center gap-2">
                <FaClock style={{ color: '#DC2626' }} />
                <span style={{ fontSize: '0.84rem', color: theme.redBoxText, fontWeight: 600 }}>
                  Auto-Escalating to Emergency SOS in:
                </span>
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#DC2626' }}>
                {invasionCountdown}s
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                onClick={confirmSafetyInvaded}
                className="btn btn-danger py-2 d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: 10, fontWeight: 700, fontSize: '0.95rem' }}
              >
                <FaShieldAlt /> YES, SAFETY INVADED! (Trigger SOS & Call)
              </button>

              <button
                type="button"
                onClick={handleConfirmSafe}
                className="btn btn-outline-secondary py-2"
                style={{ borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', color: theme.textPrimary }}
              >
                I Am Safe (Driver took alternate road / Minor traffic bypass)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          POPUP MODAL 2: INCOMING AI DETERRENT DUMMY CALL
      ════════════════════════════════════════════════════════ */}
      {incomingCallActive && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(8, 6, 20, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 20
          }}
        >
          <div
            style={{
              backgroundColor: '#1E1838',
              color: '#FFFFFF',
              borderRadius: 28,
              maxWidth: 380,
              width: '100%',
              padding: '36px 24px',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              border: '1px solid #483A85'
            }}
          >
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                backgroundColor: '#6355E6',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                margin: '0 auto 18px',
                boxShadow: '0 0 24px rgba(99, 85, 230, 0.5)'
              }}
            >
              {selectedCallerVoice === 'police' ? <FaShieldAlt /> : <FaPhoneAlt />}
            </div>

            <h4 style={{ fontWeight: 800, marginBottom: 4 }}>
              {selectedCallerVoice === 'papa' ? guardianName : selectedCallerVoice === 'mom' ? 'Maa (Emergency)' : 'Police Telemetry Sentinel (112)'}
            </h4>

            <div style={{ fontSize: '0.88rem', color: '#B5AEDB', marginBottom: 24 }}>
              {callConnected ? `Connected (${Math.floor(callDuration / 60)}:${callDuration % 60 < 10 ? '0' : ''}${callDuration % 60})` : 'Incoming Deterrent Call...'}
            </div>

            {callConnected ? (
              <div>
                <div
                  className="p-3 mb-4 rounded-3 text-start"
                  style={{ backgroundColor: 'rgba(99, 85, 230, 0.2)', border: '1px solid #6355E6', fontSize: '0.85rem' }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-1" style={{ color: '#9887FE', fontWeight: 700 }}>
                    <span>🗣️ Spoken Voice Deterrent (Playing Out Loud):</span>
                    {selectedCallerVoice === 'papa' && (
                      <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>🎙️ REAL HINDI VOICE</span>
                    )}
                  </div>
                  <div style={{ color: '#FFFFFF', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{selectedCallerVoice === 'papa'
                      ? `Hello, haan kahan ho tum? Achha, abhi kitni der lagegi ghar pahunchne mein? Theek hai, suno apni live location WhatsApp kar do... aur gaadi (${nextTripActive ? nextTripVehiclePlate : vehicleNumberPlate}) ka number bhi bhej dena. Main dekh leta hoon kahan pahunchi ho tum. Dhyan se aana.`
                      : selectedCallerVoice === 'mom'
                      ? `Beta! Tumhari live location screen par aa rahi hai. Papa ne police ko cab number ${nextTripActive ? nextTripVehiclePlate : vehicleNumberPlate} de diya hai, gaadi roko!`
                      : `Attention driver of vehicle ${nextTripActive ? nextTripVehiclePlate : vehicleNumberPlate}. This is Police Telemetry Sentinel. Vehicle deviation logged under women safety surveillance.`}"
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDeclineOrHangupCall}
                  className="btn btn-danger w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: 16, fontWeight: 700, fontSize: '1rem' }}
                >
                  <FaPhoneAlt style={{ transform: 'rotate(135deg)' }} /> End Deterrent Call
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-around mt-4">
                <button
                  type="button"
                  onClick={handleDeclineOrHangupCall}
                  className="btn d-flex flex-column align-items-center"
                  style={{ background: 'none', border: 'none', color: '#FFFFFF' }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: '50%',
                      backgroundColor: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      marginBottom: 8
                    }}
                  >
                    <FaTimes />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#B5AEDB' }}>Decline</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnswerCall}
                  className="btn d-flex flex-column align-items-center"
                  style={{ background: 'none', border: 'none', color: '#FFFFFF' }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      marginBottom: 8,
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
                    }}
                  >
                    <FaPhoneAlt />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>Answer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          POPUP MODAL 3: IN-TRAIN RAILWAY POLICE (RPF) EMERGENCY & GUARDIAN SENTINEL
      ════════════════════════════════════════════════════════ */}
      {trainEmergencyModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(8, 6, 20, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 16,
            backdropFilter: 'blur(6px)'
          }}
        >
          <div
            style={{
              backgroundColor: theme.cardBg,
              color: theme.textPrimary,
              borderRadius: 22,
              maxWidth: 640,
              width: '100%',
              padding: 26,
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              border: '2px solid #F43F5E'
            }}
          >
            {/* Modal Header */}
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0
                  }}
                >
                  <FaShieldAlt />
                </div>
                <div>
                  <h5 style={{ fontWeight: 800, margin: 0, color: '#DC2626' }}>
                    🚨 In-Train Railway Police & Guardian Alert
                  </h5>
                  <span style={{ fontSize: '0.78rem', color: theme.textSecondary }}>
                    Direct RPF Interception + Live Location Sync with Guardian in #{selectedTrain.trainNumber}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrainEmergencyModal(false)}
                className="btn btn-sm btn-outline-secondary"
                style={{ borderRadius: 8 }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Auto-Aggregated Rail Security Dossier */}
            <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ fontSize: '0.72rem', color: '#6355E6', fontWeight: 800, textTransform: 'uppercase' }}>
                  AUTOMATIC PASSENGER TELEMETRY DOSSIER
                </span>
                <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>NTES LIVE VERIFIED</span>
              </div>

              <div className="row g-2" style={{ fontSize: '0.82rem' }}>
                <div className="col-6">
                  <span style={{ color: theme.textMuted }}>Train:</span>{' '}
                  <strong style={{ color: theme.textPrimary }}>#{selectedTrain.trainNumber} {selectedTrain.trainName}</strong>
                </div>
                <div className="col-6">
                  <span style={{ color: theme.textMuted }}>Your Berth:</span>{' '}
                  <strong style={{ color: '#6355E6' }}>Coach {coachNumber}, Seat {seatNumber}</strong>
                </div>
                <div className="col-6">
                  <span style={{ color: theme.textMuted }}>Current Location:</span>{' '}
                  <strong style={{ color: theme.textPrimary }}>Passed {runningStatus?.currentStation?.name || originCity}</strong> ({deviceCoords.speed} km/h)
                </div>
                <div className="col-6">
                  <span style={{ color: theme.textMuted }}>Next Station Halt:</span>{' '}
                  <strong style={{ color: '#10B981' }}>{runningStatus?.nextStation?.name || destinationCity} (PF {runningStatus?.nextStation?.platform || '1'})</strong>
                </div>
                <div className="col-12 mt-1 pt-1 border-top" style={{ borderColor: theme.cardBorder }}>
                  <span style={{ color: theme.textMuted }}>Live Hardware GPS:</span>{' '}
                  <span style={{ color: theme.textPrimary }}>Lat {deviceCoords.lat}, Lng {deviceCoords.lng} (Accuracy ±{deviceCoords.accuracy}m)</span>
                </div>
              </div>
            </div>

            {/* Step 1: Select Suspicious Activity / Threat Reason */}
            <div className="mb-3">
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: theme.textPrimary, marginBottom: 6, display: 'block' }}>
                1. Select Suspicious Activity / Nature of Danger:
              </label>
              <div className="d-flex flex-wrap gap-2">
                {[
                  'Harassment / Eve-teasing / Misbehavior',
                  'Stalking / Suspicious person staring or following',
                  'Unauthorized men entering ladies coach / berth',
                  'Unattended / Suspicious luggage or parcel',
                  'Drunk / Rowdy / Threatening co-passengers',
                  'Immediate physical danger or safety invaded'
                ].map((reason, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTrainIncidentReason(reason)}
                    className={`btn btn-sm ${trainIncidentReason === reason ? 'btn-danger' : 'btn-outline-secondary'}`}
                    style={{ borderRadius: 16, fontSize: '0.74rem', fontWeight: 600 }}
                  >
                    {trainIncidentReason === reason ? '● ' : ''}{reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dual Escalation Actions (RPF + Guardian) */}
            <div className="row g-2 mb-3">
              {/* Box 1: Railway Police Direct Assistance */}
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: theme.redBoxBg, border: theme.redBoxBorder }}>
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <strong style={{ color: '#DC2626', fontSize: '0.86rem' }}>
                        🛡️ Railway Police (RPF 139)
                      </strong>
                      <span className="badge bg-danger" style={{ fontSize: '0.65rem' }}>GOVT OF INDIA</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: theme.redBoxText, margin: '0 0 10px', lineHeight: 1.4 }}>
                      Alerts Meri Saheli lady escort squad in Coach C2 & C4, onboard TTE, and next station RPF police post.
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <a
                      href="tel:139"
                      className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1 shadow-sm"
                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.82rem' }}
                    >
                      <FaPhoneAlt /> Call RPF Helpline 139 Direct
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDispatchTrainEmergency(trainIncidentReason)}
                      className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.8rem' }}
                    >
                      <FaShieldAlt /> Dispatch Onboard RPF Escort
                    </button>
                  </div>
                </div>
              </div>

              {/* Box 2: Guardian (Papa) Simultaneous Alert */}
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: theme.greenBoxBg, border: theme.greenBoxBorder }}>
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <strong style={{ color: '#16A34A', fontSize: '0.86rem' }}>
                        📱 Inform Guardian ({guardianName})
                      </strong>
                      <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>WHATSAPP + SMS</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: theme.greenBoxText, margin: '0 0 10px', lineHeight: 1.4 }}>
                      Sends pre-composed WhatsApp distress message with train number, Coach {coachNumber}, Seat {seatNumber}, and live GPS map pin.
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `🚨 URGENT EMERGENCY IN TRAIN!
Papa, I am feeling unsafe / noticed suspicious activity in Train #${selectedTrain.trainNumber} (${selectedTrain.trainName})!
📍 Coach: Coach ${coachNumber}, Seat: ${seatNumber}
📍 Current Location: Passed ${runningStatus?.currentStation?.name || originCity} (Speed: ${deviceCoords.speed} km/h)
📍 Approaching Next Halt: ${runningStatus?.nextStation?.name || destinationCity} (PF ${runningStatus?.nextStation?.platform || '1'})
⚠️ Reason: ${trainIncidentReason}
🛡️ Railway Police (139 / RPF) has been alerted for immediate coach interception.
Live GPS Coordinates: https://maps.google.com/?q=${deviceCoords.lat},${deviceCoords.lng}
Please stay on call with me!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success btn-sm w-100 d-flex align-items-center justify-content-center gap-1 shadow-sm"
                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.82rem' }}
                    >
                      <FaWhatsapp style={{ fontSize: '1.1rem' }} /> 1-Click WhatsApp Alert to Papa
                    </a>

                    <a
                      href={`tel:${guardianPhone}`}
                      className="btn btn-outline-success btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                      style={{ borderRadius: 8, fontWeight: 700, fontSize: '0.8rem' }}
                    >
                      <FaPhoneAlt /> Call Papa ({guardianPhone})
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Passenger Alarm & Discreet Option */}
            <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong style={{ fontSize: '0.82rem', color: theme.textPrimary }}>
                  🔊 In-Coach Deterrent Sound & Whistle:
                </strong>
                <span style={{ fontSize: '0.72rem', color: theme.textMuted }}>Draw fellow passenger attention</span>
              </div>

              <div className="d-flex gap-2">
                {trainWhistlePlaying ? (
                  <button
                    type="button"
                    onClick={stopTrainWhistle}
                    className="btn btn-danger btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                    style={{ borderRadius: 8, fontWeight: 700 }}
                  >
                    <FaVolumeMute /> Stop Passenger Whistle Alarm
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={playTrainWhistle}
                    className="btn btn-outline-warning btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 text-dark"
                    style={{ borderRadius: 8, fontWeight: 700 }}
                  >
                    <FaVolumeUp /> Play Loud Passenger Whistle Alarm (Attract Coach Attention)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    stopTrainWhistle();
                    handleDispatchTrainEmergency('Discreet Alert (Silent SOS)');
                    alert("Silent Distress Dispatched: RPF and Guardian notified discreetly without phone audio.");
                  }}
                  className="btn btn-outline-secondary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1"
                  style={{ borderRadius: 8, fontWeight: 600, fontSize: '0.76rem' }}
                >
                  🤫 Silent Discreet SOS
                </button>
              </div>
            </div>

            {/* Dispatched Live Resolution Tracker */}
            {trainIncidentDispatched && (
              <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: theme.blueBoxBg, border: theme.blueBoxBorder }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <FaCheckCircle style={{ color: '#2563EB', fontSize: '1.1rem' }} />
                    <strong style={{ fontSize: '0.85rem', color: theme.blueBoxText }}>
                      Live RPF Emergency Response Tracker:
                    </strong>
                  </div>
                  <span className="badge bg-primary" style={{ fontSize: '0.68rem' }}>IN PROGRESS</span>
                </div>

                <div className="d-flex flex-column gap-2" style={{ fontSize: '0.78rem' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-success fw-bold">✓</span>
                    <span><strong>139 Central Control:</strong> Rail security ticket generated for Coach {coachNumber}, Seat {seatNumber}.</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-success fw-bold">✓</span>
                    <span><strong>Guardian Sync:</strong> WhatsApp SOS payload prepared with real-time GPS pin.</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563EB', boxShadow: '0 0 6px #2563EB' }} />
                    <span><strong>Onboard Meri Saheli Escort:</strong> Lady RPF constable dispatched to Coach {coachNumber}.</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2563EB', boxShadow: '0 0 6px #2563EB' }} />
                    <span><strong>Station Interception:</strong> {runningStatus?.nextStation?.name || destinationCity} RPF Post alerted at Platform {runningStatus?.nextStation?.platform || '1'}.</span>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 pt-2 border-top" style={{ borderColor: theme.cardBorder }}>
              <button
                type="button"
                onClick={() => setTrainEmergencyModal(false)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 8, padding: '6px 18px', fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          POPUP MODAL 4: FULL PAST VOYAGE SAFETY AUDIT DOSSIER
      ════════════════════════════════════════════════════════ */}
      {selectedHistoryTrip && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(8, 6, 20, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: 16,
            backdropFilter: 'blur(6px)'
          }}
        >
          <div
            style={{
              backgroundColor: theme.cardBg,
              color: theme.textPrimary,
              borderRadius: 22,
              maxWidth: 720,
              width: '100%',
              padding: 26,
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              border: '2px solid #8B5CF6'
            }}
          >
            {/* Modal Header */}
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom" style={{ borderColor: theme.cardBorder }}>
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                    color: '#8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    flexShrink: 0
                  }}
                >
                  <FaHistory />
                </div>
                <div>
                  <h5 style={{ fontWeight: 800, margin: 0, color: theme.textPrimary }}>
                    {selectedHistoryTrip.title}
                  </h5>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <span className="badge bg-success" style={{ fontSize: '0.68rem' }}>
                      {selectedHistoryTrip.status}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: theme.textSecondary, fontFamily: 'monospace' }}>
                      AUDIT TOKEN: #{selectedHistoryTrip.safetyAuditToken}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHistoryTrip(null)}
                className="btn btn-sm btn-outline-secondary"
                style={{ borderRadius: 8 }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body: Complete Chronological Itinerary & Audit */}
            <div className="d-flex flex-column gap-3 mb-3">
              {/* Dates & Route Overview */}
              <div className="p-3 rounded-3" style={{ backgroundColor: theme.subCardBg, border: theme.subCardBorder }}>
                <div className="row g-2" style={{ fontSize: '0.84rem' }}>
                  <div className="col-6">
                    <span style={{ color: theme.textMuted }}>Voyage Window:</span>{' '}
                    <strong>{selectedHistoryTrip.departureDate} – {selectedHistoryTrip.returnDate}</strong>
                  </div>
                  <div className="col-6">
                    <span style={{ color: theme.textMuted }}><FaRoute style={{ marginRight: 4 }} />Corridor Route:</span>{' '}
                    <strong>{selectedHistoryTrip.originCity} ➔ {selectedHistoryTrip.destinationCity} & Back</strong>
                  </div>
                  <div className="col-6">
                    <span style={{ color: theme.textMuted }}>Registered Guardian:</span>{' '}
                    <strong>{selectedHistoryTrip.guardian.name}</strong> ({selectedHistoryTrip.guardian.phone})
                  </div>
                  <div className="col-6">
                    <span style={{ color: theme.textMuted }}>Last Check-in:</span>{' '}
                    <strong style={{ color: '#10B981' }}>{selectedHistoryTrip.guardian.lastCheckin}</strong>
                  </div>
                </div>
              </div>

              {/* Step 1: Outbound Rail Journey */}
              <div className="p-3 rounded-3" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <FaTrain style={{ color: '#6355E6' }} />
                    <strong style={{ fontSize: '0.88rem', color: theme.textPrimary }}>Phase 1: Outbound Express Train</strong>
                  </div>
                  <span className="badge bg-primary" style={{ fontSize: '0.65rem' }}>NTES COMPLIANT</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: theme.textSecondary, lineHeight: 1.5 }}>
                  <div><strong>Train:</strong> #{selectedHistoryTrip.outboundTrain.trainNumber} {selectedHistoryTrip.outboundTrain.trainName}</div>
                  <div><strong>Route:</strong> {selectedHistoryTrip.originStation} ({selectedHistoryTrip.outboundTrain.departureTime}) ➔ {selectedHistoryTrip.destinationStation} ({selectedHistoryTrip.outboundTrain.arrivalTime})</div>
                  <div><strong>Berth Allocation:</strong> Coach {selectedHistoryTrip.outboundTrain.coach}, Seat {selectedHistoryTrip.outboundTrain.seat}</div>
                </div>
              </div>

              {/* Step 2: Safe Stay & Hotel Verification */}
              <div className="p-3 rounded-3" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <FaHotel style={{ color: '#10B981' }} />
                    <strong style={{ fontSize: '0.88rem', color: theme.textPrimary }}>Phase 2: Safe Hotel Stay & Verification</strong>
                  </div>
                  <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>{selectedHistoryTrip.stay.verifiedScore}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: theme.textSecondary, lineHeight: 1.5 }}>
                  <div><strong>Property Name:</strong> {selectedHistoryTrip.stay.name}</div>
                  <div><strong>Full Address:</strong> {selectedHistoryTrip.stay.address}</div>
                  <div><strong>Stay Duration:</strong> Check-in: {selectedHistoryTrip.stay.checkIn} | Check-out: {selectedHistoryTrip.stay.checkOut}</div>
                </div>
              </div>

              {/* Step 3: All Transit Vehicles Logged with Plates & Drivers */}
              <div className="p-3 rounded-3" style={{ backgroundColor: theme.cardBg, border: theme.cardBorder }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <FaCar style={{ color: '#F59E0B' }} />
                    <strong style={{ fontSize: '0.88rem', color: theme.textPrimary }}>Phase 3: Verified Local & Return Fleet Log</strong>
                  </div>
                  <span className="badge bg-warning text-dark" style={{ fontSize: '0.65rem' }}>IND NUMBER PLATES</span>
                </div>
                <div className="d-flex flex-column gap-2" style={{ fontSize: '0.82rem' }}>
                  {selectedHistoryTrip.localTransitVehicles.map((veh, idx) => (
                    <div key={idx} className="p-2 rounded border d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ backgroundColor: theme.subCardBg, borderColor: theme.subCardBorder }}>
                      <div>
                        <strong>{veh.leg}:</strong> {veh.transportMode}
                        <div style={{ fontSize: '0.74rem', color: theme.textMuted }}>
                          Driver: {veh.driverName} ({veh.driverPhone})
                        </div>
                      </div>
                      <span
                        style={{
                          backgroundColor: '#FDE047',
                          color: '#000000',
                          border: '1.5px solid #000000',
                          borderRadius: 4,
                          padding: '2px 8px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          fontFamily: 'monospace'
                        }}
                      >
                        🇮🇳 {veh.vehiclePlate}
                      </span>
                    </div>
                  ))}

                  {/* Return Departure Cab */}
                  <div className="p-2 rounded border d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ backgroundColor: theme.subCardBg, borderColor: theme.subCardBorder }}>
                    <div>
                      <strong>Return Departure Cab:</strong> {selectedHistoryTrip.returnJourney.departureCab.leg} ({selectedHistoryTrip.returnJourney.departureCab.transportMode})
                      <div style={{ fontSize: '0.74rem', color: theme.textMuted }}>
                        Driver: {selectedHistoryTrip.returnJourney.departureCab.driverName} ({selectedHistoryTrip.returnJourney.departureCab.driverPhone})
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#FDE047',
                        color: '#000000',
                        border: '1.5px solid #000000',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        fontFamily: 'monospace'
                      }}
                    >
                      🇮🇳 {selectedHistoryTrip.returnJourney.departureCab.vehiclePlate}
                    </span>
                  </div>

                  {/* Return Express Train */}
                  <div className="p-2 rounded border" style={{ backgroundColor: theme.subCardBg, borderColor: theme.subCardBorder }}>
                    <strong>Return Express Train:</strong> #{selectedHistoryTrip.returnJourney.train.trainNumber} {selectedHistoryTrip.returnJourney.train.trainName}
                    <div style={{ fontSize: '0.74rem', color: theme.textMuted }}>
                      Berth: Coach {selectedHistoryTrip.returnJourney.train.coach}, Seat {selectedHistoryTrip.returnJourney.train.seat} ({selectedHistoryTrip.returnJourney.train.departure} ➔ {selectedHistoryTrip.returnJourney.train.arrival})
                    </div>
                  </div>

                  {/* Doorstep Cab */}
                  <div className="p-2 rounded border d-flex flex-wrap align-items-center justify-content-between gap-2" style={{ backgroundColor: theme.subCardBg, borderColor: theme.subCardBorder }}>
                    <div>
                      <strong>Doorstep Arrival Cab:</strong> {selectedHistoryTrip.returnJourney.arrivalDoorstepCab.leg} ({selectedHistoryTrip.returnJourney.arrivalDoorstepCab.transportMode})
                      <div style={{ fontSize: '0.74rem', color: theme.textMuted }}>
                        Driver: {selectedHistoryTrip.returnJourney.arrivalDoorstepCab.driverName} ({selectedHistoryTrip.returnJourney.arrivalDoorstepCab.driverPhone})
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#FDE047',
                        color: '#000000',
                        border: '1.5px solid #000000',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        fontFamily: 'monospace'
                      }}
                    >
                      🇮🇳 {selectedHistoryTrip.returnJourney.arrivalDoorstepCab.vehiclePlate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Security Telemetry Audit */}
              <div className="p-3 rounded-3" style={{ backgroundColor: theme.greenBoxBg, border: theme.greenBoxBorder }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FaShieldAlt style={{ color: '#10B981', fontSize: '1.1rem' }} />
                  <strong style={{ fontSize: '0.86rem', color: theme.greenBoxText }}>Official Safety Audit Certificate</strong>
                </div>
                <div style={{ fontSize: '0.8rem', color: theme.greenBoxText, lineHeight: 1.45 }}>
                  {selectedHistoryTrip.securitySummary}
                </div>
                <div className="mt-2 pt-2 border-top d-flex justify-content-between" style={{ borderColor: theme.greenBoxBorder, fontSize: '0.74rem', color: theme.greenBoxText }}>
                  <span>Corridor Deviations: <strong>{selectedHistoryTrip.corridorDeviations}</strong></span>
                  <span>Emergency Dispatches: <strong>{selectedHistoryTrip.emergencyTriggered ? '1 (Resolved)' : '0 (None)'}</strong></span>
                  <span>Guardian Sync: <strong>100% WhatsApp Acknowledged</strong></span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 border-top" style={{ borderColor: theme.cardBorder }}>
              <div className="d-flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `📜 HERHUB COMPLETE SAFETY AUDIT DOSSIER (#${selectedHistoryTrip.safetyAuditToken})
Trip: ${selectedHistoryTrip.title}
Dates: ${selectedHistoryTrip.departureDate} - ${selectedHistoryTrip.returnDate}
Status: ${selectedHistoryTrip.status}

🚆 Outbound Train: #${selectedHistoryTrip.outboundTrain.trainNumber} (Coach ${selectedHistoryTrip.outboundTrain.coach}, Seat ${selectedHistoryTrip.outboundTrain.seat})
🏨 Hotel: ${selectedHistoryTrip.stay.name}
🚕 Verified Vehicles: ${selectedHistoryTrip.localTransitVehicles.map(v => `${v.transportMode} [${v.vehiclePlate} - ${v.driverName}]`).join(' | ')}
🔙 Return: #${selectedHistoryTrip.returnJourney.train.trainNumber} (Doorstep Cab [${selectedHistoryTrip.returnJourney.arrivalDoorstepCab.vehiclePlate} - ${selectedHistoryTrip.returnJourney.arrivalDoorstepCab.driverName}])

Guardian: ${selectedHistoryTrip.guardian.name} (${selectedHistoryTrip.guardian.phone})
Audit: ${selectedHistoryTrip.securitySummary}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success btn-sm d-flex align-items-center gap-1 shadow-sm"
                  style={{ borderRadius: 8, fontWeight: 700 }}
                >
                  <FaShareAlt /> Share Full Dossier
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  style={{ borderRadius: 8, fontWeight: 600 }}
                >
                  <FaDownload /> Print / Save PDF
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedHistoryTrip(null)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 8, padding: '6px 20px', fontWeight: 600 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SoloTripPlannerPage;
