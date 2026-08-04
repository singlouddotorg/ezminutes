# EZ Minutes: Tunebook Editor

**Tunebook Editor** is a browsing and enrichment tool for the tunebook data that Capture and Compile both share (`tunebook-index.js`) — a way to see what's actually in it, and to merge in richer per-song detail (meter, key, time signature, text and music attribution, source citation) than the shared index currently carries on its own.

Part of the [EZ Minutes suite](README.md) — see the suite-level README for the full picture. Like Capture and Compile, it needs `tunebook-index.js` in the same folder, and runs the same way: open `tunebook-editor.html` in a browser, no install, no server, no build step, fully offline.

**Current status: Phase 3.** Browse, **Edit Book**, and **Export** are all built. Export packages one book as a standalone contribution file for a maintainer to review by hand — it does not generate or replace `tunebook-index.js` itself, and nothing exported here becomes available in Capture or Compile automatically. That only happens once a maintainer folds an accepted contribution into a future bundled release of the suite.

## Getting started

Like Compile, Tunebook Editor is built for a laptop, desktop, or keyboard-equipped tablet — not a phone.

1. Open `tunebook-editor.html`. The Browse tab loads showing every book currently in `tunebook-index.js`, exactly as Compile's own Tunebook Index tab does.
2. To see richer detail for a book, choose one or more of its **edition index** files — see `edition-indexes/` — via the file picker (multiple files can be selected at once, each merged in turn) or, when this suite is actually served over http(s) rather than opened directly from disk, use "Scan edition-indexes/ for matches" to check every book already in the registry against that folder automatically and load whatever's found. This merges meter, key, attribution, and source data into each book's entries in your working copy.
3. Browse and search as usual; enriched entries now show their extra detail under the title.

## Edition index files

An edition index is a small, separate JSON file — one per book edition — carrying song-level detail beyond what `tunebook-index.js` stores today:

| Field | Shape | What it is |
|---|---|---|
| `meter` | string | The poetic/metrical structure (C.M., L.M., S.M., H.M., P.M., or syllable-count notation like "11, 8") — **not** the musical time signature, even though they're printed right next to each other on the page |
| `timeSignature` | string | The actual musical time signature (4/4, 2/4, 6/8, etc.) |
| `key` | string | The musical key, as printed |
| `firstLine` | string | The opening line of the lyrics |
| `textAttribution` | `{ credit, year }` | Author of the words |
| `musicAttribution` | `{ credit, year }` | Composer of the tune |
| `harmonizationAttribution` | `{ credit, year }` | Whoever arranged the other voice parts, when credited separately from the tune's original composer — common in later reprints of older tunes; kept distinct from `musicAttribution` on purpose, since collapsing them loses real information |
| `source` | `{ citedAbbr, page }` | The earlier tunebook this tune was drawn or adapted from, if not original to this book. Can be the primary citation for the whole song on its own — not only a secondary note nested inside a composer or harmonizer credit |
| `scriptureReference` | string | A Bible citation printed under the title |
| `historicalNote` | string | A paragraph of prose history about the song or composer, when printed on the page |
| `copyrightNotice` | string | An explicit copyright line, when present |
| `verseCount` | number | How many verses are printed |
| `isContinuation` | boolean | True if this page is a continuation ("Concluded") of a tune that began on an earlier page — not a new song in its own right |
| `catalogCode` | string | A short corner reference code, when present. Some books use this as their own shorthand for a `source` citation already given elsewhere on the page (as VPH does) — check for that before treating it as an unexplained code |

See `edition-indexes/tunebook-page-extraction-guide.md` for detailed instructions on recognizing each of these on an actual scanned page, including which ones are easy to conflate (meter/time signature, and the three separate attribution fields).

Two edition indexes are included as real, complete examples:

- `edition-indexes/ShH2012.json` — The Shenandoah Harmony (2012), all 469 entries.
- `edition-indexes/VPH2024.json` — The Valley Pocket Harmonist (2024).

Each carries an `editionCode` matching one already in `tunebook-index.js` (`ShH2012`, `VPH2024`) — merging only ever attaches to a book that's already in the registry; adding an entirely new book is done through Edit Book.

**A structurally invalid file is rejected entirely, before anything merges.** The whole file is checked first — every song's fields are the right type, `textAttribution`/`musicAttribution`/`harmonizationAttribution`/`source` have the shape they're supposed to, `verseCount` is actually a number, and so on. If anything is wrong, nothing from that file is applied at all, and the load message reports what's actually broken (up to a handful of specific issues, plus a count of any more) — rather than merging everything up to the point a bad record happened to appear and leaving the rest silently unmerged. Page keys from the file also get canonicalized the same way a hand-typed one in Edit Book would, so a file using `" 42T "` or similar ends up correctly filed as `42t` rather than creating a stray, non-canonical key.

**The scan feature only works when this suite is actually served over http(s)** — a local dev server, or once deployed to GitHub Pages — not when `tunebook-editor.html` is opened directly from disk, since every major browser's own security model blocks `fetch()` on a `file://` page outright. This isn't a bug to work around; it's the same "usable without a server" identity the rest of this suite already has, applied honestly rather than pretending automatic discovery works everywhere it doesn't. When scanning isn't available, the message says so plainly and points back to the manual file picker above it, which always works regardless of how the page was opened.

**Merging is careful about titles on purpose.** If an edition index's title for a page disagrees with what's already in `tunebook-index.js`, the existing title is kept and the disagreement is called out in the load message rather than silently overwritten — the shared index is the thing every other part of the suite already depends on, so it isn't the enrichment file's place to quietly correct it. This is a softer, content-level warning, distinct from the structural checks above — a title disagreement doesn't block the rest of the file from merging. All the other fields (meter, key, attribution, source) merge in regardless.

## Edit Book

Add a new tunebook, or edit an existing one's book-level fields and page index. This is deliberately hand-labor, one row at a time, not a bulk importer: the goal is a tool for the ongoing correction and small-addition work an edition's data actually needs, not a replacement for editing `tunebook-index.js` directly when a whole book's worth of data is already collected and ready to go in at once.

**Edition Code, Work Code, and SHMHA Code sit together**, at the top of the form — these are the book's three identity codes, kept visually grouped and separate from the more descriptive fields (title, compiler, publisher) below them.

**Edition Code is editable, including on an existing book — with a real warning, not just a note.** It's the key everything else in the suite references (Capture entries, Compile imports, this registry itself), so changing it on an existing book is a genuine rename, not a label tweak: the entry moves to the new key, and anything that already pointed at the old one (a saved Capture project, an already-exported CSV) won't find it there anymore. The form makes this explicit before it happens, and it should match the edition-specific code SingLoud.org's own master registry uses — not something invented locally — since that's the whole point of the Work/Edition Code split in the first place.

**Full Title and Subtitle are separate fields.** Some books have a real main title/subtitle split on their own title page (e.g. "The New Sacred Harp" as the main title, with "A Collection of Hymn-Tunes, Anthems, and Popular Songs, for the Choir, Class, Convention and Home Circle" as the subtitle beneath it) — keeping these separate rather than one long concatenated string lets the main title stand on its own wherever space is tight, with the subtitle shown only where there's room.

**The badge color inputs sit next to a live preview** of the actual pill Browse and the rest of the suite render, updating on every keystroke — what's shown here is what it will really look like, not an approximation.

**Shape System is a set of radio buttons (Four-shape / Seven-shape / Unknown), positioned right after the badge section** — mutually exclusive by design, since a book is one or the other, not both. Choosing one shows a small, separate quick-identify mark immediately before the pill wherever it's shown — Browse's book listing, and the live preview here. This mark is a real Unicode character (❹ or ❼, the "dingbat negative circled digit" glyphs), not a CSS-drawn shape — simpler to maintain and it renders identically everywhere a font supports the Dingbats block, which is effectively everywhere. It's kept deliberately separate from the pill's own colors, since those are the book's own chosen identity and shouldn't have to also carry an unrelated piece of information about notation system.

**Duplicate page keys are refused, not silently overwritten** — matching the same rule the edition-index build scripts already enforce when they generate the JSON files above. Deleting a page asks for confirmation first, since there's no undo once it's gone from the working copy.

**Every field this suite's schema can hold per song is editable here** — not just page and title. An "Editing detail" toggle switches between **Page & Title** (the simpler, original scope) and **Full Info** (meter, key, time signature, first line, all three attribution types, source, scripture reference, verse count, historical note, copyright notice, catalog code). This is a display choice, not a data one — the underlying validation is identical either way; Page & Title mode just doesn't show fields you may not have collected yet. In Full Info mode, adding a song shows the complete field set up front, and each existing row gets a "Full details" button that expands an inline editor for everything on that one song, rather than showing every field for every row at once — with a book of 500+ songs, that would overwhelm the page far more than it would help.

## Export

Package one book from the working copy as a contribution file to email the maintainer for review — this is a review-and-submit workflow, not a way to generate a new `tunebook-index.js` yourself.

1. Choose a book. Arriving here via **Review for Export** (a button that appears on Edit Book right after a successful save) preselects the book just worked on.
2. The panel shows whether this is a **new book** or a **revision** to an existing baseline book, and — for a revision — a full change summary: which book-level fields changed, and which pages were added, removed, or retitled, compared against the bundled `tunebook-index.js` this browser started from.
3. Validation runs automatically. Structural problems (a blank Full Title or Common Name, for instance) disable **Export Contribution** until fixed; softer issues (no pages yet, or a baseline book that's also been given an SHMHA Code it shouldn't have) show as warnings but don't block export.
4. Contributor name, email, and submission notes are all optional, but worth filling in — they travel with the file and are the only way the maintainer knows who to follow up with.
5. **Export Contribution** downloads a single JSON file — the book's full data, the change summary, and the submission info together — named for the book and the date.

The downloaded file goes to the maintainer by email (`sacredharpbiblio@gmail.com`), not through any automated channel. Exporting doesn't touch this browser's own working copy, Capture, or Compile — a contribution only becomes real for everyone once a maintainer reviews it and folds it into a future bundled `tunebook-index.js`.

### `build_shh_index.py` / `build_vph_index.py`

The two Python scripts alongside the JSON files are how those files were actually built — converting a compiler-supplied spreadsheet (a CSV or an xlsx workbook) into the edition-index JSON shape, with real judgment calls documented inline (which title column to trust when a book repeats tune names, how a combined "abbreviation + page" citation column gets split apart, why some fields come back blank for a given source rather than guessed at). They're kept here as a record of *how* this data was produced and *why* specific decisions were made, not as tools meant to be re-run as part of using the suite — the file paths they reference are specific to the machine they were built on. Treat them as documentation with working code in it, useful as a reference the next time a new edition index gets built from a new source spreadsheet.

## Data & privacy

Same as the rest of the suite: everything runs locally in the browser. The working copy lives in this browser's local storage only — nothing is uploaded anywhere, and dropping an edition index file onto the loader never leaves this device.
