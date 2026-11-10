# Anarchist Archive

![Anarchist Archive identity](docs/brand/anarchist-archive/readme-lockup.png)

Preserved zines and pamphlets with their source records, a catalog, an on-site reader and downloads. The first collection is the Anarchist Zine Archive: zines on mutual aid, abolition, ecology, work and anarchist thought, preserved from Internet Archive's `ZineArchive` item.

Every document keeps its original file, its source history and a note on rights. The rights are unknown, and the archive does not grant any reuse license. Many titles come from source filenames and are provisional catalog labels, not researched bibliographic titles. To ask for a correction or removal, write to info@subcult.tv.

Public site: https://anarchist-archive.subcult.tv

This repository is SUBCULT's Arkhiv archive software with the Anarchist Archive's collections, catalog design and deployment. A second collection, A-Info zines from São Paulo, is configured but not public.

## Features

For readers:

- A catalog of covers with search across metadata and page text, subject filters and a choice of layouts.
- Document pages with editions, pages, source details and rights notes.
- An on-site PDF reader (PDF.js) with a reading focus mode, and search inside documents that have extracted text.
- Downloads of the original preserved files.
- Favorites saved in your browser, and share links.

For operators, the `arkhiv` CLI:

- Plans and acquires explicitly selected source files in bounded, resumable batches, and keeps the original bytes with their SHA-256 hashes.
- Extracts text and cover images, and supports editorial edits and grouping of editions without changing the source metadata.
- Refreshes the source inventory and queues added, changed or removed files for review instead of publishing them.
- Approves or withdraws public access per file from a reviewed manifest, or automatically for a collection whose configuration sets a verified-automatic policy, after hash and reader checks pass.
- Audits stored files, and backs up and restores the catalog and archive.

## Quick start

Requirements: Go 1.26, Node.js 24, pnpm 10.33.0 and Docker with Compose.

Run everything in containers:

```sh
cp .env.example .env    # then choose a local database password
docker compose up --build
```

The web app is served on the loopback port set by `WEB_PORT` (5173 in `.env.example`), and the API on `API_PORT`.

Or run the API and frontend directly against a PostgreSQL 17 database. The API does not read `.env`; export `DATABASE_URL` and an archive folder first (migrations are applied from `../migrations` at startup):

```sh
export DATABASE_URL=postgres://USER:PASSWORD@127.0.0.1:5432/DB?sslmode=disable
export ARKHIV_ARCHIVE=$PWD/var/archive
make dev-api    # Go API from backend/cmd/app
make dev-web    # Vite on port 5173
```

Vite proxies `/api` to `http://127.0.0.1:8080`. Set `ARKHIV_DEV_API` to use another API address.

Checks:

```sh
make verify               # Go format, vet and tests; web typecheck, lint, tests and build; Compose config; dependency pins
make test-browser         # desktop and narrow-screen browser tests in a disposable Docker stack
make test-operations      # Python tests for the scheduled job scripts
make test-integration     # catalog, search, asset and recovery tests; needs a disposable TEST_DATABASE_URL
```

## Configuration

| Variable | Used by | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | API, CLI | PostgreSQL connection string |
| `API_ADDR` | API | Listen address |
| `ARKHIV_ARCHIVE` | API, CLI | Root folder of preserved files |
| `MIGRATIONS_DIR` | API | Folder of SQL migrations, applied at startup |
| `ARKHIV_PUBLIC` | API | Set to `1` to serve only publicly approved files, without running migrations |
| `ARKHIV_REVISION` | API | Revision string reported by the server |
| `VITE_PUBLIC_URL` | Web build | Canonical public address; the current origin is used when unset |
| `VITE_CORRECTION_CONTACT` | Web build | Address for correction and removal requests |

Local Compose also reads `PROJECT_NAME`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT`, `API_PORT` and `WEB_PORT` from `.env` (see [`.env.example`](.env.example)), and `ARKHIV_ARCHIVE_PATH` for the archive folder.

Each collection (source items, selected files, size and batch limits, update and access policy) is defined in a file under `collections/`: [`anarchist-zines.yaml`](collections/anarchist-zines.yaml) and [`a-info-zines.yaml`](collections/a-info-zines.yaml). The first reviewed public manifest is [`anarchist-zines-public-review.json`](collections/anarchist-zines-public-review.json).

## Operator commands

Build the CLI with `make build`, then run `bin/arkhiv <command> --config ../collections/COLLECTION.yaml` from `backend/`. Without `--config`, commands use `collections/anarchist-zines.yaml`. Commands include:

| Command | Purpose |
| --- | --- |
| `migrate` | Apply database migrations |
| `plan`, `acquire` | Preview and run a bounded acquisition |
| `refresh`, `changes`, `review-change`, `acquire-changes` | Check the source for changes, list them, decide on each, and fetch approved changes |
| `list`, `inspect`, `edit`, `group` | Inspect documents, apply editorial overrides, group editions |
| `extract` | Extract text and covers |
| `publish`, `unpublish` | Publish documents in the private catalog |
| `approve-public`, `revoke-public` | Grant or withdraw public access from a reviewed manifest |
| `approve-automatic` | Apply a collection's verified-automatic access policy |
| `audit`, `backup`, `restore` | Check stored files, back up and restore |

[`docs/runbooks/source-updates.md`](docs/runbooks/source-updates.md) explains the source refresh and change review process.

## Deploy

The repository builds two images:

- [`backend/Dockerfile`](backend/Dockerfile): the API and the `arkhiv` CLI, with migrations, collection files, `poppler-utils` and the PostgreSQL client. The API listens on port 8080 and stores files under `/data/archive`.
- [`web/Dockerfile`](web/Dockerfile): the static frontend on nginx. [`web/nginx.public.conf`](web/nginx.public.conf) is the configuration for a public site.

For a public deployment, run migrations and acquisition with an operator database role, then start the API with `ARKHIV_PUBLIC=1`, a read-only database role and a read-only archive mount. Approve files with `approve-public` before they appear. Serve the frontend over HTTPS.

## Project layout

```text
backend/       Go API (cmd/app) and operator CLI (cmd/arkhiv)
web/           React and Vite frontend with the PDF reader
migrations/    SQL migrations
collections/   Collection configurations and public access manifest
scripts/       Browser test stack and scheduled job scripts
deploy/        Shared-engine Compose file and version pins
docs/          Brand assets, design studies, plans and runbooks
```

## Contributing

- Bugs and feature requests: [GitHub issues](https://github.com/subculture-collective/arkhiv-anarchist/issues).
- Code: pull requests on GitHub against `main`. CI runs `make verify`, the browser tests and a production image build on every pull request. All must pass.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## License

The software is licensed under GPL-3.0-only. See [LICENSE](LICENSE). The license does not apply to the archived documents, whose rights remain with their creators.
