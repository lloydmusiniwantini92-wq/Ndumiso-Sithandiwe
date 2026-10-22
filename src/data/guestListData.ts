export interface GuestEntry {
  id: number;
  name: string;
  phone?: string;
  allowedGuests?: number;
}

export const GUEST_LIST: GuestEntry[] = [
  { id: 1, name: "Peter Mpofu", phone: "" },
  { id: 2, name: "NaNgcuu", phone: "0712351321" },
  { id: 3, name: "Julie", phone: "077727681" },
  { id: 4, name: "NaMishie", phone: "0772322925" },
  { id: 5, name: "NaKieth", phone: "0718487145" },
  { id: 6, name: "Mr and Mrs Sibanda (bridesparents)", phone: "", allowedGuests: 2 },
  { id: 7, name: "naAgrippah", phone: "0775182678" },
  { id: 8, name: "Mr and Mrs Dube", phone: "0773430508", allowedGuests: 2 },
  { id: 9, name: "Busi Mpofu", phone: "0772408809" },
  { id: 10, name: "Sphiwe Dube", phone: "0772208022" },
  { id: 11, name: "Patie", phone: "0772618114" },
  { id: 12, name: "Judie", phone: "07717129701" },
  { id: 13, name: "NoNtoe", phone: "0772377341" },
  { id: 14, name: "Brillient", phone: "0783437855" },
  { id: 15, name: "Thulie", phone: "0787224019" },
  { id: 16, name: "naPrim", phone: "0773486710" },
  { id: 17, name: "Tendai Mateke", phone: "0772857416" },
  { id: 18, name: "Melina Moyo", phone: "0713386780" },
  { id: 19, name: "Opah Magidi", phone: "" },
  { id: 20, name: "naJeco", phone: "9781944796" },
  { id: 21, name: "naNdue", phone: "7723295" },
  { id: 22, name: "Nomusa", phone: "07787250423" },
  { id: 23, name: "Sukoluhle", phone: "0775815539" },
  { id: 24, name: "Nkululeko", phone: "0786313924" },
  { id: 25, name: "Ntobeko", phone: "0772230282" },
  { id: 26, name: "Dumo", phone: "0774088717" },
  { id: 27, name: "Lindani", phone: "0776240867" },
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
  { id: 39, name: "Mr and Mrs Kusa Sibanda", phone: "0772383605", allowedGuests: 2 },
  { id: 40, name: "Abie", phone: "0774139844" },
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
  { id: 53, name: "Privilege", phone: "" },
  { id: 54, name: "Mr & Mrs Bajila", phone: "", allowedGuests: 2 },
  { id: 55, name: "Joana", phone: "" },
  { id: 56, name: "Trinity", phone: "" },
  { id: 57, name: "Holy", phone: "" },
  { id: 58, name: "Millicent", phone: "" },
  { id: 59, name: "Memory", phone: "" },
  { id: 60, name: "Mr and mrs magandiwa", phone: "", allowedGuests: 2 },
  { id: 61, name: "Aisha", phone: "" },
  { id: 62, name: "Sindy mnvundla", phone: "" },
  { id: 63, name: "Irene Ncube", phone: "" },
  { id: 64, name: "Lilian", phone: "" },
  { id: 65, name: "Mr and Mrs marambidze", phone: "", allowedGuests: 2 },
  { id: 66, name: "Jordan", phone: "" },
  { id: 67, name: "Thabo", phone: "" },
  { id: 68, name: "Mihla", phone: "" },
  { id: 69, name: "Jamie", phone: "" },
  { id: 70, name: "Lattie", phone: "" },
  { id: 71, name: "Sbonakele", phone: "" },
  { id: 72, name: "Bleh & Mrs dube", phone: "", allowedGuests: 2 },
  { id: 73, name: "Keith", phone: "" },
  { id: 74, name: "Princess", phone: "" },
  { id: 75, name: "Sindy Mabuza", phone: "" },
  { id: 76, name: "Mrs Moyo", phone: "" },
  { id: 77, name: "Rejoice", phone: "" },
  { id: 78, name: "Novuyo", phone: "" },
  { id: 79, name: "Kim", phone: "" },
  { id: 80, name: "Melody", phone: "" },
  { id: 81, name: "Mrs Velani", phone: "" },
  { id: 82, name: "Mitchell khanyile", phone: "" },
  { id: 83, name: "Naskhu", phone: "" },
  { id: 84, name: "Smilo", phone: "" },
  { id: 85, name: "Maggie", phone: "" },
  { id: 86, name: "Nonhlanhla", phone: "" },
  { id: 87, name: "Mr & Mrs B Sibanda", phone: "", allowedGuests: 2 },
  { id: 88, name: "Suzan", phone: "" },
  { id: 89, name: "Ethel", phone: "" },
  { id: 90, name: "Melissa", phone: "" },
  { id: 91, name: "Shinel", phone: "" },
  { id: 92, name: "Orlando", phone: "" },
  { id: 93, name: "Madli", phone: "" },
  { id: 94, name: "Bridget", phone: "" },
  { id: 95, name: "Nomazulu", phone: "" },
];

/**
 * Normalizes a guest name for robust, flexible matching.
 */
export function normalizeGuestName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[().,\-_'/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts searchable keywords and tokens for a guest name.
 * Handles cultural prefixes like 'na'/'no' and honorifics like 'Mr and Mrs'.
 */
function getKeywords(name: string): string[] {
  const c = normalizeGuestName(name);
  const withoutTitles = c.replace(/^(mr and mrs|mr & mrs|mr|mrs)\s+/, '');
  const tokens = c.split(' ').filter((t) => t.length > 1);
  const withoutTokens = withoutTitles.split(' ').filter((t) => t.length > 1);

  // Cultural root extraction (e.g. naAgrippah -> Agrippah, Narhoda -> Rhoda)
  const culturalRoots: string[] = [];
  for (const t of [...tokens, ...withoutTokens]) {
    if (t.startsWith('na') && t.length > 4) culturalRoots.push(t.slice(2));
    if (t.startsWith('no') && t.length > 4) culturalRoots.push(t.slice(2));
  }

  return Array.from(
    new Set([c, withoutTitles, ...tokens, ...withoutTokens, ...culturalRoots])
  );
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
 * Intelligent fuzzy search for wedding guests.
 * Matches first names, last names, cultural roots, titles, and common typos.
 * Returns up to 3 high-confidence candidate guests.
 */
export function smartMatchGuests(query: string, limit = 3): GuestEntry[] {
  const q = normalizeGuestName(query);
  if (!q || q.length < 2) return [];

  const qTokens = q.split(' ').filter((t) => t.length > 1);
  const candidates: { guest: GuestEntry; score: number }[] = [];

  for (const guest of GUEST_LIST) {
    const keywords = getKeywords(guest.name);
    let bestScore = 0;

    for (const kw of keywords) {
      if (kw === q) {
        bestScore = Math.max(bestScore, 100);
      } else if (kw.startsWith(q)) {
        bestScore = Math.max(bestScore, 90);
      } else if (q.startsWith(kw)) {
        bestScore = Math.max(bestScore, 85);
      } else if (kw.includes(q)) {
        bestScore = Math.max(bestScore, 80);
      } else {
        const dist = levenshtein(q, kw);
        const maxLen = Math.max(q.length, kw.length);
        const sim = 1 - dist / maxLen;
        // Typo tolerance: <= 2 letter edits or >= 60% similarity
        if (dist <= 2 || sim >= 0.6) {
          bestScore = Math.max(bestScore, Math.round(sim * 75));
        }
      }
    }

    // Also match individual words in multi-word queries
    for (const qt of qTokens) {
      for (const kw of keywords) {
        if (kw === qt) bestScore = Math.max(bestScore, 85);
        else if (kw.startsWith(qt)) bestScore = Math.max(bestScore, 75);
      }
    }

    if (bestScore >= 50) {
      candidates.push({ guest, score: bestScore });
    }
  }

  // Sort descending by relevance score
  candidates.sort((a, b) => b.score - a.score);

  return candidates.slice(0, limit).map((c) => c.guest);
}

/**
 * Checks whether an input name is considered a verified match on the guest list.
 */
export function verifyGuestName(input: string): {
  isVerified: boolean;
  matchedGuest?: GuestEntry;
} {
  const clean = normalizeGuestName(input);
  if (!clean || clean.length < 2) return { isVerified: false };

  // 1. Direct or stripped match
  const exact = GUEST_LIST.find((g) => {
    const norm = normalizeGuestName(g.name);
    const withoutParens = normalizeGuestName(g.name.replace(/\(.*?\)/g, ''));
    return norm === clean || withoutParens === clean;
  });
  if (exact) return { isVerified: true, matchedGuest: exact };

  // 2. Keyword exact match (e.g. typing "Peter Mpofu" or "Mr and Mrs Sibanda")
  for (const g of GUEST_LIST) {
    const keywords = getKeywords(g.name);
    if (keywords.includes(clean)) {
      return { isVerified: true, matchedGuest: g };
    }
  }

  return { isVerified: false };
}
