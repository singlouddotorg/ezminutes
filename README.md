# EZ Minutes

A single-file, no-install web app for logging songs during a shape-note singing and turning that log into a clean, ready-to-compile CSV of minutes.

Built for the Sacred Harp / shape-note singing community, but usable for any event where you need to log a running order of items, leaders, and page/tune references.

Here is a walkthrough:
https://www.youtube.com/watch?v=ydjWNx06eCk

## What it does

- **Fast entry, built for the table.** Type a leader's name and a page number, hit Enter — no button required. The song title looks itself up from the book's index as you type.
- **Catches mistakes before they happen.** Warns if a page number could mean two different songs (top/bottom), flags pages that don't exist in the book's index, and gently notes if a page has already been logged that day.
- **Six songbooks built in**, each with a full page-title index: The Shenandoah Harmony, The Valley Pocket Harmonist, The Sacred Harp (2025 and 1991 editions), The B. F. White Sacred Harp (Cooper Book), and The Christian Harmony — plus an "Other" option for anything not from a listed book.
- **Markers** for Recess, Lunch, Announcements, and New Day / Location, so the log reads the same way the published minutes eventually will.
- **Tags** for Call Back, Memorial, and Special songs.
- **Everything stays in your browser.** No account, no server, no data leaving your device. Entries persist automatically as you go, with an optional periodic backup download and a one-click Download CSV / Copy at any time.
- **Load a CSV back in** to keep adding to a previous session, correct entries, or pick up on a different device.
- **Full edit support** — every safeguard that applies to a new entry (ambiguous pages, unknown pages, duplicates) applies the same way when editing an existing one.

## Getting started

No installation, no build step, no dependencies. It's one HTML file.

1. Download `index.html` (or clone this repo).
2. Open it in any modern browser — double-click it, or drag it into a browser tab.
3. That's it. Everything runs locally in the page.

To make it available as a link anyone can open, see **Hosting on GitHub Pages** below.

## Using it at a singing

1. Fill in **Event**, **Date**, and **Location**, check off which **Song Sources** are in use, then tap **Done — collapse** to tuck that away for the rest of the session.
2. For each song: type the **Leader**, then the **Page** (e.g. `123`, `45t`, `45b` for top/bottom pages), and hit Enter.
3. Use **Recess / Lunch / Announcements / New Day** to mark breaks and transitions, and tag a song as **Call Back / Memorial / Special** if it applies.
4. Download the CSV (or copy it) whenever you like — it's safe to do this mid-session, and again at the end.

See `samples/james-river-convention-2025-11-01-minutes.csv` for a full worked example of what a completed session's export looks like.

## The CSV format

Every export (manual download, clipboard copy, or automatic backup) uses the same 14 columns:

| Column | Notes |
|---|---|
| `Order of entry` | Sequential position in the log. |
| `Record Type` | `song` or `marker`. |
| `Event` | Sticky for the session; can change mid-file if a New Day marker is used. |
| `Date` | `YYYY-MM-DD`. |
| `Location` | Free text. |
| `Book` | One of the built-in book abbreviations, or `OTHER`. Blank for markers. |
| `Leader(s)` | Free text; multiple leaders are comma-separated. Blank for markers. |
| `Page` | The page/call number as typed (e.g. `45t`). Blank for `OTHER` entries and markers. |
| `Song` | Looked up automatically for indexed books; typed directly for `OTHER` entries. |
| `Tag` | Blank, `Call Back`, `Memorial`, or `Special`. |
| `Notes` | Free text. |
| `Marker` | The marker label (`RECESS`, `LUNCH`, `ANNOUNCEMENTS`, `NEW DAY / LOCATION`). Blank for songs. |
| `Timestamp ISO` | The authoritative instant the entry was logged, in UTC. Used for sorting/auditing. |
| `Time entered` | The display-formatted local time at the moment of entry (e.g. `10:03 AM`). **This is what the app shows and re-shows on import** — it won't shift if the file is opened in a different timezone later. |

A file can be loaded back into the app (via **Load CSV** on the welcome screen, or **Load CSV** from the in-app session menu) to resume a session, correct entries, or merge onto a different device. The importer validates the header, checks `Order of entry` for gaps or duplicates, and rejects rows with structurally invalid data (unrecognized book codes, a missing page on an indexed book, an `OTHER` entry with no title, and so on) rather than silently importing them.

## Data & privacy

Nothing here talks to a server. There is no account, no analytics, no network request of any kind at runtime (the only external calls are to Google Fonts for typefaces). Everything — the running log, the session settings — lives in the browser's local storage on the device you're using, plus whatever CSV files you explicitly download.

That also means: **this is single-device.** There's no sync between a phone and a laptop. If you need to hand off between devices mid-singing, download or copy the CSV and load it into the app on the other device.

## Known limitations

- Single browser/device per session — no built-in multi-user sync.
- The book indexes are only as accurate as the data entered into this project; if you spot a wrong title or a missing page, please open an issue.
- Automatic periodic backup is a real file download, not a silent background save — browsers can't do the latter. Treat it as a bonus, not your only backup.

## Contributing

Issues and pull requests are welcome — corrections to book indexes, bug reports, and feature suggestions all included. This is a single self-contained HTML file by design; please keep contributions dependency-free if possible.

## License

MIT — see `LICENSE`.
