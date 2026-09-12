# personal-page

Static blog generated with Node.js 22. Run `npm ci`, `npm run build`, and
`npm start` to preview at http://localhost:8080. `npm test` checks the generator,
filter behavior, asset references, and output budgets.

Styles live in `site/css/`: the shared shell, retained article formatting,
syntax highlighting, and article index. Remove obsolete rules instead of adding
overrides. The build minifies CSS and index-only navigation JavaScript with
esbuild; no browser framework or web fonts are used. CSS is limited to 8,000
bytes minified / 2,500 bytes gzipped; navigation JavaScript to 2,000 bytes gzipped.
Existing analytics and performance scripts are preserved and excluded from
these budgets.

The first sentence of each abstract is displayed on the index; its remaining
text stays hidden but searchable. Filtering progressively enhances the static
article list, and the filter disclosure uses native HTML.

The logo in `site/logo.svg` contains paths extracted from the supplied updated
logo PDF. The build fingerprints the logo and stylesheet, updates HTML, and
`npm run vercel` reads the generated stylesheet URL for its preload header.
HTML revalidates; fingerprinted assets can be cached for a year. Generate pages
before running the routing command independently. CSS license notices are
copied to `public/css/LICENSE.txt` and are not loaded by pages.

Edit source files only, then regenerate `public/` with `npm run build`.
