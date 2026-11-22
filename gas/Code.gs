/**
 * 圖鑑配對碰｜後端（Google Apps Script Web App）
 * 馬偕醫學大學圖書館 × 飛資得醫學資訊
 *
 * 部署步驟見 README-game.md。
 * 第一次使用：在 Apps Script 編輯器選擇函式 setup → 執行，會建立 records、config 工作表。
 *
 * API：前端以 POST（Content-Type: text/plain）送 JSON，用 action 區分
 *   submit     寫入一局紀錄；通過時由後端產生不重複的兌換碼
 *   verifyPin  驗證工作人員 PIN
 *   redeem     （需 PIN）核銷兌換碼，同一碼只能核銷一次
 *   stats      （需 PIN）活動數據與通過名單
 */

// 若此程式不是從試算表「擴充功能 → Apps Script」建立的，請在這裡填試算表 ID
const SHEET_ID = '';

// 必須與前端 game.html 的 CONFIG 一致
const HOME_COUNT = 7;
const BOOTH_COUNT = 5;
const PASS_RATE = 0.8;

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // 排除 0 O 1 I L
const HEADERS = ['時間戳記', '模式', '姓名', '學校', '科系', '學號', 'Email', '答對數', '總題數',
                 '是否通過', '兌換碼', '抽到的題目ID', '點開原圖數', '是否已兌換', '兌換時間', '局ID'];
// 欄位位置（1 起算）
const C = { time: 1, mode: 2, name: 3, school: 4, dept: 5, sid: 6, email: 7, score: 8, total: 9,
            passed: 10, code: 11, qids: 12, visited: 13, redeemed: 14, redeemedAt: 15, rid: 16 };

/* ---------------- 進入點 ---------------- */

function doPost(e) {
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (req.action) {
      case 'submit':    return json_(submit_(req.record || {}));
      case 'verifyPin': return json_({ ok: true, valid: checkPin_(req.pin) });
      case 'redeem':    requirePin_(req.pin); return json_(redeem_(req.code));
      case 'stats':     requirePin_(req.pin); return json_(stats_());
      default:          return json_({ ok: false, error: 'UNKNOWN_ACTION' });
    }
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'mmu-healthlibrary-game' });
}

/* ---------------- 第一次設定 ---------------- */

function setup() {
  const ss = ss_();
  let rec = ss.getSheetByName('records');
  if (!rec) rec = ss.insertSheet('records');
  if (rec.getLastRow() === 0) rec.appendRow(HEADERS);
  rec.setFrozenRows(1);
  rec.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  // 學號、兌換碼、題目ID、局ID 存成純文字（避免學號開頭的 0 被吃掉）
  [C.sid, C.code, C.qids, C.rid].forEach(col => rec.getRange(1, col, rec.getMaxRows(), 1).setNumberFormat('@'));

  let cfg = ss.getSheetByName('config');
  if (!cfg) cfg = ss.insertSheet('config');
  if (cfg.getLastRow() === 0) {
    cfg.appendRow(['key', 'value', '說明']);
    cfg.appendRow(['STAFF_PIN', '請改成6位數以上', '擺攤現場模式的工作人員 PIN']);
    cfg.getRange('B2').setNumberFormat('@');
  }
}

/* ---------------- 動作 ---------------- */

function submit_(r) {
  const mode = r.mode === 'booth' ? 'booth' : 'home';
  const total = toInt_(r.total);
  const score = toInt_(r.score);
  const rid = clean_(r.rid, 64);
  const sid = clean_(r.sid, 40).toUpperCase();
  if (!rid) throw new Error('MISSING_RID');
  if (!sid) throw new Error('MISSING_SID');
  if (total !== (mode === 'home' ? HOME_COUNT : BOOTH_COUNT)) throw new Error('BAD_TOTAL');
  if (score < 0 || score > total) throw new Error('BAD_SCORE');

  const p = {
    name: clean_(r.name, 60), school: clean_(r.school, 60), dept: clean_(r.dept, 60),
    email: clean_(r.email, 120)
  };
  if (mode === 'home') {
    if (!p.name || !p.school || !p.dept || !p.email) throw new Error('MISSING_FIELDS');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) throw new Error('BAD_EMAIL');
  }
  const passed = mode === 'home' && score >= Math.ceil(total * PASS_RATE);

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_('records');
    const rows = dataRows_(sh);
    // 網路重送時同一局只寫一次
    const dup = rows.find(row => String(row[C.rid - 1]) === rid);
    if (dup) return { ok: true, passed: dup[C.passed - 1] === '是', code: String(dup[C.code - 1] || '') };

    let code = '';
    if (passed) {
      const used = new Set(rows.map(row => String(row[C.code - 1])));
      do { code = genCode_(); } while (used.has(code));
    }
    const row = new Array(HEADERS.length).fill('');
    row[C.time - 1] = new Date();
    row[C.mode - 1] = mode;
    row[C.name - 1] = safe_(p.name);
    row[C.school - 1] = safe_(p.school);
    row[C.dept - 1] = safe_(p.dept);
    row[C.sid - 1] = safe_(sid);
    row[C.email - 1] = safe_(p.email);
    row[C.score - 1] = score;
    row[C.total - 1] = total;
    row[C.passed - 1] = passed ? '是' : '否';
    row[C.code - 1] = code;
    row[C.qids - 1] = clean_(r.qids, 200).replace(/[^0-9,]/g, '');
    row[C.visited - 1] = Math.max(0, Math.min(total, toInt_(r.visited)));
    row[C.redeemed - 1] = passed ? '否' : '';
    row[C.rid - 1] = rid;
    sh.appendRow(row);
    return { ok: true, passed: passed, code: code };
  } finally {
    lock.releaseLock();
  }
}

function redeem_(raw) {
  const code = normCode_(raw);
  if (!code) return { ok: true, status: 'notfound' };
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_('records');
    const rows = dataRows_(sh);
    const i = rows.findIndex(row => String(row[C.code - 1]) === code && row[C.passed - 1] === '是');
    if (i < 0) return { ok: true, status: 'notfound' };
    const row = rows[i];
    const info = {
      name: row[C.name - 1], dept: row[C.dept - 1], sid: String(row[C.sid - 1]),
      score: row[C.score - 1], total: row[C.total - 1]
    };
    if (row[C.redeemed - 1] === '是') {
      info.redeemedAt = iso_(row[C.redeemedAt - 1]);
      return { ok: true, status: 'used', rec: info };
    }
    const now = new Date();
    sh.getRange(i + 2, C.redeemed, 1, 2).setValues([['是', now]]);
    info.redeemedAt = now.toISOString();
    return { ok: true, status: 'ok', rec: info };
  } finally {
    lock.releaseLock();
  }
}

function stats_() {
  const rows = dataRows_(sheet_('records'));
  const home = rows.filter(r => r[C.mode - 1] === 'home');
  const passed = home.filter(r => r[C.passed - 1] === '是');
  return {
    ok: true,
    homePlays: home.length,
    passCount: passed.length,
    uniquePass: new Set(passed.map(r => String(r[C.sid - 1]))).size,
    redeemed: passed.filter(r => r[C.redeemed - 1] === '是').length,
    boothPlays: rows.filter(r => r[C.mode - 1] === 'booth').length,
    passList: passed.map(r => ({
      code: String(r[C.code - 1]), name: r[C.name - 1], dept: r[C.dept - 1], sid: String(r[C.sid - 1]),
      score: r[C.score - 1], total: r[C.total - 1], redeemed: r[C.redeemed - 1] === '是', time: iso_(r[C.time - 1])
    }))
  };
}

/* ---------------- PIN ---------------- */

function checkPin_(pin) {
  const ok = String(pin || '') !== '' && String(pin) === getStaffPin_();
  if (!ok) Utilities.sleep(1000); // 拖慢暴力猜測
  return ok;
}

function requirePin_(pin) {
  if (!checkPin_(pin)) throw new Error('PIN_INVALID');
}

function getStaffPin_() {
  const sh = sheet_('config');
  const vals = sh.getDataRange().getValues();
  for (let i = 1; i < vals.length; i++) {
    if (String(vals[i][0]).trim() === 'STAFF_PIN') return String(vals[i][1]).trim();
  }
  throw new Error('STAFF_PIN_NOT_SET');
}

/* ---------------- 工具 ---------------- */

function ss_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function sheet_(name) {
  const sh = ss_().getSheetByName(name);
  if (!sh) throw new Error('SHEET_MISSING_' + name + '（請先執行 setup）');
  return sh;
}

function dataRows_(sh) {
  const n = sh.getLastRow() - 1;
  if (n <= 0) return [];
  return sh.getRange(2, 1, n, HEADERS.length).getValues();
}

function genCode_() {
  let s = 'MMU-';
  for (let i = 0; i < 4; i++) s += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  return s;
}

function normCode_(raw) {
  let c = String(raw || '').toUpperCase().replace(/\s+/g, '');
  if (!c) return '';
  if (c.indexOf('MMU-') === 0) return c;
  if (c.indexOf('MMU') === 0 && c.length === 7) return 'MMU-' + c.slice(3);
  return 'MMU-' + c;
}

function clean_(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

// 防止使用者輸入被試算表當成公式
function safe_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function toInt_(v) {
  const n = parseInt(v, 10);
  return isNaN(n) ? -1 : n;
}

function iso_(v) {
  return v instanceof Date ? v.toISOString() : String(v || '');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
