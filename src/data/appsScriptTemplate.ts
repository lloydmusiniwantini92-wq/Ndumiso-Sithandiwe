export const UPGRADED_APPS_SCRIPT_CODE = `/**
 * Ndumiso & Sithandiwe — Smart Wedding RSVP & Host Portal Backend
 * Features:
 * 1. Automatic Backup (creates 'Backup_Sheet1' before first cleanup so nothing is ever lost)
 * 2. Automatic Duplicate Removal (merges Brillient's 10 rows, Millicent's 2 rows, etc. into 1 clean row each)
 * 3. Smart Upsert on RSVP (updates existing guest row in-place instead of appending duplicates)
 * 4. 2-Way Sync with the Website Host Portal (/admin) for Standby Guest Replacements & Phone Edits
 */

const RSVPS_SHEET_NAME = 'Sheet1';
const GUEST_LIST_SHEET_NAME = 'GuestList';
const BACKUP_SHEET_NAME = 'Backup_Sheet1';

function normalizeName(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[().,\\-_'/]/g, ' ')
    .replace(/\\s+/g, ' ')
    .trim();
}

function normalizePhone(phone) {
  if (!phone) return '';
  var digits = String(phone).replace(/\\D/g, '');
  if (!digits) return '';
  if (digits.indexOf('263') === 0 && digits.length >= 11) {
    digits = digits.substring(3);
  } else if (digits.indexOf('0') === 0 && digits.length >= 9) {
    digits = digits.substring(1);
  }
  return digits;
}

function formatDisplayPhone(phone) {
  if (!phone) return '';
  var s = String(phone).trim();
  if (/^[789]\\d{7,8}$/.test(s)) {
    return '0' + s;
  }
  return s;
}

function isHeaderRow(rowValues) {
  var a = String(rowValues[0] || '').toLowerCase();
  var b = String(rowValues[1] || '').toLowerCase();
  return (
    a.indexOf('submit') !== -1 ||
    a.indexOf('time') !== -1 ||
    a.indexOf('date') !== -1 ||
    b === 'name' ||
    b === 'guest'
  );
}

/**
 * Run this function once from the Apps Script toolbar (or it runs automatically on sync/RSVP)
 * to back up Sheet1 and delete all duplicate RSVP rows!
 */
function cleanDuplicatesNow() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(RSVPS_SHEET_NAME) || ss.getSheetByName('RSVPs') || ss.getSheets()[0];
  if (!sheet || sheet.getLastRow() < 2) return 0;

  // 1. Automatic Safety Backup on first run
  if (!ss.getSheetByName(BACKUP_SHEET_NAME)) {
    var backup = sheet.copyTo(ss);
    backup.setName(BACKUP_SHEET_NAME);
  }

  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), 6);
  var allValues = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  var startIdx = isHeaderRow(allValues[0]) ? 1 : 0;
  var seenByName = {};
  var seenByPhone = {};
  var rowsToDelete = [];

  // Scan from bottom (newest) to top (oldest) so we keep the latest response per guest
  for (var i = allValues.length - 1; i >= startIdx; i--) {
    var row = allValues[i];
    var nameKey = normalizeName(row[1]);
    var phoneKey = normalizePhone(row[2]);

    if (!nameKey && !phoneKey) {
      rowsToDelete.push(i + 1);
      continue;
    }

    var matchedSurvivorIdx = null;
    if (nameKey && seenByName[nameKey] !== undefined) {
      matchedSurvivorIdx = seenByName[nameKey];
    } else if (phoneKey && seenByPhone[phoneKey] !== undefined) {
      matchedSurvivorIdx = seenByPhone[phoneKey];
    }

    if (matchedSurvivorIdx !== null) {
      // Preserve any dietary notes from earlier duplicate rows if the newest row left notes blank
      var survivorRow = allValues[matchedSurvivorIdx];
      if (!String(survivorRow[5] || '').trim() && String(row[5] || '').trim()) {
        survivorRow[5] = row[5];
        sheet.getRange(matchedSurvivorIdx + 1, 6).setValue(row[5]);
      }
      rowsToDelete.push(i + 1);
    } else {
      if (nameKey) seenByName[nameKey] = i;
      if (phoneKey) seenByPhone[phoneKey] = i;
      // Fix stripped leading 0 on phone numbers
      var cleanPhone = formatDisplayPhone(row[2]);
      if (cleanPhone && String(row[2]) !== cleanPhone) {
        sheet.getRange(i + 1, 3).setNumberFormat('@').setValue(cleanPhone);
      }
    }
  }

  // Delete duplicate rows from bottom to top
  for (var d = 0; d < rowsToDelete.length; d++) {
    sheet.deleteRow(rowsToDelete[d]);
  }

  return rowsToDelete.length;
}

function readRsvps(sheet) {
  if (!sheet || sheet.getLastRow() < 1) return [];
  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), 6);
  var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  var startIdx = isHeaderRow(values[0]) ? 1 : 0;
  var list = [];
  for (var i = startIdx; i < values.length; i++) {
    var r = values[i];
    if (!r[1] && !r[2]) continue;
    list.push({
      submittedAt: r[0] ? String(r[0]) : '',
      name: String(r[1] || '').trim(),
      phone: formatDisplayPhone(r[2]),
      attendance: String(r[3] || 'attending').trim().toLowerCase(),
      guests: r[4] || 1,
      notes: String(r[5] || '').trim()
    });
  }
  return list;
}

function readGuestList(ss) {
  var gSheet = ss.getSheetByName(GUEST_LIST_SHEET_NAME);
  if (!gSheet || gSheet.getLastRow() < 2) return null;
  var rawJson = gSheet.getRange(2, 5).getValue();
  if (rawJson && String(rawJson).indexOf('[') === 0) {
    try {
      return JSON.parse(String(rawJson));
    } catch (e) {}
  }
  return null;
}

function saveGuestListToSheet(ss, guestListJson) {
  var gSheet = ss.getSheetByName(GUEST_LIST_SHEET_NAME);
  if (!gSheet) {
    gSheet = ss.insertSheet(GUEST_LIST_SHEET_NAME);
  }
  gSheet.clearContents();
  gSheet.getRange(1, 1, 1, 5).setValues([['ID', 'Name', 'Phone', 'AllowedGuests', 'FullStateJSON']]);
  try {
    var parsed = JSON.parse(guestListJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      var rows = parsed.map(function(g, idx) {
        return [
          g.id || (idx + 1),
          g.name || '',
          formatDisplayPhone(g.phone || ''),
          g.allowedGuests || 1,
          idx === 0 ? guestListJson : ''
        ];
      });
      gSheet.getRange(2, 1, rows.length, 5).setValues(rows);
    }
  } catch (e) {}
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(RSVPS_SHEET_NAME) || ss.getSheetByName('RSVPs') || ss.getSheets()[0];
  var duplicatesRemoved = cleanDuplicatesNow();
  var rsvps = readRsvps(sheet);
  var guestList = readGuestList(ss);

  return ContentService.createTextOutput(JSON.stringify({
    result: 'success',
    duplicatesRemoved: duplicatesRemoved,
    rsvps: rsvps,
    guestList: guestList
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(RSVPS_SHEET_NAME) || ss.getSheetByName('RSVPs') || ss.getSheets()[0];
    var action = (e.parameter && e.parameter.action) ? e.parameter.action : 'upsertRsvp';

    // Always clean existing duplicates first
    var duplicatesRemoved = cleanDuplicatesNow();

    // Admin Portal actions: saveGuestList, replaceGuest, updateGuest, deduplicateSheet
    if (e.parameter && e.parameter.guestListJson) {
      saveGuestListToSheet(ss, e.parameter.guestListJson);
    }

    if (action === 'replaceGuest' && e.parameter.oldName) {
      // If the replaced guest had a row in Sheet1, remove/reset it so the standby guest starts fresh
      var targetOldKey = normalizeName(e.parameter.oldName);
      var lastR = sheet.getLastRow();
      if (lastR >= 1) {
        var vals = sheet.getRange(1, 1, lastR, Math.max(sheet.getLastColumn(), 6)).getValues();
        var sIdx = isHeaderRow(vals[0]) ? 1 : 0;
        for (var rIdx = vals.length - 1; rIdx >= sIdx; rIdx--) {
          if (normalizeName(vals[rIdx][1]) === targetOldKey) {
            sheet.deleteRow(rIdx + 1);
          }
        }
      }
    }

    if (action === 'saveGuestList' || action === 'replaceGuest' || action === 'updateGuest' || action === 'deduplicateSheet') {
      return ContentService.createTextOutput(JSON.stringify({
        result: 'success',
        duplicatesRemoved: duplicatesRemoved
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Standard RSVP Upsert (1 row per guest — never duplicates!)
    var submittedAt = e.parameter.submittedAt || new Date().toISOString();
    var name = String(e.parameter.name || '').trim();
    var phone = formatDisplayPhone(e.parameter.phone || '');
    var attendance = String(e.parameter.attendance || 'attending').trim();
    var guests = e.parameter.guests || '1';
    var notes = String(e.parameter.notes || '').trim();

    if (!name) {
      return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: 'Missing name' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var normInName = normalizeName(name);
    var normInPhone = normalizePhone(phone);
    var updatedExisting = false;

    if (sheet.getLastRow() >= 1) {
      var data = sheet.getRange(1, 1, sheet.getLastRow(), Math.max(sheet.getLastColumn(), 6)).getValues();
      var start = isHeaderRow(data[0]) ? 1 : 0;
      for (var i = start; i < data.length; i++) {
        var rowName = normalizeName(data[i][1]);
        var rowPhone = normalizePhone(data[i][2]);
        if ((normInName && rowName === normInName) || (normInPhone && rowPhone && normInPhone === rowPhone)) {
          var finalNotes = notes || String(data[i][5] || '').trim();
          sheet.getRange(i + 1, 3).setNumberFormat('@');
          sheet.getRange(i + 1, 1, 1, 6).setValues([[submittedAt, name, phone, attendance, guests, finalNotes]]);
          updatedExisting = true;
          break;
        }
      }
    }

    if (!updatedExisting) {
      var nextRow = sheet.getLastRow() + 1;
      sheet.getRange(nextRow, 3).setNumberFormat('@');
      sheet.getRange(nextRow, 1, 1, 6).setValues([[submittedAt, name, phone, attendance, guests, notes]]);
    }

    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      upserted: updatedExisting ? 'updated' : 'inserted',
      duplicatesRemoved: duplicatesRemoved
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
`;
