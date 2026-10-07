# Qingkui Zeng — Academic Homepage

English academic website for Qingkui Zeng, Lecturer at the School of Artificial Intelligence, Tongling University.

**Live website:** https://zenghuh.site/
**CV:** https://zenghuh.site/cv/

## Development

Node.js 20 or later is sufficient. The website has no npm runtime or build dependencies.

```sh
npm run build
npm run check
npm run dev -- --host 127.0.0.1 --port 4175 --strictPort
```

Open http://127.0.0.1:4175/ to preview. Rebuild and reload after changing content. The generated HTML is committed so GitHub Pages can publish the repository root directly, without running Node or Jekyll on the hosting server.

## Updating content

Edit `data/site.json`, then run `npm run build` and `npm run check`. The homepage and printable CV use the same publication, education and employment records. The publication list is prerendered, so all 19 papers are readable without JavaScript. JavaScript adds search, year filters, citation copying, mobile navigation and reading progress.

Keep the Scholar metrics together with their snapshot date. Publication years and BibTeX follow the publisher's final citation; notes preserve earlier Scholar records and conference years when they differ. Only add a Code link when a public repository has been verified.

## Publishing and recovery

The custom domain is retained in `CNAME`; `.nojekyll` enables direct static publishing. Preserve the existing GitHub Pages branch/root publishing source. The validation workflow checks that the generated pages match their content source.

The previous site's exact master commit, `073895ebadba325ea178ee73818023599a39c573`, is preserved in `backup/pre-redesign-20261006`. Git history remains available. A rollback should restore that version through a normal reviewable commit or revert, without rewriting history.

## Design and sources

The long-page reading order and academic content patterns were informed by https://xukun12138.github.io/. All new HTML, CSS and JavaScript were written independently. Reference-author photos, documents, paper figures and tracking services are not included.

The design uses white, ice blue, snow-mountain blue and deep navy, with local optimized imagery and system sans-serif fonts. The hero landscape and electric-guitar interest image were generated with the built-in ImageGen tool. The hiking and ceramic interests use photographs supplied by the owner on 2026-10-07; the small guitar profile photograph comes from the owner's previous site. Generated illustrations do not document personal trips or performances.

See `docs/content-sources.md` for provenance, `docs/image-prompts.md` for image prompts and `design-qa.md` for browser and visual acceptance results.

The repository's existing MIT license is retained.
