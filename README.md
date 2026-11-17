# VICE CLIPS

VICE CLIPS is a local-first video clipping MVP. The initial workflow costs $0 in service subscriptions and processes files on the user's Windows PC. VICE ISLAND is the product's interactive operations interface.

## Zero-cost MVP architecture

- apps/web: Next.js interface.
- apps/worker: local TypeScript worker using FFmpeg/FFprobe installed on Windows.
- Local folders: source videos, temporary files and rendered MP4 clips.
- Optional Supabase Free: authentication and metadata only. The app must still work without it.
- No Redis, S3, paid AI API, cloud worker or required API key in the MVP.
- CPU-friendly render profile: 720x1280, H.264, AAC, ultrafast preset, two threads, one render at a time.

## Requirements

- Windows 10/11
- Node.js 20+
- FFmpeg and FFprobe available in PATH
- 8 GB RAM is supported by processing one clip at a time; avoid running multiple renders concurrently.

## Install

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Run the local dependency diagnostic:

```powershell
.\\scripts\\check-local.ps1
npm run worker
```

Render an authorized video directly with:

```powershell
npm run clip -- --input "C:\Videos\source.mp4" --output "C:\Videos\vice-clip.mp4" --start 30 --duration 45
```

Optional SRT subtitles can be burned in with --subtitles "C:\Videos\captions.srt". The source video and output must be on local disk.

## Current MVP scope

The local clip command probes a video, extracts a selected interval, converts it to 9:16 and writes an MP4. It does not yet automatically transcribe, identify viral moments, connect livestreams or publish to social platforms. Those features are later milestones, not completed features.

## Rights and platform constraints

Only process media that VICE CLIPS owns or has documented permission to process. Public availability is not permission to download, edit, redistribute or monetize a stream. Platform integrations must use documented APIs and granted OAuth scopes. Never bypass access controls or platform restrictions.

## Free-tier caveat

Optional hosting/database free tiers have quotas, restrictions and may change. Local processing is the no-subscription path; cloud hosting, storage, continuous livestream capture and 24/7 processing are not promised to be free.

## Security

Never commit .env.local, OAuth secrets, Supabase service-role keys or access tokens. Do not paste secrets into GitHub issues or chat.
