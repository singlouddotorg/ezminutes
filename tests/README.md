# EZ Minutes Suite — Regression Tests

A dev-only, permanent regression suite for Capture, Compile, and Tunebook Editor — converting the throwaway jsdom scripts written and re-written by hand throughout this project's development into something that actually accumulates. Nothing here changes what gets distributed to an actual user: Capture, Compile, and Tunebook Editor remain plain static HTML files with no build step and no dependencies of their own. This folder tests them from the outside.

## Running the tests

```
cd tests
npm install
npm test
```

That's the whole setup — `jsdom` and `papaparse` are the only dependencies, both dev-only. Node's own built-in test runner (`node --test`) does the rest; nothing else needed.

## What's covered, and why each of these specifically

Every test here traces back to something that actually broke, or came close to breaking, during this project's development — not a hypothetical concern invented for the sake of coverage:

- **`roundtrip.test.js`** — the single most-repeated manual check across the whole project: all four real, historical sample CSVs must import cleanly into both Capture and Compile, with zero JS errors and the right row counts. This was run by hand after nearly every change made to either app.
- **`compile-schema4-validation.test.js`** — Schema 4's Session ID requirement. This is the one bug that was confirmed as real, then never actually fixed, then confirmed as real *again* in a later review before finally being corrected — exactly the kind of regression a persistent test exists to catch the third time before a person has to.
- **`compile-transactional-import.test.js`** — the single most serious bug found in this whole project: Compile used to wipe the current project before the replacement file had even been read, so an unreadable or malformed replacement meant the real project was gone with no way back. Covers the rollback path directly, not just the happy path.
- **`compile-canonical-leader-conflicts.test.js`** — two rows sharing a raw leader name but disagreeing on the canonical spelling must both keep their own value on export, not have one silently overwrite the other. Verifies the exact "Jane Smith vs. John Smith" case from the original bug report.
- **`tunebook-editor-core.test.js`** — rename identity tracking (a book's `originalEditionCode` must survive even a second rename, still pointing at the very first master code) and page-key canonicalization (`.1`/`.2` always becomes `t`/`b`, including establishing a book's very first split page — the specific case the old, more cautious rule couldn't handle).
- **`tunebook-editor-edition-index-validation.test.js`** — a structurally invalid edition-index JSON file must reject in full, not partially merge up to the point a bad record was found. Also directly verifies both real bundled files (`ShH2012.json`, `VPH2024.json`) still merge cleanly under the stricter validation, not just synthetic test data.

## A real gotcha hit while building this suite itself

Every individual test file passed cleanly in isolation, but running the whole suite together (`node --test tests/*.test.js`) hung indefinitely partway through. The cause: a `JSDOM` instance's internal timers and handles don't get released just because a test function returns — `win.close()` has to be called explicitly. This never surfaced during this project's earlier manual testing, since every ad-hoc script ran in its own one-off Node process that exited immediately afterward, taking everything with it. It only became visible once multiple test files started running inside one long-lived process. Every `JSDOM` window created via `helpers.js`'s `loadPage()` is now tracked and explicitly closed in each file's `after()` hook — worth knowing if a new test file gets added later and starts creating windows some other way.

## What's deliberately not covered yet

This suite is Node-level (jsdom), not real-browser end-to-end. It cannot catch anything that depends on actual browser rendering, CSS layout, or real click/focus/keyboard behavior a person would experience — only what's observable through the DOM and JS execution jsdom provides. A Playwright-based browser suite covering user-facing flows end to end (Start New Singing, Start New Session, the actual review-and-export click path in Compile) is a separate, larger decision, not something folded into this.
