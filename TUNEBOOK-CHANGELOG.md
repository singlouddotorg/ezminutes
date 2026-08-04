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

**Added:** `GeH2012` — The Georgian Harmony (Second Edition, 2012). Work Code `GeH`, SHMHA code `GH`. 177 songs, digitized from a compiler-supplied source list. SingLoud's own book page lists this title simply as "GeH · 2010" without an edition-year suffix in the code — the `2012` in our Edition Code identifies the specific edition this index was built from (the Second Edition), matching how EZ Minutes already suffixes other books by edition year (e.g. `ShH2012`, `SHC2012`). If a different edition's index is ever added, it should get its own distinct code rather than overwrite this one.

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

**Added:** `NbH2003` — The Norumbega Harmony. Work Code `NbH`, SHMHA code `NbH` (both already anticipated in the "Forthcoming" table below and in `compile.html`'s `WORKCODE_TO_SHMHA` map before this addition — no code changes needed there). 136 songs, digitized from a compiler-supplied source list (page, title pairs; gold-on-black lettering per the compiler's own note, unrelated to the data itself). No split top/bottom pages in this book — every song has its own page. The `2003` in the Edition Code marks the edition this index was built from, matching how other books are suffixed by edition year; if a different edition's index is ever added, it should get its own distinct code rather than overwrite this one.

**Added:** `CSH1934` — The Colored Sacred Harp, compiled by J. Jackson (Ozark, Alabama, 1934). Work Code `CSH`, SHMHA code `CSH`. 77 songs. This one arrived already digitized against the extraction guide's full rich schema (meter, time signature, attributions, verse counts, etc.) rather than a bare page/title list, and a matching edition index (`edition-indexes/CSH1934.json`) was added alongside the base entry. Two things needed correcting before either could be used: (1) the source data's page-position notation ("upper-right", "lower half", etc.) was normalized to `t`/`b` — but only for the 8 pages that genuinely have two different songs sharing a page; 25 other rows carried a position descriptor despite being the *only* song on that page, and correctly resolved to a bare page number rather than a stray, unnecessary suffix; (2) a "36424" value appearing in nearly every row's `catalogCode` field was discarded as an erroneous printer's plate number picked up during extraction, not a real per-song catalog reference — the same plate number recurring identically across almost every page is a strong signal it's a printing artifact, not tunebook-specific metadata (see the extraction guide's own updated caution about this exact pattern). `meter`, `key`, `sourceCitedAbbr`/`sourcePage`, and `copyrightNotice` are all blank across every one of the 77 songs, confirmed directly rather than assumed — this book genuinely doesn't carry any of these, unlike the Denson-lineage books this suite otherwise indexes. What looked like a uniform-zero pattern worth double-checking (the same shape the erroneous "36424" catalog code had, before it turned out to be a printing artifact) turned out this time to be a real, confirmed fact about the book itself rather than a gap in extraction.

**Added:** `NSH1884` — The New Sacred Harp: A Collection of Hymn-Tunes, Anthems, and Popular Songs, for the Choir, Class, Convention and Home Circle. Compiled by B. F. White and J. L. White, published by J. L. White (Atlanta, Georgia, 1884). Work Code `NSH`, SHMHA uncoded. 208 songs, the first seven-shape book in this suite — added the `shapeSystem` field to the schema specifically for this ("4-shape" or "7-shape"), plus a small black-circle quick-identify badge shown alongside the color pill in Browse and Edit Book. Assembled from many small batches of real page images over an extended session, cross-checked at the end against the book's own printed alphabetical index — which caught a real, serious problem before anything shipped: 43 pages had two different songs sharing one bare page key with no `t`/`b` split, inherited from the very first batch of this book's data. Building the edition index the ordinary way silently dropped the second song at every one of those 43 pages (208 rows in, 165 songs out) — caught by checking the output count against the input count rather than assuming they'd match, and none of it was published until the actual splits were confirmed against the real pages one by one. Also caught and fixed while resolving this: a defaced index entry ("We Must Say") had been misread as page 15 when it's actually page 115 — still an open gap, not yet resolved — and an initial attempt to key "Absent Friends" as "15b" was itself a mistake, caught and corrected: the top half of page 15 is only an unlabeled continuation of "Fairy Moonlight" from page 14, not a second real song, so "Absent Friends" is the only genuine song on that page and correctly gets the bare page number `15`, matching the same rule this suite already applies elsewhere (a continuation fragment never counts as one of a page's divisions). A spelling slip in the source data ("New Brittian") was also corrected to "New Britain" at page 57b, matching the book's own printed index — applied to the actual data at the time but never previously written down here; recorded now so the fix has an actual paper trail instead of just having happened. A later, more careful pass through the book's own index caught two further open spelling questions the same way "New Brittain" first surfaced, both now confirmed directly against the actual pages: "Braidy" (page 58) was recorded as "Braidi" and has been corrected to match what's actually printed; "Warwick" (page 50b) needed no change at all — the data already matched the page, and it was the index's own "Warnick" that was off, not this dataset. Separately, "Zuar" (page 70t) was briefly and wrongly flagged as a missing song — it was never actually missing, only mis-transcribed as belonging to page 79 during the original index read-through; confirmed directly against the page that it was correctly in place at 70t the whole time, and the false alarm was corrected rather than left standing. Badge set to dark brown on medium tan, matching the request rather than the earlier placeholder colors chosen without input. Full Title split into `fullTitle` ("The New Sacred Harp") and a new `subtitle` field (the "A Collection of Hymn-Tunes..." phrase), the first book in this suite to actually use the new field. The Shape System input changed from free text to a set of three radio buttons (Four-shape / Seven-shape / Unknown) and repositioned to sit after the badge section rather than before it; the quick-identify mark itself changed from a CSS-drawn circle to the actual Unicode dingbat circled-digit characters (❹ / ❼), simpler to maintain than an equivalent shape built from spans and border-radius.

**Added:** `NHC2001`, `HaS2008`, `SHW2007`, `MoH2005` — four books added together from supplied page/title lists (no rich edition-index data with these, page and title only, matching the original scope this file was built for). All four closed out long-standing rows in the "Forthcoming" table below.

- **`NHC2001`** — The New Harp of Columbia, compiled by M. L. Swan and W. H. Swan, University of Tennessee Press (Knoxville, 2001 reprint). Work Code `NHC`, SHMHA code `NHC`. 260 songs, seven-shape.
- **`HaS2008`** — The Harmonia Sacra, compiled by Joseph Funk and Sons, Harmonia Sacra Publishing Company (Goshen, IN, 2008). Work Code `HaS`, SHMHA code `HS` — matching the code already in `compile.html`'s existing SHMHA table, resolving the reconciliation the forthcoming-table note had been flagging as outstanding. 470 songs, seven-shape.
- **`SHW2007`** — The Sacred Harp (Fourth Edition, with Supplement), compiled by B. F. White, J. L. White, and E. J. King, "The J. L. White Sacred Harp" (Loganville, GA, 2007). Work Code `SHW`, SHMHA code `WB`. 602 songs, four-shape — the largest book in this suite so far.
- **`MoH2005`** — The Missouri Harmony, compiled by Wings of Song, Missouri Historical Society Press (2005). Work Code `MoH`, SHMHA code `MH`. 180 songs, four-shape. The `compiler` field ("Wings of Song") was initially held back on suspicion of being a copy-paste error, since it's word-for-word identical to one of the book's own song titles (song 121) — confirmed since to be correct rather than an error: it's the actual name of the singing group who produced this edition, not a mistake. Restored to the data.

All four passed structural validation with no duplicate page keys, no malformed keys, and no empty titles — checked directly before insertion, not assumed clean because they arrived as a complete list rather than built page-by-page. Shape System values arrived as "Four-shape"/"Seven-shape" and were normalized to this suite's actual stored format ("4-shape"/"7-shape") before insertion.

**Corrected in `SHW2007`:** `fullTitle` was bare "The Sacred Harp," identical to `SHM1991` and `SHM2025`'s own titles before those two bake their edition year directly in ("The Sacred Harp: 1991 Edition," etc.) — meaning `SHW2007` was the one book of the three left genuinely ambiguous in any dropdown, which uses `fullTitle` for its display text. Set to "The Sacred Harp (White Book, 2007)," matching the same in-`fullTitle` disambiguation pattern its siblings already use rather than inventing a new one. `commonName` updated to match for consistency, since a checklist elsewhere in Capture reads that field instead of `fullTitle` for the same book.

---

## Index v1.7.1

**Book-level field correction pass.** The book-level field audit that produced `tunebook-book-level-fields.csv` (see the "Book-level field audit" note under Index v1.7.0's working history) came back to Kevin for review; he returned an updated copy of that CSV as the source of truth, and this release brings all 15 books' book-level fields into line with it. 11 of the 15 books had at least one field touched; 4 (`HaS2008`, `MoH2005`, `NHC2001`, `NSH1884`) were already fully in sync. No `songs` data changed in any book — song counts were checked against the CSV's own `songCount` column for all 15 and all matched exactly before anything was written.

What changed, by book:
- **`ACH2009`** — `shapeSystem` added (`4-shape`), previously blank.
- **`CHM2010`** — `subtitle` and `compiler` (`William Walker`) added, previously blank; `workCode` set to `CHM` (previously deliberately blank per the Index v1.0.0 note about the SingLoud `CHI` mismatch — Kevin's updated data supersedes that caution and assigns `CHM` directly).
- **`CSH1934`** — `shapeSystem` added (`4-shape`), previously blank.
- **`GeH2012`** — `subtitle`, `compiler`, `publisher`, `placePublished`, `publicationYear`, `shapeSystem`, `badgeColor`, and `badgeTextColor` all added, previously blank (this book had no badge colors set at all until now — it was one of the two books flagged as unstyled back in Index v1.3.0's badge-color migration and never got real colors until this pass).
- **`NbH2003`** — `subtitle`, `compiler`, `publisher`, `placePublished`, `publicationYear`, `shapeSystem`, `badgeColor`, and `badgeTextColor` all added (same unstyled-badge gap as `GeH2012`, also from Index v1.3.0); `commonName` changed from "Norumbega" to "Norumbega Harmony".
- **`SHC2012`** — `subtitle` ("Revised Cooper Edition"), `compiler`, `publisher`, `placePublished`, `publicationYear`, and `shapeSystem` added; `fullTitle` changed from "The B. F. White Sacred Harp (Cooper Book)" to bare "The Sacred Harp" (edition now carried in `subtitle` instead); `commonName` changed from "Cooper '12" to "Cooper Book '12".
- **`SHM1991`** — `subtitle` ("1991 Edition"), `compiler`, and `shapeSystem` added; `fullTitle` changed from "The Sacred Harp: 1991 Edition" to bare "The Sacred Harp" (edition now carried in `subtitle` instead).
- **`SHM2025`** — same shape of change as `SHM1991`: `subtitle` ("2025 Edition"), `compiler`, and `shapeSystem` added; `fullTitle` changed from "The Sacred Harp: 2025 Edition" to bare "The Sacred Harp". (The supplied CSV had a trailing space on this book's `fullTitle` value — silently trimmed as an obvious data-entry artifact, not a real difference to preserve.)
- **`SHW2007`** — `fullTitle` changed from "The Sacred Harp (White Book, 2007)" to bare "The Sacred Harp" (edition already lived in `subtitle`, which was untouched); `commonName` changed from "The Sacred Harp (White Book, 2007)" to "Sacred Harp (White Book, 2007)" (leading "The" dropped).
- **`ShH2012`** — `subtitle`, `compiler`, `publisher`, `placePublished`, and `publicationYear` added; `shapeSystem` added (`4-shape`, previously blank); `commonName` changed from "Shenandoah" to "Shenandoah Harmony".
- **`VPH2024`** — `subtitle`, `compiler`, `publisher`, `placePublished`, `publicationYear`, and `shapeSystem` added; `commonName` changed from "Valley Pocket" to "Valley Pocket Harmonist".

**Worth flagging, not resolved here:** this release directly reverses the "Corrected in `SHW2007`" fix from Index v1.7.0, which had deliberately baked "(White Book, 2007)" into that book's `fullTitle` specifically because `SHM1991`/`SHM2025`/`SHW2007` otherwise shared an identical bare "The Sacred Harp" `fullTitle` and were indistinguishable in any UI that displays `fullTitle` alone. With this pass, `SHM1991`, `SHM2025`, `SHC2012`, and `SHW2007` now *all four* share the bare `fullTitle` "The Sacred Harp" again, disambiguated only by `subtitle` — and `subtitle` is not currently rendered in every picker that shows `fullTitle`. Confirmed two real UI spots where this now shows up as four indistinguishable entries: Capture's live book-logging dropdown (`capture.html`, `BOOKS` array built from `b.fullTitle`) and Tunebook Editor's Browse-tab tunebook picker (`tunebook-editor.html`, line ~786). Both are still disambiguated by their underlying edition code internally — nothing is actually broken or mis-attributable — but a person skimming either dropdown by title alone can no longer tell the four books apart at a glance. Left as-is pending Kevin's call on whether to concatenate `subtitle` (or just the edition year) into those two specific display strings, since that's a UI decision beyond what this correction pass was asked to do.

---

## Index v1.7.2

**Corrected in `CHM2010`:** `shapeSystem` was `4-shape`, which is wrong — Walker's *Christian Harmony* tradition is seven-shape. This was an error inherited directly from the `tunebook-book-level-fields.csv` sync in Index v1.7.1 (that CSV's `CHM2010` row read `4-shape`), caught by Kevin reviewing the Tunebook Registry's rendered badges rather than caught during the v1.7.1 sync itself — the CSV was trusted as-is for that field at the time. Corrected to `7-shape` here. Worth a general note for next time a book-level CSV like that one comes back for another round: `shapeSystem` in particular is easy to eyeball-miss in a spreadsheet review since it doesn't visibly clash with anything else in the row, unlike a wrong title or code.

---

## Index v1.7.3

**Corrected in `NHC2001`:** page `a184` was a single combined entry titled "Rounds," standing in for five distinct songs printed together on that page. Split into five individual entries — `a184.1` through `a184.5` — each with its own real title, per Kevin's direct transcription from the book:

| Key | Title |
|---|---|
| `a184.1` | Down Derry (Round, in three parts) |
| `a184.2` | The Church Bell (Round, in three parts) |
| `a184.3` | Morning Bell (Round, in two parts) |
| `a184.4` | Welcome (Round, in two parts) |
| `a184.5` | Sabbath (Round, in three parts) |

The original entry's `musicAttribution` ("Swan," 1848) was carried forward onto all five, since it was recorded once for the whole page and nothing suggests it varies per round — worth a correction if that's wrong for any individual one. `.1`-`.5` suffixes here mean "position on this page," not the suite's separate `.1`/`.2` top-bottom shorthand (which only ever applies to a bare numeric page and tops out at 2) — confirmed no collision: both `canonPage()` implementations in the suite (`capture.html`, `tunebook-editor.html`) only match that shorthand against a page key that's *purely* digits before the dot, so a lettered key like `a184.1` was never at risk of being reinterpreted as "top half of a184." NHC2001's song count moves from 260 to 264 as a result (net +4 from the 5-for-1 split).

---

## Forthcoming — identified, not yet indexed

SingLoud's book listing (singloud.org/books) names several tunebooks EZ Minutes doesn't have song data for yet. Rather than add placeholder entries with no songs to `tunebook-index.js` — which risks a book appearing "supported" in the Capture checkbox list while silently having nothing behind it — they're recorded here instead, with whatever identifiers are already known, so adding the real data later is just a matter of filling in the `songs` object.

| Full Title | Common Name | SingLoud | SHMHA |
|---|---|---|---|
| The Christian Harmony (Heritage / 1873 Edition) | Christian Harmony (Heritage) | CHW2015 | *(unknown)* |
| The Southern Harmony | Southern Harmony | SoH *(1993 reprint)* | SoH |
| The Social Harp | Social Harp | ScH | ScH |
| The Northern Harmony | Northern Harmony | NoH2012 | NH |

SHMHA codes above are carried over from the existing `SINGLOUD_TO_SHMHA` table already in `compile.html`, not independently re-verified against SHMHA's own materials for this changelog entry.

1. Add an entry under `EZ_MINUTES_TUNEBOOKS.books` in `tunebook-index.js`, keyed by a short code that doesn't collide with an existing one. See the comment block at the top of that file for the exact shape.
2. Add a row to this changelog (or a new dated section, for a later index version) recording the addition.
3. If replacing the whole file with an updated version, bump `EZ_MINUTES_TUNEBOOK_INDEX_VERSION` at the top of `tunebook-index.js` and add a new section here rather than editing the v1.0.0 table above.

No code changes to `capture.html` or `compile.html` are needed to add a book — both derive their book lists, title lookups, split-page detection, code mappings, and badge colors from whatever's in `tunebook-index.js` at load time.
