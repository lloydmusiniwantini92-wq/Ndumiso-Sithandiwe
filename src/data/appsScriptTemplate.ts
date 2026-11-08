export const UPGRADED_APPS_SCRIPT_CODE = `/**
 * Ndumiso & Sithandiwe — Smart Wedding RSVP, Auto-Styling & Bride/Bridegroom Backend
 * Features:
 * 1. Automatic Safety Backup (creates 'Backup_Sheet1' before first cleanup so nothing is ever lost)
 * 2. Smart Duplicate Removal (merges Brillient's 16 rows, Trinity's 2 rows, Millicent's 2 rows, etc. into 1 row each)
 * 3. Automatic #ERROR! Phone Recovery (formats phone column as '@' Plain Text so '+44...' never becomes #ERROR!)
 * 4. BRIDE (Sithandiwe) vs BRIDEGROOM (Ndumiso) Separation across Sheet1 + 2 Dedicated Styled Tabs:
 *    - 'Bride (Sithandiwe)' (95 Invites + Live Scorecard Banner)
 *    - 'Bridegroom (Ndumiso)' (82 Invites + Live Scorecard Banner)
 * 5. Luxury Editorial Spreadsheet Styling (Charcoal & Champagne Gold headers, frozen rows, status colors, wrapped notes)
 */

const RSVPS_SHEET_NAME = 'Sheet1';
const BRIDE_TAB_NAME = 'Bride (Sithandiwe)';
const GROOM_TAB_NAME = 'Bridegroom (Ndumiso)';
const GUEST_LIST_SHEET_NAME = 'GuestList';
const BACKUP_SHEET_NAME = 'Backup_Sheet1';

// Known phone numbers for guests whose '+44' or '+263' caused #ERROR! in legacy Sheet1
const KNOWN_PHONE_RECOVERY = {
  'najeco': '09781944796',
  'mr and mrs bango': '+44 7368 252393',
  'nandue': '0772344295',
  'nangcuu': '0772453257',
  'mr and mrs ncube': '+44 7861 31350'
};

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
  var str = String(phone).trim();
  if (str.indexOf('#') === 0) return '';
  var digits = str.replace(/\\D/g, '');
  if (!digits || digits.length < 6) return '';
  if (digits.indexOf('263') === 0 && digits.length >= 11) {
    digits = digits.substring(3);
  } else if (digits.indexOf('0') === 0 && digits.length >= 9) {
    digits = digits.substring(1);
  }
  return digits;
}

function formatDisplayPhone(phone, guestName) {
  var s = phone ? String(phone).trim() : '';
  if (!s || s.indexOf('#') === 0) {
    var norm = normalizeName(guestName || '');
    if (norm && KNOWN_PHONE_RECOVERY[norm]) {
      return KNOWN_PHONE_RECOVERY[norm];
    }
    return '';
  }
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
    b === 'guest' ||
    b === 'guest name'
  );
}

/**
 * Run this function from the Apps Script toolbar (or it runs automatically on sync/RSVP)
 * to deduplicate Sheet1, recover #ERROR! phones, and apply luxury styling + Bride/Bridegroom tabs!
 */
function cleanDuplicatesNow() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(RSVPS_SHEET_NAME) || ss.getSheetByName('RSVPs') || ss.getSheets()[0];
  if (!sheet) return 0;

  // 1. Automatic Safety Backup on first run
  if (!ss.getSheetByName(BACKUP_SHEET_NAME) && sheet.getLastRow() >= 2) {
    var backup = sheet.copyTo(ss);
    backup.setName(BACKUP_SHEET_NAME);
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    styleMasterRsvpSheet(sheet);
    return 0;
  }

  var lastCol = Math.max(sheet.getLastColumn(), 7);
  var allValues = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  var startIdx = isHeaderRow(allValues[0]) ? 1 : 0;
  var seenByKey = {};
  var seenByPhone = {};
  var rowsToDelete = [];

  // Format Column C (Phone) as Plain Text '@' first so '+44...' never triggers #ERROR!
  sheet.getRange(1, 3, lastRow, 1).setNumberFormat('@');

  // Scan from bottom (newest) to top (oldest) so we keep the latest response per guest
  for (var i = allValues.length - 1; i >= startIdx; i--) {
    var row = allValues[i];
    var nameKey = normalizeName(row[1]);
    var cleanPhone = formatDisplayPhone(row[2], row[1]);
    var phoneKey = normalizePhone(cleanPhone);
    var sideVal = String(row[6] || '').trim().toUpperCase();
    if (sideVal !== 'BRIDE' && sideVal !== 'BRIDEGROOM') {
      sideVal = 'BRIDE'; // Legacy Oct/Nov 2026 rows are from Bride's side list
    }

    if (!nameKey && !phoneKey) {
      rowsToDelete.push(i + 1);
      continue;
    }

    var compositeNameKey = sideVal + ':' + nameKey;
    var matchedSurvivorIdx = null;

    if (nameKey && seenByKey[compositeNameKey] !== undefined) {
      matchedSurvivorIdx = seenByKey[compositeNameKey];
    } else if (phoneKey && seenByPhone[phoneKey] !== undefined) {
      var prevIdx = seenByPhone[phoneKey];
      var prevName = normalizeName(allValues[prevIdx][1]);
      if (!nameKey || prevName === nameKey) {
        matchedSurvivorIdx = prevIdx;
      }
    }

    if (matchedSurvivorIdx !== null) {
      var survivorRow = allValues[matchedSurvivorIdx];
      // Preserve any dietary notes from earlier duplicate rows if the newest row left notes blank
      if (!String(survivorRow[5] || '').trim() && String(row[5] || '').trim()) {
        survivorRow[5] = row[5];
        sheet.getRange(matchedSurvivorIdx + 1, 6).setValue(row[5]);
      }
      // Preserve valid phone if survivor had #ERROR! or blank
      var survivorPhone = formatDisplayPhone(survivorRow[2], survivorRow[1]);
      if (!survivorPhone && cleanPhone) {
        survivorRow[2] = cleanPhone;
        sheet.getRange(matchedSurvivorIdx + 1, 3).setNumberFormat('@').setValue(cleanPhone);
      }
      rowsToDelete.push(i + 1);
    } else {
      if (nameKey) seenByKey[compositeNameKey] = i;
      if (phoneKey) seenByPhone[phoneKey] = i;

      // Fix stripped leading 0 or #ERROR! on phone numbers and ensure Side column is populated
      if (String(row[2]) !== cleanPhone) {
        sheet.getRange(i + 1, 3).setNumberFormat('@').setValue(cleanPhone);
      }
      if (String(row[6] || '').toUpperCase() !== sideVal) {
        sheet.getRange(i + 1, 7).setValue(sideVal);
      }
    }
  }

  // Delete duplicate rows from bottom to top
  for (var d = 0; d < rowsToDelete.length; d++) {
    sheet.deleteRow(rowsToDelete[d]);
  }

  // Apply luxury styling to Sheet1 and rebuild Bride & Bridegroom tabs
  styleMasterRsvpSheet(sheet);
  var savedGuestList = readGuestList(ss);
  var currentRsvps = readRsvps(sheet);
  if (savedGuestList && savedGuestList.length > 0) {
    rebuildAndStyleSideTabs(ss, savedGuestList, currentRsvps);
  }

  return rowsToDelete.length;
}

/**
 * Applies editorial charcoal & champagne-gold styling to Sheet1 (Master RSVPs).
 */
function styleMasterRsvpSheet(sheet) {
  if (!sheet) return;
  var headers = [[
    'Submitted At',
    'Guest Name',
    'Phone / WhatsApp',
    'Attendance',
    'Guests (Seats)',
    'Dietary / Heartfelt Wishes',
    'Family Side'
  ]];
  sheet.getRange(1, 1, 1, 7).setValues(headers);

  var headerRange = sheet.getRange(1, 1, 1, 7);
  headerRange
    .setBackground('#141414')
    .setFontColor('#E8D3B9')
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontSize(10)
    .setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);

  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var numRows = lastRow - 1;
    var dataRange = sheet.getRange(2, 1, numRows, 7);
    dataRange
      .setFontFamily('Arial')
      .setFontSize(10)
      .setVerticalAlignment('middle');

    sheet.getRange(2, 3, numRows, 1).setNumberFormat('@');
    sheet.getRange(2, 4, numRows, 2).setHorizontalAlignment('center');
    sheet.getRange(2, 6, numRows, 1).setWrap(true);
    sheet.getRange(2, 7, numRows, 1).setHorizontalAlignment('center').setFontWeight('bold');

    var vals = dataRange.getValues();
    var bgColors = [];
    var fontColors = [];

    for (var r = 0; r < vals.length; r++) {
      var isEven = r % 2 === 1;
      var baseBg = isEven ? '#FAF8F5' : '#FFFFFF';
      var att = String(vals[r][3] || 'attending').toLowerCase();
      var side = String(vals[r][6] || 'BRIDE').toUpperCase();

      var attBg = att === 'declining' ? '#FFE4E6' : '#DCFCE7';
      var attFg = att === 'declining' ? '#9F1239' : '#166534';

      var sideBg = side === 'BRIDEGROOM' ? '#DBEAFE' : '#FCE7F3';
      var sideFg = side === 'BRIDEGROOM' ? '#1E40AF' : '#9D174D';

      bgColors.push([baseBg, baseBg, baseBg, attBg, baseBg, baseBg, sideBg]);
      fontColors.push(['#555555', '#111111', '#222222', attFg, '#111111', '#333333', sideFg]);
    }

    dataRange.setBackgrounds(bgColors);
    dataRange.setFontColors(fontColors);
  }

  sheet.setColumnWidth(1, 165);
  sheet.setColumnWidth(2, 210);
  sheet.setColumnWidth(3, 150);
  sheet.setColumnWidth(4, 115);
  sheet.setColumnWidth(5, 115);
  sheet.setColumnWidth(6, 360);
  sheet.setColumnWidth(7, 140);
}

/**
 * Automatically builds & styles the two dedicated family sheets:
 * 1) 'Bride (Sithandiwe)'
 * 2) 'Bridegroom (Ndumiso)'
 */
function rebuildAndStyleSideTabs(ss, guestList, rsvps) {
  if (!Array.isArray(guestList) || guestList.length === 0) return;

  var brideGuests = [];
  var groomGuests = [];

  for (var i = 0; i < guestList.length; i++) {
    var g = guestList[i];
    var side = String(g.side || (g.id <= 95 ? 'BRIDE' : 'BRIDEGROOM')).toUpperCase();
    if (side === 'BRIDEGROOM') {
      groomGuests.push(g);
    } else {
      brideGuests.push(g);
    }
  }

  renderCategorySheet(
    ss,
    BRIDE_TAB_NAME,
    'BRIDE\\'S FAMILY & GUESTS — SITHANDIWE SIBANDA',
    '#831843',
    '#FDF2F8',
    brideGuests
  );

  renderCategorySheet(
    ss,
    GROOM_TAB_NAME,
    'BRIDEGROOM\\'S FAMILY & GUESTS — NDUMISO MASUKU',
    '#1E3A8A',
    '#EFF6FF',
    groomGuests
  );
}

function renderCategorySheet(ss, tabName, bannerTitle, accentHex, softTintHex, sideGuests) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
  }
  sheet.clearContents();
  sheet.clearFormats();

  var attendingCount = 0;
  var confirmedSeats = 0;
  var declinedCount = 0;
  var pendingCount = 0;

  for (var i = 0; i < sideGuests.length; i++) {
    var st = String(sideGuests[i].rsvpStatus || 'pending').toLowerCase();
    if (st === 'attending') {
      attendingCount++;
      confirmedSeats += Number(sideGuests[i].rsvpGuests || sideGuests[i].allowedGuests || 1);
    } else if (st === 'declining') {
      declinedCount++;
    } else {
      pendingCount++;
    }
  }

  // Row 1: Luxury Title Banner
  sheet.getRange(1, 1, 1, 8).merge();
  sheet.getRange(1, 1).setValue(bannerTitle);
  sheet.getRange(1, 1, 1, 8)
    .setBackground('#141414')
    .setFontColor('#E8D3B9')
    .setFontFamily('Georgia')
    .setFontSize(12)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);

  // Row 2: Live Summary Scorecard
  var summaryText =
    'Total Invites: ' + sideGuests.length +
    '   |   Attending: ' + attendingCount + ' (' + confirmedSeats + ' Confirmed Seats)' +
    '   |   Declined: ' + declinedCount +
    '   |   Awaiting RSVP: ' + pendingCount;
  sheet.getRange(2, 1, 1, 8).merge();
  sheet.getRange(2, 1).setValue(summaryText);
  sheet.getRange(2, 1, 1, 8)
    .setBackground(softTintHex)
    .setFontColor(accentHex)
    .setFontFamily('Arial')
    .setFontSize(10)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(2, 28);

  // Row 3: Table Headers
  var headers = [[
    'Invite #',
    'Guest / Couple Name',
    'Family Side',
    'Phone / WhatsApp',
    'Max Seats',
    'RSVP Status',
    'Confirmed Seats',
    'Dietary / Heartfelt Wishes & Standby Notes'
  ]];
  sheet.getRange(3, 1, 1, 8).setValues(headers);
  sheet.getRange(3, 1, 1, 8)
    .setBackground(accentHex)
    .setFontColor('#FFFFFF')
    .setFontFamily('Arial')
    .setFontSize(10)
    .setFontWeight('bold')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(3, 30);
  sheet.setFrozenRows(3);

  if (sideGuests.length === 0) return;

  var rows = [];
  var bgMatrix = [];
  var fgMatrix = [];

  for (var idx = 0; idx < sideGuests.length; idx++) {
    var g = sideGuests[idx];
    var status = String(g.rsvpStatus || 'pending').toLowerCase();
    var statusLabel =
      status === 'attending'
        ? 'ATTENDING'
        : status === 'declining'
        ? 'DECLINED'
        : 'PENDING';
    var seats =
      status === 'attending'
        ? Number(g.rsvpGuests || g.allowedGuests || 1)
        : 0;
    var noteParts = [];
    if (g.rsvpNotes) noteParts.push(String(g.rsvpNotes).trim());
    if (g.replacedGuest) noteParts.push('[Replaced: ' + g.replacedGuest + ']');

    rows.push([
      g.id || (idx + 1),
      g.name || '',
      g.side || 'BRIDE',
      formatDisplayPhone(g.phone, g.name),
      g.allowedGuests || 1,
      statusLabel,
      seats,
      noteParts.join(' | ')
    ]);

    var baseRowBg = idx % 2 === 1 ? '#FAF8F5' : '#FFFFFF';
    var statusBg =
      status === 'attending'
        ? '#DCFCE7'
        : status === 'declining'
        ? '#FFE4E6'
        : '#FEF3C7';
    var statusFg =
      status === 'attending'
        ? '#166534'
        : status === 'declining'
        ? '#9F1239'
        : '#92400E';

    bgMatrix.push([
      baseRowBg,
      baseRowBg,
      softTintHex,
      baseRowBg,
      baseRowBg,
      statusBg,
      baseRowBg,
      baseRowBg
    ]);
    fgMatrix.push([
      '#666666',
      '#111111',
      accentHex,
      '#222222',
      '#333333',
      statusFg,
      status === 'attending' ? '#166534' : '#888888',
      '#333333'
    ]);
  }

  var bodyRange = sheet.getRange(4, 1, rows.length, 8);
  sheet.getRange(4, 4, rows.length, 1).setNumberFormat('@');
  bodyRange.setValues(rows);
  bodyRange.setBackgrounds(bgMatrix);
  bodyRange.setFontColors(fgMatrix);
  bodyRange.setFontFamily('Arial').setFontSize(10).setVerticalAlignment('middle');

  sheet.getRange(4, 1, rows.length, 1).setHorizontalAlignment('center');
  sheet.getRange(4, 3, rows.length, 1).setHorizontalAlignment('center').setFontWeight('bold');
  sheet.getRange(4, 5, rows.length, 3).setHorizontalAlignment('center');
  sheet.getRange(4, 6, rows.length, 1).setFontWeight('bold');
  sheet.getRange(4, 8, rows.length, 1).setWrap(true);

  sheet.setColumnWidth(1, 80);
  sheet.setColumnWidth(2, 230);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 150);
  sheet.setColumnWidth(5, 95);
  sheet.setColumnWidth(6, 120);
  sheet.setColumnWidth(7, 125);
  sheet.setColumnWidth(8, 380);
}

function readRsvps(sheet) {
  if (!sheet || sheet.getLastRow() < 1) return [];
  var lastRow = sheet.getLastRow();
  var lastCol = Math.max(sheet.getLastColumn(), 7);
  var values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  var startIdx = isHeaderRow(values[0]) ? 1 : 0;
  var list = [];
  for (var i = startIdx; i < values.length; i++) {
    var r = values[i];
    if (!r[1] && !r[2]) continue;
    list.push({
      submittedAt: r[0] ? String(r[0]) : '',
      name: String(r[1] || '').trim(),
      phone: formatDisplayPhone(r[2], r[1]),
      attendance: String(r[3] || 'attending').trim().toLowerCase(),
      guests: r[4] || 1,
      notes: String(r[5] || '').trim(),
      side: String(r[6] || 'BRIDE').trim().toUpperCase()
    });
  }
  return list;
}

function readGuestList(ss) {
  var gSheet = ss.getSheetByName(GUEST_LIST_SHEET_NAME);
  if (!gSheet || gSheet.getLastRow() < 2) return null;
  var rawJson = gSheet.getRange(2, 6).getValue() || gSheet.getRange(2, 5).getValue();
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
  gSheet.getRange(1, 1, 1, 6).setValues([['ID', 'Name', 'Side', 'Phone', 'AllowedGuests', 'FullStateJSON']]);
  try {
    var parsed = JSON.parse(guestListJson);
    if (Array.isArray(parsed) && parsed.length > 0) {
      var rows = parsed.map(function(g, idx) {
        return [
          g.id || (idx + 1),
          g.name || '',
          g.side || (g.id <= 95 ? 'BRIDE' : 'BRIDEGROOM'),
          formatDisplayPhone(g.phone || '', g.name),
          g.allowedGuests || 1,
          idx === 0 ? guestListJson : ''
        ];
      });
      gSheet.getRange(2, 4, rows.length, 1).setNumberFormat('@');
      gSheet.getRange(2, 1, rows.length, 6).setValues(rows);

      var sheet = ss.getSheetByName(RSVPS_SHEET_NAME) || ss.getSheets()[0];
      rebuildAndStyleSideTabs(ss, parsed, readRsvps(sheet));
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

    // Admin Portal actions: saveGuestList, replaceGuest, updateGuest, deduplicateSheet, styleAndSyncSheets
    if (e.parameter && e.parameter.guestListJson) {
      saveGuestListToSheet(ss, e.parameter.guestListJson);
    }

    if (action === 'replaceGuest' && e.parameter.oldName) {
      var targetOldKey = normalizeName(e.parameter.oldName);
      var lastR = sheet.getLastRow();
      if (lastR >= 1) {
        var vals = sheet.getRange(1, 1, lastR, Math.max(sheet.getLastColumn(), 7)).getValues();
        var sIdx = isHeaderRow(vals[0]) ? 1 : 0;
        for (var rIdx = vals.length - 1; rIdx >= sIdx; rIdx--) {
          if (normalizeName(vals[rIdx][1]) === targetOldKey) {
            sheet.deleteRow(rIdx + 1);
          }
        }
      }
    }

    if (
      action === 'saveGuestList' ||
      action === 'replaceGuest' ||
      action === 'updateGuest' ||
      action === 'deduplicateSheet' ||
      action === 'styleAndSyncSheets'
    ) {
      styleMasterRsvpSheet(sheet);
      var savedList = readGuestList(ss);
      if (savedList) {
        rebuildAndStyleSideTabs(ss, savedList, readRsvps(sheet));
      }
      return ContentService.createTextOutput(JSON.stringify({
        result: 'success',
        duplicatesRemoved: duplicatesRemoved
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Standard RSVP Upsert (1 row per guest scoped by Side — never duplicates!)
    var submittedAt = e.parameter.submittedAt || new Date().toISOString();
    var name = String(e.parameter.name || '').trim();
    var phone = formatDisplayPhone(e.parameter.phone || '', name);
    var attendance = String(e.parameter.attendance || 'attending').trim();
    var guests = e.parameter.guests || '1';
    var notes = String(e.parameter.notes || '').trim();
    var side = String(e.parameter.side || 'BRIDE').trim().toUpperCase();
    if (side !== 'BRIDE' && side !== 'BRIDEGROOM') side = 'BRIDE';

    if (!name) {
      return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: 'Missing name' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var normInName = normalizeName(name);
    var normInPhone = normalizePhone(phone);
    var updatedExisting = false;

    if (sheet.getLastRow() >= 1) {
      var data = sheet.getRange(1, 1, sheet.getLastRow(), Math.max(sheet.getLastColumn(), 7)).getValues();
      var start = isHeaderRow(data[0]) ? 1 : 0;
      for (var i = start; i < data.length; i++) {
        var rowName = normalizeName(data[i][1]);
        var rowPhone = normalizePhone(data[i][2]);
        var rowSide = String(data[i][6] || 'BRIDE').trim().toUpperCase();
        var sameSide = (rowSide === side);

        if (sameSide && ((normInName && rowName === normInName) || (normInPhone && rowPhone && normInPhone === rowPhone && rowName === normInName))) {
          var finalNotes = notes || String(data[i][5] || '').trim();
          sheet.getRange(i + 1, 3).setNumberFormat('@');
          sheet.getRange(i + 1, 1, 1, 7).setValues([[submittedAt, name, phone, attendance, guests, finalNotes, side]]);
          updatedExisting = true;
          break;
        }
      }
    }

    if (!updatedExisting) {
      var nextRow = sheet.getLastRow() + 1;
      sheet.getRange(nextRow, 3).setNumberFormat('@');
      sheet.getRange(nextRow, 1, 1, 7).setValues([[submittedAt, name, phone, attendance, guests, notes, side]]);
    }

    styleMasterRsvpSheet(sheet);

    // Also update the saved GuestList tab & Bride / Bridegroom tabs if present
    var currentGuestList = readGuestList(ss);
    if (Array.isArray(currentGuestList) && currentGuestList.length > 0) {
      for (var gIdx = 0; gIdx < currentGuestList.length; gIdx++) {
        var gItem = currentGuestList[gIdx];
        var gSide = String(gItem.side || (gItem.id <= 95 ? 'BRIDE' : 'BRIDEGROOM')).toUpperCase();
        if (gSide === side && normalizeName(gItem.name) === normInName) {
          gItem.phone = phone || gItem.phone;
          gItem.rsvpStatus = attendance.toLowerCase() === 'declining' ? 'declining' : 'attending';
          gItem.rsvpGuests = Number(guests) || 1;
          gItem.rsvpNotes = notes || gItem.rsvpNotes || '';
          gItem.rsvpSubmittedAt = submittedAt;
          break;
        }
      }
      saveGuestListToSheet(ss, JSON.stringify(currentGuestList));
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
