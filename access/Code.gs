/**
 * Hatchet Survival: invite-only access
 *
 * The front desk for the game. When someone asks to play, the game sends their email here. This script adds
 * them to the "Requests" sheet and emails you Approve and Deny buttons. When you approve, the game opens for
 * them by itself, and they get an email saying they are in.
 *
 * To take someone's access away later, type "denied" in their Status cell (or delete their row).
 * The setup steps are in the game's README, under "Invite-only access".
 */
const GAME_URL = 'https://ejpeakin.github.io/hatchet-game/';   // where players open the game (used in the "you're in" email)
const MAX_EMAILS_PER_HOUR = 20;                                // a cap on request emails, in case someone floods the form
const SHEET_NAME = 'Requests';
const COL = { time: 1, email: 2, name: 3, status: 4, id: 5, key: 6, token: 7 };

function doGet(e) {
  const p = (e && e.parameter) || {};
  const out = o => json_(o, p.callback);
  try {
    if (p.action === 'request') return out(request_(p));
    if (p.action === 'status') return out(status_(p));
    if (p.action === 'approve' || p.action === 'deny') return decide_(p);
    return page_('Hatchet access is running', 'The game uses this address to send requests. Requests are listed in your Requests sheet.');
  } catch (err) {
    console.error(err);
    return out({ ok: false, error: 'server', detail: String(err && err.message || err).slice(0, 160) });
  }
}

/* A player asks to play. Their browser sends a random key with the request, and only that browser can see
   the answer, so passing the link on does not let anyone else in. */
function request_(p) {
  const email = String(p.email || '').trim().toLowerCase().slice(0, 120);
  const name = String(p.name || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const key = String(p.key || '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { ok: false, error: 'email' };
  if (!/^[0-9a-f]{32}$/.test(key)) return { ok: false, error: 'key' };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const row = findRow_(sh, COL.key, key);
    if (row) {
      const r = sh.getRange(row, 1, 1, COL.id).getValues()[0];
      const same = String(r[COL.email - 1]).toLowerCase() === email, status = String(r[COL.status - 1]).toLowerCase();
      if (same && (status === 'approved' || status === 'pending')) return { ok: true, id: r[COL.id - 1], status };   // already asked: no second email
    }
    if (!underLimit_()) return { ok: false, error: 'busy' };
    // a new request, or asking again after a "no" (the same row is reopened)
    const id = row ? sh.getRange(row, COL.id).getValue() : Utilities.getUuid();
    const token = Utilities.getUuid().replace(/-/g, '');
    const values = [new Date(), safe_(email), safe_(name), 'pending', id, key, token];
    if (row) sh.getRange(row, 1, 1, values.length).setValues([values]);
    else sh.appendRow(values);
    notifyOwner_(email, name, id, token);
    return { ok: true, id, status: 'pending' };
  } finally {
    lock.releaseLock();
  }
}

/* The game asks where a request stands: approved, denied, pending, or unknown (the row was deleted). */
function status_(p) {
  const sh = sheet_();
  const row = findRow_(sh, COL.id, String(p.id || ''));
  if (!row || String(sh.getRange(row, COL.key).getValue()) !== String(p.key || '')) return { ok: true, status: 'unknown' };
  const s = String(sh.getRange(row, COL.status).getValue()).trim().toLowerCase();
  return { ok: true, status: s === 'approved' || s === 'denied' ? s : 'pending' };
}

/* You pressed Approve or Deny in the email. The first page asks you to confirm, so the link checkers some
   email apps run cannot approve anyone just by opening the link. */
function decide_(p) {
  const approve = p.action === 'approve';
  const sh = sheet_();
  const row = findRow_(sh, COL.id, String(p.id || ''));
  if (!row || !p.token || String(sh.getRange(row, COL.token).getValue()) !== String(p.token)) {
    return page_('This link does not work', 'It may be from an older request. Every request is listed in your Requests sheet.');
  }
  const r = sh.getRange(row, 1, 1, COL.status).getValues()[0];
  const email = String(r[COL.email - 1]), name = String(r[COL.name - 1]), was = String(r[COL.status - 1]).toLowerCase();
  const who = name ? name + ' (' + email + ')' : email;
  if (p.confirm !== '1') {
    const form = '<form method="get" action="' + esc_(ScriptApp.getService().getUrl()) + '" target="_top">' +
      ['action', 'id', 'token'].map(k => '<input type="hidden" name="' + k + '" value="' + esc_(p[k]) + '">').join('') +
      '<input type="hidden" name="confirm" value="1"><button type="submit">' + (approve ? 'Yes, let them play' : 'Yes, deny') + '</button></form>';
    return page_((approve ? 'Approve ' : 'Deny ') + who + '?', approve ? 'They will be able to play straight away.' : 'They will see that their request was not approved.', form);
  }
  sh.getRange(row, COL.status).setValue(approve ? 'approved' : 'denied');
  if (approve && was !== 'approved') {
    try {
      MailApp.sendEmail(email, "You're in: Hatchet Survival",
        'Your request to play Hatchet Survival was approved.\n\nPlay here: ' + GAME_URL +
        '\n\nIf you still have the game open on the sign-in screen, it opens by itself.');
    } catch (err) { console.error(err); }
  }
  return page_(approve ? 'Approved' : 'Denied', approve ? who + ' can play now. If they still have the game open, it opens by itself.' : who + ' will see that their request was not approved.');
}

function notifyOwner_(email, name, id, token) {
  const base = ScriptApp.getService().getUrl();
  const link = a => base + '?action=' + a + '&id=' + encodeURIComponent(id) + '&token=' + token;
  const who = name ? name + ' (' + email + ')' : email;
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: 'Hatchet Survival: ' + (name || email) + ' wants to play',
    body: who + ' asked to play Hatchet Survival.\n\nApprove: ' + link('approve') + '\nDeny: ' + link('deny'),
    htmlBody: '<p><b>' + esc_(who) + '</b> asked to play Hatchet Survival.</p>' +
      '<p><a href="' + link('approve') + '" style="display:inline-block;padding:10px 18px;background:#e8863a;color:#1a0f06;text-decoration:none;border-radius:6px;font-weight:bold">Approve</a>' +
      '&nbsp;&nbsp;<a href="' + link('deny') + '" style="display:inline-block;padding:10px 18px;border:1px solid #999;color:#333;text-decoration:none;border-radius:6px">Deny</a></p>' +
      '<p style="color:#666">Each button opens a page where you confirm. Everyone who has asked is listed in your Requests sheet.</p>'
  });
}

/* ---- helpers ---- */
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Time', 'Email', 'Name', 'Status', 'Request ID', 'Device key', 'Approve token']);
    sh.setFrozenRows(1);
  }
  return sh;
}
function findRow_(sh, col, value) {   // the row holding exactly `value` in column `col`, or 0
  if (!value || sh.getLastRow() < 2) return 0;
  const cell = sh.getRange(2, col, sh.getLastRow() - 1, 1).createTextFinder(value).matchEntireCell(true).findNext();
  return cell ? cell.getRow() : 0;
}
function underLimit_() {
  const cache = CacheService.getScriptCache(), k = 'mails-' + Math.floor(Date.now() / 3600000), n = Number(cache.get(k) || 0);
  if (n >= MAX_EMAILS_PER_HOUR) return false;
  cache.put(k, String(n + 1), 3700);
  return true;
}
function safe_(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }   // keep the sheet from reading a typed name as a formula
function esc_(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
/* JSON, or JSONP when the game asks for a callback (its backup when a browser will not hand back the plain answer) */
function json_(o, callback) {
  if (callback && /^[A-Za-z_$][\w$]{0,40}$/.test(callback)) return ContentService.createTextOutput(callback + '(' + JSON.stringify(o) + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function page_(title, text, extra) {
  const html = '<!doctype html><meta charset="utf-8"><style>body{font:16px/1.5 system-ui,sans-serif;max-width:480px;margin:40px auto;padding:0 16px;color:#222}' +
    'h1{font-size:22px}button{font:600 16px system-ui,sans-serif;padding:10px 18px;border:0;border-radius:6px;background:#e8863a;color:#1a0f06;cursor:pointer}</style>' +
    '<h1>' + esc_(title) + '</h1>' + (text ? '<p>' + esc_(text) + '</p>' : '') + (extra || '');
  return HtmlService.createHtmlOutput(html).setTitle('Hatchet access').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
