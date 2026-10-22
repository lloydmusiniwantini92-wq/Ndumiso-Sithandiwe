# Connecting the RSVP Form to Google Sheets (with Phone & Guest Whitelist)

This guide shows how to set up the Google Sheets RSVP backend so that:
1. **Emails are removed** and **Phone / WhatsApp numbers** are captured.
2. **Only invited guests** from the 95-person guest list can RSVP. Anyone else is rejected.

---

## 1. Sheet Setup

Open your Google Spreadsheet (e.g. `Ndumiso & Sithandiwe – RSVPs`):

### Tab 1: `RSVPs` (or `Sheet1`)
In row 1, set these headers exactly:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| `submittedAt` | `name` | `phone` | `attendance` | `guests` | `notes` |

*(Note: `email` has been replaced with `phone`)*

---

### Tab 2: `GuestList` (Whitelist Tab)
Create a new sheet/tab named **`GuestList`**.
In row 1, add headers:

| A | B |
|---|---|
| `Name` | `Phone` |

In Column A (starting from row 2), paste the 95 invited guests:

```text
Peter Mpofu
NaNgcuu
Julie
NaMishie
NaKieth
Mr and Mrs Sibanda (bridesparents)
naAgrippah
Mr and Mrs Dube
Busi Mpofu
Sphiwe Dube
Patie
Judie
NoNtoe
Brillient
Thulie
naPrim
Tendai Mateke
Melina Moyo
Opah Magidi
naJeco
naNdue
Nomusa
Sukoluhle
Nkululeko
Ntobeko
Dumo
Lindani
Onesimo
Pinkie
Faith
Boneni
Mhlobo
Ntombie
Sabheki
Narhoda
Mr and Mrs Bango
Manotsha
Mr and Mrs Baron
Mr and Mrs Kusa Sibanda
Abie
Israel
Mr and Mrs Mpofu
Butho
Ruth
Mr and Mrs Ncube
Mamo
Prince
Gracious
Welly
Samantha
Josphine
Mduduzi
Privilege
Mr & Mrs Bajila
Joana
Trinity
Holy
Millicent
Memory
Mr and mrs magandiwa
Aisha
Sindy mnvundla
Irene Ncube
Lilian
Mr and Mrs marambidze
Jordan
Thabo
Mihla
Jamie
Lattie
Sbonakele
Bleh & Mrs dube
Keith
Princess
Sindy Mabuza
Mrs Moyo
Rejoice
Novuyo
Kim
Melody
Mrs Velani
Mitchell khanyile
Naskhu
Smilo
Maggie
Nonhlanhla
Mr & Mrs B Sibanda
Suzan
Ethel
Melissa
Shinel
Orlando
Madli
Bridget
Nomazulu
```

---

## 2. Add the Apps Script Code

1. In your Google Sheet, open **Extensions → Apps Script**.
2. Replace all existing code with the following:

```javascript
const RSVPS_SHEET_NAME = 'RSVPs'; // Tab where submissions are stored (fallback to Sheet1)
const GUEST_LIST_SHEET_NAME = 'GuestList'; // Tab containing allowed names

// Built-in whitelist fallback of the 95 invited guests
const INVITED_GUESTS = [
  "Peter Mpofu", "NaNgcuu", "Julie", "NaMishie", "NaKieth",
  "Mr and Mrs Sibanda (bridesparents)", "naAgrippah", "Mr and Mrs Dube",
  "Busi Mpofu", "Sphiwe Dube", "Patie", "Judie", "NoNtoe", "Brillient",
  "Thulie", "naPrim", "Tendai Mateke", "Melina Moyo", "Opah Magidi",
  "naJeco", "naNdue", "Nomusa", "Sukoluhle", "Nkululeko", "Ntobeko",
  "Dumo", "Lindani", "Onesimo", "Pinkie", "Faith", "Boneni", "Mhlobo",
  "Ntombie", "Sabheki", "Narhoda", "Mr and Mrs Bango", "Manotsha",
  "Mr and Mrs Baron", "Mr and Mrs Kusa Sibanda", "Abie", "Israel",
  "Mr and Mrs Mpofu", "Butho", "Ruth", "Mr and Mrs Ncube", "Mamo",
  "Prince", "Gracious", "Welly", "Samantha", "Josphine", "Mduduzi",
  "Privilege", "Mr & Mrs Bajila", "Joana", "Trinity", "Holy",
  "Millicent", "Memory", "Mr and mrs magandiwa", "Aisha",
  "Sindy mnvundla", "Irene Ncube", "Lilian", "Mr and Mrs marambidze",
  "Jordan", "Thabo", "Mihla", "Jamie", "Lattie", "Sbonakele",
  "Bleh & Mrs dube", "Keith", "Princess", "Sindy Mabuza", "Mrs Moyo",
  "Rejoice", "Novuyo", "Kim", "Melody", "Mrs Velani", "Mitchell khanyile",
  "Naskhu", "Smilo", "Maggie", "Nonhlanhla", "Mr & Mrs B Sibanda",
  "Suzan", "Ethel", "Melissa", "Shinel", "Orlando", "Madli",
  "Bridget", "Nomazulu"
];

function normalizeName(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[().,\-_'/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isAuthorizedGuest(inputName, spreadsheet) {
  const normInput = normalizeName(inputName);
  if (!normInput) return false;

  // 1. Try reading names from the GuestList sheet tab if it exists
  let allowedNames = INVITED_GUESTS;
  const guestSheet = spreadsheet.getSheetByName(GUEST_LIST_SHEET_NAME);
  if (guestSheet && guestSheet.getLastRow() > 1) {
    const listValues = guestSheet.getRange(2, 1, guestSheet.getLastRow() - 1, 1).getValues();
    const sheetNames = listValues.map(r => r[0]).filter(Boolean);
    if (sheetNames.length > 0) {
      allowedNames = sheetNames;
    }
  }

  // 2. Check match with normalization
  for (let i = 0; i < allowedNames.length; i++) {
    const normAllowed = normalizeName(allowedNames[i]);
    const normAllowedNoParens = normalizeName(allowedNames[i].replace(/\(.*?\)/g, ''));
    if (normInput === normAllowed || normInput === normAllowedNoParens) {
      return true;
    }
    // Substring match for substantial names (>= 5 chars)
    if (normInput.length >= 5 && (normAllowed.includes(normInput) || normInput.includes(normAllowed))) {
      return true;
    }
  }

  return false;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(RSVPS_SHEET_NAME) || ss.getSheetByName('Sheet1') || ss.getSheets()[0];

    const submittedName = e.parameter.name || '';

    // Guest verification check
    if (!isAuthorizedGuest(submittedName, ss)) {
      return ContentService.createTextOutput(JSON.stringify({
        result: 'error',
        error: 'Unauthorized: The name is not on the invited wedding guest list.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Append authorized response to sheet
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(h => (e.parameter[h] !== undefined ? e.parameter[h] : ''));
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Click the **Save** (disk) icon.

---

## 3. Deploy / Update the Web App

If you already have a deployment:
1. Click **Deploy → Manage deployments**.
2. Click the **Pencil (Edit)** icon on the active deployment.
3. In the **Version** dropdown, select **New version**.
4. Click **Deploy**.

If creating a new deployment:
1. **Deploy → New deployment** → gear icon → **Web app**.
2. *Execute as*: **Me**.
3. *Who has access*: **Anyone**.
4. Click **Deploy** and copy the **Web app URL** (ending with `/exec`).

---

## 4. How the Two-Tier Security Works

1. **Client-Side Verification (React):**
   - The user starts typing their name in the RSVP form.
   - A dropdown shows matching names from the 95 invited guests for one-click selection.
   - If someone types a name not on the list, a message explains that the wedding is private and submission is disabled.
2. **Server-Side Verification (Google Apps Script):**
   - Even if someone tries to bypass the browser by sending a direct HTTP POST request, the Apps Script checks the name against the authorized list and rejects unauthorized submissions.
