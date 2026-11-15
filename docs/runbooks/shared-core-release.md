# Shared core: live layout, upgrades and rollback

Since November 14, 2026 (arkhiv#55) anarchist-archive.subcult.tv's `/api` is the
shared Arkhiv core in print compatibility mode, not the API in `backend/`. The
frontend is unchanged. `deploy/core-release.json` records the reviewed core
release and `deploy/archive-core.env` pins its immutable image digest.

## Live layout on Almaz

| Part | Where |
|---|---|
| Compose project | `anarchist-core` in `/mnt/spektr/server/data/anarchist-core/`; its `compose.yml` is `deploy/core-compose.yml` |
| Settings | `.env` there: `ARCHIVE_ENGINE_IMAGE` (the bootstrap pin), `ARCHIVE_ROOT` (`/mnt/spektr/server/data/arkhiv/pilot`, the legacy archive, mounted read-only), `CORE_SUBNET` |
| Database | service `db` (PostgreSQL 17, data in `runtime/database`), network alias `anarchist-core-db` |
| Credentials | `runtime/` (mode 0700): owner password and URL for `operator`, URL of the read-only `arkhiv_reader` role for `core` |
| Core | service `core`, container `anarchist-core-core-1`: `ARKHIV_COMPATIBILITY=print`, `ARKHIV_PUBLIC=1`, `VHNESS_COLLECTION=anarchist-zines` |
| Collections | `anarchist-zines` (699 public documents, 700 public variants) and `a-info-zines` (15 documents, private as in the legacy app). Compatibility serving takes one collection, so `core` serves `anarchist-zines`; `operator` has both in `VHNESS_COLLECTIONS` |
| Public access | all 700 public variants are automatic access: the owner's collection decision (`review-public-collection --approve-public`), not manual reviews |
| Routing | `core` joins `arkhiv-pilot_public-reader` as `anarchist-core`. The web container `arkhiv-pilot-public-web-1` bind-mounts `/mnt/spektr/server/data/arkhiv/public-nginx.conf`, whose `/api/` location resolves `anarchist-core:8080` through Docker DNS at request time, so a recreated core is picked up without a reload |
| arkhiv.subcult.tv | its Caddy site sends `/api/documents*`, `/api/assets/*` and `/api/collections` to the same web container, so those paths follow the same upstream |
| Legacy API | `arkhiv-pilot-public-api-1` (Compose project `arkhiv-pilot`), stopped and kept for rollback, with database `arkhiv` in `arkhiv-pilot-db-1` |
| Cutover evidence | `cutover-20261114/` in the project directory: the off-host backup copy it was built from, the export, migration plan and apply receipts, comparisons and the switch script |

The `arkhiv_reader` role has `default_transaction_read_only=on`. `migrate`
grants it SELECT on new tables because `operator` sets
`ARKHIV_READER_ROLE=arkhiv_reader`.

The database has a 1536 MiB memory limit. On November 15, a backup of
`retained_legacy_exports` hit the former 768 MiB limit during public reads;
the kernel killed the dumping PostgreSQL process and the server recovered.
The deployment refused activation. Keep enough memory for a full dump while
the reader is running; a successful idle dump alone does not establish that.

The database was built from the newest off-host backup on NUC with
`scripts/export_print_legacy.py --source backup`,
`scripts/prepare_print_migration.py` and `scripts/apply_print_migration.py` from
the arkhiv repository, as rehearsed on arkhiv#50. Each collection kept its legacy
limits (`anarchist-zines` 8 GiB, `a-info-zines` 150 MiB). Document IDs, variant
IDs and URLs are the legacy ones. The site no longer reads the legacy `arkhiv`
database; keep it for the rollback below.

The owner approved pausing acquisitions on 2026-11-15 UTC. The legacy
`arkhiv-update.timer` is disabled: it would acquire and publish into the
legacy database, which the site no longer reads. Migrate acquisition to the
core before re-enabling it; reading and downloading remain available. The legacy backup, audit,
retention, restore and monitor timers still run against the legacy stack.

Set `c="docker compose --project-directory /mnt/spektr/server/data/anarchist-core -p anarchist-core"`
for the commands below.

## Automatic core deploys

The `changes` job in `.github/workflows/deploy.yml` compares the `version` in
`deploy/core-release.json` with the `core_version` that
`https://anarchist-archive.subcult.tv/api/version` reports. When they differ,
when `deploy/core.Dockerfile` changed since the last successful core deploy, or
when a manual run sets `deploy_core`, the `core` job runs before the web job,
provided the repository variable `CORE_DEPLOY_ENABLED` is `true`. The job:

1. pulls the pinned digest and refuses an image whose digest, version or
   revision differs from the pin and `deploy/core-release.json`;
2. builds `deploy/core.Dockerfile` from that digest with an empty context. The
   wrapper adds labels only (source, this repository's revision, the core
   version and the core's revision); CI refuses it if its layers differ from the
   pin's;
3. sends the image to the `anarchist-archive-core` receiver profile with its own
   key (`HOMELAB_CORE_DEPLOY_KEY`) and runs `deploy REVISION`. On Almaz the
   receiver takes a validated dump of the core database
   (`~/.local/libexec/anarchist-core-predeploy-backup`, keeping the five newest
   in `backups/`), runs `operator migrate` with the new image, swaps `core`,
   checks `/api/ready`, a catalog request and `/api/version` (`core_version`
   against the image's `org.opencontainers.image.version`), and restores the
   previous image if a check fails;
4. fails with an annotation when the receiver refuses or rolls back, and
   otherwise checks the live `core_version` and records the deploy as a GitHub
   deployment with task `deploy:core` in the `production` environment. The
   `changes` job compares `deploy/core.Dockerfile` with that commit, so a wrapper
   change whose deploy failed carries forward to the next run. Before the first
   record exists, the core deploys once to create it.

The web job then deploys only `public-web`. The web receiver profile
(`anarchist-archive`) has never listed the legacy API, so web deploys do not
start it, and the workflow no longer builds or publishes it. The receipt and
registration record are under `~/.local/state/fleet-deploy/anarchist-archive-core/`.

## Deploy the core by hand

Back up the database first:

```sh
~/.local/libexec/anarchist-core-predeploy-backup
```

Then set `ARCHIVE_ENGINE_IMAGE` in `.env`, and run `$c --profile operator run --rm operator migrate`
followed by `$c up -d core`.

## Roll back to the legacy API

Tested on 2026-11-15 UTC (switch to legacy, verify the 699-document catalog and a document page, switch forward again). The
switch script writes the nginx config in place, because it is a single-file bind
mount, and reloads nginx without recreating the web container:

```sh
S=/mnt/spektr/server/data/anarchist-core/cutover-20261114/scripts/switch.sh
bash $S legacy   # start the legacy API, wait for /api/ready, restore proxy_pass http://public-api:8080
bash $S core     # point /api at anarchist-core:8080, check /api/version, stop the legacy API
```

On the legacy API `/api/version` returns 404 and `/api/ready` reports revision
`85f100f`. The original nginx config is kept beside the live one as
`public-nginx.conf.before-core-20261114`. While the legacy API serves, an
automatic web deploy does not touch it. Resume `arkhiv-update.timer` only while
the legacy API is the one serving.

## Roll back a core upgrade

Migrations are additive. To return to the previous core image, use the
receiver's rollback overlay from the release receipt, or set the previous digest
in `.env` and run `$c up -d core`. A core older than the database schema may not
start; restore the matching pre-deploy dump from `backups/` into a separate
database first, and preserve newer writes before any restore.

The original document and variant identities, metadata, source history and
access decisions belong to the recovered archive. A core upgrade does not
approve additional media or change collection policy.

## Cutover comparison

The full comparison covered 699 public documents, 700 variants and covers,
2,100 byte-range requests, 1,366 variant searches and six full downloads.
Document identities, matching page numbers and media bytes matched. The 1,161
snippet differences are the core's query-centered excerpts instead of legacy
leading text. The core also returns subjects without an explicit collection
parameter and returns 404 for the out-of-scope private A-Info collection, where
legacy returned empty lists. Neither exposes private documents.

A local nightly core dump runs at 00:55 under
`anarchist-core-backup.timer`, retaining seven dumps. Off-host copies of these
new per-site databases are tracked by arkhiv#117; the legacy off-host backup
is retained but does not include subsequent core-only changes.
