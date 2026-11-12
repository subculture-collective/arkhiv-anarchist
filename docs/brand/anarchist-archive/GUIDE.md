# Anarchist Archive — Brand guide

Anarchist Archive: Preserved zines and pamphlets with source records, a catalog, reading and downloads.

Status: Selected by the owner on November 12, 2026, as proposed: the red slash, the name Anarchist Archive, Inter Tight for artwork and the secondary grey for rules only. The mark, wordmark, palette and layouts follow the site's Front Cover design, which the owner selected on October 3, 2026. They replace the Stapled pamphlet identity that an agent selected on November 4, 2026 under the owner's instruction to complete the remaining branding. Sample social layouts remain unapproved for publication.

## Mark

The letter A and a slash, "A/", in heavy grotesque shapes, as in the site's masthead. The A is the text colour and the slash is the accent red. It is an original geometric drawing in the maintained generator; no third-party logo or collection artwork is traced. `logos/mark.svg` is the colour version, `mark-mono-dark.svg` is one light colour for dark backgrounds and `mark-mono-light.svg` is one dark colour for light backgrounds.

- Clear space: one quarter of the mark's height on every side.
- Minimum size: 32 pixels wide on screen. The browser icon is a separately framed derivative for 16, 32 and 48 pixels.
- No gradients, rotation, outlines, shadows or recolouring beyond the three files above.

## Palette

| Role | Colour | Use | Contrast on background |
| --- | --- | --- | --- |
| Background | #f3f1ea | Canvas | — |
| Text | #22231f | Copy and the mark | 13.99:1 |
| Accent | #8c2921 | Lit element and emphasis | 7.57:1 |
| Secondary | #99968c | Rules and borders; too light for text | 2.62:1 |

Text on the background must be at least 4.5:1 and the accent at least 3:1; the generator fails the build otherwise.

## Typography

- Display: Inter Tight, weight 700, for the name and headlines.
- Body: Newsreader, regular, for descriptions.
- Label: IBM Plex Mono, regular, upper case with slight tracking, for small labels such as `ANARCHIST ARCHIVE / BY SUBCULT`.
- Spacing steps: 8, 16, 24, 32, 48, 64 and 96 pixels.

## Front Cover layouts

The hero, link preview and sample social layouts follow the site's Front Cover design: a ruled masthead with the mark, the first word of the name in very large tight capitals (letter spacing -0.055 em), the second word in spaced monospace (0.3 em), heavy and hairline rules, and a framed cover. The cover frame holds a line drawing of an open stapled pamphlet, the earlier mark of this pack, kept as an illustration. Collection scans have unknown rights and are not used in brand artwork. The site itself sets its headings in Arial; Inter Tight is the bundled, licensed stand-in for artwork.

## Files

`logos/` holds the mark variants and the lockup; `product/` the mark copy, the 1440×900 hero and the 1200×630 link preview; `social/` the 1500×500 banner, 1080×1080 square and 512×512 avatar. Layout copy is the one-line description and is marked SAMPLE where it is a sample. Text in every SVG is converted to paths, and `fonts/` carries the three fonts with their licences for new artwork.

Rebuild only this pack with `python3 studio/brand-tools/remaining_site_packs.py --only anarchist-archive` from the repository root. Do not edit the PNG exports by hand.

## Product relationship

The product repository owns its interface and behavior. This pack supplies identity artwork, icons and link previews; it does not replace product controls, source notices, rights records or color semantics. Use the product's existing type stack in the application. Artwork uses the licensed bundled fonts.
