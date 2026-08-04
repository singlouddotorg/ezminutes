# Considered Options

A running list of ideas that have come up during development but haven't been built — kept separate from `instructions.html` (which describes what the suite actually does today) and from the general README/docs, which describe current behavior rather than possible futures.

Nothing here is committed to. Some of these may never get built; some may turn out to be bad ideas once actually attempted. This list exists so a real idea doesn't quietly get lost between when it's raised and when there's time to build it — not as a promise or a spec.

Each entry notes its status:
- **Idea** — discussed, not started.
- **Partially built** — something related exists, but not the full idea as originally discussed.
- **Known limitation** — not a planned feature exactly, more an honest gap in something already built, worth fixing properly rather than living with indefinitely.
- **Planned, deferred** — not a maybe. Confirmed to happen; only the timing is deferred.
- **Resolved — built** — was an open question at some point in this project's history; now actually decided and built. Noted here briefly for context, since the file's own history discussed it as unresolved.

---

## Deployment (high priority for release day)

**Host the app at a singloud.org subdomain, via GitHub Pages — Planned, deferred**
Confirmed plan, not an open question: singloud.org itself won't serve the app files — every project listed on singloud.org/projects/ follows the same pattern (a short WordPress page describing the project, linking out to wherever it actually lives; the Sacred Harp Bibliography Project links to a Substack, FaSoLa Minutes + App links to fasolaminutes.org). EZ Minutes will follow that same pattern: a subdomain of singloud.org — `ezminutes.singloud.org` — serving the actual app, kept visually and organizationally tied to SingLoud rather than existing at arm's length on a fully separate domain. The mechanics, for whenever this gets picked up:

1. Push the current suite to `singlouddotorg/ezminutes` on GitHub (capture.html, compile.html, index.html, instructions.html, tunebook-index.js, the README/CHANGELOG files, samples/).
2. Enable GitHub Pages on that repo (Settings → Pages), pointing at whichever branch/folder holds these files.
3. Add a `CNAME` file to the repo containing `ezminutes.singloud.org`.
4. Add a DNS record for that subdomain (wherever singloud.org's DNS is managed) pointing at GitHub Pages.
5. Once live, add the short descriptive "Active Project" entry on singloud.org/projects/ itself, linking to the new subdomain — a WordPress content task, separate from the steps above.

No server, no build pipeline — GitHub Pages just serves whatever's currently pushed to the repo. High priority specifically for whenever "release day" is decided; not urgent before that.

**Produce a real instructional walkthrough video — Planned, deferred**
`instructions.html` originally carried a placeholder for this ("A complete EZ Minutes walkthrough will appear here") — removed for the pre-release version rather than left as a visible placeholder, since a permanent-looking "coming soon" box reads worse than no box at all once real people are actually testing the app. The plan is confirmed, not abandoned: a produced video covering the same ground as the written Quick Start and workflow sections, to be added back in once it exists. Worth revisiting once field-test feedback has settled the workflow enough that a video wouldn't need re-recording after early corrections.

---

## Testing & Quality

**Automated regression test suite — Resolved — built**

Raised repeatedly across several release reviews as an open question: every fix across this whole project had been verified by a hand-written, disposable jsdom script, thrown away once the fix was confirmed. This worked, but explains why a few specific bugs (Schema 4 Session ID validation among them) got confirmed as real in one review, never actually fixed, and then had to be confirmed as real *again* in a later review before finally being corrected — a persistent suite exists specifically to catch that kind of recurrence the second time, not the third.

Built as a separate, dev-only `tests/` folder (Node's built-in test runner plus `jsdom` and `papaparse`, both dev dependencies only) sitting alongside the actual suite files, with a matching GitHub Actions workflow so it runs on every push once it's in the repo. This has no effect on the distributed app whatsoever — Capture, Compile, and Tunebook Editor remain exactly what they've always been: static files, no build step, no dependencies of their own. Covers the highest-value, most-repeated manual checks from this project's history: the four-sample Capture/Compile round-trip, Schema 4 Session ID validation, Compile's transactional import safety, canonical leader conflict preservation, Tunebook Editor's rename identity tracking and page-key canonicalization, and edition-index structural validation (including both real bundled `ShH2012.json`/`VPH2024.json` files, not just synthetic test data).

Deliberately out of scope for now: real-browser end-to-end testing (Playwright or similar) for actual click/focus/keyboard user flows, which jsdom cannot exercise. A separate, larger decision if it's ever wanted.

---



## Capture

**Prefill a new singing from last year's enriched CSV — Idea**
Capture's "Load CSV" currently only resumes the *same* event (same order sequence, same session structure) — it's not built to seed a brand-new singing's setup from a previous one. The idea: a third welcome-gate action (alongside "Start New Singing" and "Resume Current Singing") — something like "Start New Singing, prefilled from last year" — that reads a prior Compile-enriched CSV and lifts just the setup data: Officers & Roles, location, books typically used, and critically, the accumulated *proofread* leader-name list for autocomplete. Using Compile's corrected `Canonical Leader(s)` values (not raw Capture-typed names) as next year's autocomplete seed would actively propagate corrections forward each year rather than reintroducing the same misspellings — a real, compounding benefit specific to annual singings. Only useful from the second year of a singing's life onward; the schema (v3) already carries everything this would need, so this is mostly a Capture-side UI/workflow addition, not a schema change.

---

## Compile

**Output profiles (full vision) — Partially built**
The original idea (Traditional Published Minutes / SHMHA Submission / Website / Archival Record / Proofing Copy / Data Exchange, each determining structure and content independent of file format) is only partly realized. What actually exists now: a "Type of output" choice (Traditional vs. SHMHA) that gates which wording options and export formats are shown. The broader vision — more named profiles, each with its own structural rules beyond wording and format — is still just an idea. (Note: `instructions.html`'s "Output profiles — Planned" line is now stale relative to this partial build and needs updating whenever the docs pass happens.)

**MP3 Chapters and Video Markers — Idea**
Using the order and timing EZ Minutes already captures to generate chapter lists for a long recording, YouTube-style timestamp markers, or editing cue sheets. Not started.

**Per-instance prayer-leader credit, beyond one chaplain per session — Idea**
The session-level chaplain override (built during schema v3 work) handles one common real case — a different chaplain for a different day. It doesn't handle a *rotation of several people*, each giving one specific prayer within the same session (seen directly in real minutes: Western Massachusetts 1999 had four chaplains across two days, each credited for a specific prayer, not one "the chaplain" per day). Solving this properly would mean letting a specific prayer instance (opening, lunch blessing, closing) carry its own credited name, independent of the session-level default — a real feature, not just a documentation gap, but one that needs its own design pass rather than a quick patch.

**DOCX export — Idea (rebuild)**
Removed early on (RC-01) because the old generator was broken and built against a document model since replaced. Plain text, Markdown, and HTML can be pasted into Word in the meantime. Rebuilding a real DOCX exporter — bundled locally, not via CDN, per the original decision to remove the JSZip dependency — remains a candidate whenever there's appetite for it.

**Full corrections-propagation model (Capture) — Known limitation, partial fix shipped**
RC2-04 shipped a short-term fix: editing Event corrects every row in the file; editing Date/Location/Officers corrects every row in the *current session*. This covers the common real case. A more complete model (e.g., explicit "apply this correction to: this row / this session / the whole event" per edit) was considered and set aside as more than the immediate bug needed.

**RC-12: fully flexible import error handling — Known limitation, partially deferred**
Tied to the schema-v2/v3 baseline work; only partially revisited since. Import validation could likely be made more forgiving in places without losing its usefulness as a safety net — not scoped in detail yet.

---

**"Visitors" / "First-time singers" needs a general rethink — Idea, flagged for revisit**
Right now this exists only as a free-text list on Names & Lists ("Visitors and first-time singers included..."), separate from the counting/summary-line mechanism the Minutes Maker toggles now use for singers/leaders/songs. Worth a real look at what this concept should actually be: is it one list or two (a first-time-ever singer is a different fact from a visitor from another convention who's sung for years)? Should it have its own toggleable count in the summary line, the way singers/leaders/songs now do? Does it belong on Names & Lists at all, or somewhere closer to the officer/roster data? No decision made here — just flagging that the current implementation predates a lot of the toggle/summary-line thinking that's since gone into Minutes Maker, and hasn't been revisited since.

**Reordering whole sessions as a block — Idea, explicitly deferred**
When session boundaries were made undraggable (to stop them from accidentally getting reordered independently of their entries), the fix only closed off the *accidental* risk — it never built genuine "move this whole session, and everything in it, to a different position" as a feature. If reordering an entire session (not just individual rows within one) turns out to matter in practice, that's a distinct, separate feature request from what's built now, not something the current fix silently already covers.

## Tunebook Index / Database

**Local activation of unofficial tunebook contributions — Future consideration**

Tunebook Editor currently uses a contribution-only model: users can add or revise a tunebook and export a book-specific contribution file for maintainer review, but Capture and Compile continue to use only the curated Master Tunebook Index distributed with the suite. A possible future feature would allow a user to activate a local working-copy or imported contribution in Capture and Compile before it has been accepted into the master collection.

The benefit would be immediate use of an unlisted local or newly compiled tunebook without waiting for a suite release. The cost is a new distinction the entire suite would have to preserve reliably between official master records and unofficial local records. Locally activated books would need conspicuous labeling, isolated storage, conflict handling when a later master release adds the same Edition Code, and safe migration when the local and official records differ. CSV portability would also need clear rules so another device could distinguish an official Edition Code from a local override.

Not planned for the current release. Revisit only if field use shows a real need for immediate local access that outweighs the risk of divergent or ambiguously authoritative tunebook data.

**Editing tunebook data from within the app — Partially built**
Now underway as its own tool, `tunebook-editor.html` (see `TUNEBOOK-EDITOR-README.md`), rather than a mode bolted onto Compile's own Tunebook Index panel as originally sketched here. Phase 3 done: Browse, Edit Book, and Export all work. Edit Book covers adding a new book, editing an existing one's book-level fields (including a real, editable Edition Code with a warning and required confirmation about it being a genuine rename), and adding/editing/deleting individual page-title entries one at a time, with duplicate page keys refused rather than silently overwritten. Export turned out to be a different shape than originally imagined here: rather than generating a replacement `tunebook-index.js` directly, it packages one book as a standalone contribution file (change summary, validation results, optional contributor info) for a maintainer to review by email — the actual bundled index only changes when a maintainer folds an accepted contribution into a future suite release. The originally-open bulk-paste question is resolved, deliberately: per-row entry only, on purpose — this tool is for the hand-labor of building the conceptual structure and making small corrections, not a bulk importer; a whole book's worth of already-collected data is expected to go into `tunebook-index.js` directly instead.

**Full song data per entry (meter, composer, etc.) — Partially built**
The richer per-song shape this envisioned (meter, key, time signature, text/music attribution, source citation) now exists as a real, separate file format — an **edition index** (`edition-indexes/*.json`) — that Tunebook Editor can merge into a book's entries for browsing, without changing `tunebook-index.js`'s own shape or touching `lookupTitle()`/`canonPage()` at all. Two real, complete edition indexes are included (`ShH2012.json`, all 469 entries; `VPH2024.json`), each built from a compiler-supplied spreadsheet via a documented conversion script. Still open: whether this richer data ever gets folded into `tunebook-index.js` itself (making it available to Capture/Compile directly, not just Tunebook Editor's browse view) is a separate, larger decision than what's been built so far.


**Progressive Web App (PWA) conversion — Idea, explicitly deferred**
Raised as a "what would this look like" discussion, not a request to build. Would mean a manifest + service worker, installable as its own icon rather than "a zip you extract and open" — and for Capture specifically, would close a real gap: right now offline use requires the file already being open or already downloaded, where a service worker would let the app launch fully offline even without a pre-downloaded copy, which matters for the rural/no-signal singing case this app is actually built for. The real costs: service workers require HTTPS or localhost (won't register on `file://` at all, so this isn't additive to the current zip-based distribution — it requires actually hosting the app somewhere, most likely marylandshapenote.com, with its own clean URL scope), and every release then needs correct cache invalidation or someone gets silently stuck on a stale, possibly-buggy cached version — a real, recurring tax at this project's release cadence (beta.7 through beta.24 in one review cycle alone). Deliberately not pursued now: the app needs to be field-tested as currently conceived, simpler, before taking on that added complexity and hosting dependency. Worth revisiting once real-world use has shaken out the current design. If it does move forward, worth deciding early whether Capture and Compile become two separately-installable icons or one shell app with both inside it — leaning toward two, since nobody's hunting for "the other app" mid-singing.

**Multi-device sync / merge — Idea**
Flagged early as a real gap: no built-in way to merge two devices' logs from the same live singing (e.g., two secretaries logging in parallel, or a handoff mid-event via more than a single CSV file exchange). Explicitly out of scope for now; noted as a candidate for a future GitHub issue rather than anything close to being designed.

---

*Last updated after the RC4 release-candidate review cycle (metadata-row integrity, marker prose/tags, missing-dependency handling, session-transition cleanup, and the Location/City-State consolidation). Add to this list as new ideas come up; move an entry to "Partially built" or delete it once something is actually shipped.*
