# Design and implementation acceptance

final result: passed

## Comparison target and evidence

Reference: https://xukun12138.github.io/, captured desktop hero, About, Research, News, Publications, Highlights, CV and Contact, plus a measured 390 × 844 responsive frame. The approved target is an independent English implementation with white/snow-blue colors, verified owner content, a compact real avatar and a new interest section.

Source visual truth directory: `D:/work/网站/_research/academic-homepage/`.

- Source desktop: `01-reference-desktop-hero.jpg`, `05-reference-publications.jpg` and the other numbered section captures.
- Source mobile: `reference-mobile-390.jpg`; CSS viewport measured as 390 × 844.
- Implementation: `implementation-comparison-desktop.png`, `implementation-comparison-publications.png`, `implementation-mobile-390.png`, `implementation-mobile-menu.png`, `implementation-desktop-research.png`, `implementation-desktop-interests.png`, `implementation-desktop-contact.png`, and `implementation-cv.png`.
- Combined full-view comparisons: `comparison-hero.jpg`, `comparison-publications.jpg`.
- Focused toolbar/card comparison: `comparison-publication-controls.jpg`.
- Print output: `cv-print-qa.pdf` and all three `cv-print-page-*.png` renders.

Desktop comparison uses the source's 1055 × 884 CSS viewport and the corresponding 1040 px content region. The source image pixels are 1040 × 871; the implementation capture is 1055 × 884 at device scale factor 1. Both are cropped to the common 1040 × 871 content region, excluding the implementation scrollbar and its extra bottom pixels without rescaling. The comparison boards combine both images in one input. Mobile final evidence uses native DevTools device metrics at 390 × 844 and device scale factor 1. Earlier scaled-frame and malformed screenshots are not used as final native implementation evidence.

## Fidelity surfaces

| Surface | Evaluation |
|---|---|
| Fonts and typography | System sans-serif stack with a large identity heading, clear section hierarchy, smaller publication metadata and readable long-title wrapping. The owner's English copy replaces reference-author copy. |
| Spacing and layout rhythm | 1180 px maximum content width; sticky header; two-column hero/biography; four research cards; full-width publication cards; two-column CV; three interest cards. Tablet/mobile columns collapse as specified. |
| Colors and tokens | Approved white, ice blue, #2E6E9E accent, #19364B ink, #52687A muted text and #D4E3EE borders. Blue/white button contrast is 5.47:1; ink/white 12.57:1; muted/ice 5.38:1. Hero footer link has a pale backing for readability over photography. |
| Images and asset quality | Local optimized WebP images, no hotlinks. Four generated decorative assets inspected for subject and palette. Interest images preserve 3:2; the original 140 px guitar profile photo is displayed at small size. No invented author portrait or reference photographs. |
| Copy and content | Confirmed Lecturer appointment, Ph.D. dates, both email addresses and interests; 19 unique DOI-linked papers, correct author order and owner emphasis; dated Scholar snapshot. Unsupported CV sections omitted. |

## Findings and repair history

No unresolved P0/P1/P2 findings remain.

1. **[P2, repaired] Interest pictures appeared too tall.** HTML height attributes kept the images at their source height after CSS width changed. Added responsive `height:auto`; post-fix measurements confirm 375 × 250 px (3:2) desktop image regions, and the complete corrected cards were recaptured.
2. **[P2, repaired] Double anchor offset left excessive preceding content above a section.** Removed the redundant root scroll padding and retained section/card scroll margins. Fresh-page measurements place the publication section about 100 px below the viewport top on desktop.
3. **[P2, repaired] Two-digit CV list numbers were clipped in print.** Increased print list padding from 16 to 28 px. Regenerated the three-page A4 PDF and inspected every page; entries 10–19 now retain complete numbers, with no cropped text or split entries.
4. **[P2, repaired] Tablet About heading joined two sentences when its line break was hidden.** Added a space after the line break in the source text.
5. **[P3, repaired] Home navigation could retain an earlier active-section indication.** Clear the active marker near the top and explicitly handle home/back-to-top links.

Changes in palette, English-only navigation, personal content, compact profile image, publication totals and hobbies are approved adaptations rather than fidelity defects. The source's language/theme switches and tracking UI are intentionally absent.

## Browser and functional acceptance

- Native browser CSS viewport checks: 1440 × 900, 768 × 1024, 390 × 844, 360 × 800. At all four widths the document's scroll width equals its client width; no horizontal overflow. Desktop research has four columns, tablet two, mobile one; interests use three/two/one columns.
- Mobile menu opens, closes after navigation and closes with Escape. Brand/back-to-top behavior checked; primary anchors and contact/CV targets inspected.
- Search is case-insensitive and combines with year selection. 2025 gives two papers; FLNAP plus 2025 gives one; FLNAP plus 2020 gives an empty state; Reset restores all 19; uppercase owner-name search returns all papers. Keyboard Tab exposes a visible focus outline, and Enter activates a year button.
- BibTeX copy success was confirmed by both the status and the copied DOI. Clipboard-unavailable behavior was tested through temporary fault injection in the test page, showing an expanded selectable citation; the page was reloaded to restore its original API afterward.
- A news link reveals its paper even when a prior year/search filter hid that paper.
- With script execution disabled, all 19 publication cards remain rendered and the JS-only search controls remain hidden. Script execution was restored afterward.
- CV print toolbar is visible; Chromium A4 PDF export produces three pages. All page renders inspected after the final print repair. No OS printer job is part of this acceptance run.
- Page console checked: no application errors or warnings.
- `npm run build`, `npm run check` and `git diff --check` pass. The check covers data count/uniqueness, DOI fields, final citation years, prerendered homepage/CV, IDs/internal links, local imagery, CNAME/.nojekyll and legacy-file removal.

## Follow-up polish and limits

No blocking visual follow-up remains. Verification used Chromium device emulation; physical mobile hardware and other browser engines were not tested. Scholar metrics are a dated snapshot. Repository Pages settings require authenticated administration access and are not exposed by the current connector; the existing publishing source is preserved, and the release is separately verified against the live domain after merge.
