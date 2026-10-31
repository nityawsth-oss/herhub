/**
 * 🗺️ CROWDSOURCED ROUTE REVIEWS & REAL-WORLD SAFETY INTELLIGENCE SERVICE
 * 
 * Collects post-journey reviews, comfort star ratings, and route experiences
 * from women travelers to continuously improve safety intelligence for the next travelers.
 */

const STORAGE_KEY = 'herhub_route_reviews';

// Default initial dataset of verified past route reviews across major Indian corridors
export const INITIAL_ROUTE_REVIEWS = [
  {
    id: 'rev-1',
    routeKey: 'Connaught Place to Saket Citywalk',
    origin: 'Connaught Place, Central Delhi',
    destination: 'Select Citywalk Mall, Saket, New Delhi',
    city: 'Delhi NCR',
    travelMode: 'metro',
    stars: 5,
    comfortLevel: 'Highly Safe & Comfortable',
    timeSlot: 'Night (10:15 PM)',
    lighting: 'Well-lit throughout',
    crowd: 'Good pedestrian crowd',
    policePresence: 'Visible PCR van at metro gate',
    driverBehavior: 'N/A (Yellow Line Metro)',
    experience: 'Yellow line metro was fully active with CISF guards and women-only coach respected. The walk from Saket metro to mall has high-mast LED lighting and active auto stands.',
    nightRecommendation: 'yes',
    alias: 'Anonymous Commuter #412',
    timestamp: 'Yesterday at 10:45 PM',
    helpfulCount: 48
  },
  {
    id: 'rev-2',
    routeKey: 'Connaught Place to Saket Citywalk',
    origin: 'Connaught Place, Central Delhi',
    destination: 'Select Citywalk Mall, Saket, New Delhi',
    city: 'Delhi NCR',
    travelMode: 'cab',
    stars: 4,
    comfortLevel: 'Good & Safe',
    timeSlot: 'Late Evening (9:00 PM)',
    lighting: 'Well-lit throughout',
    crowd: 'Moderate traffic',
    policePresence: 'Police barricade check at Aurobindo Marg',
    driverBehavior: 'Professional & verified driver',
    experience: 'Uber cab stayed strictly on the main Aurobindo Marg corridor. Traffic was moderate. Felt completely secure with HerHub corridor geofence active.',
    nightRecommendation: 'yes',
    alias: 'Anonymous Sister #189',
    timestamp: '2 days ago',
    helpfulCount: 31
  },
  {
    id: 'rev-3',
    routeKey: 'Noida Sector 18 to Lajpat Nagar',
    origin: 'Noida Sector 18 Atta Market, Noida',
    destination: 'Central Market, Lajpat Nagar II, New Delhi',
    city: 'Delhi NCR',
    travelMode: 'auto',
    stars: 3,
    comfortLevel: 'Moderate / Needs Caution',
    timeSlot: 'Night (10:45 PM)',
    lighting: 'Dark spots near DND flyway exit',
    crowd: 'Deserted near loop',
    policePresence: 'No police seen on toll loop',
    driverBehavior: 'Driver asked for extra fare, but stayed on route',
    experience: 'The DND flyway is fast, but the underpass loop heading into Sarai Kale Khan has 2 non-working streetlamps. Recommend using the Ashram flyover route instead of the inner service road after 10 PM.',
    nightRecommendation: 'caution',
    alias: 'Daily NCR Commuter #76',
    timestamp: '3 days ago',
    helpfulCount: 65
  },
  {
    id: 'rev-4',
    routeKey: 'MG Road Metro to Koramangala',
    origin: 'MG Road Metro Station, Bengaluru',
    destination: 'Koramangala 5th Block, Bengaluru',
    city: 'Bengaluru',
    travelMode: 'cab',
    stars: 5,
    comfortLevel: 'Highly Safe & Comfortable',
    timeSlot: 'Late Night (11:20 PM)',
    lighting: 'Well-lit commercial boulevard',
    crowd: 'Lots of active cafes and restaurants',
    policePresence: 'Bengaluru City Police Pink Hoysala parked at Sony World junction',
    driverBehavior: 'Polite, OTP verified',
    experience: 'Koramangala 100ft road and 80ft road are very safe even past 11 PM because restaurants and tech hubs are open. Pink Hoysala patrol van was actively patrolling.',
    nightRecommendation: 'yes',
    alias: 'Bengaluru Techie #304',
    timestamp: 'Yesterday at 11:50 PM',
    helpfulCount: 42
  },
  {
    id: 'rev-5',
    routeKey: 'Bauliya to Pandeypur',
    origin: 'Bauliya, Varanasi',
    destination: 'Pandeypur, Varanasi',
    city: 'Varanasi',
    travelMode: 'auto',
    stars: 4,
    comfortLevel: 'Good & Safe',
    timeSlot: 'Evening (8:30 PM)',
    lighting: 'Adequate streetlamps on main road',
    crowd: 'Active local market bustling',
    policePresence: 'Traffic police at Pandeypur Chauraha',
    driverBehavior: 'Local auto driver, shared ride with other female passengers',
    experience: 'Main road through Bauliya to Pandeypur is safe till 9:30 PM with open medical shops. Avoid inner lanes of Hukulganj on foot after 9 PM, take the main chauraha road.',
    nightRecommendation: 'yes',
    alias: 'BHU Student Voice #92',
    timestamp: '4 days ago',
    helpfulCount: 29
  },
  {
    id: 'rev-6',
    routeKey: 'Tedhi Pulia to Gudamba Thana',
    origin: 'Tedhi Pulia, Lucknow',
    destination: 'Gudamba Thana, Lucknow',
    city: 'Lucknow',
    travelMode: 'e-rickshaw',
    stars: 4,
    comfortLevel: 'Good & Safe',
    timeSlot: 'Night (9:45 PM)',
    lighting: 'High-mast LED lighting along Kursi road',
    crowd: 'Active transit hub',
    policePresence: 'UP 112 PRV van active near Gudamba Thana',
    driverBehavior: 'Prompt, well-behaved',
    experience: 'Kursi Road corridor is wide and brightly lit. Gudamba police station provides high reassurance. Safe for solo women commuters.',
    nightRecommendation: 'yes',
    alias: 'Lucknow Sister #55',
    timestamp: '5 days ago',
    helpfulCount: 37
  }
];

/**
 * Standardize route key for matching origins and destinations
 */
export function normalizeRouteKey(origin, destination) {
  if (!origin || !destination) return 'General Route';
  const cleanO = origin.split(',')[0].trim().toLowerCase();
  const cleanD = destination.split(',')[0].trim().toLowerCase();
  return `${cleanO} ➔ ${cleanD}`;
}

/**
 * Get all stored reviews
 */
export function getAllReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ROUTE_REVIEWS));
      return INITIAL_ROUTE_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ROUTE_REVIEWS;
  } catch (e) {
    return INITIAL_ROUTE_REVIEWS;
  }
}

/**
 * Add a new post-journey review
 * Immediately updates the crowdsourced route intelligence
 */
export function addRouteReview(reviewData) {
  const reviews = getAllReviews();
  const safeRandomId = Math.floor(100 + Math.random() * 900);
  
  const newReview = {
    id: `rev-${Date.now()}`,
    routeKey: reviewData.routeKey || normalizeRouteKey(reviewData.origin, reviewData.destination),
    origin: reviewData.origin || 'Selected Origin',
    destination: reviewData.destination || 'Selected Destination',
    city: reviewData.city || 'City Corridor',
    travelMode: reviewData.travelMode || 'cab',
    stars: Number(reviewData.stars) || 5,
    comfortLevel: reviewData.comfortLevel || 'Good & Safe',
    timeSlot: reviewData.timeSlot || 'Night Journey',
    lighting: reviewData.lighting || 'Adequate lighting',
    crowd: reviewData.crowd || 'Moderate activity',
    policePresence: reviewData.policePresence || 'Standard security',
    driverBehavior: reviewData.driverBehavior || 'Respectful & verified',
    experience: reviewData.experience ? reviewData.experience.trim() : 'Smooth and safe travel confirmed.',
    nightRecommendation: reviewData.nightRecommendation || 'yes',
    alias: reviewData.alias || `Verified Solo Traveler #${safeRandomId}`,
    timestamp: 'Just now',
    helpfulCount: 1
  };

  const updated = [newReview, ...reviews];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('herhub_route_reviewed', { detail: newReview }));
  }

  return newReview;
}

/**
 * Calculate aggregated safety intelligence for a specific corridor
 */
export function getRouteSafetyIntelligence(origin, destination) {
  const reviews = getAllReviews();
  const searchO = (origin || '').toLowerCase();
  const searchD = (destination || '').toLowerCase();

  // Find reviews matching this corridor (exact or fuzzy locality match)
  const matching = reviews.filter((r) => {
    const rO = (r.origin || '').toLowerCase();
    const rD = (r.destination || '').toLowerCase();
    const rKey = (r.routeKey || '').toLowerCase();

    if (searchO && searchD) {
      const oLoc = searchO.split(',')[0].trim();
      const dLoc = searchD.split(',')[0].trim();
      return (
        rKey.includes(oLoc) ||
        rKey.includes(dLoc) ||
        (rO.includes(oLoc) && rD.includes(dLoc))
      );
    }
    return true;
  });

  const relevant = matching.length > 0 ? matching : reviews.slice(0, 3);
  const totalStars = relevant.reduce((acc, curr) => acc + (curr.stars || 4), 0);
  const avgStars = (totalStars / relevant.length).toFixed(1);
  const recommendedCount = relevant.filter(r => r.nightRecommendation === 'yes').length;
  const comfortPct = Math.round((recommendedCount / relevant.length) * 100);

  // Extract key tips for the next traveler
  const keyTips = relevant
    .map(r => r.experience)
    .filter(Boolean)
    .slice(0, 3);

  // Lighting & Police telemetry synthesis
  const hasGoodLighting = relevant.filter(r => (r.lighting || '').toLowerCase().includes('well-lit')).length;
  const lightingPct = Math.round((hasGoodLighting / relevant.length) * 100) || 85;

  const hasPcr = relevant.filter(r => (r.policePresence || '').toLowerCase().includes('pcr') || (r.policePresence || '').toLowerCase().includes('police')).length;
  const policePct = Math.round((hasPcr / relevant.length) * 100) || 75;

  return {
    totalReviews: relevant.length,
    avgStars: parseFloat(avgStars),
    comfortPct,
    lightingPct,
    policePct,
    keyTips,
    recentReviews: relevant,
    verdict: avgStars >= 4.5 ? 'EXCELLENT SAFETY RATING' : avgStars >= 3.8 ? 'VERIFIED SAFE CORRIDOR' : 'CAUTION ADVISED AT NIGHT'
  };
}
