# Google Sheets Auto-Deduplication, Auto-Styling & Bride/Bridegroom Host Portal (`/admin`)

## What Was Upgraded
1. **Bride (Sithandiwe — 95 Invites) & Bridegroom (Ndumiso — 82 Invites) Separation (177 Total Invitations):**
   - **Bride's Side (`BRIDE` — #1 to #95):** Preserved 100% of existing RSVPs, phone numbers (including recovered `#ERROR!` phone numbers for `Mr and Mrs Bango` and `NaJeco`), headcounts, dietary requirements, and heartfelt wishes from the Google Sheet.
   - **Bridegroom's Side (`BRIDEGROOM` — #96 to #177):** Added all 82 invitations from Ndumiso's family list (including 13 couple/pair invites with `2` seats and 69 single invites with `1` seat).
2. **Hybrid RSVP UX (`/rsvp` & `/details` Modal):**
   - Guests can select **Bride's Side (Sithandiwe)** or **Bridegroom's Side (Ndumiso)** at the top of the RSVP card, or type their name immediately and tap their side-badged suggestion pill (`Bride` vs `Bridegroom`).
   - Prevents cross-family collisions for shared names (`Novuyo`, `Melissa`, `Mr and Mrs Ncube`) and shared surnames (`Masuku`, `Chirwa`, `Ndlovu`, `Dube`, `Moyo`, `Sibanda`).
3. **Flexible Host Portal Routes (`/admin`, `/details/admin`, `/rsvp/admin`, `/journey/admin`):**
   - Unlock with PIN: **`3012`** (or `2026`).
   - Filter between **Both Families (177)**, **Bride's Side — Sithandiwe (95)**, and **Bridegroom's Side — Ndumiso (82)** with separate live seat counters.
4. **Google Sheets Auto-Deduplication, `#ERROR!` Phone Recovery & 3-Tab Luxury Styling:**
   - Automatically backs up `Sheet1` to `Backup_Sheet1`.
   - Deletes all duplicate rows (`Brillient`'s 16 rows, `Trinity`'s 2 rows, `Mr and Mrs Magandiwa`'s 2 rows, `Patie`'s 2 rows, `Onesimo`'s 2 rows, `Mrs Velani`'s 2 rows, `Millicent`'s 2 rows) while keeping all dietary notes.
   - Formats phone numbers as Plain Text (`@`) so `+44...` and `+263...` never turn into `#ERROR!` and leading `0`s are never stripped.
   - Styles `Sheet1` and automatically builds two dedicated, color-coded family tabs: **`Bride (Sithandiwe)`** and **`Bridegroom (Ndumiso)`** with live summary scorecards at the top.

---

## 1-Minute Step in Google Sheets (To Clean & Style the Live Spreadsheet Tabs)

Because Google Apps Script runs inside your Google Sheet, do this once to apply the deduplication and luxury styling directly inside Google Sheets:

1. Open your Google Sheet (`Ndumiso & Sithandiwe – RSVPs`) and click **Extensions → Apps Script**.
2. Visit **`https://ndumiso-sithandiwe.vercel.app/admin`** (unlock with PIN `3012`), click **Sheet Auto-Style & Clean Script**, and click **Copy Full Script**.
3. Replace the old code in Apps Script with the copied script, click **Save** (disk icon), and click **Run** (`cleanDuplicatesNow`) in the top toolbar.
4. Click **Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy**.
5. Back on `/admin`, click **Sync, Deduplicate & Style Sheet** once — this pushes all 177 invitations (`95 Bride + 82 Bridegroom`) into the spreadsheet and generates the styled **`Bride (Sithandiwe)`** and **`Bridegroom (Ndumiso)`** tabs!
