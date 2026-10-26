import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  UserPlus,
  RefreshCw,
  ArrowLeftRight,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Phone,
  Sparkles,
  Download,
  Copy,
  Check,
  X,
  Lock,
  ExternalLink,
  Code2,
} from 'lucide-react';
import {
  GuestEntry,
  DEFAULT_GUEST_LIST,
  getActiveGuestList,
  saveActiveGuestListLocal,
  syncWithGoogleSheets,
  pushAdminUpdateToGoogleSheets,
  formatDisplayPhone,
  GOOGLE_SHEET_ID,
} from '../data/guestListData';
import { UPGRADED_APPS_SCRIPT_CODE } from '../data/appsScriptTemplate';

const ADMIN_PIN_STORAGE_KEY = 'ns_wedding_admin_unlocked_v1';
const VALID_PINS = ['3012', '2026', '1230'];

export const Admin: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [guests, setGuests] = useState<GuestEntry[]>(() =>
    getActiveGuestList()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'attending' | 'declining' | 'pending' | 'replaced'
  >('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [replaceModalGuest, setReplaceModalGuest] =
    useState<GuestEntry | null>(null);
  const [replaceForm, setReplaceForm] = useState({
    newName: '',
    newPhone: '',
    allowedGuests: '1',
  });

  const [editModalGuest, setEditModalGuest] = useState<GuestEntry | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    allowedGuests: '1',
    rsvpStatus: 'pending' as 'pending' | 'attending' | 'declining',
    rsvpGuests: '1',
    rsvpNotes: '',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    phone: '',
    allowedGuests: '1',
  });

  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    if (!isUnlocked) return;
    handleSync(true);
  }, [isUnlocked]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_PINS.includes(pinInput.trim())) {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, 'true');
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSync = async (silent = false) => {
    setIsSyncing(true);
    try {
      const res = await syncWithGoogleSheets();
      setGuests(res.guests);
      if (!silent) {
        if (res.syncedFromCloud) {
          showToast(
            res.duplicatesRemoved
              ? `Synced live with Google Sheets & removed ${res.duplicatesRemoved} duplicate RSVP(s)!`
              : 'Synced live with Google Sheets!'
          );
        } else {
          showToast('Guest list saved & up to date!');
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCleanDuplicatesNow = async () => {
    setIsSyncing(true);
    try {
      await pushAdminUpdateToGoogleSheets('deduplicateSheet', guests, {
        deduplicate: 'true',
      });
      await handleSync(true);
      showToast(
        'Deduplication command sent to Google Sheets & guest list synced!'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Open Standby Replacement Modal
  const openReplaceModal = (guest: GuestEntry) => {
    setReplaceModalGuest(guest);
    setReplaceForm({
      newName: '',
      newPhone: '',
      allowedGuests: String(guest.allowedGuests || 1),
    });
  };

  const submitStandbyReplacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceModalGuest || !replaceForm.newName.trim()) return;

    const oldName = replaceModalGuest.name;
    const newName = replaceForm.newName.trim();
    const newPhone = formatDisplayPhone(replaceForm.newPhone);
    const allowedGuests = Number(replaceForm.allowedGuests) || 1;

    const updatedList = guests.map((g) => {
      if (g.id !== replaceModalGuest.id) return g;
      return {
        ...g,
        name: newName,
        phone: newPhone,
        allowedGuests,
        replacedGuest: g.replacedGuest
          ? `${g.replacedGuest} → ${oldName}`
          : oldName,
        rsvpStatus: 'pending' as const,
        rsvpGuests: undefined,
        rsvpNotes: '',
        rsvpSubmittedAt: undefined,
      };
    });

    setGuests(updatedList);
    setReplaceModalGuest(null);

    await pushAdminUpdateToGoogleSheets('replaceGuest', updatedList, {
      guestId: String(replaceModalGuest.id),
      oldName,
      newName,
      newPhone,
      allowedGuests: String(allowedGuests),
    });

    showToast(
      `Replaced "${oldName}" with standby guest "${newName}". Ready for their RSVP!`
    );
  };

  // Open Edit Modal
  const openEditModal = (guest: GuestEntry) => {
    setEditModalGuest(guest);
    setEditForm({
      name: guest.name,
      phone: guest.phone || '',
      allowedGuests: String(guest.allowedGuests || 1),
      rsvpStatus: guest.rsvpStatus || 'pending',
      rsvpGuests: String(guest.rsvpGuests || guest.allowedGuests || 1),
      rsvpNotes: guest.rsvpNotes || '',
    });
  };

  const submitEditGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalGuest || !editForm.name.trim()) return;

    const updatedName = editForm.name.trim();
    const updatedPhone = formatDisplayPhone(editForm.phone);
    const allowedGuests = Number(editForm.allowedGuests) || 1;

    const updatedList = guests.map((g) => {
      if (g.id !== editModalGuest.id) return g;
      return {
        ...g,
        name: updatedName,
        phone: updatedPhone,
        allowedGuests,
        rsvpStatus: editForm.rsvpStatus,
        rsvpGuests:
          editForm.rsvpStatus === 'attending'
            ? Number(editForm.rsvpGuests) || 1
            : undefined,
        rsvpNotes: editForm.rsvpNotes.trim(),
        rsvpSubmittedAt:
          editForm.rsvpStatus !== 'pending'
            ? g.rsvpSubmittedAt || new Date().toISOString()
            : undefined,
      };
    });

    setGuests(updatedList);
    setEditModalGuest(null);

    await pushAdminUpdateToGoogleSheets('updateGuest', updatedList, {
      guestId: String(editModalGuest.id),
      name: updatedName,
      phone: updatedPhone,
      allowedGuests: String(allowedGuests),
      rsvpStatus: editForm.rsvpStatus,
      rsvpGuests: editForm.rsvpGuests,
      rsvpNotes: editForm.rsvpNotes.trim(),
    });

    showToast(`Updated details for "${updatedName}"!`);
  };

  // Add New Guest
  const submitAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;

    const nextId =
      guests.reduce((max, g) => Math.max(max, g.id), 0) + 1;
    const newGuest: GuestEntry = {
      id: nextId,
      name: addForm.name.trim(),
      phone: formatDisplayPhone(addForm.phone),
      allowedGuests: Number(addForm.allowedGuests) || 1,
      rsvpStatus: 'pending',
    };

    const updatedList = [...guests, newGuest];
    setGuests(updatedList);
    setIsAddModalOpen(false);
    setAddForm({ name: '', phone: '', allowedGuests: '1' });

    await pushAdminUpdateToGoogleSheets('saveGuestList', updatedList);
    showToast(`Added "${newGuest.name}" (#${nextId}) to the guest list!`);
  };

  // Remove Guest
  const handleDeleteGuest = async (guest: GuestEntry) => {
    if (
      !window.confirm(
        `Remove "${guest.name}" from the guest list? (Tip: Use "Replace Guest" if you are swapping in someone on standby.)`
      )
    ) {
      return;
    }
    const updatedList = guests.filter((g) => g.id !== guest.id);
    setGuests(updatedList);
    await pushAdminUpdateToGoogleSheets('saveGuestList', updatedList);
    showToast(`Removed "${guest.name}" from the guest list.`);
  };

  // Export Clean CSV
  const handleExportCsv = () => {
    const headers = [
      'Invite #',
      'Guest Name',
      'Phone / WhatsApp',
      'Max Allowed Guests',
      'RSVP Status',
      'Confirmed Headcount',
      'Dietary / Notes',
      'Replaced Previous Guest',
    ];
    const rows = guests.map((g) => [
      g.id,
      `"${(g.name || '').replace(/"/g, '""')}"`,
      `"${formatDisplayPhone(g.phone)}"`,
      g.allowedGuests || 1,
      g.rsvpStatus || 'pending',
      g.rsvpStatus === 'attending' ? g.rsvpGuests || g.allowedGuests || 1 : 0,
      `"${(g.rsvpNotes || '').replace(/"/g, '""')}"`,
      `"${(g.replacedGuest || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Ndumiso_Sithandiwe_Clean_GuestList_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to latest 30 Dec Final Guestlist baseline
  const handleResetToFinalBaseline = async () => {
    if (
      !window.confirm(
        'Sync local list with the 30 December Final Guestlist baseline while keeping existing RSVPs?'
      )
    ) {
      return;
    }
    saveActiveGuestListLocal(DEFAULT_GUEST_LIST);
    setGuests(DEFAULT_GUEST_LIST);
    await pushAdminUpdateToGoogleSheets('saveGuestList', DEFAULT_GUEST_LIST);
    showToast('Synced with 30 December Final Guestlist!');
  };

  // Computed Stats
  const stats = useMemo(() => {
    let attendingInvites = 0;
    let attendingHeadcount = 0;
    let decliningInvites = 0;
    let pendingInvites = 0;
    let replacedCount = 0;

    for (const g of guests) {
      if (g.replacedGuest) replacedCount++;
      if (g.rsvpStatus === 'attending') {
        attendingInvites++;
        attendingHeadcount += g.rsvpGuests || g.allowedGuests || 1;
      } else if (g.rsvpStatus === 'declining') {
        decliningInvites++;
      } else {
        pendingInvites++;
      }
    }

    return {
      totalInvites: guests.length,
      attendingInvites,
      attendingHeadcount,
      decliningInvites,
      pendingInvites,
      replacedCount,
    };
  }, [guests]);

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return guests.filter((g) => {
      if (statusFilter === 'attending' && g.rsvpStatus !== 'attending')
        return false;
      if (statusFilter === 'declining' && g.rsvpStatus !== 'declining')
        return false;
      if (
        statusFilter === 'pending' &&
        g.rsvpStatus &&
        g.rsvpStatus !== 'pending'
      )
        return false;
      if (statusFilter === 'replaced' && !g.replacedGuest) return false;

      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        (g.phone && g.phone.toLowerCase().includes(q)) ||
        (g.replacedGuest && g.replacedGuest.toLowerCase().includes(q)) ||
        String(g.id) === q
      );
    });
  }, [guests, searchQuery, statusFilter]);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-ink text-paper flex flex-col justify-center items-center px-4 py-20 relative">
        <div className="w-full max-w-md bg-[#111111] border border-[#E8D3B9]/35 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-[#E8D3B9]/15 border border-[#E8D3B9]/40 flex items-center justify-center mx-auto mb-5 text-[#E8D3B9]">
            <Lock className="w-6 h-6" />
          </div>
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#E8D3B9] font-bold block mb-2">
            Ndumiso &amp; Sithandiwe
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl italic font-light text-paper mb-2">
            Host Guest Portal
          </h1>
          <p className="font-sans text-xs text-paper/65 mb-6 leading-relaxed">
            Enter the wedding host PIN to manage guest names, phone numbers, and
            standby replacements directly on the website.
          </p>

          <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              inputMode="numeric"
              placeholder="Enter PIN (3012)"
              value={pinInput}
              onChange={(e) => {
                setPinError(false);
                setPinInput(e.target.value);
              }}
              className="w-full bg-paper/5 border border-paper/20 rounded-xl px-4 py-3.5 text-center text-lg tracking-[0.4em] text-paper placeholder:text-paper/25 placeholder:tracking-normal placeholder:text-xs focus:outline-none focus:border-[#E8D3B9]"
            />
            {pinError && (
              <p className="text-xs text-rose-400">
                Incorrect PIN. Try <strong>3012</strong> (for 30 December).
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#E8D3B9] text-ink font-sans text-xs tracking-[0.3em] uppercase font-bold hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              Unlock Guest Manager
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-paper/10">
            <Link
              to="/rsvp"
              className="font-sans text-[10px] uppercase tracking-[0.25em] text-paper/50 hover:text-[#E8D3B9]"
            >
              &larr; Back to RSVP Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-paper pt-24 pb-20 px-4 sm:px-6 md:px-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-[#E8D3B9] text-ink font-sans text-xs font-semibold shadow-2xl flex items-center gap-2.5 max-w-md w-[92%]"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-[#121212] border border-[#E8D3B9]/25 rounded-3xl p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-2 text-[#E8D3B9] font-sans text-[10px] tracking-[0.35em] uppercase font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Self-Service Host Portal &bull; 30 Dec 2026</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl italic font-light text-paper">
              Guest List &amp; Standby Manager
            </h1>
            <p className="font-sans text-xs text-paper/65 mt-2 max-w-2xl leading-relaxed">
              Edit guest names, add or fix phone numbers, and swap unavailable
              guests with standby replacements without losing any existing
              RSVPs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8D3B9] text-ink font-sans text-[11px] tracking-[0.18em] uppercase font-bold hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Guest</span>
            </button>

            <button
              type="button"
              onClick={handleCleanDuplicatesNow}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-paper/10 border border-[#E8D3B9]/35 text-[#E8D3B9] font-sans text-[11px] tracking-[0.15em] uppercase font-semibold hover:bg-[#E8D3B9]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`}
              />
              <span>Sync &amp; Deduplicate</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-paper/5 border border-paper/15 text-paper/85 font-sans text-[11px] tracking-[0.15em] uppercase hover:border-[#E8D3B9] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Clean Excel/CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsScriptModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 font-sans text-[11px] tracking-[0.15em] uppercase hover:bg-emerald-900/50 transition-all cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Sheet Auto-Clean Script</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="bg-[#121212] border border-paper/10 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-paper/50 text-[10px] font-sans uppercase tracking-widest mb-2">
              <span>Total Invites</span>
              <Users className="w-4 h-4 text-[#E8D3B9]" />
            </div>
            <div className="font-serif text-3xl text-paper">
              {stats.totalInvites}
            </div>
            <div className="text-[11px] text-paper/50 mt-1">
              Invited parties
            </div>
          </div>

          <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-emerald-300/80 text-[10px] font-sans uppercase tracking-widest mb-2">
              <span>Attending</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-serif text-3xl text-emerald-300">
              {stats.attendingInvites}
            </div>
            <div className="text-[11px] text-emerald-200/70 mt-1">
              {stats.attendingHeadcount} total seats confirmed
            </div>
          </div>

          <div className="bg-[#121212] border border-rose-500/30 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-rose-300/80 text-[10px] font-sans uppercase tracking-widest mb-2">
              <span>Declined</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="font-serif text-3xl text-rose-300">
              {stats.decliningInvites}
            </div>
            <div className="text-[11px] text-rose-200/70 mt-1">
              Can swap with standby
            </div>
          </div>

          <div className="bg-[#121212] border border-amber-500/25 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-amber-200/80 text-[10px] font-sans uppercase tracking-widest mb-2">
              <span>Awaiting RSVP</span>
              <Clock className="w-4 h-4 text-amber-300" />
            </div>
            <div className="font-serif text-3xl text-amber-200">
              {stats.pendingInvites}
            </div>
            <div className="text-[11px] text-amber-200/60 mt-1">
              Yet to respond
            </div>
          </div>

          <div className="bg-[#121212] border border-[#E8D3B9]/30 rounded-2xl p-4 sm:p-5 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[#E8D3B9] text-[10px] font-sans uppercase tracking-widest mb-2">
              <span>Standby Swaps</span>
              <ArrowLeftRight className="w-4 h-4 text-[#E8D3B9]" />
            </div>
            <div className="font-serif text-3xl text-[#E8D3B9]">
              {stats.replacedCount}
            </div>
            <div className="text-[11px] text-paper/60 mt-1">
              Replaced slots
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-paper/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guest by name, phone number, or invite #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-paper/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-paper placeholder:text-paper/35 focus:outline-none focus:border-[#E8D3B9]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#141414] border border-paper/10 rounded-2xl p-1.5">
            {(
              [
                { id: 'all', label: `All (${guests.length})` },
                { id: 'attending', label: `Attending (${stats.attendingInvites})` },
                { id: 'declining', label: `Declined (${stats.decliningInvites})` },
                { id: 'pending', label: `Pending (${stats.pendingInvites})` },
                { id: 'replaced', label: `Swapped (${stats.replacedCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl font-sans text-[10.5px] uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#E8D3B9] text-ink font-bold'
                    : 'text-paper/65 hover:text-paper'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guest List Cards / Table (Mobile-First & Desktop Responsive) */}
        <div className="bg-[#121212] border border-paper/15 rounded-3xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-paper/10">
            {filteredGuests.length === 0 ? (
              <div className="p-12 text-center text-paper/50 font-sans text-sm">
                No guests match your search or filter.
              </div>
            ) : (
              filteredGuests.map((guest) => {
                const isAttending = guest.rsvpStatus === 'attending';
                const isDeclining = guest.rsvpStatus === 'declining';

                return (
                  <div
                    key={guest.id}
                    className="p-4 sm:p-5 hover:bg-paper/[0.03] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-paper/5 border border-paper/15 flex items-center justify-center font-sans text-xs text-[#E8D3B9] font-semibold shrink-0 mt-0.5">
                        #{guest.id}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-lg sm:text-xl text-paper font-medium">
                            {guest.name}
                          </h3>

                          {(guest.allowedGuests || 1) > 1 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#E8D3B9]/15 border border-[#E8D3B9]/30 text-[#E8D3B9] font-sans text-[9.5px] uppercase tracking-wider">
                              Couple (2 Seats)
                            </span>
                          )}

                          {isAttending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-sans text-[10px] uppercase tracking-wider font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Attending ({guest.rsvpGuests || 1})
                            </span>
                          )}

                          {isDeclining && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 font-sans text-[10px] uppercase tracking-wider font-semibold">
                              <XCircle className="w-3 h-3" />
                              Declined
                            </span>
                          )}

                          {!isAttending && !isDeclining && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-paper/5 border border-paper/15 text-paper/50 font-sans text-[10px] uppercase tracking-wider">
                              Pending RSVP
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-paper/65 font-sans">
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#E8D3B9]/70" />
                            {guest.phone ? (
                              <span className="text-paper/85">
                                {formatDisplayPhone(guest.phone)}
                              </span>
                            ) : (
                              <span className="text-paper/35 italic">
                                No phone number yet
                              </span>
                            )}
                          </span>

                          {guest.replacedGuest && (
                            <span className="inline-flex items-center gap-1 text-[#E8D3B9]/90 bg-[#E8D3B9]/10 px-2 py-0.5 rounded-md text-[11px]">
                              <ArrowLeftRight className="w-3 h-3" />
                              Replaced: <strong>{guest.replacedGuest}</strong>
                            </span>
                          )}

                          {guest.rsvpNotes && (
                            <span className="text-emerald-200/90 italic">
                              &ldquo;{guest.rsvpNotes}&rdquo;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for Sithandiwe / Host */}
                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                      <button
                        type="button"
                        onClick={() => openReplaceModal(guest)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E8D3B9]/15 border border-[#E8D3B9]/40 text-[#E8D3B9] hover:bg-[#E8D3B9] hover:text-ink font-sans text-[10.5px] uppercase tracking-wider font-semibold transition-all cursor-pointer"
                        title="Swap this person with a standby guest"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>Replace Guest</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(guest)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-paper/5 border border-paper/15 text-paper/85 hover:border-[#E8D3B9] hover:text-[#E8D3B9] font-sans text-[10.5px] uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Name / Phone</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteGuest(guest)}
                        className="p-2 rounded-xl bg-paper/5 border border-paper/10 text-paper/40 hover:text-rose-400 hover:border-rose-500/40 transition-all cursor-pointer"
                        title="Remove guest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-paper/50 font-sans">
          <div className="flex items-center gap-4">
            <Link to="/rsvp" className="hover:text-[#E8D3B9]">
              &larr; Go to Public RSVP Page
            </Link>
            <a
              href={`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#E8D3B9]"
            >
              <span>Open Connected Google Sheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            type="button"
            onClick={handleResetToFinalBaseline}
            className="text-paper/40 hover:text-paper underline cursor-pointer"
          >
            Re-sync 30 Dec Final Guestlist Baseline
          </button>
        </div>
      </div>

      {/* MODAL 1: Replace Guest with Standby */}
      <AnimatePresence>
        {replaceModalGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReplaceModalGuest(null)}
            className="fixed inset-0 z-[200] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#141414] border border-[#E8D3B9]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-paper relative"
            >
              <button
                type="button"
                onClick={() => setReplaceModalGuest(null)}
                className="absolute top-5 right-5 text-paper/50 hover:text-paper cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-[#E8D3B9] font-sans text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                <ArrowLeftRight className="w-4 h-4" />
                <span>Standby Guest Replacement</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl italic text-paper mb-2">
                Replace {replaceModalGuest.name}
              </h3>
              <p className="font-sans text-xs text-paper/65 mb-6 leading-relaxed">
                This will swap Invite #{replaceModalGuest.id} with your standby
                guest, keep all other RSVPs untouched, and allow the new guest
                to RSVP immediately.
              </p>

              <form
                onSubmit={submitStandbyReplacement}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    New Standby Guest Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Mr and Mrs Mangena or Timothy"
                    value={replaceForm.newName}
                    onChange={(e) =>
                      setReplaceForm({ ...replaceForm, newName: e.target.value })
                    }
                    className="w-full bg-paper/5 border border-paper/20 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    New Guest Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={replaceForm.newPhone}
                    onChange={(e) =>
                      setReplaceForm({
                        ...replaceForm,
                        newPhone: e.target.value,
                      })
                    }
                    className="w-full bg-paper/5 border border-paper/20 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    Allowed Seats for This Invite
                  </label>
                  <select
                    value={replaceForm.allowedGuests}
                    onChange={(e) =>
                      setReplaceForm({
                        ...replaceForm,
                        allowedGuests: e.target.value,
                      })
                    }
                    className="w-full bg-[#1C1C1C] border border-paper/20 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  >
                    <option value="1">1 Person (Single Invite)</option>
                    <option value="2">2 People (Couple Invite)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setReplaceModalGuest(null)}
                    className="flex-1 py-3 rounded-xl border border-paper/20 text-paper/70 font-sans text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#E8D3B9] text-ink font-sans text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Confirm Swap
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Edit Guest Name / Phone / RSVP Status */}
      <AnimatePresence>
        {editModalGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditModalGuest(null)}
            className="fixed inset-0 z-[200] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#141414] border border-[#E8D3B9]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-paper relative"
            >
              <button
                type="button"
                onClick={() => setEditModalGuest(null)}
                className="absolute top-5 right-5 text-paper/50 hover:text-paper cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-[#E8D3B9] font-sans text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                <Edit3 className="w-4 h-4" />
                <span>Edit Invite #{editModalGuest.id}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl italic text-paper mb-5">
                Update Guest Details
              </h3>

              <form onSubmit={submitEditGuest} className="flex flex-col gap-4">
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    Guest Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full bg-paper/5 border border-paper/20 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full bg-paper/5 border border-paper/20 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                      Allowed Guests
                    </label>
                    <select
                      value={editForm.allowedGuests}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          allowedGuests: e.target.value,
                        })
                      }
                      className="w-full bg-[#1C1C1C] border border-paper/20 rounded-xl px-3 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                      RSVP Status
                    </label>
                    <select
                      value={editForm.rsvpStatus}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          rsvpStatus: e.target.value as any,
                        })
                      }
                      className="w-full bg-[#1C1C1C] border border-paper/20 rounded-xl px-3 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                    >
                      <option value="pending">Pending</option>
                      <option value="attending">Attending</option>
                      <option value="declining">Declined</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    Dietary / Special Notes
                  </label>
                  <input
                    type="text"
                    placeholder="Optional dietary note..."
                    value={editForm.rsvpNotes}
                    onChange={(e) =>
                      setEditForm({ ...editForm, rsvpNotes: e.target.value })
                    }
                    className="w-full bg-paper/5 border border-paper/20 rounded-xl px-4 py-2.5 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setEditModalGuest(null)}
                    className="flex-1 py-3 rounded-xl border border-paper/20 text-paper/70 font-sans text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#E8D3B9] text-ink font-sans text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Add New Guest */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 z-[200] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#141414] border border-[#E8D3B9]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-paper relative"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 text-paper/50 hover:text-paper cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-[#E8D3B9] font-sans text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                <UserPlus className="w-4 h-4" />
                <span>Add Invited Guest</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl italic text-paper mb-5">
                New Guest Invitation
              </h3>

              <form onSubmit={submitAddGuest} className="flex flex-col gap-4">
                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Mr and Mrs Ndlovu"
                    value={addForm.name}
                    onChange={(e) =>
                      setAddForm({ ...addForm, name: e.target.value })
                    }
                    className="w-full bg-paper/5 border border-paper/20 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 077 123 4567"
                    value={addForm.phone}
                    onChange={(e) =>
                      setAddForm({ ...addForm, phone: e.target.value })
                    }
                    className="w-full bg-paper/5 border border-paper/20 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase tracking-widest text-paper/70 block mb-1.5">
                    Allowed Seats
                  </label>
                  <select
                    value={addForm.allowedGuests}
                    onChange={(e) =>
                      setAddForm({ ...addForm, allowedGuests: e.target.value })
                    }
                    className="w-full bg-[#1C1C1C] border border-paper/20 rounded-xl px-4 py-3 text-sm text-paper focus:outline-none focus:border-[#E8D3B9]"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People (Couple)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-paper/20 text-paper/70 font-sans text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#E8D3B9] text-ink font-sans text-xs uppercase tracking-wider font-bold hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Add Guest
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Google Sheets Auto-Deduplicate & Sync Apps Script */}
      <AnimatePresence>
        {isScriptModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsScriptModalOpen(false)}
            className="fixed inset-0 z-[200] bg-ink/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#141414] border border-[#E8D3B9]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-paper relative"
            >
              <button
                type="button"
                onClick={() => setIsScriptModalOpen(false)}
                className="absolute top-5 right-5 text-paper/50 hover:text-paper cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-emerald-300 font-sans text-[10px] uppercase tracking-[0.3em] font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Automatic Google Sheets Duplicate Cleaner &amp; 2-Way Sync</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl italic text-paper mb-3">
                One-Paste Google Sheets Upgrade
              </h3>
              <p className="font-sans text-xs text-paper/70 leading-relaxed mb-4">
                Paste this upgraded script into your Google Sheet (
                <strong>Extensions &rarr; Apps Script</strong>) and click{' '}
                <strong>Deploy &rarr; Manage deployments &rarr; Edit &rarr; New version</strong>.
                You can also click <strong>Run &rarr; cleanDuplicatesNow</strong> once inside Apps Script to immediately delete all duplicate rows (like Brillient&apos;s 10 entries) after it automatically creates a safety backup tab!
              </p>

              <div className="flex items-center justify-between mb-2">
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#E8D3B9]">
                  Apps Script Code (Code.gs)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(UPGRADED_APPS_SCRIPT_CODE);
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 3000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E8D3B9] text-ink font-sans text-[10.5px] uppercase tracking-wider font-bold cursor-pointer"
                >
                  {copiedScript ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Script</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-black/80 border border-paper/15 rounded-2xl p-4 text-[11px] text-emerald-200/90 overflow-x-auto max-h-72 font-mono leading-relaxed">
                {UPGRADED_APPS_SCRIPT_CODE}
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
