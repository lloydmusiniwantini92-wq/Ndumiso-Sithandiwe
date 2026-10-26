# Google Sheets Auto-Deduplication & Self-Service Host Portal (`/admin`)

## What Was Upgraded
1. **30 December Final Guestlist Applied (Non-Destructive Merge):**
   - Preserved all existing live RSVPs and phone numbers (`Brillient`, `Sukoluhle`, `Millicent`, `Privilege`, `Bridget`, `Abie`, `Opah Magidi`, `Rejoice`, `Lindani`).
   - Applied the standby replacements from `30 December Final Guestlist.xlsx`:
     - `#3 Julie` — Phone updated to `0777727681`
     - `#6 Mr and Mrs Sibanda` — Updated display name (keeps aliases for Bride's Parents)
     - `#39 Mr and Mrs Sibanda` — Updated display name (`0772383605`)
     - `#53 Mr & Mrs Bajila` & `#54 Privilege` — Ordered per final sheet
     - `#57 Lolo` — Replaced `Holy`
     - `#68 Mr and Mrs Mangena` — Replaced `Mihla` (`2` guests)
     - `#72 Mrs Dube` — Replaced `Bleh & Mrs dube` (`1` guest)
     - `#75 Timothy` — Replaced `Sindy Mabuza`
     - `#87 Mr & Mrs Sibanda` — Updated from `Mr & Mrs B Sibanda` (`2` guests)
2. **Option B: Self-Service Host Portal (`/admin`):**
   - Visit **`/admin`** on the website (or tap **"Host Portal"** at the bottom of the `/rsvp` or `/details` page).
   - Unlock with PIN: **`3012`** (or `2026`).
   - From her phone or computer, she can:
     - Tap **Replace Guest** next to anyone who cancels to swap in a standby guest.
     - Tap **Edit Name / Phone** to update names, phone numbers, allowed seats (`1` or `2`), or RSVP status.
     - Tap **Add Guest** to add new invitations.
     - Tap **Export Clean Excel/CSV** to download a 100% deduplicated spreadsheet anytime.
3. **Zero Duplicate RSVPs (Frontend + Backend):**
   - **Frontend Lock & Status Detection:** Rapid double/triple taps are blocked with a synchronous lock, and guests who have already RSVPed see a banner letting them know their RSVP is already on file.
   - **Google Sheets Automatic Deduplication & Upsert:** Automatically creates a `Backup_Sheet1` tab, deletes duplicate rows (such as `Brillient`'s 10 entries and `Millicent`'s 2 entries) while keeping any dietary notes, and updates existing rows in place instead of appending duplicates.

---

## Optional 1-Minute Google Sheets Script Upgrade (For Auto-Cleaning Existing Sheet Rows)

To automatically delete the existing duplicate rows inside your Google Sheet without touching a single row manually:

1. In your Google Sheet (`Ndumiso & Sithandiwe – RSVPs`), click **Extensions → Apps Script**.
2. Open the `/admin` portal on your website, click **Sheet Auto-Clean Script**, and click **Copy Full Script**.
3. Paste the script into Apps Script, click **Save** (disk icon), and click **Run** (`cleanDuplicatesNow`) once to immediately back up `Sheet1` and delete all duplicate rows.
4. Click **Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy**.
