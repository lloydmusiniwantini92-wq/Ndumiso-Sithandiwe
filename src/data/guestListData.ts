export type GuestSide = 'BRIDE' | 'BRIDEGROOM';

export interface GuestEntry {
  id: number;
  name: string;
  side: GuestSide;
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
  side?: GuestSide | string;
  guestId?: number | string;
}

export const RSVP_ENDPOINT =
  (import.meta as any).env?.VITE_RSVP_ENDPOINT ||
  'https://script.google.com/macros/s/AKfycbyTGxdmSFL2N5hEisMyTjgGQ_aOcr06TKavP-PwevV8zwnHN6A-j8nVyk-3Vn3_rugSSA/exec';

export const GOOGLE_SHEET_ID = '1dOiZFMm1UoLp13-WFpOcxvNiNKFmLdfT4eqal-CvkXM';

const STORAGE_KEY_GUESTS_V2 = 'ns_wedding_guest_list_v2';
const STORAGE_KEY_GUESTS = 'ns_wedding_guest_list_v3';
const STORAGE_KEY_RSVPS = 'ns_wedding_rsvp_records_v3';
const STORAGE_KEY_LAST_SUBMIT = 'ns_wedding_last_submit_v3';

/**
 * BRIDE'S SIDE (Sithandiwe Sibanda) — 95 Invitations (#1 to #95)
 * Includes all pre-existing RSVPs, phone numbers (including recovered #ERROR! phones),
 * headcounts, dietary notes, and heartfelt wishes from the Google Sheet.
 */
export const BRIDE_GUEST_LIST: GuestEntry[] = [
  {
    id: 1,
    name: 'Peter Mpofu',
    side: 'BRIDE',
    phone: '0772000000',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T15:00:00.000Z',
  },
  {
    id: 2,
    name: 'NaNgcuu',
    side: 'BRIDE',
    phone: '0772453257',
    aliases: ['0712351321'],
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'Low fat',
    rsvpSubmittedAt: '2026-10-28T16:00:00.000Z',
  },
  { id: 3, name: 'Julie', side: 'BRIDE', phone: '0777727681' },
  { id: 4, name: 'NaMishie', side: 'BRIDE', phone: '0772322925' },
  { id: 5, name: 'NaKieth', side: 'BRIDE', phone: '0718487145' },
  {
    id: 6,
    name: 'Mr and Mrs Sibanda',
    side: 'BRIDE',
    phone: '0718648131',
    allowedGuests: 2,
    aliases: ['Mr and Mrs Sibanda (bridesparents)', 'Bridesparents'],
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpNotes: 'Diabetic no to broiler',
    rsvpSubmittedAt: '2026-10-24T21:30:00.000Z',
  },
  { id: 7, name: 'naAgrippah', side: 'BRIDE', phone: '0775182678' },
  {
    id: 8,
    name: 'Mr and Mrs Dube',
    side: 'BRIDE',
    phone: '0773430508',
    allowedGuests: 2,
  },
  {
    id: 9,
    name: 'Busi Mpofu',
    side: 'BRIDE',
    phone: '0772408809',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes:
      'Wishing you both a lifetime of love,laughter and happiness. So excited to celebrate with you ❤️🙏',
    rsvpSubmittedAt: '2026-10-24T20:30:00.000Z',
  },
  { id: 10, name: 'Sphiwe Dube', side: 'BRIDE', phone: '0772208022' },
  {
    id: 11,
    name: 'Patie',
    side: 'BRIDE',
    phone: '0774881323',
    aliases: ['0772618114'],
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'Nil',
    rsvpSubmittedAt: '2026-10-24T21:00:00.000Z',
  },
  {
    id: 12,
    name: 'Judie',
    side: 'BRIDE',
    phone: '07717129701',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T05:30:00.000Z',
  },
  { id: 13, name: 'NoNtoe', side: 'BRIDE', phone: '0772377341' },
  {
    id: 14,
    name: 'Brillient',
    side: 'BRIDE',
    phone: '0783437855',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T15:31:02.875Z',
  },
  {
    id: 15,
    name: 'Thulie',
    side: 'BRIDE',
    phone: '0787224019',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T09:30:00.000Z',
  },
  {
    id: 16,
    name: 'naPrim',
    side: 'BRIDE',
    phone: '0773486710',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'Wishing you joyous wedding day',
    rsvpSubmittedAt: '2026-10-25T15:10:00.000Z',
  },
  {
    id: 17,
    name: 'Tendai Mateke',
    side: 'BRIDE',
    phone: '0772857416',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-11-04T19:00:00.000Z',
  },
  {
    id: 18,
    name: 'Melina Moyo',
    side: 'BRIDE',
    phone: '0773259634',
    aliases: ['0713386780'],
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-24T20:10:00.000Z',
  },
  {
    id: 19,
    name: 'Opah Magidi',
    side: 'BRIDE',
    phone: '0712292088',
    allowedGuests: 2,
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpNotes: 'Broccoli and cauliflower',
    rsvpSubmittedAt: '2026-10-26T10:00:00.000Z',
  },
  {
    id: 20,
    name: 'naJeco',
    side: 'BRIDE',
    phone: '09781944796',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'Pork allergy',
    rsvpSubmittedAt: '2026-10-25T08:00:00.000Z',
  },
  {
    id: 21,
    name: 'naNdue',
    side: 'BRIDE',
    phone: '0772344295',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-29T07:00:00.000Z',
  },
  {
    id: 22,
    name: 'Nomusa',
    side: 'BRIDE',
    phone: '0787250423',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: "I'm alegic with fizzies",
    rsvpSubmittedAt: '2026-10-25T05:00:00.000Z',
  },
  {
    id: 23,
    name: 'Sukoluhle',
    side: 'BRIDE',
    phone: '0775815539',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'No spices',
    rsvpSubmittedAt: '2026-10-25T16:00:00.000Z',
  },
  { id: 24, name: 'Nkululeko', side: 'BRIDE', phone: '0786313924' },
  { id: 25, name: 'Ntobeko', side: 'BRIDE', phone: '0772230282' },
  { id: 26, name: 'Dumo', side: 'BRIDE', phone: '0774088717' },
  {
    id: 27,
    name: 'Lindani',
    side: 'BRIDE',
    phone: '0776240867',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'Absolutely no sea food of any kind',
    rsvpSubmittedAt: '2026-10-26T12:00:00.000Z',
  },
  {
    id: 28,
    name: 'Onesimo',
    side: 'BRIDE',
    phone: '0784067800',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes:
      'Thank you for the invitation may the good lord richly bless the day and the union',
    rsvpSubmittedAt: '2026-10-25T08:30:00.000Z',
  },
  {
    id: 29,
    name: 'Pinkie',
    side: 'BRIDE',
    phone: '0784265871',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes:
      "Dietary >Don't take soft drinks | Note for the couple > Wishing you the best years to come",
    rsvpSubmittedAt: '2026-10-24T20:00:00.000Z',
  },
  {
    id: 30,
    name: 'Faith',
    side: 'BRIDE',
    phone: '0775825043',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'May your marriage be beautiful as your love story',
    rsvpSubmittedAt: '2026-10-24T20:15:00.000Z',
  },
  { id: 31, name: 'Boneni', side: 'BRIDE', phone: '0787818364' },
  {
    id: 32,
    name: 'Mhlobo',
    side: 'BRIDE',
    phone: '0779992013',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes:
      "To the Beautiful Couple 🥂🤍 May your union be blessed with a lifetime of love, peace, prosperity, and unwavering commitment. May God remain the foundation of your home and may your love grow. Here's to a beautiful marriage, a blessed home, and a lifetime of choosing each other💗 Ngilithanda kabi my favourite people",
    rsvpSubmittedAt: '2026-10-24T16:00:00.000Z',
  },
  {
    id: 33,
    name: 'Ntombie',
    side: 'BRIDE',
    phone: '0716580573',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: "Here's to love,laughter, and happily ever after!",
    rsvpSubmittedAt: '2026-10-24T20:20:00.000Z',
  },
  { id: 34, name: 'Sabheki', side: 'BRIDE', phone: '0784057457' },
  { id: 35, name: 'Narhoda', side: 'BRIDE', phone: '0715797654' },
  {
    id: 36,
    name: 'Mr and Mrs Bango',
    side: 'BRIDE',
    phone: '+44 7368 252393',
    allowedGuests: 2,
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpSubmittedAt: '2026-10-30T12:00:00.000Z',
  },
  { id: 37, name: 'Manotsha', side: 'BRIDE', phone: '0718395688' },
  {
    id: 38,
    name: 'Mr and Mrs Baron',
    side: 'BRIDE',
    phone: '+358 76834666',
    allowedGuests: 2,
  },
  {
    id: 39,
    name: 'Mr and Mrs Sibanda',
    side: 'BRIDE',
    phone: '0772383605',
    allowedGuests: 2,
    aliases: ['Mr and Mrs Kusa Sibanda', 'Kusa Sibanda'],
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpNotes: 'None',
    rsvpSubmittedAt: '2026-10-27T08:00:00.000Z',
  },
  {
    id: 40,
    name: 'Abie',
    side: 'BRIDE',
    phone: '0774139844',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T20:00:00.000Z',
  },
  { id: 41, name: 'Israel', side: 'BRIDE', phone: '+44 7789 814159' },
  {
    id: 42,
    name: 'Mr and Mrs Mpofu',
    side: 'BRIDE',
    phone: '0777742198',
    allowedGuests: 2,
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpNotes: 'May God guide your marriage',
    rsvpSubmittedAt: '2026-10-25T06:00:00.000Z',
  },
  { id: 43, name: 'Butho', side: 'BRIDE', phone: '078477483' },
  { id: 44, name: 'Ruth', side: 'BRIDE', phone: '' },
  {
    id: 45,
    name: 'Mr and Mrs Ncube',
    side: 'BRIDE',
    phone: '+44 7861 31350',
    allowedGuests: 2,
    aliases: ['+44 7903 228760', 'Mr & Mrs Ncube'],
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpNotes: 'Nkosiyami waze wayenza intando yakho',
    rsvpSubmittedAt: '2026-10-24T17:00:00.000Z',
  },
  {
    id: 46,
    name: 'Mamo',
    side: 'BRIDE',
    phone: '+44 7578 875689',
    allowedGuests: 2,
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpSubmittedAt: '2026-10-24T17:30:00.000Z',
  },
  {
    id: 47,
    name: 'Prince',
    side: 'BRIDE',
    phone: '07886131350',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-27T19:00:00.000Z',
  },
  { id: 48, name: 'Gracious', side: 'BRIDE', phone: '' },
  { id: 49, name: 'Welly', side: 'BRIDE', phone: '0780589134' },
  { id: 50, name: 'Samantha', side: 'BRIDE', phone: '' },
  {
    id: 51,
    name: 'Josphine',
    side: 'BRIDE',
    phone: '077272841',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T15:05:00.000Z',
  },
  { id: 52, name: 'Mduduzi', side: 'BRIDE', phone: '' },
  {
    id: 53,
    name: 'Mr & Mrs Bajila',
    side: 'BRIDE',
    phone: '',
    allowedGuests: 2,
  },
  {
    id: 54,
    name: 'Privilege',
    side: 'BRIDE',
    phone: '0788142413',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T17:15:00.000Z',
  },
  {
    id: 55,
    name: 'Joana',
    side: 'BRIDE',
    phone: '0781033881',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-22T15:00:00.000Z',
  },
  {
    id: 56,
    name: 'Trinity',
    side: 'BRIDE',
    phone: '0786966273',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'May God sustain you😘',
    rsvpSubmittedAt: '2026-10-22T17:00:00.000Z',
  },
  { id: 57, name: 'Lolo', side: 'BRIDE', phone: '', replacedGuest: 'Holy' },
  {
    id: 58,
    name: 'Millicent',
    side: 'BRIDE',
    phone: '0777338641',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T17:00:00.000Z',
  },
  { id: 59, name: 'Memory', side: 'BRIDE', phone: '' },
  {
    id: 60,
    name: 'Mr and mrs magandiwa',
    side: 'BRIDE',
    phone: '0771479140',
    allowedGuests: 2,
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpNotes: 'I love the couple so much',
    rsvpSubmittedAt: '2026-10-24T13:00:00.000Z',
  },
  { id: 61, name: 'Aisha', side: 'BRIDE', phone: '' },
  { id: 62, name: 'Sindy mnvundla', side: 'BRIDE', phone: '' },
  { id: 63, name: 'Irene Ncube', side: 'BRIDE', phone: '' },
  { id: 64, name: 'Lilian', side: 'BRIDE', phone: '' },
  {
    id: 65,
    name: 'Mr and Mrs marambidze',
    side: 'BRIDE',
    phone: '',
    allowedGuests: 2,
  },
  { id: 66, name: 'Jordan', side: 'BRIDE', phone: '' },
  { id: 67, name: 'Thabo', side: 'BRIDE', phone: '' },
  {
    id: 68,
    name: 'Mr and Mrs Mangena',
    side: 'BRIDE',
    phone: '',
    allowedGuests: 2,
    replacedGuest: 'Mihla',
  },
  { id: 69, name: 'Jamie', side: 'BRIDE', phone: '' },
  { id: 70, name: 'Lattie', side: 'BRIDE', phone: '' },
  { id: 71, name: 'Sbonakele', side: 'BRIDE', phone: '' },
  {
    id: 72,
    name: 'Mrs Dube',
    side: 'BRIDE',
    phone: '0774916089',
    allowedGuests: 1,
    replacedGuest: 'Bleh & Mrs dube',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes:
      'Wishing you endless happiness on the new journey you are about to embark on 😊',
    rsvpSubmittedAt: '2026-10-26T18:00:00.000Z',
  },
  { id: 73, name: 'Keith', side: 'BRIDE', phone: '' },
  { id: 74, name: 'Princess', side: 'BRIDE', phone: '' },
  {
    id: 75,
    name: 'Timothy',
    side: 'BRIDE',
    phone: '',
    replacedGuest: 'Sindy Mabuza',
  },
  { id: 76, name: 'Mrs Moyo', side: 'BRIDE', phone: '' },
  {
    id: 77,
    name: 'Rejoice',
    side: 'BRIDE',
    phone: '+27655472319',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'Wishing you all the best in your marriage',
    rsvpSubmittedAt: '2026-10-26T10:30:00.000Z',
  },
  {
    id: 78,
    name: 'Novuyo',
    side: 'BRIDE',
    phone: '+264817677970',
    allowedGuests: 2,
    rsvpStatus: 'attending',
    rsvpGuests: 2,
    rsvpSubmittedAt: '2026-10-25T08:05:00.000Z',
  },
  {
    id: 79,
    name: 'Kim',
    side: 'BRIDE',
    phone: '+264817677970',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T08:10:00.000Z',
  },
  {
    id: 80,
    name: 'Melody',
    side: 'BRIDE',
    phone: '0780360941',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T08:20:00.000Z',
  },
  {
    id: 81,
    name: 'Mrs Velani',
    side: 'BRIDE',
    phone: '',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T09:00:00.000Z',
  },
  {
    id: 82,
    name: 'Mitchell khanyile',
    side: 'BRIDE',
    phone: '0784251285',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'May God protect the union.',
    rsvpSubmittedAt: '2026-10-22T17:30:00.000Z',
  },
  { id: 83, name: 'Naskhu', side: 'BRIDE', phone: '' },
  {
    id: 84,
    name: 'Smilo',
    side: 'BRIDE',
    phone: '0776933713',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'I pray this new chapter gives you everlasting happiness',
    rsvpSubmittedAt: '2026-10-25T13:00:00.000Z',
  },
  { id: 85, name: 'Maggie', side: 'BRIDE', phone: '' },
  { id: 86, name: 'Nonhlanhla', side: 'BRIDE', phone: '' },
  {
    id: 87,
    name: 'Mr & Mrs Sibanda',
    side: 'BRIDE',
    phone: '',
    allowedGuests: 2,
    aliases: ['Mr & Mrs B Sibanda', 'B Sibanda'],
  },
  { id: 88, name: 'Suzan', side: 'BRIDE', phone: '' },
  {
    id: 89,
    name: 'Ethel',
    side: 'BRIDE',
    phone: '0772413846',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-11-01T13:00:00.000Z',
  },
  { id: 90, name: 'Melissa', side: 'BRIDE', phone: '' },
  { id: 91, name: 'Shinel', side: 'BRIDE', phone: '' },
  { id: 92, name: 'Orlando', side: 'BRIDE', phone: '' },
  { id: 93, name: 'Madli', side: 'BRIDE', phone: '' },
  {
    id: 94,
    name: 'Bridget',
    side: 'BRIDE',
    phone: '0779851688',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpSubmittedAt: '2026-10-25T19:00:00.000Z',
  },
  {
    id: 95,
    name: 'Nomazulu',
    side: 'BRIDE',
    phone: '0783356313',
    rsvpStatus: 'attending',
    rsvpGuests: 1,
    rsvpNotes: 'Heha linzima🤪',
    rsvpSubmittedAt: '2026-10-25T13:30:00.000Z',
  },
];

/**
 * BRIDEGROOM'S SIDE (Ndumiso Masuku) — 82 Invitations (#96 to #177)
 */
export const BRIDEGROOM_GUEST_LIST: GuestEntry[] = [
  {
    id: 96,
    name: 'Mr G & Mrs I Masuku',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Mr G and Mrs I Masuku', 'Mr & Mrs G Masuku', 'G Masuku', 'I Masuku'],
  },
  {
    id: 97,
    name: 'Mr O and Mrs S Masuku',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Mr O & Mrs S Masuku', 'Mr & Mrs O Masuku', 'O Masuku', 'S Masuku'],
  },
  {
    id: 98,
    name: 'Mr J and Mrs N Masuku',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Mr J & Mrs N Masuku', 'Mr & Mrs J Masuku', 'J Masuku', 'N Masuku'],
  },
  {
    id: 99,
    name: 'Musa Masuku',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 100,
    name: 'Thamdo Masuku',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Thando Masuku', 'Thamdo'],
  },
  {
    id: 101,
    name: 'Delight Chirwa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Delight'],
  },
  {
    id: 102,
    name: 'Aunt Nande',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Nande'],
  },
  {
    id: 103,
    name: 'Sis Noma',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Noma', 'Sister Noma'],
  },
  {
    id: 104,
    name: 'Aunt Sibongile',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Sibongile'],
  },
  {
    id: 105,
    name: 'Atrass Chirwa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Atrass'],
  },
  {
    id: 106,
    name: 'Sithembile Chirwa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Sithembile'],
  },
  {
    id: 107,
    name: 'Junior Chirwa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Junior'],
  },
  {
    id: 108,
    name: 'Hazel Chirwa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Hazel'],
  },
  {
    id: 109,
    name: 'Gogo Manyathi',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Manyathi'],
  },
  {
    id: 110,
    name: 'Innocent Nyathi',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Innocent', 'Nyathi'],
  },
  {
    id: 111,
    name: 'Mthulisi',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 112,
    name: 'Rachel',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 113,
    name: 'Lonas Chirwa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Lonas'],
  },
  {
    id: 114,
    name: 'Novuyo',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 115,
    name: 'Sidumiso',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 116,
    name: 'Vee Chirwa and Wife',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Vee Chirwa', 'Mr and Mrs Vee Chirwa'],
  },
  {
    id: 117,
    name: 'Sis Rose',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Rose', 'Sister Rose'],
  },
  {
    id: 118,
    name: 'Sis Precious',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Precious', 'Sister Precious'],
  },
  {
    id: 119,
    name: 'Thandiwe',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 120,
    name: 'Sis Percy',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Percy', 'Sister Percy'],
  },
  {
    id: 121,
    name: 'Tanaka',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 122,
    name: 'Mr and Mrs Ncube',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Mr & Mrs Ncube (Groom)'],
  },
  {
    id: 123,
    name: 'Mr and Mrs Mushoriwa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Mushoriwa', 'Mr & Mrs Mushoriwa'],
  },
  {
    id: 124,
    name: 'Mr and Mrs A Ndlovu',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['A Ndlovu', 'Mr & Mrs A Ndlovu'],
  },
  {
    id: 125,
    name: 'Mr and Mrs A Ngoma',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['A Ngoma', 'Mr & Mrs A Ngoma', 'Mr and Mrs Ngoma', 'Ngoma'],
  },
  {
    id: 126,
    name: 'Malume Elvis',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Elvis', 'Uncle Elvis'],
  },
  {
    id: 127,
    name: 'Malume Satracy and Natracy',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Satracy and Natracy', 'Malume Satracy', 'Natracy', 'Satracy'],
  },
  {
    id: 128,
    name: 'Tracy',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 129,
    name: 'Thelma',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 130,
    name: 'Shawn',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 131,
    name: 'Mr and Mrs T Ndlovu',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['T Ndlovu', 'Mr & Mrs T Ndlovu'],
  },
  {
    id: 132,
    name: 'Mrs H Murugani',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['H Murugani', 'Mrs Murugani', 'Murugani'],
  },
  {
    id: 133,
    name: 'Mrs E Hove',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['E Hove', 'Mrs Hove', 'Hove'],
  },
  {
    id: 134,
    name: 'Mrs G Dube',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['G Dube'],
  },
  {
    id: 135,
    name: 'Mrs S Ndlovu',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['S Ndlovu'],
  },
  {
    id: 136,
    name: 'Pastor A Moyo',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Pastor Moyo', 'A Moyo'],
  },
  {
    id: 137,
    name: 'Mr and Mrs Tessa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Tessa', 'Mr & Mrs Tessa'],
  },
  {
    id: 138,
    name: 'Mama Mavako',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Mavako', 'Mrs Mavako'],
  },
  {
    id: 139,
    name: 'Mrs Mlilo',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Mlilo'],
  },
  {
    id: 140,
    name: 'Manyoni',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 141,
    name: 'Melissa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 142,
    name: 'Sis Bambe',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Bambe', 'Sister Bambe'],
  },
  {
    id: 143,
    name: 'Evidence',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 144,
    name: 'Miracle',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 145,
    name: 'Bishop P and F Netha',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Bishop Netha', 'P and F Netha', 'Mr and Mrs Netha', 'Netha'],
  },
  {
    id: 146,
    name: 'Mrs N Mabhena',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['N Mabhena', 'Mrs Mabhena', 'Mabhena'],
  },
  {
    id: 147,
    name: 'Mrs I Ndlovu',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['I Ndlovu'],
  },
  {
    id: 148,
    name: 'Khesani and Musa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 2,
    aliases: ['Khesani', 'Musa and Khesani'],
  },
  {
    id: 149,
    name: 'Nqobani Ncube',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Nqobani'],
  },
  {
    id: 150,
    name: 'Awande Moyo',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Awande'],
  },
  {
    id: 151,
    name: 'Walter Moyo',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Walter'],
  },
  {
    id: 152,
    name: 'Shawn Ndlovu',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 153,
    name: 'Ronald Nyatwa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Ronald', 'Nyatwa'],
  },
  {
    id: 154,
    name: 'Zwelakhe Jamela',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Zwelakhe', 'Jamela'],
  },
  {
    id: 155,
    name: 'Iphithanda Masuku',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Iphithanda'],
  },
  {
    id: 156,
    name: 'Nkosizwile Bhebhe',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Nkosizwile', 'Bhebhe'],
  },
  {
    id: 157,
    name: 'Butho Khumalo',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Khumalo'],
  },
  {
    id: 158,
    name: 'Khalifa',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 159,
    name: 'Nkanyiso Moyo',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Nkanyiso'],
  },
  {
    id: 160,
    name: 'Leo J Ndlovu',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Leo Ndlovu', 'Leo'],
  },
  {
    id: 161,
    name: 'Sbuda',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 162,
    name: 'Gugue Helpstars',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Gugue', 'Gugu Helpstars', 'Gugu'],
  },
  {
    id: 163,
    name: 'Grace Helpstars',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Grace'],
  },
  {
    id: 164,
    name: 'Enock Dube',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Enock'],
  },
  {
    id: 165,
    name: 'Sr Nyasha',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Sister Nyasha', 'Nyasha'],
  },
  {
    id: 166,
    name: 'Sr Salome',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Sister Salome', 'Salome'],
  },
  {
    id: 167,
    name: 'Sr Leocardia',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Sister Leocardia', 'Leocardia'],
  },
  {
    id: 168,
    name: 'Mr Mposi',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Mposi'],
  },
  {
    id: 169,
    name: 'Mr Mpala',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Mpala'],
  },
  {
    id: 170,
    name: 'Mr Nkomo',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Nkomo'],
  },
  {
    id: 171,
    name: 'Connie',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 172,
    name: 'Scoe',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 173,
    name: 'Khanyile',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 174,
    name: 'Nhlanhla Masuku',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Nhlanhla'],
  },
  {
    id: 175,
    name: 'Ezra Nyoni',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Ezra', 'Nyoni'],
  },
  {
    id: 176,
    name: 'Lindani Ndlovu',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
  },
  {
    id: 177,
    name: 'Prosper Dube',
    side: 'BRIDEGROOM',
    phone: '',
    allowedGuests: 1,
    aliases: ['Prosper'],
  },
];

export const DEFAULT_GUEST_LIST: GuestEntry[] = [
  ...BRIDE_GUEST_LIST,
  ...BRIDEGROOM_GUEST_LIST,
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
  'ms',
  'guest',
  'couple',
  'wife',
  'aunt',
  'sis',
  'sister',
  'sr',
  'malume',
  'uncle',
  'gogo',
  'pastor',
  'bishop',
  'mama',
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
 * Strips common honorifics/titles from a normalized name.
 */
export function stripHonorifics(normName: string): string {
  return normName
    .replace(
      /^(mr and mrs|mr|mrs|miss|ms|aunt|sis|sister|sr|malume|uncle|gogo|pastor|bishop|mama)\s+/g,
      ''
    )
    .replace(/\s+and\s+wife$/g, '')
    .trim();
}

/**
 * Normalizes a phone number so that "078 343 7855", "783437855", and "+263783437855"
 * all resolve to the same canonical digits ("783437855") for deduplication and matching.
 * Ignores Google Sheets formula errors like "#ERROR!".
 */
export function normalizePhone(phone?: string): string {
  if (!phone) return '';
  const str = String(phone).trim();
  if (str.startsWith('#')) return '';
  let digits = str.replace(/\D/g, '');
  if (!digits || digits.length < 6) return '';
  if (digits.startsWith('263') && digits.length >= 11) {
    digits = digits.slice(3);
  } else if (digits.startsWith('0') && digits.length >= 9) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * Formats a phone number cleanly as text so Google Sheets doesn't strip leading zeros
 * or turn "+44..." into "#ERROR!".
 */
export function formatDisplayPhone(phone?: string): string {
  if (!phone) return '';
  const trimmed = String(phone).trim();
  if (!trimmed || trimmed.startsWith('#')) return '';
  if (/^[789]\d{7,8}$/.test(trimmed)) {
    return '0' + trimmed;
  }
  return trimmed;
}

/**
 * Ensures any saved or cloud guest list always includes both the 95 BRIDE and 82 BRIDEGROOM
 * baseline invitations, while preserving any live RSVPs, phone updates, or standby replacements.
 */
export function mergeGuestListsWithBaseline(
  savedOrCloudList: GuestEntry[] | null | undefined
): GuestEntry[] {
  if (!Array.isArray(savedOrCloudList) || savedOrCloudList.length === 0) {
    return DEFAULT_GUEST_LIST;
  }

  const savedById = new Map<number, GuestEntry>();
  for (const item of savedOrCloudList) {
    if (item && typeof item.id === 'number') {
      savedById.set(item.id, item);
    }
  }

  const merged: GuestEntry[] = DEFAULT_GUEST_LIST.map((baseGuest) => {
    const saved = savedById.get(baseGuest.id);
    const defaultSide: GuestSide =
      baseGuest.side || (baseGuest.id <= 95 ? 'BRIDE' : 'BRIDEGROOM');
    if (!saved) {
      return { ...baseGuest, side: defaultSide };
    }

    const cleanSavedPhone = formatDisplayPhone(saved.phone);
    const cleanBasePhone = formatDisplayPhone(baseGuest.phone);
    const hasSavedRsvp =
      saved.rsvpStatus === 'attending' || saved.rsvpStatus === 'declining';

    return {
      ...baseGuest,
      ...saved,
      side: saved.side || defaultSide,
      name: saved.name || baseGuest.name,
      phone: cleanSavedPhone || cleanBasePhone || '',
      allowedGuests: saved.allowedGuests || baseGuest.allowedGuests || 1,
      aliases: saved.aliases || baseGuest.aliases,
      replacedGuest: saved.replacedGuest || baseGuest.replacedGuest,
      rsvpStatus: hasSavedRsvp
        ? saved.rsvpStatus
        : baseGuest.rsvpStatus || 'pending',
      rsvpGuests: hasSavedRsvp
        ? saved.rsvpGuests || saved.allowedGuests || baseGuest.allowedGuests || 1
        : baseGuest.rsvpGuests,
      rsvpNotes:
        (saved.rsvpNotes && saved.rsvpNotes.trim()) ||
        baseGuest.rsvpNotes ||
        '',
      rsvpSubmittedAt: saved.rsvpSubmittedAt || baseGuest.rsvpSubmittedAt,
    };
  });

  // Also preserve any custom-added guests with id > DEFAULT_GUEST_LIST.length (177)
  const maxBaseId = DEFAULT_GUEST_LIST.length;
  for (const item of savedOrCloudList) {
    if (item && typeof item.id === 'number' && item.id > maxBaseId) {
      merged.push({
        ...item,
        side: item.side || 'BRIDE',
        phone: formatDisplayPhone(item.phone),
      });
    }
  }

  return merged;
}

/**
 * Returns the active guest list, merging the 177-guest baseline (95 Bride + 82 Bridegroom)
 * with any host/admin edits stored in localStorage.
 */
export function getActiveGuestList(): GuestEntry[] {
  if (typeof window === 'undefined') return DEFAULT_GUEST_LIST;
  try {
    const rawV3 = localStorage.getItem(STORAGE_KEY_GUESTS);
    if (rawV3) {
      const parsed = JSON.parse(rawV3);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return mergeGuestListsWithBaseline(parsed);
      }
    }
    // Migrate seamlessly from v2 if present
    const rawV2 = localStorage.getItem(STORAGE_KEY_GUESTS_V2);
    if (rawV2) {
      const parsedV2 = JSON.parse(rawV2);
      if (Array.isArray(parsedV2) && parsedV2.length > 0) {
        const migrated = mergeGuestListsWithBaseline(parsedV2);
        localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(migrated));
        return migrated;
      }
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
    const merged = mergeGuestListsWithBaseline(list);
    localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(merged));
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
 * Intelligent search suggestions while typing, optionally scoped by Family Side (BRIDE / BRIDEGROOM).
 */
export function smartMatchGuests(
  query: string,
  limit = 6,
  customList?: GuestEntry[],
  sideFilter: GuestSide | 'ALL' = 'ALL'
): GuestEntry[] {
  const q = normalizeGuestName(query);
  if (!q || q.length < 2 || STOP_WORDS.has(q)) return [];

  const fullList = customList || getActiveGuestList();
  const list =
    sideFilter === 'ALL'
      ? fullList
      : fullList.filter((g) => g.side === sideFilter);

  const candidates: { guest: GuestEntry; score: number }[] = [];

  for (const guest of list) {
    const raw = normalizeGuestName(guest.name);
    const noParens = normalizeGuestName(guest.name.replace(/\(.*?\)/g, ''));
    const withoutTitles = stripHonorifics(noParens);
    const tokens = noParens
      .split(' ')
      .filter((t) => !STOP_WORDS.has(t) && t.length > 1);

    let score = 0;

    if (raw === q || noParens === q || withoutTitles === q) {
      score = 100;
    } else if (raw.startsWith(q) || withoutTitles.startsWith(q)) {
      score = 92;
    } else if (raw.includes(q) || withoutTitles.includes(q)) {
      score = 88;
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
      // Check cultural prefix 'na' / 'no'
      for (const t of tokens) {
        if ((t.startsWith('na') || t.startsWith('no')) && t.length > 4) {
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
 * Prevents cross-family collisions on shared surnames (Masuku, Chirwa, Ndlovu, Dube, Moyo, Ncube, Sibanda)
 * by requiring either an exact full/stripped/alias match OR an unambiguous token match.
 */
export function verifyGuestName(
  input: string,
  customList?: GuestEntry[],
  sideFilter: GuestSide | 'ALL' = 'ALL',
  selectedGuestId?: number
): {
  isVerified: boolean;
  matchedGuest?: GuestEntry;
  ambiguousMatches?: GuestEntry[];
} {
  const q = normalizeGuestName(input);
  if (!q || q.length < 3) return { isVerified: false };
  if (STOP_WORDS.has(q)) return { isVerified: false };

  const fullList = customList || getActiveGuestList();
  const list =
    sideFilter === 'ALL'
      ? fullList
      : fullList.filter((g) => g.side === sideFilter);

  // 0. If user explicitly clicked a suggestion pill (selectedGuestId) and the name still matches
  if (selectedGuestId) {
    const explicitGuest = fullList.find((g) => g.id === selectedGuestId);
    if (explicitGuest) {
      const explicitRaw = normalizeGuestName(explicitGuest.name);
      const explicitStripped = stripHonorifics(explicitRaw);
      if (q === explicitRaw || q === explicitStripped) {
        return { isVerified: true, matchedGuest: explicitGuest };
      }
    }
  }

  // 1. Exact Full Name, Without-Parens, or Stripped-Honorifics Match
  const exactMatches: GuestEntry[] = [];
  for (const guest of list) {
    const raw = normalizeGuestName(guest.name);
    const noParens = normalizeGuestName(guest.name.replace(/\(.*?\)/g, ''));
    const withoutTitles = stripHonorifics(noParens);

    if (q === raw || q === noParens || (withoutTitles && q === withoutTitles)) {
      exactMatches.push(guest);
      continue;
    }

    if (guest.aliases) {
      for (const alias of guest.aliases) {
        const normAlias = normalizeGuestName(alias);
        if (normAlias && !/^\d+$/.test(normAlias) && q === normAlias) {
          exactMatches.push(guest);
          break;
        }
      }
    }
  }

  if (exactMatches.length === 1) {
    return { isVerified: true, matchedGuest: exactMatches[0] };
  }
  if (exactMatches.length > 1) {
    // E.g. "Novuyo" or "Melissa" or "Mr and Mrs Ncube" when sideFilter === 'ALL'
    return {
      isVerified: true,
      matchedGuest: exactMatches[0],
      ambiguousMatches: exactMatches,
    };
  }

  // 2. Single-token / cultural-root match — ONLY verify if it uniquely matches 1 guest in the active scope
  // (Prevents typing "Masuku" or "Chirwa" or "Ndlovu" from auto-selecting the wrong family member)
  const tokenMatches: GuestEntry[] = [];
  for (const guest of list) {
    const noParens = normalizeGuestName(guest.name.replace(/\(.*?\)/g, ''));
    const tokens = noParens
      .split(' ')
      .filter((t) => !STOP_WORDS.has(t) && t.length >= 3);

    for (const t of tokens) {
      if (t === q) {
        tokenMatches.push(guest);
        break;
      }
      if (
        (t.startsWith('na') || t.startsWith('no')) &&
        t.length > 4 &&
        t.slice(2) === q
      ) {
        tokenMatches.push(guest);
        break;
      }
    }
  }

  if (tokenMatches.length === 1) {
    return { isVerified: true, matchedGuest: tokenMatches[0] };
  }
  if (tokenMatches.length > 1) {
    return {
      isVerified: false,
      ambiguousMatches: tokenMatches,
    };
  }

  return { isVerified: false };
}

/**
 * Deduplicates RSVP submissions by matching (side + normalized guest name) OR normalized phone.
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

    const normSide =
      String(row.side || '').toUpperCase() === 'BRIDEGROOM'
        ? 'BRIDEGROOM'
        : String(row.side || '').toUpperCase() === 'BRIDE'
        ? 'BRIDE'
        : '';

    let key = normName
      ? `name:${normSide ? normSide + ':' : ''}${normName}`
      : `phone:${normPhone}`;

    if (!normSide && normName && byKey.has(`name:BRIDE:${normName}`)) {
      key = `name:BRIDE:${normName}`;
    } else if (
      !normSide &&
      normName &&
      byKey.has(`name:BRIDEGROOM:${normName}`)
    ) {
      key = `name:BRIDEGROOM:${normName}`;
    } else if (normPhone && phoneToKey.has(normPhone)) {
      const existingPhoneKey = phoneToKey.get(normPhone)!;
      const existingEntry = byKey.get(existingPhoneKey);
      // Only merge by phone if it's the same person (or blank name) — note Kim & Novuyo shared a phone on Oct 25!
      if (
        !normName ||
        (existingEntry && normalizeGuestName(existingEntry.name) === normName)
      ) {
        key = existingPhoneKey;
      }
    }

    if (normPhone) {
      phoneToKey.set(normPhone, key);
    }

    const existing = byKey.get(key);
    if (existing) {
      duplicatesRemoved++;
      const mergedNotes =
        row.notes && String(row.notes).trim()
          ? String(row.notes).trim()
          : existing.notes || '';
      const mergedPhone =
        formatDisplayPhone(row.phone) || formatDisplayPhone(existing.phone);
      byKey.set(key, {
        ...existing,
        ...row,
        phone: mergedPhone,
        notes: mergedNotes,
        side: normSide || existing.side,
      });
    } else {
      byKey.set(key, {
        ...row,
        phone: formatDisplayPhone(row.phone),
        side: normSide || row.side,
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
 * with the exact same values (prevents accidental double/triple taps).
 */
export function isDuplicateRapidSubmission(payload: {
  name: string;
  phone: string;
  attendance: string;
  guests: string;
  notes: string;
  side?: GuestSide;
}): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_SUBMIT);
    if (!raw) return false;
    const last = JSON.parse(raw);
    const samePerson =
      (normalizeGuestName(last.name) === normalizeGuestName(payload.name) &&
        (!payload.side || !last.side || last.side === payload.side)) ||
      (normalizePhone(last.phone) &&
        normalizePhone(last.phone) === normalizePhone(payload.phone) &&
        normalizeGuestName(last.name) === normalizeGuestName(payload.name));
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
 * command to Google Sheets (including family side: BRIDE or BRIDEGROOM).
 */
export async function submitGuestRsvp(payload: {
  name: string;
  phone: string;
  attendance: string;
  guests: string;
  notes: string;
  side?: GuestSide;
  guestId?: number;
}): Promise<{ skippedDuplicate: boolean }> {
  const formattedPhone = formatDisplayPhone(payload.phone);
  const submittedAt = new Date().toISOString();

  // 1. Update local guest list state immediately so the UI & Admin Portal reflect the RSVP
  const list = getActiveGuestList();
  const verification = verifyGuestName(
    payload.name,
    list,
    payload.side || 'ALL',
    payload.guestId
  );
  const matchedGuest = verification.matchedGuest;
  const resolvedSide: GuestSide =
    matchedGuest?.side || payload.side || 'BRIDE';
  const normInputPhone = normalizePhone(formattedPhone);

  const updatedList = list.map((g) => {
    const isMatch = matchedGuest
      ? g.id === matchedGuest.id
      : g.side === resolvedSide &&
        (normalizeGuestName(g.name) === normalizeGuestName(payload.name) ||
          (normInputPhone && normalizePhone(g.phone) === normInputPhone));

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
  if (isDuplicateRapidSubmission({ ...payload, side: resolvedSide })) {
    return { skippedDuplicate: true };
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(
      STORAGE_KEY_LAST_SUBMIT,
      JSON.stringify({ ...payload, side: resolvedSide, timestamp: Date.now() })
    );
  }

  // 3. Send to Google Apps Script endpoint with action=upsertRsvp & side=BRIDE|BRIDEGROOM
  if (RSVP_ENDPOINT) {
    try {
      await fetch(RSVP_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          action: 'upsertRsvp',
          deduplicate: 'true',
          guestId: String(matchedGuest?.id || payload.guestId || ''),
          side: resolvedSide,
          name: matchedGuest?.name || payload.name,
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
 * Syncs with Google Sheets (reads live GuestList + deduplicated RSVPs from Apps Script if supported),
 * always preserving the full 177-guest baseline (95 Bride + 82 Bridegroom).
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
        let baseList: GuestEntry[] = mergeGuestListsWithBaseline(
          Array.isArray(data.guestList) && data.guestList.length > 0
            ? data.guestList
            : localList
        );

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
              const rSide = String(r.side || '').toUpperCase();
              if (
                (rSide === 'BRIDE' || rSide === 'BRIDEGROOM') &&
                rSide !== guest.side
              ) {
                return false;
              }
              if (r.guestId && Number(r.guestId) === guest.id) {
                return true;
              }
              const rName = normalizeGuestName(r.name);
              const rPhone = normalizePhone(r.phone);
              if (rName && rName === normGName) {
                // If no side was recorded in an older Sheet1 row, legacy rows (Oct/Nov 2026) belong to BRIDE
                if (!rSide && guest.side === 'BRIDEGROOM') {
                  const existsOnBride = baseList.some(
                    (b) =>
                      b.side === 'BRIDE' &&
                      normalizeGuestName(b.name) === rName
                  );
                  if (existsOnBride) return false;
                }
                return true;
              }
              if (normGPhone && rPhone && normGPhone === rPhone && rName === normGName) {
                return true;
              }
              return false;
            });

            if (!match) return guest;
            return {
              ...guest,
              phone:
                formatDisplayPhone(match.phone) ||
                formatDisplayPhone(guest.phone) ||
                '',
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
 * Pushes an admin action (replace guest, update guest, save full list, or deduplicate & style sheet)
 * to the Google Apps Script backend while immediately saving locally.
 */
export async function pushAdminUpdateToGoogleSheets(
  action:
    | 'saveGuestList'
    | 'replaceGuest'
    | 'updateGuest'
    | 'deduplicateSheet'
    | 'styleAndSyncSheets',
  updatedList: GuestEntry[],
  extraParams: Record<string, string> = {}
): Promise<boolean> {
  const merged = mergeGuestListsWithBaseline(updatedList);
  saveActiveGuestListLocal(merged);
  if (!RSVP_ENDPOINT) return false;

  try {
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: new URLSearchParams({
        action,
        guestListJson: JSON.stringify(merged),
        ...extraParams,
      }),
    });
    return true;
  } catch (err) {
    console.warn('Could not push admin update to Google Sheets:', err);
    return false;
  }
}
