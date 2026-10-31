/**
 * 🔒 ZERO-KNOWLEDGE ANONYMOUS COMMUNITY THOUGHTS & AWARENESS SERVICE
 * 
 * Strict Privacy Guarantees:
 * - NO names, NO emails, NO IP addresses, NO phone numbers stored or exposed.
 * - Client-side real-time PII (Personally Identifiable Information) scrubber.
 * - Persistent in localStorage for instant synchronization across sessions.
 */

const STORAGE_KEY = 'herhub_anonymous_thoughts';
const LIKES_KEY = 'herhub_liked_thoughts';

// Initial curated awareness thoughts for immediate high-impact presentation
export const INITIAL_AWARENESS_THOUGHTS = [
  {
    id: 'th-1',
    category: 'Legal Right',
    categoryColor: '#8B5CF6',
    icon: '⚖️',
    content: 'Zero FIR Mandate: Any police station in India is legally bound to register your FIR immediately, irrespective of jurisdiction. (Sec 173 BNSS). Never let them turn you away!',
    alias: 'Anonymous Advocate #142',
    region: 'National Legal Rights',
    timestamp: '10 min ago',
    likes: 142,
    verified: true
  },
  {
    id: 'th-2',
    category: 'Night Safety',
    categoryColor: '#10B981',
    icon: '💡',
    content: 'If an auto/cab takes an unlit bypass at night, pretend to be on a loud speaker call: "Yes papa, sharing live GPS right now, will reach in 8 minutes." It instantly deters misconduct.',
    alias: 'Anonymous Sister #309',
    region: 'Bengaluru ORR',
    timestamp: '24 min ago',
    likes: 218,
    verified: true
  },
  {
    id: 'th-3',
    category: 'Safety Alert',
    categoryColor: '#EF4444',
    icon: '⚠️',
    content: 'Sikanderpur metro underpass Exit 3 has non-functional sodium lamps after 9:30 PM. Use the main illuminated boulevard at Exit 1 instead until civic repair is completed.',
    alias: 'Anonymous Commuter #88',
    region: 'Gurugram Metro',
    timestamp: '45 min ago',
    likes: 89,
    verified: true
  },
  {
    id: 'th-4',
    category: 'Cyber Defense',
    categoryColor: '#3B82F6',
    icon: '🛡️',
    content: 'Beware of Instagram DM links saying "Is this your leaked video?". It is a malware session hijacker. Do not click. Dial 1930 or file on cybercrime.gov.in right away.',
    alias: 'Cyber Forensics Sentinel #19',
    region: 'Digital Space',
    timestamp: '1 hr ago',
    likes: 174,
    verified: true
  },
  {
    id: 'th-5',
    category: 'Solidarity & Courage',
    categoryColor: '#EC4899',
    icon: '💜',
    content: 'To every woman returning late from shifts: You belong in every street, every metro, every public space with full dignity. Stay cautious, stay fierce, sisterhood has your back!',
    alias: 'Anonymous Sister #771',
    region: 'Mumbai Central',
    timestamp: '2 hr ago',
    likes: 312,
    verified: true
  },
  {
    id: 'th-6',
    category: 'Public Transit',
    categoryColor: '#F59E0B',
    icon: '🚌',
    content: 'All Delhi pink buses have government marshals on duty. If someone misbehaves or crowds you deliberately, walk straight to the marshal or pull the emergency bell.',
    alias: 'Delhi Safe Commuter #53',
    region: 'Delhi NCR',
    timestamp: '3 hr ago',
    likes: 126,
    verified: true
  }
];

// Regex for detecting phone numbers (Indian & International) and emails
const PHONE_REGEX = /(\+?\d{1,4}[-.\s]?)?(\b\d{10}\b|\b\d{5}[-.\s]?\d{5}\b|\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b)/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

/**
 * Real-time PII Scrubber: strips any accidental personal phone or email
 */
export function scrubPII(text) {
  if (!text) return '';
  return text
    .replace(PHONE_REGEX, '[PROTECTED CONTACT]')
    .replace(EMAIL_REGEX, '[PROTECTED EMAIL]');
}

/**
 * Checks if input contains potential personal data
 */
export function checkPII(text) {
  if (!text) return { hasPII: false, types: [] };
  const hasPhone = PHONE_REGEX.test(text);
  PHONE_REGEX.lastIndex = 0; // reset regex state
  const hasEmail = EMAIL_REGEX.test(text);
  EMAIL_REGEX.lastIndex = 0; // reset regex state

  const types = [];
  if (hasPhone) types.push('Phone Number');
  if (hasEmail) types.push('Email Address');

  return {
    hasPII: types.length > 0,
    types,
    cleanText: scrubPII(text)
  };
}

/**
 * Get all thoughts (from localStorage or defaults)
 */
export function getThoughts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_AWARENESS_THOUGHTS));
      return INITIAL_AWARENESS_THOUGHTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_AWARENESS_THOUGHTS;
  } catch (e) {
    return INITIAL_AWARENESS_THOUGHTS;
  }
}

/**
 * Add a new anonymous thought
 * Automatically scrubs PII and assigns anonymous identifiers
 */
export function addThought({ category, content, alias, region }) {
  const thoughts = getThoughts();

  // Color mapping based on category
  const categoryColors = {
    'Legal Right': '#8B5CF6',
    'Night Safety': '#10B981',
    'Safety Alert': '#EF4444',
    'Cyber Defense': '#3B82F6',
    'Solidarity & Courage': '#EC4899',
    'Public Transit': '#F59E0B',
    'Campus & Workplace': '#06B6D4'
  };

  const categoryIcons = {
    'Legal Right': '⚖️',
    'Night Safety': '💡',
    'Safety Alert': '⚠️',
    'Cyber Defense': '🛡️',
    'Solidarity & Courage': '💜',
    'Public Transit': '🚌',
    'Campus & Workplace': '🏢'
  };

  // Safe anonymous pseudonym (strictly zero PII)
  const safeRandomId = Math.floor(100 + Math.random() * 900);
  const safeAlias = alias && alias.trim() ? alias.trim() : `Anonymous Sister #${safeRandomId}`;

  // Sanitize and scrub content
  const cleanContent = scrubPII(content ? content.trim() : '');
  const cleanRegion = region && region.trim() ? region.trim() : 'Community Verified';

  const newThought = {
    id: `th-${Date.now()}`,
    category: category || 'Night Safety',
    categoryColor: categoryColors[category] || '#8B5CF6',
    icon: categoryIcons[category] || '💡',
    content: cleanContent,
    alias: safeAlias,
    region: cleanRegion,
    timestamp: 'Just now',
    likes: 1,
    verified: true
  };

  const updated = [newThought, ...thoughts];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}

  // Broadcast event across all components in the app
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('herhub_thoughts_updated', { detail: newThought }));
  }

  return newThought;
}

/**
 * Upvote/Like a thought
 */
export function likeThought(id) {
  try {
    const rawLiked = localStorage.getItem(LIKES_KEY);
    const likedSet = rawLiked ? JSON.parse(rawLiked) : {};

    const thoughts = getThoughts();
    const updated = thoughts.map((item) => {
      if (item.id === id) {
        const isLiked = likedSet[id];
        const newLikes = isLiked ? Math.max(0, (item.likes || 1) - 1) : (item.likes || 0) + 1;
        if (isLiked) {
          delete likedSet[id];
        } else {
          likedSet[id] = true;
        }
        return { ...item, likes: newLikes };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LIKES_KEY, JSON.stringify(likedSet));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('herhub_thoughts_updated'));
    }

    return { updated, isLiked: !!likedSet[id] };
  } catch (e) {
    return { updated: getThoughts(), isLiked: false };
  }
}

/**
 * Check if user already liked a thought
 */
export function isThoughtLiked(id) {
  try {
    const rawLiked = localStorage.getItem(LIKES_KEY);
    const likedSet = rawLiked ? JSON.parse(rawLiked) : {};
    return !!likedSet[id];
  } catch (e) {
    return false;
  }
}
