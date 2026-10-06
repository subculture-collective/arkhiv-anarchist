# Curator and preservation workflows

This closes the planning scope of Anarchist Archive #16. Implementation and live activation keep their own evidence requirements. The original private pilot, expanded archive and second collection establish the boundaries below.

## Tasks and authority

A curator finds source items, compares original and extracted evidence, groups editions, records corrections and notes, and accepts or passes a candidate. Arkhiv owns the copied private curation workbench. Its accepted-only `arkhiv.curation.v1` export is an operator draft: every access field remains false. An acceptance decision grants no acquisition, reading, download, scheduling or public rights.

Operators preserve the complete source response and file inventory before applying a correction. Source metadata remains immutable evidence; editorial overrides are separate. A changed original creates a new variant with its own checksum and review, rather than replacing an original silently. Grouping preserves document and variant identities and records the basis for the change. Native backend migration retains the donor histories and maps the original identities.

Public approval and restriction remain explicit operator actions bound to the current source and exact file. Withdrawal removes serving access while retaining originals and private decisions. A later review cannot reuse an earlier approval for changed bytes. Public correction/removal contact remains info@subcult.tv. Anonymous readers and optional viewer accounts gain no editorial authority.

Use the workbench only in a private operator environment with a separate state directory. Publication operators use their existing archive review tools; no viewer session or curation export can write publication decisions. Introducing multiple curator roles would require a separate deployment and permission proposal. No new role system is accepted by this planning issue.

## Preservation and failure handling

Existing managed jobs cover daily integrity audits, independent NUC backups, source refresh with resume/backoff, stale/failure monitoring and recurring fresh-database restores. Unsuccessful or incomplete source listings never advance the successful baseline. Source removal never deletes local originals. New and changed variants remain private until reviewed.

Retention is still dry-run: seven daily, four weekly and six monthly candidates with qualification pins. Archive #56 owns bounded backup growth, current capacity measurements, deduplication, the 60-day projection and fresh independent restore proof. Keep every verified snapshot and pin until a separately reviewed deletion activation. Do not treat retention configuration as evidence that a calendar cycle or restore ran.

Core #50 owns isolated migration and rollback receipts; #98 owns retained backend cutover and maintenance migration. Capture source revision, immutable image, native contracts, manifests, decisions and schedules before a release. Restore into new state, compare identities and bytes, qualify the original reader, and retain the old artifact/checkpoint. A public cutover has its own owner decision.

## OCR and search assessment

Measured pilot coverage was page text for 24 of 25 documents; one OCR companion had only document-level text. Preserve that distinction: page zero is whole-document OCR, not an invented page match. The expanded migration keeps native page indexes and covers rather than rerunning extraction. Eighteen historical Riot Grrrl refresh records lack raw files; none backs an active edition, so that observation does not justify fabricating source evidence or scheduling OCR over missing bytes.

Current metadata, available-text and page search meet the retained reader contract. No measured multilingual relevance benchmark or scan-only OCR benchmark establishes a need for vector search, automatic translation or automatic AI publication. Those changes are not accepted implementation work. Before proposing an OCR change, choose a small checksum-bound sample from the retained corpus, record languages and missing/existing text, compare extraction accuracy and page mapping, measure CPU/storage cost, and name the license and independent recovery requirements. Keep OCR output as a derivative with tool/version provenance.

## Focused work and rollout

The accepted work is already assigned: Kollektor #2 tracks catalog-to-curation attachment and operator-draft qualification under Arkhiv ownership; Arkhiv #98 tracks native backend conversion; Anarchist Archive #56 tracks backup capacity. Existing archive review and update issues cover correction, publication/restriction and preservation schedules. These tasks retain their own runtime and recovery gates. This plan adds no acquisition, provider, public deployment or automatic publication.

Planning verification uses the existing passing isolated `make verify` receipt for the unchanged application code, plus a local link and whitespace check for this document. No generated archive data or credentials belong in Git.
