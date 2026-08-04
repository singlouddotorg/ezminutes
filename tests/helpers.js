// Shared test helpers for the EZ Minutes suite's Node-based regression tests.
//
// These wrap the same jsdom patterns used throughout this project's development to
// manually verify fixes - the point of this test suite is to make those checks
// permanent instead of throwaway, not to introduce a different testing approach.
'use strict';

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Points at the actual suite files - this assumes tests/ sits as a direct sibling
// folder to capture.html, compile.html, etc. (i.e. tests/ lives inside the suite's own
// folder, one level below capture.html). Adjust here if the folder layout ever changes,
// rather than in every individual test file.
const SUITE_DIR = path.join(__dirname, '..');

function suitePath(...parts) {
  return path.join(SUITE_DIR, ...parts);
}

function readSuiteFile(...parts) {
  return fs.readFileSync(suitePath(...parts), 'utf8');
}

// Loads one of the suite's HTML pages into a jsdom window with scripts running.
// Uses a file:// URL so the page's own <script src="tunebook-index.js"> resolves and
// loads correctly - this is required for Capture, Compile, and Tunebook Editor, all of
// which depend on that shared file being present alongside them, exactly as a real
// browser opening these files directly from disk would see them.
//
// Known limitation, inherited from manual testing throughout this project: jsdom's
// localStorage under a file:// origin is unreliable and often throws. Every affected
// app already treats a failed localStorage write/read as a real, user-facing condition
// (a visible warning) rather than crashing, so tests here work around this the same way
// manual verification did - by checking in-memory state and rendered DOM output, not by
// depending on localStorage actually persisting within a single test run.
// Every JSDOM window created via loadPage() is tracked here so it can be explicitly
// closed. This matters specifically because this suite runs many test files in one
// long-lived `node --test` process - a window's own internal timers and handles don't
// get released just because a test function returns, and left unclosed across enough
// tests in one process, they can stall the whole run. (This never mattered during this
// project's earlier ad-hoc, one-script-per-invocation manual testing, since each script
// exited immediately after running and took everything with it.)
const openWindows = [];

function closeAllWindows() {
  while (openWindows.length) {
    const win = openWindows.pop();
    try {
      win.close();
    } catch (e) {
      // already closed or never fully initialized - safe to ignore during cleanup
    }
  }
}

function loadPage(filename, opts = {}) {
  const html = readSuiteFile(filename);
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'file://' + SUITE_DIR + '/',
  });
  const win = dom.window;
  win.confirm = opts.confirm !== undefined ? opts.confirm : () => true;
  if (win.HTMLElement && win.HTMLElement.prototype) {
    win.HTMLElement.prototype.scrollIntoView = function () {};
  }
  const errors = [];
  win.addEventListener('error', (e) => errors.push(e.message));
  dom.__errors = errors;
  openWindows.push(win);
  return dom;
}

// Stubs the browser download mechanism (Blob + object URL + <a download>) so a page's
// own "Download CSV" / "Export Contribution" style buttons can be exercised in a test
// and their output captured, without an actual file ever touching disk.
function stubDownload(win) {
  const ref = { value: null, filename: null };
  win.URL.createObjectURL = () => 'blob:fake';
  win.URL.revokeObjectURL = () => {};
  const origCreateElement = win.document.createElement.bind(win.document);
  win.document.createElement = function (tag) {
    const el = origCreateElement(tag);
    if (tag === 'a') {
      el.click = function () {};
    }
    return el;
  };
  const OrigBlob = win.Blob;
  win.Blob = function (parts, opts) {
    ref.value = parts.join('');
    return new OrigBlob(parts, opts);
  };
  return ref;
}

// Waits for a fixed delay - used after dispatching a 'change' event on a file input,
// since the actual file-reading path in every app here goes through an async
// FileReader, not a synchronous read.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simulates picking a file for a <input type="file"> element and dispatching the
// 'change' event the app's own listener is waiting for.
function pickFile(win, inputEl, contents, filename, mimeType) {
  const file = new win.File([contents], filename, { type: mimeType });
  Object.defineProperty(inputEl, 'files', { value: [file], configurable: true });
  inputEl.dispatchEvent(new win.Event('change'));
}

function listSamples() {
  const dir = suitePath('samples');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.csv'));
}

function readSample(filename) {
  return fs.readFileSync(suitePath('samples', filename), 'utf8');
}

module.exports = {
  SUITE_DIR,
  suitePath,
  readSuiteFile,
  loadPage,
  closeAllWindows,
  stubDownload,
  wait,
  pickFile,
  listSamples,
  readSample,
};
