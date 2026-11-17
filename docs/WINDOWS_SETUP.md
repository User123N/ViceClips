# Windows setup — VICE CLIPS local MVP

This setup uses your Windows PC as the media worker. No NVIDIA card, paid API key, Redis server or cloud storage is needed.

## 1. Install Node.js

Install the current Node.js LTS release (20 or newer) from the official Node.js website. Close and reopen PowerShell, then check:

```powershell
node --version
npm.cmd --version
```

## 2. Install FFmpeg

Install a Windows FFmpeg build from a trusted distributor and add the folder containing ffmpeg.exe and ffprobe.exe to your user PATH. Reopen PowerShell after changing PATH.

Verify:

```powershell
ffmpeg -version
ffprobe -version
```

If either command is not recognized, the PATH setup is incomplete.

## 3. Download the repository

```powershell
git clone https://github.com/User123N/ViceClips.git
cd ViceClips
npm.cmd install
Copy-Item .env.example .env.local
```

No values need to be added to .env.local for local video rendering.

## 4. Run diagnostics

```powershell
.\\scripts\\check-local.ps1
npm.cmd run worker
```

## 5. Start the web interface

```powershell
npm.cmd run dev
```

Open http://localhost:3000.

## 6. Render your first authorized clip

Open a second PowerShell window in the repository folder. Replace the example paths with real files on your PC:

```powershell
npm.cmd run clip -- --input "C:\Videos\source.mp4" --output "C:\Videos\vice-clip.mp4" --start 30 --duration 45
```

To burn in an existing SRT file:

```powershell
npm.cmd run clip -- --input "C:\Videos\source.mp4" --output "C:\Videos\vice-clip.mp4" --start 30 --duration 45 --subtitles "C:\Videos\captions.srt"
```

The MVP currently limits each rendered segment to 3–180 seconds and input files to 4 GB. Rendering uses CPU and may be slower than real time. Run only one render at a time on an 8 GB machine.

## Troubleshooting

- Restart PowerShell after installing Node.js or FFmpeg.
- Confirm ffmpeg.exe and ffprobe.exe are both on PATH.
- Use a local video file that you own or are explicitly authorized to edit.
- If FFmpeg reports that the subtitles filter is unavailable, use a build that includes libass or render without the optional --subtitles argument.
- Do not put passwords, OAuth tokens or service-role keys in the repository.
