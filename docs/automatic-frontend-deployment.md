# Automatic public-reader deployment

Native Gitea CI retains `make verify` and the isolated browser/PostgreSQL 17
smoke. PRs also build and validate the public-reader image without deployment
credentials. Main pushes and manual main dispatches publish the existing role
images first, then deploy the exact frontend revision to Almaz's existing
`public-web` service, container `arkhiv-pilot-public-web-1`.

This consumer now includes the selected Anarchist Archive export from shared
Arkhiv PR 156, commit `0de7aa5d1e5d5b4296c099bcc465266fa70bd4c7`. The public brand
files and their documentation are copied byte-for-byte. Its identity tags and
software credit are applied to the source HTML so a full rebuild retains the
branding already present on the live reader. The runtime base keeps the deployed
fleet's maintained nginx 1.31.7 pin rather than reverting to the older 1.29 source.
The reusable shared Arkhiv default identity is independent of this consumer.

The host's frontend-only baseline retains its two existing networks and read-only
production nginx bind. The existing public API upstream, core/data containers,
archive files, collection membership, provenance and rights records keep their
current release and preservation procedures. This workflow performs no database
migration, ingestion or publication-pointer change.

An app-specific restricted fleet-deploy key accepts only this repository/service
and current main. The receiver refuses runtime drift, verifies image identity,
configuration and public HTML, and restores the previous image on failed
readiness. Retries reuse the first accepted image for that revision. Gitea stores
`HOMELAB_DEPLOY_KEY` and pinned `HOMELAB_KNOWN_HOSTS`; the homelab operator owns
the key and must rotate it by 2027-02-03. Register and test the host profile before
merge; private receipts retain image IDs, diagnostics and rollback commands.
After rollout, compare public HTML/branding/build assets with the running image
and check catalog and document access separately from deployment status.

The original dependency/condition chain produced green PR and main runs with
both image publication and deployment skipped. Delivery now has a direct
dependency on verification; main-only credential guards stay at step level. The
same job builds and validates the reader on PRs, then publishes the exact built
reader and existing API role image before main activation. Main retries skip
publication and reuse an accepted artifact. A green overall run requires a
separate readback of the build/publication/deployment steps and live revision.
