# Connecting the RSVP form to Google Sheets

You do **not** need the couple's email to build this. Create the sheet on any
Google account (yours is fine), then share it with them as **Editor**. If you'd
rather the sheet belong to them, create it while logged into their account (or
transfer ownership later via Share → their email → "Transfer ownership").

## 1. Create the sheet
1. Go to https://sheets.new and name it `Ndumiso & Sithandiwe – RSVPs`.
2. In row 1, add these headers exactly:

   | A | B | C | D | E | F |
   |---|---|---|---|---|---|
   | submittedAt | name | email | attendance | guests | notes |

## 2. Add the script
1. In the sheet: **Extensions → Apps Script**.
2. Delete everything there and paste:

```js
const SHEET_NAME = 'Sheet1'; // change if you renamed the tab

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
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

3. Click the **Save** icon.

## 3. Deploy it as a Web App
1. **Deploy → New deployment** → gear icon → **Web app**.
2. *Execute as*: **Me**. *Who has access*: **Anyone**.
3. Click **Deploy**, approve the permissions (choose "Advanced → Go to project" if warned).
4. Copy the **Web app URL** (ends with `/exec`).

## 4. Plug it into the website
Create a file named `.env.local` in the project root (next to `package.json`):

```
VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

Restart `npm run dev`. Submit a test RSVP on `/details`; a new row should appear in the sheet.
For hosting (e.g. Vercel), add the same `VITE_RSVP_ENDPOINT` variable in the project's environment settings and redeploy.

> If you edit the script later, use **Deploy → Manage deployments → Edit → New version**,
> otherwise the live URL keeps running the old code.

## Optional: email alerts for each RSVP
In the sheet: **Tools → Notification settings → Edit notifications → "Any changes are made" → Email immediately**.
