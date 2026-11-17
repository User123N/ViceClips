# VICE CLIPS

VICE CLIPS is a cloud-based gaming and livestream content production platform. Its primary interface is **VICE ISLAND**, an interactive 3D island where each building opens a real production module.

## Product direction
- Business model: owned editorial channels.
- Primary content: livestream highlights from owned or explicitly authorized sources.
- Automation: queue-driven AI production.
- Editing: advanced vertical video workflows.
- Infrastructure: cloud web app + persistent media worker.
- Initial channels: VICE LIVE and VICE GTA.

## Architecture
- `apps/web`: Next.js application and VICE ISLAND.
- `apps/worker`: persistent background worker for transcription, moment detection and FFmpeg rendering.
- `packages/agents`: typed agent workflows and orchestration.
- `packages/integrations`: platform-specific API adapters.
- `packages/video-engine`: FFmpeg profiles and render pipeline.
- `packages/database`: shared database types and queries.
- `supabase/migrations`: PostgreSQL schema and RLS policies.

The web application must not render videos inside serverless request handlers. Heavy media processing belongs in the worker.

## Rights and platform constraints
Only process media that VICE CLIPS owns or has documented permission to process. Public availability is not permission to download, edit, redistribute or monetize a stream. Each source must have a permission record with allowed operations and (where applicable) an expiry date. Platform integrations must use documented APIs and granted OAuth scopes. Never bypass access controls or platform restrictions.

## Development
Requirements: Node.js 20+, npm, Supabase project, Redis-compatible queue, and an S3-compatible object store for cloud media processing. Copy `.env.example` to `.env.local` and configure only services you have provisioned. Never commit credentials.

The first milestone is a working end-to-end flow using an uploaded authorized video: ingest -> transcribe -> detect moments -> render vertical clip -> store result. Platform-specific stream ingestion and publishing are separate milestones because API permissions differ.

## Status
Repository initialized. This is not yet a production-ready application. Update this status only after features are implemented and verified.
