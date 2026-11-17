import { spawn } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

type Options = { input: string; output: string; start: number; duration: number; subtitles?: string };

function parseArgs(argv: string[]): Options {
  const values = new Map<string, string>();
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith("--") || !argv[i + 1] || argv[i + 1].startsWith("--")) {
      throw new Error("Invalid arguments. See the usage example in README.md.");
    }
    values.set(key.slice(2), argv[++i]);
  }
  const input = values.get("input");
  const output = values.get("output");
  const start = Number(values.get("start") ?? 0);
  const duration = Number(values.get("duration") ?? 30);
  if (!input || !output) throw new Error("Required: --input <video> --output <clip.mp4>");
  if (!Number.isFinite(start) || start < 0) throw new Error("--start must be a number >= 0.");
  if (!Number.isFinite(duration) || duration < 3 || duration > 180) {
    throw new Error("--duration must be between 3 and 180 seconds for this 8 GB RAM profile.");
  }
  if (path.resolve(input) === path.resolve(output)) throw new Error("Input and output paths must be different.");
  return { input: path.resolve(input), output: path.resolve(output), start, duration, subtitles: values.get("subtitles") ? path.resolve(values.get("subtitles")!) : undefined };
}

function run(command: string, args: string[], capture = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr?.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.once("error", (error) => reject(new Error(`Could not start ${command}. Is it installed and available in PATH? ${error.message}`)));
    child.once("close", (code) => {
      if (code === 0) resolve(capture ? stdout : "");
      else reject(new Error(`${command} exited with code ${code}. ${stderr.slice(-1800)}`));
    });
  });
}

function escapeFilterPath(filePath: string): string {
  return filePath.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'").replace(/,/g, "\\,").replace(/\[/g, "\\[").replace(/\]/g, "\\]");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputInfo = await stat(options.input).catch(() => null);
  if (!inputInfo?.isFile()) throw new Error(`Input video not found: ${options.input}`);
  if (inputInfo.size > 4 * 1024 * 1024 * 1024) throw new Error("Input is larger than the 4 GB MVP limit. Use a shorter/smaller source file.");
  if (options.subtitles) {
    const subtitleInfo = await stat(options.subtitles).catch(() => null);
    if (!subtitleInfo?.isFile()) throw new Error(`Subtitle file not found: ${options.subtitles}`);
  }
  const durationText = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", options.input], true);
  const sourceDuration = Number(durationText.trim());
  if (!Number.isFinite(sourceDuration) || sourceDuration <= 0) throw new Error("FFprobe could not read the source video duration.");
  if (options.start + options.duration > sourceDuration) {
    throw new Error(`Selected interval ends at ${(options.start + options.duration).toFixed(1)}s, but source duration is ${sourceDuration.toFixed(1)}s.`);
  }
  if (path.extname(options.output).toLowerCase() !== ".mp4") throw new Error("Output filename must end in .mp4.");
  await mkdir(path.dirname(options.output), { recursive: true });

  let videoFilter = "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1";
  if (options.subtitles) videoFilter += `,subtitles=filename='${escapeFilterPath(options.subtitles)}'`;
  const ffmpegArgs = [
    "-hide_banner", "-y", "-ss", String(options.start), "-i", options.input,
    "-t", String(options.duration), "-map", "0:v:0", "-map", "0:a?",
    "-vf", videoFilter, "-c:v", "libx264", "-preset", "ultrafast",
    "-crf", "28", "-threads", "2", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", options.output
  ];

  console.log("VICE CLIPS · CPU RENDER");
  console.log(`Source: ${options.input}`);
  console.log(`Interval: ${options.start}s → ${options.start + options.duration}s`);
  console.log("Profile: 720x1280 · H.264 ultrafast · 2 CPU threads");
  console.log("Rendering one clip. This may take longer than the clip duration on CPU-only hardware.\n");
  await run("ffmpeg", ffmpegArgs);
  const outputInfo = await stat(options.output);
  console.log(`\nDone: ${options.output}`);
  console.log(`Output size: ${(outputInfo.size / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((error: unknown) => {
  console.error("\n[VICE CLIPS] ", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
