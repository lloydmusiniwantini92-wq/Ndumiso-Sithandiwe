export interface GuestEntry {
  id: number;
  name: string;
  phone?: string;
  allowedGuests?: number;
  replacedGuest?: string;
  aliases?: string[];
  rsvpStatus?: 'attending' | 'declining' | 'pending';
  rsvpGuests?: number;
  rsvpNotes?: string;
  rsvpSubmittedAt?: string;
}

export interface RsvpSubmission {
  submittedAt: string;
  name: string;
  phone: string;
  attendance: 'attending' | 'declining' | string;
  guests: string | number;
  notes?: string;
}

export const RSVP_ENDPOINT =
  (import.meta as any).env?.VITE_RSVP_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbyTGxdmSFL2N5hEisMyTjgGQ_aOcr06TKavP-PwevV8zwnHN6A-j8nVyk-3Vn3_rugSSA/exec';

export const GOOGLE_SHEET_ID = '1dOiZFMm1UoLp13-WFpOcxvNiNKFmLdfT4eqal-CvkXM';

const STORAGE_KEY_GUESTS = 'ns_wedding_guest_list_v2';
const STORAGE_KEY_RSVPS = 'ns_wedding_rsvp_records_v2';
const STORAGE_KEY_LAST_SUBMIT = 'ns_wedding_last_submit_v2';

/**
 * Updated 95-person Final Guest List (from "30 December Final Guestlist.xlsx")
 * Preserves existing RSVPs & phone numbers while applying standby replacements:
 * - #3 Julie: phone updated to 0777727681
 * - #6 Mr and Mrs Sibanda (Bride's Parents)
 * - #39 Mr and Mrs Sibanda (0772383605)
 * - #53 Mr & Mrs Bajila & #54 Privilege
 * - #57 Lolo (replaced Holy)
 * - #68 Mr and Mrs Mangena (replaced Mihla)
 * - #72 Mrs Dube (replaced Bleh & Mrs dube)
 * - #75 Timothy (replaced Sindy Mabuza)
 * - #87 Mr & Mrs Sibanda (formerly Mr & Mrs B Sibanda)
 */
export const DEFAULT_GUEST_LIST: GuestEntry[] = [
  { id: 1, name: "Peter Mpofu", phone: "" },
  { id: 2, name: "NaNgcuu", phone: "0712351321" },
  { id: 3, name: "Julie", phone: "0777727681" },
  { id: 4, name: "NaMishie", phone: "0772322925" },
  { id: 5, name: "NaKieth", phone: "0718487145" },
  {
    id: 6,
    name: "Mr and Mrs Sibanda",
    phone: "",
    allowedGuests: 2,
    aliases: ["Mr and Mrs Sibanda (bridesparents)", "Bridesparents"],
  },
  { id: 7, name: "naAgrippah", phone: "0775182678" },
  { id: 8, name: "Mr and Mrs Dube", phone: "0773430508", allowedGuests: 2 },
  { id: 9, name: "Busi Mpofu", phone: "0772408809" },
  { id: 10, name: "Sphiwe Dube", phone: "0772208022" },
  { id: 11, name: "Patie", phone: "0772618114" },
  { id: 12, name: "Judie", phone: "07717129701" },
  { id: 13, name: "NoNtoe", phone: "0772377341" },
  {
    id: 14,
    name: "Brillient",
    phone: "0783437855",
    rsvpStatus: "attending",
    rsvpGuests: 1,
    rsvpSubmittedAt: "2026-10-25T15:31:02.875Z",
  },
  { id: 15, name: "Thulie", phone: "0787224019" },
  { id: 16, name: "naPrim", phone: "0773486710" },
  { id: 17, name: "Tendai Mateke", phone: "0772857416" },
  { id: 18, name: "Melina Moyo", phone: "0713386780" },
  {
    id: 19,
    name: "Opah Magidi",
    phone: "0712292088",
    allowedGuests: 2,
    rsvpStatus: "attending",
    rsvpGuests: 2,
    rsvpNotes: "Broccoli and cauliflower",
    rsvpSubmittedAt: "2026-10-26T10:00:00.000Z",
  },
  { id: 20, name: "naJeco", phone: "09781944796" },
  { id: 21, name: "naNdue", phone: "07723295" },
  { id: 22, name: "Nomusa", phone: "07787250423" },
  {
    id: 23,
    name: "Sukoluhle",
    phone: "0775815539",
    rsvpStatus: "attending",
    rsvpGuests: 1,
    rsvpNotes: "No spices",
    rsvpSubmittedAt: "2026-10-25T16:00:00.000Z",
  },
  { id: 24, name: "Nkululeko", phone: "0786313924" },
  { id: 25, name: "Ntobeko", phone: "0772230282" },
  { id: 26, name: "Dumo", phone: "0774088717" },
  {
    id: 27,
    name: "Lindani",
    phone: "0776240867",
    rsvpStatus: "attending",
    rsvpGuests: 1,
    rsvpNotes: "Absolutely no sea food of any kind",
    rsvpSubmittedAt: "2026-10-26T12:00:00.000Z",
  },
  { id: 28, name: "Onesimo", phone: "0784067800" },
  { id: 29, name: "Pinkie", phone: "0784265871" },
  { id: 30, name: "Faith", phone: "0775825043" },
  { id: 31, name: "Boneni", phone: "0787818364" },
  { id: 32, name: "Mhlobo", phone: "077992013" },
  { id: 33, name: "Ntombie", phone: "071650573" },
  { id: 34, name: "Sabheki", phone: "0784057457" },
  { id: 35, name: "Narhoda", phone: "0715797654" },
  { id: 36, name: "Mr and Mrs Bango", phone: "+44 7368 252393", allowedGuests: 2 },
  { id: 37, name: "Manotsha", phone: "0718395688" },
  { id: 38, name: "Mr and Mrs Baron", phone: "+358 76834666", allowedGuests: 2 },
  {
    id: 39,
    name: "Mr and Mrs Sibanda",
    phone: "0772383605",
    allowedGuests: 2,
    aliases: ["Mr and Mrs Kusa Sibanda", "Kusa Sibanda"],
  },
  {
    id: 40,
    name: "Abie",
    phone: "0774139844",
    rsvpStatus: "attending",
    rsvpGuests: 1,
    rsvpSubmittedAt: "2026-10-25T20:00:00.000Z",
  },
  { id: 41, name: "Israel", phone: "+44 7789 814159" },
  { id: 42, name: "Mr and Mrs Mpofu", phone: "0777742198", allowedGuests: 2 },
  { id: 43, name: "Butho", phone: "078477483" },
  { id: 44, name: "Ruth", phone: "" },
  { id: 45, name: "Mr and Mrs Ncube", phone: "+44 7903 228760", allowedGuests: 2 },
  { id: 46, name: "Mamo", phone: "" },
  { id: 47, name: "Prince", phone: "" },
  { id: 48, name: "Gracious", phone: "" },
  { id: 49, name: "Welly", phone: "0780589134" },
  { id: 50, name: "Samantha", phone: "" },
  { id: 51, name: "Josphine", phone: "077272841" },
  { id: 52, name: "Mduduzi", phone: "" },
  { id: 53, name: "Mr & Mrs Bajila", phone: "", allowedGuests: 2 },
  {
    id: 54,
    name: "Privilege",
    phone: "0788142413",
    rsvpStatus: "attending",
    rsvpGuests: 1,
    rsvpSubmittedAt: "2026-10-25T17:15:00.000Z",
  },
  { id: 55, name: "Joana", phone: "" },
  { id: 56, name: "Trinity", phone: "" },
  { id: 57, name: "Lolo", phone: "", replacedGuest: "Holy" },
  {
    id: 58,
    name: "Millicent",
    phone: "0777338641",
    rsvpStatus: "attending",
    rsvpGuests: 1,
    rsvpSubmittedAt: "2026-10-25T17:00:00.000Z",
  },
  { id: 59, name: "Memory", phone: "" },
  { id: 60, name: "Mr and mrs magandiwa", phone: "", allowedGuests: 2 },
  { id: 61, name: "Aisha", phone: "" },
  { id: 62, name: "Sindy mnvundla", phone: "" },
  { id: 63, name: "Irene Ncube", phone: "" },
  { id: 64, name: "Lilian", phone: "" },
  { id: 65, name: "Mr and Mrs marambidze", phone: "", allowedGuests: 2 },
  { id: 66, name: "Jordan", phone: "" },
  { id: 67, name: "Thabo", phone: "" },
  {
    id: 68,
    name: "Mr and Mrs Mangena",
    phone: "",
    allowedGuests: 2,
    replacedGuest: "Mihla",
  },
  { id: 69, name: "Jamie", phone: "" },
  { id: 70, name: "Lattie", phone: "" },
  { id: 71, name: "Sbonakele", phone: "" },
  {
    id: 72,
    name: "Mrs Dube",
    phone: "",
    allowedGuests: 1,
    replacedGuest: "Bleh & Mrs dube",
  },
  { id: 73, name: "Keith", phone: "" },
  { id: 74, name: "Princess", phone: "" },
  { id: 75, name: "Timothy", phone: "", replacedGuest: "Sindy Mabuza" },
  { id: 76, name: "Mrs Moyo", phone: "" },
  {
    id: 77,
    name: "Rejoice",
    phone: "+27655472319",
    rsvpStatus: "attending",
    rsvpGuests: 1,
    rsvpNotes: "Wishing you all the best in your marriage",
    rsvpSubmittedAt: "2026-10-26T10:30:00.000Z",
  },
  { id: 78, name: "Novuyo", phone: "" },
  { id: 79, name: "Kim", phone: "" },
  { id: 80, name: "Melody", phone: "" },
  { id: 81, name: "Mrs Velani", phone: "" },
  { id: 82, name: "Mitchell khanyile", phone: "" },
  { id: 83, name: "Naskhu", phone: "" },
  { id: 84, name: "Smilo", phone: "" },
  { id: 85, name: "Maggie", phone: "" },
  { id: 86, name: "Nonhlanhla", phone: "" },
  {
    id: 87,
    name: "Mr & Mrs Sibanda",
    phone: "",
    allowedGuests: 2,
    aliases: ["Mr & Mrs B Sibanda", "B Sibanda"],
  },
  { id: 88, name: "Suzan", phone: "" },
  { id: 89, name: "Ethel", phone: "" },
  { id: 90, name: "Melissa", phone: "" },
  { id: 91, name: "Shinel", phone: "" },
  { id: 92, name: "Orlando", phone: "" },
  { id: 93, name: "Madli", phone: "" },
  {
    id: 94,
    name: "Bridget",
    phone: "0779851688",
    rsvpStatus: "attending",
    rsvpGuests: 1,
    rsvpSubmittedAt: "2026-10-25T19:00:00.000Z",
  },
  { id: 95, name: "Nomazulu", phone: "" },
];

// Keep backwards-compatible export
export const GUEST_LIST: GuestEntry[] = DEFAULT_GUEST_LIST;

const STOP_WORDS = new Set([
  'mr',
  'mrs',
  'mr and mrs',
  'and',
  'the',
  'miss',
  'guest',
  'couple',
]);

/**
 * Normalizes a guest name for robust, flexible matching.
 */
export function normalizeGuestName(name: string): string {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[().,\-_'/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes a phone number so that "078 343 7855", "783437855", and "+263783437855"
 * all resolve to the same canonical digits ("783437855") for deduplication and matching.
 */
export function normalizePhone(phone?: string): string {
  if (!phone) return '';
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('263') && digits.length >= 11) {
    digits = digits.slice(3);
  } else if (digits.startsWith('0') && digits.length >= 9) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * Formats a phone number cleanly as text so Google Sheets doesn't strip leading zeros.
 */
export function formatDisplayPhone(phone?: string): string {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  if (/^[789]\d{7,8}$/.test(trimmed)) {
    return '0' + trimmed;
  }
  return trimmed;
}

/**
 * Returns the active guest list, merging the default 95-guest list with any
 * host/admin edits stored in localStorage or synced from Google Sheets.
 */
export function getActiveGuestList(): GuestEntry[] {
  if (typeof window === 'undefined') return DEFAULT_GUEST_LIST;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GUESTS);
    if (!raw) return DEFAULT_GUEST_LIST;
    const saved: GuestEntry[] = JSON.parse(raw);
    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
  } catch (err) {
    console.warn('Could not read saved guest list:', err);
  }
  return DEFAULT_GUEST_LIST;
}

/**
 * Persists the updated guest list locally and dispatches an event so all components update.
 */
export function saveActiveGuestListLocal(list: GuestEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('ns-guest-list-updated'));
  } catch (err) {
    console.warn('Could not save guest list to localStorage:', err);
  }
}

/**
 * Computes Levenshtein edit distance between two strings.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }

  return d[m][n];
}

/**
 * Intelligent search suggestions while typing.
 */
export function smartMatchGuests(
  query: string,
  limit = 4,
  customList?: GuestEntry[]
): GuestEntry[] {
  const q = normalizeGuestName(query);
  if (!q || q.length < 2 || STOP_WORDS.has(q)) return [];

  const list = customList || getActiveGuestList();
  const candidates: { guest: GuestEntry; score: number }[] = [];

  for (const guest of list) {
    const raw = normalizeGuestName(guest.name);
    const noParens = normalizeGuestName(guest.name.replace(/\(.*?\)/g, ''));
    const withoutTitles = noParens.replace(
      /^(mr and mrs|mr & mrs|mr|mrs)\s+/,
      ''
    );
    const tokens = noParens
      .split(' ')
      .filter((t) => !STOP_WORDS.has(t) && t.length > 1);

    let score = 0;

    if (raw === q || noParens === q || withoutTitles === q) {
      score = 100;
    } else if (raw.startsWith(q) || withoutTitles.startsWith(q)) {
      score = 90;
    } else if (tokens.some((t) => t === q)) {
      score = 85;
    } else if (tokens.some((t) => t.startsWith(q))) {
      score = 80;
    } else {
      // Check aliases if present
      if (guest.aliases) {
        for (const alias of guest.aliases) {
          const normAlias = normalizeGuestName(alias);
          if (normAlias === q || normAlias.includes(q)) {
            score = Math.max(score, 88);
          }
        }
      }
      // Check cultural prefix 'na'
      for (const t of tokens) {
        if (t.startsWith('na') && t.length > 4) {
          const root = t.slice(2);
          if (root === q) score = Math.max(score, 90);
          else if (root.startsWith(q)) score = Math.max(score, 80);
        }
      }
      // Levenshtein typo tolerance on words
      for (const t of [withoutTitles, ...tokens]) {
        if (!t) continue;
        const dist = levenshtein(q, t);
        const maxLen = Math.max(q.length, t.length);
        const sim = 1 - dist / maxLen;
        if (dist <= 1 || (dist <= 2 && maxLen >= 6)) {
          score = Math.max(score, Math.round(sim * 75));
        }
      }
    }

    if (score >= 50) {
      candidates.push({ guest, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, limit).map((c) => c.guest);
}

/**
 * STRICT Verification: Verifies whether an input name belongs to the invited guests.
 * Rejects bogus text, numbers, generic titles, and uninvited names.
 */
export function verifyGuestName(
  input: string,
  customList?: GuestEntry[]
): {
  isVerified: boolean;
  matchedGuest?: GuestEntry;
} {
  const q = normalizeGuestName(input);
  if (!q || q.length < 3) return { isVerified: false };
  if (STOP_WORDS.has(q)) return { isVerified: false };

  const list = customList || getActiveGuestList();

  for (const guest of list) {
    const raw = normalizeGuestName(guest.name);
    const noParens = normalizeGuestName(guest.name.replace(/\(.*?\)/g, ''));
    const withoutTitles = noParens.replace(
      /^(mr and mrs|mr & mrs|mr|mrs)\s+/,
      ''
    );

    // 1. Full name match
    if (q === raw || q === noParens || q === withoutTitles) {
      return { isVerified: true, matchedGuest: guest };
    }

    // 2. Alias match
    if (guest.aliases) {
      for (const alias of guest.aliases) {
        const normAlias = normalizeGuestName(alias);
        if (q === normAlias) {
          return { isVerified: true, matchedGuest: guest };
        }
      }
    }

    // 3. Individual name tokens (First name or Last name, at least 3 chars)
    const tokens = noParens
      .split(' ')
      .filter((t) => !STOP_WORDS.has(t) && t.length >= 3);
    for (const t of tokens) {
      if (t === q) {
        return { isVerified: true, matchedGuest: guest };
      }
      // Cultural root: naAgrippah -> Agrippah, Narhoda -> Rhoda
      if (t.startsWith('na') && t.length > 4 && t.slice(2) === q) {
        return { isVerified: true, matchedGuest: guest };
      }
      if (t.startsWith('no') && t.length > 4 && t.slice(2) === q) {
        return { isVerified: true, matchedGuest: guest };
      }
    }
  }

  return { isVerified: false };
}

/**
 * Deduplicates RSVP submissions by matching normalized guest name OR normalized phone.
 * Keeps the most recent submission for each unique guest while preserving any non-empty notes.
 */
export function deduplicateRsvpSubmissions(
  rows: RsvpSubmission[]
): {
  deduplicated: RsvpSubmission[];
  duplicatesRemoved: number;
} {
  const byKey = new Map<string, RsvpSubmission>();
  const phoneToKey = new Map<string, string>();
  let duplicatesRemoved = 0;

  for (const row of rows) {
    const normName = normalizeGuestName(row.name);
    const normPhone = normalizePhone(row.phone);
    if (!normName && !normPhone) continue;

    // Determine canonical key by name or phone
    let key = normName ? `name:${normName}` : `phone:${normPhone}`;
    if (normPhone && phoneToKey.has(normPhone)) {
      key = phoneToKey.get(normPhone)!;
    } else if (byKey.has(key) && normPhone) {
      phoneToKey.set(normPhone, key);
    } else if (normPhone) {
      phoneToKey.set(normPhone, key);
    }

    const existing = byKey.get(key);
    if (existing) {
      duplicatesRemoved++;
      const mergedNotes =
        row.notes && String(row.notes).trim()
          ? String(row.notes).trim()
          : existing.notes || '';
      const mergedPhone = formatDisplayPhone(row.phone || existing.phone);
      byKey.set(key, {
        ...existing,
        ...row,
        phone: mergedPhone,
        notes: mergedNotes,
      });
    } else {
      byKey.set(key, {
        ...row,
        phone: formatDisplayPhone(row.phone),
      });
    }
  }

  return {
    deduplicated: Array.from(byKey.values()),
    duplicatesRemoved,
  };
}

/**
 * Checks if a guest was just submitted from this device within the last 60 seconds
 * with the exact same values (prevents accidental double/triple taps like Brillient's 10 rows).
 */
export function isDuplicateRapidSubmission(payload: {
  name: string;
  phone: string;
  attendance: string;
  guests: string;
  notes: string;
}): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_SUBMIT);
    if (!raw) return false;
    const last = JSON.parse(raw);
    const samePerson =
      normalizeGuestName(last.name) === normalizeGuestName(payload.name) ||
      (normalizePhone(last.phone) &&
        normalizePhone(last.phone) === normalizePhone(payload.phone));
    const sameChoice =
      last.attendance === payload.attendance &&
      String(last.guests) === String(payload.guests) &&
      String(last.notes || '').trim() === String(payload.notes || '').trim();
    const withinWindow = Date.now() - (last.timestamp || 0) < 60_000;
    return Boolean(samePerson && sameChoice && withinWindow);
  } catch {
    return false;
  }
}

/**
 * Records an RSVP submission locally onto the active guest list and sends an upsert
 * command to Google Sheets (which updates the existing row in place and cleans duplicates).
 */
export async function submitGuestRsvp(payload: {
  name: string;
  phone: string;
  attendance: string;
  guests: string;
  notes: string;
}): Promise<{ skippedDuplicate: boolean }> {
  const formattedPhone = formatDisplayPhone(payload.phone);
  const submittedAt = new Date().toISOString();

  // 1. Update local guest list state immediately so the UI & Admin Portal reflect the RSVP
  const list = getActiveGuestList();
  const verification = verifyGuestName(payload.name, list);
  const normInputPhone = normalizePhone(formattedPhone);

  const updatedList = list.map((g) => {
    const isMatch =
      (verification.matchedGuest && verification.matchedGuest.id === g.id) ||
      normalizeGuestName(g.name) === normalizeGuestName(payload.name) ||
      (normInputPhone && normalizePhone(g.phone) === normInputPhone);

    if (!isMatch) return g;
    return {
      ...g,
      phone: formattedPhone || g.phone,
      rsvpStatus: (payload.attendance === 'declining'
        ? 'declining'
        : 'attending') as 'attending' | 'declining',
      rsvpGuests: Number(payload.guests) || 1,
      rsvpNotes: payload.notes?.trim() || g.rsvpNotes || '',
      rsvpSubmittedAt: submittedAt,
    };
  });
  saveActiveGuestListLocal(updatedList);

  // 2. Check if this exact same payload was already sent in the last 60 seconds
  if (isDuplicateRapidSubmission(payload)) {
    return { skippedDuplicate: true };
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      STORAGE_KEY_LAST_SUBMIT,
      JSON.stringify({ ...payload, timestamp: Date.now() })
    );
  }

  // 3. Send to Google Apps Script endpoint with action=upsertRsvp (backwards-compatible with old script too)
  if (RSVP_ENDPOINT) {
    try {
      await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          action: 'upsertRsvp',
          deduplicate: 'true',
          name: verification.matchedGuest?.name || payload.name,
          phone: formattedPhone,
          attendance: payload.attendance,
          guests: payload.guests,
          notes: payload.notes,
          submittedAt,
        }),
      });
    } catch (err) {
      console.error('RSVP submission network error:', err);
    }
  }

  return { skippedDuplicate: false };
}

/**
 * Syncs with Google Sheets (reads live GuestList + deduplicated RSVPs from Apps Script if supported).
 */
export async function syncWithGoogleSheets(): Promise<{
  guests: GuestEntry[];
  syncedFromCloud: boolean;
  duplicatesRemoved?: number;
}> {
  const localList = getActiveGuestList();

  if (!RSVP_ENDPOINT) {
    return { guests: localList, syncedFromCloud: false };
  }

  try {
    const res = await fetch(`${RSVP_ENDPOINT}?action=getState&t=${Date.now()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (Array.isArray(data.guestList) || Array.isArray(data.rsvps))) {
        let baseList: GuestEntry[] =
          Array.isArray(data.guestList) && data.guestList.length > 0
            ? data.guestList
            : localList;

        // Merge live RSVPs from Sheet1 (after deduplicating)
        let duplicatesRemoved = Number(data.duplicatesRemoved || 0);
        if (Array.isArray(data.rsvps)) {
          const { deduplicated, duplicatesRemoved: localDups } =
            deduplicateRsvpSubmissions(data.rsvps);
          duplicatesRemoved += localDups;

          baseList = baseList.map((guest) => {
            const normGName = normalizeGuestName(guest.name);
            const normGPhone = normalizePhone(guest.phone);
            const match = deduplicated.find((r) => {
              const rName = normalizeGuestName(r.name);
              const rPhone = normalizePhone(r.phone);
              if (rName && rName === normGName) return true;
              if (normGPhone && rPhone && normGPhone === rPhone) return true;
              const verified = verifyGuestName(r.name, [guest]);
              return verified.isVerified;
            });

            if (!match) return guest;
            return {
              ...guest,
              phone: formatDisplayPhone(match.phone || guest.phone),
              rsvpStatus:
                String(match.attendance).toLowerCase() === 'declining'
                  ? 'declining'
                  : 'attending',
              rsvpGuests: Number(match.guests) || guest.allowedGuests || 1,
              rsvpNotes: match.notes || guest.rsvpNotes || '',
              rsvpSubmittedAt: match.submittedAt || guest.rsvpSubmittedAt,
            };
          });
        }

        saveActiveGuestListLocal(baseList);
        return {
          guests: baseList,
          syncedFromCloud: true,
          duplicatesRemoved,
        };
      }
    }
  } catch {
    // Expected if Apps Script hasn't been upgraded with doGet yet
  }

  return { guests: localList, syncedFromCloud: false };
}

/**
 * Pushes an admin action (replace guest, update guest, save full list, or deduplicate sheet)
 * to the Google Apps Script backend while immediately saving locally.
 */
export async function pushAdminUpdateToGoogleSheets(
  action: 'saveGuestList' | 'replaceGuest' | 'updateGuest' | 'deduplicateSheet',
  updatedList: GuestEntry[],
  extraParams: Record<string, string> = {}
): Promise<boolean> {
  saveActiveGuestListLocal(updatedList);
  if (!RSVP_ENDPOINT) return false;

  try {
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams({
        action,
        guestListJson: JSON.stringify(updatedList),
        ...extraParams,
      }),
    });
    return true;
  } catch (err) {
    console.warn('Could not push admin update to Google Sheets:', err);
    return false;
  }
}
