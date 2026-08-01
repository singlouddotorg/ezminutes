# EZ Minutes

A static local application suite for logging songs during a shape-note singing and turning that log into a clean, ready-to-compile CSV of minutes. Keep all distributed files together in the same folder — the apps share a tunebook data file between them and won't work correctly if it's separated from them.

Built for the Sacred Harp / shape-note singing community, but usable for any event where you need to log a running order of items, leaders, and page/tune references.

## The suite

EZ Minutes is two related tools sharing one visual system and one CSV format:

| File | What it's for |
|---|---|
| `index.html` | The suite's start page — choose Capture or Compile from here. |
| `instructions.html` | Full instructions, quick start, and troubleshooting. |
| `capture.html` | **Capture** — live, on-the-spot logging *during* the singing. |
| `compile.html` | **Compile** — reviews the captured record and prepares finished minutes. |
| `tunebook-index.js` | Shared tunebook data (page/title lookups, book names, codes) both apps load. **Required** — Capture and Compile will show a visible error if it's missing or moved out of the folder. |

Capture and Compile share the same CSV schema, tagged with a `Schema Version` column so either side can flag a mismatch clearly rather than failing silently. Neither app has its own separate color scheme — the same design system runs across all four pages, including the shared header, navigation, and footer.

**EZ Minutes is built for a laptop, desktop computer, or a tablet with a physical keyboard.** It is not designed for phones or phone-sized screens; no development effort goes toward optimizing for that case.

## Getting started

No installation, no build step. Runs entirely in the browser, with no runtime network requests once the page has loaded.

1. Download all five files listed above (and the `samples/` folder, if you want worked examples) — or clone this repo. Keep them all in the same folder; don't separate `tunebook-index.js` from the two apps.
2. Open `index.html` in any modern browser and choose where you're starting from.
3. Everything runs locally in the page. Every page in the suite — including Compile — makes zero runtime network requests of any kind once loaded.

See `instructions.html` for the full walkthrough.

## What Capture does

- **Fast entry, built for the keyboard.** Type a leader's name and a page number, hit Enter — no button required. The song title looks itself up from the book's index as you type. Leader names you've already used that day (and everyone listed in Officers & Roles) show up as autocomplete suggestions.
- **Catches mistakes before they happen.** Warns if a page number could mean two different songs (top/bottom), flags pages that don't exist in the book's index, and gently notes if a page has already been logged that day. The same checks apply when editing an existing entry, not just a new one.
- **Eight songbooks built in**, each with a full page-title index: The Shenandoah Harmony, The Valley Pocket Harmonist, The Sacred Harp (2025 and 1991 editions), The B. F. White Sacred Harp (Cooper Book), The Christian Harmony, American Christmas Harp, and The Georgian Harmony (Second Edition) — plus an "Other" option for anything not from a listed book. See `TUNEBOOK-CHANGELOG.md` for what's included and when each book was added, and for identifiers of other tunebooks that are known but not yet indexed.
- **Officers & Roles** — optional fields for Chair, Vice-Chair, Secretary, Treasurer, Arranger(s), Chaplain, and Memorial Lesson Leader, carried through on every row of the export.
- **Markers** for Recess, Lunch, and Announcements, plus a distinct **Start New Session** action for a new day, changed location, or otherwise distinct segment of the same event — it reopens the setup fields so you can update the date/location/officers first, then writes a real session record rather than a plain marker. This stays inside the same file; it's not the same as starting a whole new singing. Deleting a session boundary that still has songs or markers attached asks explicitly what to do with them — delete the session and everything in it together, or merge it away and fold its entries into the previous session — rather than removing just the boundary and leaving its entries silently orphaned.
- **Tags** for Call Back, Memorial, and Special songs.
- **Everything stays in your browser.** No account, no server, no data leaving your device. Entries persist automatically as you go, with an optional periodic backup download (off by default) and a one-click Download CSV / Copy at any time.
- **Load a CSV back in** — from the welcome screen, or from the in-app session menu at any time — to resume a session, correct entries, or pick up on a different device. Rows missing genuinely required data (an indexed book with no page, an Other entry with neither a page nor a title) are rejected with a clear explanation. An unrecognized Record Type or an unrecognized book code isn't rejected outright — those are accepted and flagged for review, since either may be a legitimate row this build simply doesn't have data for yet.

## Using Capture at a singing

1. On the welcome screen, choose **Start New Singing**, **Resume Current Singing** (only shown if there's already an unfinished one on this device), or **Load CSV** to bring in a previous export.
2. Fill in **Event**, **Date**, **Location**, and (optionally) **Officers & Roles**, check off which **Song Sources** are in use, then tap **Done — collapse** to tuck that away for the rest of the singing.
3. For each song: type the **Leader**, then the **Page** (e.g. `123`, `45t`, `45b` for top/bottom pages), and hit Enter.
4. Use **Recess / Lunch / Announcements** to mark breaks, **Start New Session** for a new day or a change of venue, and tag a song as **Call Back / Memorial / Special** if it applies.
5. Download the CSV (or copy it) whenever you like — it's safe to do this mid-session, and again at the end. A small session menu (Start new singing · Load CSV · Download CSV · Return to welcome) stays available throughout, not just at the start.

See `samples/` for four worked examples, all real historical singings: a single-session convention (James River), a two-day convention demonstrating Start New Session, Singing School, and Business Meeting markers (Western Massachusetts, 1999), a full 3-day, 247-entry convention transcription (National Sacred Harp Convention, 2000), and a single-session singing where the non-default tunebook (American Christmas Harp) is used far more than the primary Sacred Harp book, testing default-book detection under a reversed-majority split (Christmas Harp Singing, 2018).

## The CSV format

Every export (manual download, clipboard copy, or automatic backup) uses these 28 columns, in this order:

| Column | Notes |
|---|---|
| `Schema Version` | A version marker for the CSV shape itself (currently `4`), so a companion tool (like Compile) can flag a mismatch clearly instead of failing silently. |
| `Order of entry` | Sequential position in the log. |
| `Record Type` | `song`, `marker`, `session`, or `metadata`. A row with any other Record Type is preserved exactly and flagged for review rather than reinterpreted as a song — a forward-compatibility safeguard for record kinds a future version of the suite (or a different tool) might introduce. |
| `Session Label` | The label given (if any) when "Start New Session" was used — appears only on that one `session` boundary row (and, for a Compile-added session-officer-override, on that specific `metadata` row). Blank on every song and marker row; Compile carries the active session forward internally rather than repeating the label on every row. This is purely a display label — see `Session ID` below for what actually identifies a session. |
| `Session ID` | A stable, randomly-generated identifier for the session, assigned once when it's created and never regenerated. This — not the label above — is what Compile actually uses to track which rows and overrides belong to which session, so two sessions sharing the same date, location, or (blank) label are still tracked as genuinely separate sessions rather than merging into one. |
| `Metadata Field` / `Metadata Value` | Populated only on `metadata` rows — these carry Compile's own enrichment (business fields, name corrections, output style choices, and so on) so the file stays a complete round-trip record between the two apps. Blank on every song, marker, and session row. Capture preserves these rows but doesn't display them individually in its live log — just a small summary count. |
| `Event` | Sticky for the whole event; unlike Date/Location, this doesn't normally change between sessions. Blank on `metadata` rows. |
| `Date` | `YYYY-MM-DD`. Blank on `metadata` rows. |
| `Location` | Free text — venue and place together (e.g. "St. Giles Presbyterian Church, Richmond, Virginia," or "St. Multose Church, Cork, Ireland"). Blank on `metadata` rows. |
| `Chair`, `Vice-Chair`, `Secretary`, `Treasurer`, `Arranger(s)`, `Chaplain` | Optional officer names, repeated on every song/marker/session row like Event/Date/Location. Blank on `metadata` rows. |
| `Memorial Lesson Leader` | Just the name of whoever gave the memorial lesson, if any — not the names being remembered (those live in the Notes of the Memorial/Special-tagged song rows themselves). |
| `Book` | One of the built-in book abbreviations (see `TUNEBOOK-CHANGELOG.md` for the current list), or `OTHER`. Blank for markers, session, and metadata rows. |
| `SingLoud Code` | The book's SingLoud.org work code, when Compile has assigned or auto-detected one. Capture doesn't set this itself but preserves it losslessly if the file already has it. |
| `Leader(s)` | Free text; multiple leaders are comma-separated. Blank for markers, session, and metadata rows. |
| `Canonical Leader(s)` | A corrected/canonical spelling of the leader's name, when Compile has one. Same pass-through behavior as SingLoud Code. |
| `Page` | The page/call number as typed (e.g. `45t`). Blank for `OTHER` entries, markers, session, and metadata rows. |
| `Song` | Looked up automatically for indexed books, typed directly for `OTHER` entries — and, on `marker` rows specifically, this column instead carries Compile's custom prose override for that marker, if one was written. |
| `Tag` | For song rows: blank, `Call Back`, `Memorial`, or `Special`. For `marker` rows (specifically Business Meeting markers): blank, `Treasurer's Report`, `Secretary's Report`, `Chaplain's Report`, or `Chair's Remarks`. |
| `Notes` | Free text. |
| `Marker` | The marker label — `RECESS`, `LUNCH`, `ANNOUNCEMENTS`, `SINGING SCHOOL`, or `BUSINESS MEETING`. Blank for songs and session rows. |
| `Timestamp ISO` | The authoritative instant the entry was logged, in UTC. Used for sorting/auditing, and preserved exactly through Compile rather than being overwritten with export time. |
| `Time entered` | The display-formatted local time at the moment of entry (e.g. `10:03 AM`). **This is what the app shows and re-shows on import** — it won't shift if the file is opened in a different timezone later. |

A file can be loaded back into Capture (via **Load CSV** on the welcome screen, or from the in-app session menu) to resume a session, correct entries, or merge onto a different device. The importer validates the header and schema version, and rejects a row only when it's missing data genuinely required to identify what happened (a missing page on a recognized indexed book, an Other entry with neither a page nor a title). An unrecognized Record Type or an unrecognized book code is accepted and flagged for review rather than rejected — either may be a legitimate row this build doesn't have data for yet, and losing a whole file over one such row would be a worse outcome than a warning. If a file's rows are out of physical order but their own `Order of entry` values are valid and unique, the importer reorders them by that value before interpreting sessions, so a file that's been sorted, hand-edited, or reassembled by another tool doesn't get its songs silently attached to the wrong session.

## One master file, not two project formats

Capture and Compile share one authoritative Master CSV per event — there is no separate "Capture project file" and "Compile project file." Capture creates the initial Master CSV; opening it in Compile and enriching it (corrections, business notes, session overrides, and everything else on Compile's tabs) produces an updated Master CSV that supersedes the one Capture made. The newest Master CSV is always the current authoritative record. Earlier copies are fine to keep as backups, but they aren't the "real" file once a newer one exists.

Compile's other export formats — plain text, Markdown, HTML, PDF, the SHMHA submission — are one-way publication outputs generated *from* the Master CSV. None of them are meant to be re-opened or resumed, and none of them replace it.

**Metadata passthrough:** each app only actively interprets some of the metadata a Master CSV can carry — Compile's own business fields, name corrections, and settings, for instance. Neither app deletes a metadata field it doesn't recognize; anything unfamiliar (Capture-specific data, a field from a newer suite version, anything a given build doesn't yet display) is preserved exactly and passed through unchanged. This is what keeps the file safe to open in either app, in either order, including a build newer or older than the one that last touched it.

**What doesn't need to survive:** a tunebook selected in Capture's Song Sources but never actually used, or a tunebook code assigned to a book with no recorded entries, are temporary setup state, not part of the historical record. Capture warns before finishing a singing if a selected source has no attributed songs (see below) — once that's been reviewed, an unused selection is allowed to disappear from the Master CSV rather than being preserved indefinitely as clutter.

## Unused tunebook warning

If a songbook is checked in Capture's Song Sources but no songs end up logged from it, Capture asks — right at export time — whether that's a song that still needs logging, or a checkbox that was picked by mistake. This is deliberate: books aren't brought to a singing and simply not used, so an unused selection at export time is a signal worth a second look, not something to silently carry forward or silently discard.

## Data & privacy

Neither app in the suite makes any runtime network request of any kind — no CDN scripts, no remote fonts, nothing. Everything — the running log, the session settings — lives in the browser's local storage on the device you're using, plus whatever CSV files you explicitly download.

That also means: **this is single-device.** There's no sync between a phone and a laptop. If you need to hand off between devices mid-singing, download or copy the CSV and load it into Capture on the other device.

## Known limitations

- Single browser/device per session — no built-in multi-user sync. (Tracked as a future consideration — see the repo's Issues.)
- Correcting the Event name updates every row in the file; correcting Date, Location, or an officer updates every row in the *current session* (from that session's boundary forward) — it won't reach back into an earlier session, since those are presumed already finished and settled.
- The book indexes are only as accurate as the data entered into this project; if you spot a wrong title or a missing page, please open an issue.
- Automatic periodic backup is a real file download, not a silent background save — browsers can't do the latter. It's off by default; treat it as a bonus if you turn it on, not your only backup.
- Not yet tested for screen-reader/keyboard-only accessibility beyond the basics already in place (labeled controls, keyboard-reachable actions, visible focus states).

## Contributing

Issues and pull requests are welcome — corrections to book indexes, bug reports, and feature suggestions all included. This suite is intentionally kept to plain HTML/CSS/JS with no build step and no runtime network requests (aside from the two apps loading their own shared `tunebook-index.js`, a same-folder file, not a network fetch); please keep contributions that way where possible.

## License

MIT — see `LICENSE`.
