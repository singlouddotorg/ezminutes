// Tunebook Editor keeps registry as a closure-scoped variable, invisible to a test
// script's own eval/inspection - the same limitation hit repeatedly during this
// project's manual testing. Rather than fight that, this file uses the same disposable
// debug-hook approach used throughout development: a temporary copy of the real file
// with one extra line exposing what's needed for verification, built fresh for each
// test run and never touching the actual shipped file.
'use strict';

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const { suitePath, wait, stubDownload } = require('./helpers');

const TMP_DIR = path.join(__dirname, '.tmp-debug-copy');
const TMP_HTML = path.join(TMP_DIR, 'tunebook-editor.html');

const openWindows = [];

function loadDebugCopy() {
  const html = fs.readFileSync(TMP_HTML, 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
    url: 'file://' + TMP_DIR + '/',
  });
  const win = dom.window;
  win.confirm = () => true;
  win.HTMLElement.prototype.scrollIntoView = function () {};
  openWindows.push(win);
  return dom;
}

describe('Tunebook Editor', () => {
  before(() => {
    fs.mkdirSync(TMP_DIR, { recursive: true });
    fs.copyFileSync(suitePath('tunebook-index.js'), path.join(TMP_DIR, 'tunebook-index.js'));
    let html = fs.readFileSync(suitePath('tunebook-editor.html'), 'utf8');
    html = html.replace(
      'registry = loadRegistry();',
      'registry = loadRegistry(); window.__getBook = function(code){ return registry.books[code]; }; window.__bookCount = function(){ return Object.keys(registry.books).length; };'
    );
    fs.writeFileSync(TMP_HTML, html);
  });

  after(() => {
    while (openWindows.length) {
      const win = openWindows.pop();
      try { win.close(); } catch (e) {}
    }
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  });

  describe('rename identity tracking (originalEditionCode)', () => {
    test('renaming an existing baseline book is classified as a revision, keeping the original code', async () => {
      const dom = loadDebugCopy();
      await wait(800);
      const doc = dom.window.document;

      doc.getElementById('tab-edit').click();
      const editSel = doc.getElementById('editBookSelect');
      editSel.value = 'ShH2012';
      editSel.dispatchEvent(new dom.window.Event('change'));
      doc.getElementById('editEditionCode').value = 'ShHRENAMED';
      doc.getElementById('saveBookDetailsBtn').click();

      const book = dom.window.__getBook('ShHRENAMED');
      assert.equal(book.originalEditionCode, 'ShH2012');
      assert.equal(dom.window.__getBook('ShH2012'), undefined, 'Old key should no longer exist');
    });

    test('a second rename still points back to the very first master code, not the intermediate one', async () => {
      const dom = loadDebugCopy();
      await wait(800);
      const doc = dom.window.document;

      doc.getElementById('tab-edit').click();
      const editSel = doc.getElementById('editBookSelect');
      editSel.value = 'ShH2012';
      editSel.dispatchEvent(new dom.window.Event('change'));
      doc.getElementById('editEditionCode').value = 'ShHRENAMED';
      doc.getElementById('saveBookDetailsBtn').click();

      editSel.value = 'ShHRENAMED';
      editSel.dispatchEvent(new dom.window.Event('change'));
      doc.getElementById('editEditionCode').value = 'ShHRENAMEDAGAIN';
      doc.getElementById('saveBookDetailsBtn').click();

      const book = dom.window.__getBook('ShHRENAMEDAGAIN');
      assert.equal(book.originalEditionCode, 'ShH2012', 'Should still point at the first master code, not ShHRENAMED');
    });

    test('a genuinely new book has originalEditionCode: null', async () => {
      const dom = loadDebugCopy();
      await wait(800);
      const doc = dom.window.document;

      doc.getElementById('tab-edit').click();
      const editSel = doc.getElementById('editBookSelect');
      editSel.value = '__new__';
      editSel.dispatchEvent(new dom.window.Event('change'));
      doc.getElementById('editEditionCode').value = 'GENUINELYNEW1';
      doc.getElementById('editFullTitle').value = 'Genuinely New';
      doc.getElementById('editCommonName').value = 'New';
      doc.getElementById('saveBookDetailsBtn').click();

      const book = dom.window.__getBook('GENUINELYNEW1');
      assert.equal(book.originalEditionCode, null);
    });

    test('renaming to an already-existing code is blocked, not silently overwritten', async () => {
      const dom = loadDebugCopy();
      await wait(800);
      const doc = dom.window.document;
      const before = dom.window.__bookCount();

      doc.getElementById('tab-edit').click();
      const editSel = doc.getElementById('editBookSelect');
      editSel.value = 'ShH2012';
      editSel.dispatchEvent(new dom.window.Event('change'));
      doc.getElementById('editEditionCode').value = 'SHM1991'; // already exists
      doc.getElementById('saveBookDetailsBtn').click();

      assert.match(doc.getElementById('saveBookStatus').textContent, /already a book in the registry/);
      assert.equal(dom.window.__bookCount(), before, 'Book count should be unchanged after a blocked rename');
      assert.ok(dom.window.__getBook('ShH2012'), 'Original book should still exist under its original code');
    });
  });

  describe('page-key canonicalization', () => {
    test('a page key with whitespace and mixed case is canonicalized on add', async () => {
      const dom = loadDebugCopy();
      await wait(800);
      const doc = dom.window.document;

      doc.getElementById('tab-edit').click();
      const editSel = doc.getElementById('editBookSelect');
      editSel.value = 'SHM1991';
      editSel.dispatchEvent(new dom.window.Event('change'));
      doc.getElementById('newPageKey').value = ' 999T ';
      doc.getElementById('newPageTitle').value = 'Canonicalization Test';
      doc.getElementById('addSongBtn').click();

      const book = dom.window.__getBook('SHM1991');
      assert.ok(book.songs['999t'], 'Expected the canonicalized key 999t to exist');
      assert.equal(book.songs['999t'].title, 'Canonicalization Test');
    });

    test('.1/.2 always canonicalizes to t/b, even establishing a brand new split', async () => {
      const dom = loadDebugCopy();
      await wait(800);
      const doc = dom.window.document;

      doc.getElementById('tab-edit').click();
      const editSel = doc.getElementById('editBookSelect');
      editSel.value = 'SHM1991';
      editSel.dispatchEvent(new dom.window.Event('change'));
      doc.getElementById('newPageKey').value = '998.1';
      doc.getElementById('newPageTitle').value = 'First Split Top';
      doc.getElementById('addSongBtn').click();

      const book = dom.window.__getBook('SHM1991');
      assert.ok(book.songs['998t'], 'Expected 998.1 to canonicalize to 998t even with no prior split at 998');
    });

    test('duplicate detection compares canonical keys, not raw input', async () => {
      const dom = loadDebugCopy();
      await wait(800);
      const doc = dom.window.document;

      doc.getElementById('tab-edit').click();
      const editSel = doc.getElementById('editBookSelect');
      editSel.value = 'SHM1991';
      editSel.dispatchEvent(new dom.window.Event('change'));
      doc.getElementById('newPageKey').value = '997t';
      doc.getElementById('newPageTitle').value = 'First';
      doc.getElementById('addSongBtn').click();

      doc.getElementById('newPageKey').value = ' 997T ';
      doc.getElementById('newPageTitle').value = 'Duplicate Attempt';
      doc.getElementById('addSongBtn').click();

      assert.match(doc.getElementById('addSongStatus').textContent, /already exists/);
    });
  });
});
