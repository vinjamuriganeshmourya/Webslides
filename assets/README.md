# Figma export drop folder

Raw exports from the Figma icons/illustrations page
(`figma.com/design/r9rC1cjmyfA3wmoibDWJkl`, node `2:2`), waiting to be tagged.

```
icons/          icon exports
illustrations/  illustration exports
```

**Export as PNG @2x.** Figma names each file after its layer, so the names come
across. Export the SVGs alongside if a deck will use them, but the PNGs are what
gets looked at when tagging: a tag for visual appearance has to be made by seeing
the artwork, not by reading a layer name.

## Status

**Tagged, 2026-09-22. See [`TAGS.md`](TAGS.md).** 302 PNGs arrived, all of them
were rendered into indexed contact sheets and looked at, and **21 were promoted**
into `slide-kit/assets/spot` and `slide-kit/assets/cast`. `TAGS.md` carries a row
per promoted asset (what is literally drawn, palette, crop, the concepts it
honestly depicts) and accounts for the other 281 by group.

Three things came out of it that matter more than the table:

- **The licence is not established for any of it.** 48 files are named
  `ChatGPT Image <date>.png`, so at least part of the set is generated rather
  than licensed. The 21 promoted files are cleared for internal decks only.
- **There are three incompatible style families in here**, and a slide carrying
  two of them is the obvious way to misuse this drop.
- **About 20 files are third-party brand logos.** None of them should be
  promoted: hard content rule 12 wants the vendor's own file, and
  `slide-kit/assets/companies/` already holds fifteen fetched that way.

The first deck to use any of it is `slide-kit/asset-lab`, five slides that render
the promoted set at the five scales it gets used at.

## This is not the asset library

`slide-kit/assets/` is. It is the one place a deck's images are fetched to and
copied from, and it has its own rules about naming, licences and why a spare is a
liability (see its `README.md` and `illustrations/README.md`).

This folder is a **staging area**, not a second library. Anything that survives
tagging moves into `slide-kit/assets/` under that folder's conventions, with its
licence recorded, and this folder keeps only what has not been decided on yet.
Nothing here should be referenced by a deck.
