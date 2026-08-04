#!/usr/bin/env python3
"""
Converts the Shenandoah Harmony (2012) index CSV into indexes/ShH2012.json, using the same
edition-index schema as indexes/VPH2024.json (see build_vph_index.py for the full field-by-field
rationale — this file only calls out what's different for this source).

Differences from the VPH2024 conversion:

  - Source is a CSV, not an xlsx workbook, and the column ORDER differs from the VPH file
    (e.g. "Order" is the first column here, last there). Read by header name via
    csv.DictReader, not by position, so this doesn't matter.

  - This book's data is genuinely sparser: Time, Meter, Text Author/Source, Text Year,
    Composer/Arranger, and Comp./Arr. Year are ALL blank for every one of the 469 rows.
    That's a real property of this source file, not a conversion bug — those fields are
    still included on every song entry as empty strings, for the same reason the schema
    keeps them on every book rather than varying shape by how complete the source data
    happens to be: a consumer merging several books' indexes shouldn't have to handle a
    different object shape depending on which book it's reading.

  - This CSV has a "Disambiguated Title" column that isn't in the VPH file. Cross-checked
    against the *existing* tunebook-index.js entry for ShH2012 before writing anything:
    the titles already in production there match this file's "Disambiguated Title" column
    exactly (0 mismatches across all 469 entries) — NOT the bare "Title" column, which
    lacks the "<Title> - <first line>" suffix used to tell apart same-named tunes (this
    book repeats "Exultation," "Lisbon," "Bunker Hill," and others). So "title" below is
    sourced from Disambiguated Title, with a fallback to bare Title only if that column
    were ever blank (it never is here, but a blank shouldn't produce an empty title).
"""

import csv
import json
import re

SRC_CSV = "/mnt/user-data/uploads/Shenandoah_Harmony_Index_-_Sheet1.csv"
OUT_JSON = "/home/claude/indexes/ShH2012.json"
EDITION_CODE = "ShH2012"
INDEX_VERSION = "1.0.0"

MISSING_SPELLINGS = {"not specified", "unknown", "n/a", "nan", ""}


def clean(v):
    if v is None:
        return ""
    s = str(v).strip()
    if s.lower() in MISSING_SPELLINGS:
        return ""
    return s


def canon_page_key(raw_call):
    """'5t' is already lowercase in this file, but normalize defensively anyway
    ('5T' -> '5t') so this converter doesn't silently depend on the source always
    having used lowercase — matches the same rule used for VPH2024."""
    s = str(raw_call).strip()
    m = re.match(r"^(\d+)([TBtb])$", s)
    if m:
        return m.group(1) + m.group(2).lower()
    return s


def split_source(raw_abbr):
    if raw_abbr is None:
        return None
    s = str(raw_abbr).strip()
    if not s:
        return None
    m = re.match(r"^([A-Za-z0-9]+)(?:\s+(\d+))?$", s)
    if not m:
        raise ValueError("Source Abbr. value didn't match the expected pattern: %r" % raw_abbr)
    return {"citedAbbr": m.group(1), "page": m.group(2) or ""}


def main():
    with open(SRC_CSV, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    songs = {}
    for i, r in enumerate(rows, start=2):  # row 2 = first data row, matching spreadsheet row numbers
        page = canon_page_key(r["Call"])

        title = clean(r.get("Disambiguated Title")) or clean(r.get("Title"))

        entry = {
            "title": title,
            "firstLine": clean(r.get("First Line")),
            "meter": clean(r.get("Meter")),
            "timeSignature": clean(r.get("Time")),
            "key": clean(r.get("Key")),
            "textAttribution": {
                "credit": clean(r.get("Text Author/Source")),
                "year": clean(r.get("Text Year")),
            },
            "musicAttribution": {
                "credit": clean(r.get("Composer/Arranger")),
                "year": clean(r.get("Comp./Arr. Year")),
            },
        }
        src = split_source(r.get("Source Abbr."))
        if src is not None:
            entry["source"] = src

        if page in songs:
            raise ValueError("Duplicate page key %r at row %d — refusing to silently overwrite." % (page, i))
        songs[page] = entry

    out = {
        "editionCode": EDITION_CODE,
        "indexVersion": INDEX_VERSION,
        "songs": songs,
    }

    import os
    os.makedirs("/home/claude/indexes", exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print("Converted %d rows -> %d song entries" % (len(rows), len(songs)))
    print("Wrote %s" % OUT_JSON)


if __name__ == "__main__":
    main()
