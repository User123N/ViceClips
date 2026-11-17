# VICE CLIPS implementation plan

## 24-hour MVP target
Deliver a deployable MVP, not a claim of full commercial readiness.

### P0 — foundation
- Next.js app, TypeScript, lint, typecheck and build.
- Supabase Auth and database migrations.
- Owner-scoped RLS.
- Environment validation and safe secret handling.

### P1 — VICE ISLAND
- Isometric 3D island with optimized GLB assets.
- Interactive buildings: Harbor, Radar, Moment Lab, Editing Studio, Command Center, Broadcast Tower and Observatory.
- Every building opens a functional route.
- Accessible dashboard fallback and reduced-motion/mobile mode.

### P2 — media pipeline
- Upload authorized video to private object storage.
- Create durable processing job.
- Worker probes media with FFprobe.
- Transcribe audio.
- Detect candidate moments using transcript/audio features.
- Render 9:16 clips with FFmpeg and configurable caption presets.
- Save outputs and job logs.

### P3 — agents
- Atlas: orchestration and job state.
- Hunter: source discovery using permitted API scopes.
- Moment: candidate moment ranking.
- Writer: title, description and caption suggestions.
- Editor: render profile selection and FFmpeg job creation.
- Checker: media integrity, caption bounds and permission validation.
- Publisher: official API publishing only.
- Analyst: analytics aggregation.

Agents are typed services, not unrestricted autonomous bots. Every action is permission-scoped, logged and idempotent.

### P4 — platform adapters
- Twitch: OAuth and only API operations allowed by granted scopes.
- YouTube: authorized metadata and upload APIs.
- Kick: documented API capabilities only; no assumption of general VOD download access.
- Provide authorized file upload as fallback.

### P5 — distribution and analytics
- Publishing queue, scheduled status, retry handling.
- Persist external post IDs and platform URLs.
- Collect metrics only where official APIs expose them.

## Acceptance test
An authorized uploaded video can be processed end-to-end and produces a playable vertical MP4, transcript, detected moments, job history and stored metadata.

## Cost controls
- Limit concurrent renders and upload size/duration.
- Delete temporary files after successful rendering.
- Use local/open-source transcription where suitable.
- Add per-job and monthly AI/storage budgets.
- Do not enable paid services without explicit owner approval.

## Release gates
Run lint, typecheck, unit tests, production build, RLS tests and one end-to-end media test. Record integrations blocked by OAuth approval, account eligibility or unavailable API capability.
