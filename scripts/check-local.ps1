$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "VICE CLIPS - LOCAL ENVIRONMENT CHECK" -ForegroundColor Cyan
Write-Host "-----------------------------------"

$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
$ffprobe = Get-Command ffprobe -ErrorAction SilentlyContinue

if ($node) { Write-Host ("Node.js:  " + (node --version)) -ForegroundColor Green } else { Write-Host "Node.js: missing (install Node.js 20+)" -ForegroundColor Red }
if ($npm) { Write-Host ("npm:      " + (npm.cmd --version)) -ForegroundColor Green } else { Write-Host "npm: missing" -ForegroundColor Red }
if ($ffmpeg) { Write-Host "FFmpeg:   ready" -ForegroundColor Green } else { Write-Host "FFmpeg:   missing" -ForegroundColor Yellow }
if ($ffprobe) { Write-Host "FFprobe:  ready" -ForegroundColor Green } else { Write-Host "FFprobe:  missing" -ForegroundColor Yellow }

Write-Host ""
if (-not $node -or -not $npm) {
  Write-Host "Install Node.js 20 or newer, then reopen PowerShell."
  exit 1
}
if (-not $ffmpeg -or -not $ffprobe) {
  Write-Host "Install FFmpeg and add its bin folder to PATH. Then reopen PowerShell."
  Write-Host "No paid services or NVIDIA GPU are required."
  exit 2
}
Write-Host "Your PC has the basic tools required for local video rendering." -ForegroundColor Green
