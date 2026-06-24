// ============================================================
// PEARLA'S WORKSPACE – Google Apps Script Backend (FULL)
// Lim inn HELE denne filen i Apps Script-editoren i Google Sheets
// Extensions → Apps Script → slett det som er der → lim inn → Lagre → Deploy
// Etter liming: kjør funksjonen "initAllSheets" én gang manuelt
// ============================================================

const SHEET_NAMES = {
  // Jobb
  tasks:       'Oppgaver',
  taskArchive: 'Oppgaver_Arkiv',
  taskBacklog: 'Oppgaver_Backlog',
  projects:    'Prosjekter',
  meetings:    'Møtenotater',
  meetingCats: 'Møte_Kategorier',
  retroDaily:  'Retro_Daglig',
  retroWeekly: 'Retro_Ukentlig',
  retroMonthly:'Retro_Månedlig',
  energy:      'Energilogg',
  mood:        'Humørlogg',
  events:      'Kalender',
  timeLog:     'Timeføring',
  matrise:     'Prioriteringsmatrise',
  notebooks:   'Notater_Mapper',

  // Personal
  handel:      'Personal_Handleliste',
  hjem:        'Personal_Gjøremål',
  vaner:       'Personal_Vaner',
  trening:     'Personal_Trening',
  matIdeas:    'Personal_Matideer',
  sosialt:     'Personal_Sosialt',
  okonomi:     'Personal_Økonomi',
  mal:         'Personal_Mål',
  dagbok:      'Personal_Dagbok',
  fritid:      'Personal_Fritid',

  // Diverse
  meta:        'Meta',
};

// ------------------------------------------------------------
// CORS + Router – alle forespørsler går hit
// ------------------------------------------------------------
function doGet(e) {
  return handleRequest(e);
}
function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const params = e.parameter || {};
    const body   = e.postData ? JSON.parse(e.postData.contents || '{}') : {};
    const action = params.action || body.action;
    const sheet  = params.sheet  || body.sheet;

    let result;
    switch (action) {
      case 'get':       result = getData(sheet); break;
      case 'save':      result = saveData(sheet, body.data); break;
      case 'append':    result = appendRow(sheet, body.row); break;
      case 'delete':    result = deleteRow(sheet, body.rowIndex); break;
      case 'getBlob':   result = getBlob(sheet); break;
      case 'saveBlob':  result = saveBlob(sheet, body.json); break;
      case 'ping':      result = { ok: true, message: 'Tilkobling OK!' }; break;
      default:          result = { ok: false, error: 'Ukjent action: ' + action };
    }
    output.setContent(JSON.stringify(result));
  } catch (err) {
    output.setContent(JSON.stringify({ ok: false, error: err.message }));
  }
  return output;
}

// ------------------------------------------------------------
// TABELL-BASERT LAGRING (radvis, for arrays av objekter)
// Brukes for: oppgaver, prosjekter, møter, kalender, osv.
// ------------------------------------------------------------
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function getData(sheetName) {
  const sheet = getSheet(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return { ok: true, rows: [] };
  const headers = values[0];
  const rows = values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
  return { ok: true, rows };
}

function saveData(sheetName, data) {
  if (!Array.isArray(data)) return { ok: false, error: 'data må være en liste' };
  const sheet = getSheet(sheetName);
  sheet.clear();
  if (data.length === 0) return { ok: true };

  const headers = Object.keys(data[0]);
  const rows = data.map(obj => headers.map(h => obj[h] !== undefined ? obj[h] : ''));

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  return { ok: true };
}

function appendRow(sheetName, row) {
  const sheet = getSheet(sheetName);
  const headers = Object.keys(row);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  const values = headers.map(h => row[h]);
  sheet.appendRow(values);
  return { ok: true };
}

function deleteRow(sheetName, rowIndex) {
  const sheet = getSheet(sheetName);
  sheet.deleteRow(rowIndex + 2); // +1 for header, +1 for 1-indexing
  return { ok: true };
}

// ------------------------------------------------------------
// BLOB-BASERT LAGRING (for nestede/komplekse strukturer)
// Brukes for: notebooks (mapper+notislapper+seksjoner+rich text),
// matrise (4 kvadranter), personal-data
// Lagres som én stor JSON-streng i celle A1 på et eget ark
// ------------------------------------------------------------
function getBlob(sheetName) {
  const sheet = getSheet(sheetName);
  const json = sheet.getRange('A1').getValue();
  if (!json) return { ok: true, json: null };
  try {
    return { ok: true, json: JSON.parse(json) };
  } catch (e) {
    return { ok: true, json: null };
  }
}

function saveBlob(sheetName, jsonObj) {
  const sheet = getSheet(sheetName);
  sheet.clear();
  sheet.getRange('A1').setValue(JSON.stringify(jsonObj));
  return { ok: true };
}

// ------------------------------------------------------------
// INIT – kjør denne én gang manuelt for å lage alle ark
// ------------------------------------------------------------
function initAllSheets() {
  Object.values(SHEET_NAMES).forEach(name => {
    getSheet(name);
  });
  SpreadsheetApp.getActiveSpreadsheet().toast('Alle ark er opprettet!');
}
