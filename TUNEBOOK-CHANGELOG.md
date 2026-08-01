# Tunebook Index Changelog

Tracks what's included in `tunebook-index.js` and when it was added. This file is documentation only — updating the index itself means editing or replacing `tunebook-index.js`; this changelog exists so anyone (including future us) can tell what's in a given copy of that file without diffing it by hand.

`tunebook-index.js` is a separate, bundled file — not fetched, not auto-updated, not version-checked by either app. Whatever copy is sitting next to `capture.html` and `compile.html` is simply what's used. Replacing it with a newer version (more books, corrected pages) is a manual, deliberate act — nothing here happens automatically.

Each tunebook entry carries four identifiers, since these vary independently and any of them might be what someone's looking for:
- **Full title** — the book's complete published name
- **Common name** — a short, familiar way of referring to it
- **SingLoud Work Code** — SingLoud.org's short code for the book, where a confident one exists
- **SHMHA Code** — the Sacred Harp Musical Heritage Association's *Minutes Book* abbreviation, where a confirmed one exists

Song entries currently carry a page number (with `t`/`b` suffix when the book splits that page between two songs) and the title as printed. The format is intentionally left open to carry more per-song data later — composer, meter, first line, etc. — without another breaking change.

---

## Index v1.0.0 — initial release

All seven books EZ Minutes originally shipped with, migrated into the external file format from what was previously embedded directly in `capture.html`.

| Code | Full Title | Common Name | SingLoud | SHMHA | Songs |
|---|---|---|---|---|---|
| `ShH2012` | The Shenandoah Harmony | Shenandoah Harmony | ShH | ShH | 469 |
| `VPH2024` | The Valley Pocket Harmonist | Valley Pocket | VPH | *(none confirmed)* | 386 |
| `SHM2025` | The Sacred Harp: 2025 Edition | Sacred Harp '25 | SHM | *(none confirmed)* | 590 |
| `SHM1991` | The Sacred Harp: 1991 Edition | Sacred Harp '91 | SHM | *(none confirmed)* | 554 |
| `SHC2012` | The B. F. White Sacred Harp (Cooper Book) | Cooper '12 | SHC | CB | 613 |
| `CHM2010` | The Christian Harmony | Christian Harmony | *(intentionally none — see note)* | *(none confirmed)* | 672 |
| `ACH2009` | American Christmas Harp | Christmas Harp | ACH | ACH | 96 |

**Note on `CHM2010`:** SingLoud's own master key currently only has a code (`CHI`) for Ingalls' 1805 *Christian Harmony* — a different book from the Walker-tradition *Christian Harmony* this index ships. Auto-assigning `CHI` here would be a genuine tunebook misattribution, not a convenience, so it's deliberately left blank. If SingLoud adds a distinct code for the Walker-tradition book, update this entry.

**Note on `SHM2025`/`SHM1991`/`VPH2024` SHMHA codes:** no confirmed SHMHA *Minutes Book* abbreviation for these has been verified yet. Compile will prompt for these on the Song List tab rather than guess.

---

## Index v1.1.0

**Added:** `GeH2012` — The Georgian Harmony (Second Edition, 2012). SingLoud code `GeH`, SHMHA code `GH`. 177 songs, digitized from a compiler-supplied source list. SingLoud's own book page lists this title simply as "GeH · 2010" without an edition-year suffix in the code — the `2012` in our internal code identifies the specific edition this index was built from (the Second Edition), matching how EZ Minutes already suffixes other books by edition year (e.g. `ShH2012`, `SHC2012`). If a different edition's index is ever added, it should get its own distinct code rather than overwrite this one.

**Known gap in `GeH2012`:** page 24 doesn't resolve to any title. It appeared in a real historical minutes transcription (the Western Massachusetts Convention, 1999 sample), logged there as an honest "Other" entry with a note rather than a guessed title.

**Corrected in `ACH2009`:** pages 46 ("Sherburne," a two-page setting continuing to page 47) and 48 ("Shiloh") were missing from the original digitization — likely lost to a formatting quirk that wasn't caught at the time — and were briefly transcribed as "Other" entries in the Christmas Harp Singing (2018) sample before the correct titles were confirmed and added here. Page 47 has no separate entry by design: it's the continuation of page 46's setting, not a distinct song.

**Note — possible version mismatch worth checking:** SingLoud's book page lists The Shenandoah Harmony as `ShH2013`, but this index (and the rest of the suite) uses `ShH2012`. Not changed here since it's unclear whether this is a real edition difference or a typo on one side — worth confirming against the actual book before touching the existing index or its 469 songs.

---

## Index v1.4.0

**Moved, not added:** two hardcoded Sacred Harp special cases in `compile.html` (string comparisons against `"SHM1991"`/`"SHM2025"`) — preferring the Sacred Harp as a singing's default book even when another book was used more, and never giving it its own SHMHA code — are downstream of one underlying fact about a book, not two independent ones, so they're now driven by a single `isSacredHarpDefault: true` flag on `SHM2025` and `SHM1991` instead. Also consolidated the SingLoud→SHMHA code table: five entries there duplicated what these two books' (and `ACH2009`/`SHC2012`/`GeH2012`/`NbH2003`'s) own `shmhaCode` field already said, a second source of the same fact that had to be kept in sync by hand. The lookup now checks indexed books first and only falls back to the (now smaller) hardcoded table for books not yet indexed.

---

## Index v1.3.0

**Moved, not added:** book badge colors (`badgeColor` / `badgeTextColor`) — previously seven hardcoded CSS classes in `capture.html`, one per book, growing by one every time a book was added. Migrated the exact existing colors for all seven (no visual change for any of them) and made Capture apply them dynamically from this file instead. This also surfaced a real, silent gap: `GeH2012` and `NbH2003` had no color rule at all when they were added, so their badges were rendering unstyled with no background or text color set. Both now fall back to the same neutral gray Capture already used for an "Other" source, rather than nothing — a real cover color for each can be added here whenever it's known.

---

## Index v1.2.0

**Added:** `NbH2003` — The Norumbega Harmony. SingLoud code `NbH`, SHMHA code `NbH` (both already anticipated in the "Forthcoming" table below and in `compile.html`'s `SINGLOUD_TO_SHMHA` map before this addition — no code changes needed there). 136 songs, digitized from a compiler-supplied source list (page, title pairs; gold-on-black lettering per the compiler's own note, unrelated to the data itself). No split top/bottom pages in this book — every song has its own page. The `2003` in the internal code marks the edition this index was built from, matching how other books are suffixed by edition year; if a different edition's index is ever added, it should get its own distinct code rather than overwrite this one.

---

## Forthcoming — identified, not yet indexed

SingLoud's book listing (singloud.org/books) names several tunebooks EZ Minutes doesn't have song data for yet. Rather than add placeholder entries with no songs to `tunebook-index.js` — which risks a book appearing "supported" in the Capture checkbox list while silently having nothing behind it — they're recorded here instead, with whatever identifiers are already known, so adding the real data later is just a matter of filling in the `songs` object.

| Full Title | Common Name | SingLoud | SHMHA |
|---|---|---|---|
| The Christian Harmony (Heritage / 1873 Edition) | Christian Harmony (Heritage) | CHW2015 | *(unknown)* |
| J. L. White's Sacred Harp | White's Sacred Harp | SHW *(2007 reprint)* | WB |
| The Colored Sacred Harp | Colored Sacred Harp | CSH1934 | *(unknown)* |
| The Southern Harmony | Southern Harmony | SoH *(1993 reprint)* | SoH |
| The Social Harp | Social Harp | ScH | ScH |
| The Missouri Harmony | Missouri Harmony | MiH *(2005 edition)* | MH |
| The Northern Harmony | Northern Harmony | NoH2012 | NH |
| The New Harp of Columbia | New Harp of Columbia | NHC | NHC |
| The Harmonia Sacra | Harmonia Sacra | HSF *(SingLoud's own code — our existing SHMHA table currently keys this book as "HS," worth reconciling when this book is actually added)* | HS |

SHMHA codes above are carried over from the existing `SINGLOUD_TO_SHMHA` table already in `compile.html`, not independently re-verified against SHMHA's own materials for this changelog entry.

1. Add an entry under `EZ_MINUTES_TUNEBOOKS.books` in `tunebook-index.js`, keyed by a short code that doesn't collide with an existing one. See the comment block at the top of that file for the exact shape.
2. Add a row to this changelog (or a new dated section, for a later index version) recording the addition.
3. If replacing the whole file with an updated version, bump `EZ_MINUTES_TUNEBOOK_INDEX_VERSION` at the top of `tunebook-index.js` and add a new section here rather than editing the v1.0.0 table above.

No code changes to `capture.html` or `compile.html` are needed to add a book — both derive their book lists, title lookups, split-page detection, code mappings, and badge colors from whatever's in `tunebook-index.js` at load time.
