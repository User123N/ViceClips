# VICE CLIPS — zero-budget implementation plan

## Target hardware

Windows 10/11, 8 GB RAM, no NVIDIA GPU. CPU-only, one media job at a time. No paid subscriptions or required API keys.

## P0 — local foundation

- Next.js interface.
- Local TypeScript worker.
- FFmpeg/FFprobe system installation.
- Local media folders with size and duration limits.
- PowerShell setup and diagnostics.

## P1 — first end-to-end workflow

- Select an authorized local video.
- Probe duration and streams with FFprobe.
- Select start and duration.
- Render vertical 9:16 MP4 using CPU-friendly H.264 settings.
- Optionally burn an existing SRT subtitle file.
- Save render metadata and report errors clearly.

## P2 — local transcription and moment suggestions

- Integrate a small Whisper-compatible local model, CPU/int8 where supported.
- Keep model download optional and explain its disk/RAM requirements.
- Start with transcript-based candidate moments and transparent scoring rules.
- Never require a paid AI API.

## P3 — functional VICE ISLAND modules

- Harbor: import local authorized files.
- Moment Lab: review candidate moments.
- Editing Studio: select interval, aspect ratio and caption preset.
- Library: list and play exported clips.
- Command Center: sequential job status and logs.
- Other buildings remain disabled until their feature exists.

## P4 — optional free cloud features

- Supabase Free only for auth and metadata, with quotas disclosed.
- Optional static/web deployment on an eligible free tier.
- Local files remain local; no assumption of free cloud video storage.
- Official platform APIs only, after permissions and account eligibility are confirmed.

## Not in the $0 MVP

- Paid cloud GPU/CPU workers, S3 storage, Redis Cloud, paid LLM APIs.
- Guaranteed 24/7 stream capture.
- Automatic social publishing without approved official API scopes.
- Unlimited cloud hosting or storage.

## Acceptance checks

- FFmpeg and FFprobe are detected.
- Invalid input, missing audio, bad time ranges and missing subtitle files produce clear errors.
- A sample authorized MP4 renders as a playable 9:16 MP4.
- No concurrent render jobs on the 8 GB target machine.
- Run typecheck, lint, production build and a manual Windows render test before claiming release readiness.
