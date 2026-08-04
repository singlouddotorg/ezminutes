# EZ Minutes: Compile

**Compile** turns a raw song log from a Sacred Harp / shape-note singing into a polished, publication-ready set of minutes — including a purpose-built export that matches the Sacred Harp Musical Heritage Association's (SHMHA) printed *Minutes Book* format exactly.

Part of the [EZ Minutes suite](README.md) — see the suite-level README for the full picture, including Capture (the companion live-logging app this tool is designed to import from).

It needs one companion file, `tunebook-index.js`, kept in the same folder — the two apps in the suite share it rather than each embedding their own copy of the tunebook data. Beyond that: no install, no server, no build step. Open `compile.html` in a browser and it works, fully offline — no CDN scripts, no remote fonts, no runtime network requests of any kind (see [Data & privacy](#data--privacy)).

## Getting started

Compile is built for a laptop, desktop, or keyboard-equipped tablet — not a phone. Below roughly 860px wide, the app shows a plain notice instead of trying to render its full interface at a size it wasn't designed for.

1. Open `compile.html`.
2. Import your Capture CSV on the **Import** tab, or add song rows by hand on the **Song List** tab. (No file handy? `samples/james-river-convention-2025-11-01-minutes.csv` is a single-session worked example; `samples/western-massachusetts-convention-1999.csv` is a two-day convention demonstrating the Sessions review section described below, along with Singing School and Business Meeting markers; `samples/national-sacred-harp-convention-2000.csv` is a full real 3-day, 247-entry convention; `samples/christmas-harp-singing-2018-12-29.csv` demonstrates a non-default tunebook — American Christmas Harp — used more than the primary Sacred Harp book.)
3. Check **Event Details** and **Roles** — most of this now auto-fills from the CSV; fill in whatever wasn't (and shouldn't be) captured live.
4. Add **Names & Lists** and **Business** items that weren't in the CSV — including, if the original minutes had them, the full text of any memorial lesson remarks and any committee or secretary's reports. These print as-is, in their own paragraphs, in the right place in the narrative — the app is meant to reproduce this kind of material, not just the song log.
5. Clean up the **Song List** — normalize leader names, assign each non-default book a Work Code, tag Memorial/Closing/Call Back rows as needed. If the file has more than one session, review the Sessions section that appears here.
6. Review the preview on **Preview & Export** — switch between Minutes Maker, SHMHA Minutes Book Submission, and Simple List to check any of them — then download whichever format(s) you need.

## Features

- **Flexible CSV import** — recognizes Capture's current column set (`Record Type`, `Session Label`, `Leader(s)`, `Marker`, `Song`, officer columns, `Schema Version`, etc.) as well as older/looser variants, and falls back gracefully when columns are missing or renamed.
- **Auto-filled Event Details and Roles** — name of singing, date (reformatted to "Saturday, November 1, 2025" style — or type/paste a plain `YYYY-MM-DD` into the Date field yourself and it converts in place), location split into venue + city/state, books used (including "Other" when applicable), and — if your Capture export includes them — Chair, Vice-Chair, Secretary, Treasurer, Arranging committee, and Chaplain are all pulled in automatically. Everything auto-filled is called out in the import message so it's easy to double-check.
- **Sessions review** — when Capture's file includes one or more "Start New Session" boundaries (or, for older files, more than one calendar date), a Sessions section appears on the Song List tab with one card per session: its own location, and an optional expandable set of officer overrides for anything that genuinely differed that day. Each officer field is a real three-state choice, not a blank-means-default text box: **Use event default**, **None this session** (deliberately no one in that role for this session), or **Different person…** (reveals a name field). If a session's chaplain differs from what got auto-filled as the Event default, Compile auto-detects that and pre-selects **Different person…** with the name filled in — flagged in the import message for a quick double-check — rather than silently losing the difference. Two sessions with the same date, same location, or the same (or blank) label are still tracked as genuinely separate sessions; if their display labels would otherwise collide, Compile disambiguates them automatically (e.g. "Saturday, January 3 — Session 2") without requiring you to type a label just to keep them apart. Of the officer fields, only Chaplain currently affects the generated narrative (the opening/closing prayer credit); the others print once, in the closing roster, matching how real minutes are actually written.
- **Memorial Lesson Leader** — Capture's `Memorial Lesson Leader` column is just a name and is taken as-is. The Deceased and Sick/shut-in lists come from row-level Memorial/Special-tagged notes instead — each song is matched to the correct sentence by what its own note actually says, not by assuming file order, since secretaries don't always log the sick-list song before the deceased-list song. (Compile also still recognizes the older combined `Memorial Lesson` column format — "Leader — name, name, name" — for backward compatibility with earlier Capture exports.)
- **Per-day default tunebook detection** — figures out which book is the day's "home" book (so it never gets a redundant tag) even when a second book is used heavily but not exclusively.
- **Optional default-tunebook sentence** — "Name the default tunebook edition near the opening" (Minutes Maker options) inserts something like *"Song selections were from The Sacred Harp: 1991 Edition unless otherwise noted; other selections are marked ShH for The Shenandoah Harmony."* Every other recognized book actually used gets named explicitly, in the order it first appears — a bare per-song code like "ShH" means nothing to a reader unless its full title is spelled out somewhere, and this sentence is the only place that happens. Songs logged as "Other" are left out of the list itself (they're self-identifying by title, with no code to decode) but still trigger the "unless otherwise noted" hedge.
- **Two independent tunebook code systems** — internally, non-default books are tagged with **SingLoud.org** codes; the dedicated SHMHA export automatically translates those to the *Minutes Book's* own abbreviation table (e.g. `SHC` → `CB`), flagging anything it can't confidently translate rather than guessing. A handful of Capture's own book codes (`SHM2025`, `SHM1991`, `ShH2012`, `VPH2024`, `SHC2012`) are recognized and mapped automatically.
- **Leader name normalization** — clusters likely misspelled/inconsistent leader names (`John de Re` / `John DeRe` / `John del Re`) by edit distance and lets you merge them to one canonical spelling everywhere; co-leaders written comma-separated ("Chris Wolf, Elena Conway") are reformatted to "and" for display, matching Minutes Book style.
- **Narrative, not a form dump** — generates continuous prose in the style real Minutes Book entries actually use: dense semicolon-joined `Leaders:` lists, recess/lunch re-entry sentences, an inline memorial-lesson block, and a closing-song sentence — not a sectioned field-by-field printout. "Other"-book song titles print in quotes so they read clearly as a title rather than an odd phrase.
- **Room for the material Capture can't log live** — a **Memorial lesson remarks** field (Names & Lists tab) for the full text of anything said during the memorial lesson, and a **Committee & Secretary's Reports** field (Business tab) for Finance/Resolutions/Secretary's reports and similar. Both print verbatim, in their own paragraphs, in the right place in the generated document — this is what lets the app reproduce a full historical set of minutes, not just the song log.
- **Smart cleanup of capture-tool noise** — recognizes and trims auto-generated "brought the class back to order" boilerplate at the clause level (so a note that mixes boilerplate with a genuine aside keeps the useful part), and drops a redundant chaplain-prayer mention from a note *only* when the app is already crediting that same person's prayer in its own generated sentence — never when it isn't, so information is never silently dropped. The reverse case is also handled: if a note already credits a *different*, specifically named person for a prayer ("Louis Hughes led the morning prayer," say, when the event's Chaplain is someone else), Compile suppresses its own generated chaplain-credit sentence instead of generating a second, contradictory credit for the same prayer.
- **A name-only Annual/edition number field**, kept separate from the proper Name of Singing, with a live warning if an ordinal number ("2nd Annual...") gets typed into the name field by mistake. Every export bakes the number into the displayed title automatically, except the SHMHA export, which keeps its printed title fixed, matching their convention.
- **SHMHA Guide tab** — the actual submission instructions, style rules, and book-abbreviation table live in the app itself for reference while you work.
- **Three types of output, each with its own export format(s)**: **Minutes Maker** (plain text, Markdown, HTML, PDF print view, plus the Master CSV — the complete, authoritative project record that re-opens in either app without losing anything either one added), with its own per-song and summary-line checkboxes (song number, title, source, ALL CAPS, a song index, and which pieces make up the summary line); **SHMHA Minutes Book Submission**, a dedicated export that applies their specific style rules (straight quotes, `--` instead of an em dash, two spaces between sentences — abbreviation-aware, so "St. Giles" and initials like "F. Herr" don't get an incorrect extra space) on top of the translated book codes, always by page number for printed-book songs regardless of Minutes Maker's own checkboxes; and **Simple List**, a terse, events-only export (officers as "Role—Name" lines, each song as Name/Page/Source, one line per song, tab-separated) meant for checking names and details rather than publication. (A Word/.docx export previously existed but has been removed — its generator was broken and built against a document model that's being replaced; paste the plain text, Markdown, or HTML export into Word in the meantime.)
- **Configurable prayer credit phrasing** — both the opening prayer ("Prayer by X" / "The morning prayer was offered by X" / "X offered the opening prayer" / etc.) and the closing prayer ("X offered the closing prayer" / "X offered the benediction" / "The class was dismissed with prayer by X" / etc.) have their own independent style menu, matched against phrasing seen in real published minutes — set once on the Wording & presentation section and it applies throughout.
- **Live preview, by Type of output** — choose Minutes Maker, SHMHA Minutes Book Submission, or Simple List on the Preview & Export tab, and the preview updates immediately to match — check any of them before exporting.
- **Visible save status** — a persistent "Saved locally at [time]" line, or a clear warning if this browser can't save locally at all.

## Importing a CSV

Compile matches columns by name (case-insensitively), so it tolerates some variation, but it's built primarily around Capture's current export:

| Column | Notes |
|---|---|
| `Schema Version` | Informational. Compile notes a version it wasn't tested against, but never refuses an import on this basis alone — schema strictness is Capture's job on its own re-import, not Compile's. |
| `Order of entry` | Authoritative when every value is present, valid, and unique — used to reconstruct the real event sequence before sessions are even interpreted, so a file that's been resorted or reassembled by another tool still imports correctly. Falls back to physical row order, with a warning, only when values are missing, duplicated, or invalid. |
| `Record Type` | `song`, `marker`, `session`, or `metadata`. Falls back to a blank-fields heuristic if this column is missing (session boundaries can't be inferred this way, so older files fall back to grouping by date change instead). |
| `Session Label` | The label given (if any) to a `session` row — shown as that session's name on the Song List tab's Sessions section. |
| `Event`, `Date`, `Location` | Auto-fill Event Details from the *first session's* exact value — including a genuinely blank one, if that's what was recorded. A later session's different (or non-blank) value never fills in for an unrecorded first-session fact; that would misrepresent what the first session's own record actually says. `Date` is reformatted automatically. If the file's sessions span more than one calendar date, the generated header automatically shows the real date range (e.g. "June 15–17, 2000") rather than only the first day — the Event Details Date field itself still shows just the first session's date, for reference, with a note underneath confirming the detected range. |
| `Chair`, `Vice-Chair`, `Secretary`, `Treasurer`, `Arranger(s)`, `Chaplain` | Auto-fill the matching Roles tab fields, if present. |
| `Memorial Lesson Leader` | Just a name — taken as-is. (The older combined `Memorial Lesson` column, "Leader — names," is still recognized and parsed for backward compatibility.) |
| `Book` | Tunebook for this row (or `OTHER`). |
| `Leader(s)` | Also recognizes `Name(s)`, `Names`, `Leader`, `Caller` for older files. |
| `Page` | Page/song number. |
| `Song` | Title — used when `Book` is `OTHER` and the song has no page number. |
| `Tag` | `Call Back`, `Memorial`, `Special`, or the Compile-only `Closing` (Capture doesn't export this one — tag it by hand after import). |
| `Notes` | Free text; auto-cleaned of capture-tool boilerplate on export. |
| `Marker` | The break label (`RECESS`, `LUNCH`, `ANNOUNCEMENTS`) for marker rows. |
| `Time entered` | Informational only. |

## Tunebook codes: SingLoud vs. SHMHA

Two different organizations use two different three/four-letter code systems for the same tunebooks, and Compile deliberately keeps them separate:

- **SingLoud.org codes** are used internally and in every export *except* the SHMHA submission.
- **SHMHA's own codes** (published in the *Minutes Book*, page 44) are used *only* in the dedicated SHMHA export, translated automatically from the Work Code you assign.

Where the two systems don't have an obvious correspondence, the SHMHA export flags the code rather than guessing (`CODE?`).

## What Compile doesn't try to automate

By design, some judgment calls are left to the person compiling the minutes:

- Page `t`/`b` suffix correctness (needs the actual tunebook index, not just pattern-matching).
- Brevity of business/memorial/thanks write-ups — SHMHA's own instructions ask for this explicitly.
- Free-text notes that mix genuine content with capture-tool phrasing in ways the cleanup patterns don't recognize.
- Merging a Memorial-tagged and a Special-tagged row that both belong to the same memorial lesson but aren't adjacent in the file — adjacent pairs are merged automatically, non-adjacent ones need a tag adjusted by hand.
- Verifying names, dates, and figures — the app drafts; a human should always proofread before submission.

## Data & privacy

All data lives in the browser's local storage on your device. There is no backend, no account, and no analytics. Use **Reset all** to clear everything and start fresh.

Compile makes zero runtime network requests, same as Capture — no CDN scripts, no remote fonts. The whole suite shares one visual system that looks the same online or offline.

## License

MIT — see the suite-level `LICENSE`.
