# Repository Guidelines

## Project Structure & Module Organization

This repository is a static personal blog generated with Node.js scripts. Source generation code and HTML partials live in `src/`: `index.js` builds pages, `makeArticle.js` creates new article drafts, and `generateVercel.js` refreshes routing config. Authored content lives in `site/`; use `site/articles/` for Markdown posts, `site/css/` for source styles, and `site/i/` for images. Generated deployable output is written to `public/`, including compiled HTML, copied assets, and bundled CSS. `drafts/` is for unpublished writing outside the normal build flow.

## Build, Test, and Development Commands

- `npm ci`: install the exact dependency tree from `package-lock.json`.
- `npm run articles`: regenerate `public/` from `site/articles/`, templates, CSS, and images.
- `npm run vercel`: regenerate `vercel.json` routes from article filenames.
- `npm run build`: run article generation and Vercel config generation.
- `npm start`: serve `public/` locally at `http://localhost:8080`.
- `npm run add -- "Article Title"`: create a new Markdown article stub in `site/articles/`.
- `npm test`: currently a placeholder that exits successfully; add real checks when changing behavior.

Use Node.js 22.x, matching the `engines` field in `package.json`.

## Coding Style & Naming Conventions

JavaScript is CommonJS (`require`, `module` style) and uses 4-space indentation in existing scripts. Prefer `const` unless reassignment is required. Keep helper functions small and local to the script that uses them. Article source filenames use hyphenated titles, for example `Mastering-Feature-Flags-The-Basics.md`; generated HTML filenames are lowercased by the build scripts. Keep template placeholders in the existing `{{TOKEN}}` style.

## Testing Guidelines

There is no dedicated test suite yet. For generator changes, run `npm run build` and inspect the affected files in `public/` plus `vercel.json`. For content-only changes, verify the generated page with `npm start`. If adding tests, keep them close to the generator behavior they cover and make `npm test` run them.

## Commit & Pull Request Guidelines

Recent history uses short, direct commit summaries such as `updated`, `fixed-typo`, and `updated articles`. Prefer concise imperative messages that name the change, for example `fix article metadata parsing` or `add websocket article`. Pull requests should include a brief description, note whether generated `public/` output changed, link any relevant issue, and include screenshots when visual layout or published pages change.

## Agent-Specific Instructions

Do not edit generated `public/` files by hand unless the user explicitly asks for an output-only change. Update source files under `src/` or `site/`, then regenerate output with the documented commands.
