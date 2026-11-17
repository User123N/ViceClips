import { spawn } from "node:child_process";

function check(command: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(command, ["-version"], { stdio: "ignore", windowsHide: true });
    child.once("error", () => resolve(false));
    child.once("exit", (code) => resolve(code === 0));
  });
}

async function main() {
  const [ffmpeg, ffprobe] = await Promise.all([check("ffmpeg"), check("ffprobe")]);
  console.log("\nVICE CLIPS · LOCAL WORKER");
  console.log(`FFmpeg:  ${ffmpeg ? "ready" : "missing"}`);
  console.log(`FFprobe: ${ffprobe ? "ready" : "missing"}`);
  console.log("Mode:    CPU only · one render at a time");
  if (!ffmpeg || !ffprobe) {
    console.error("\nInstall FFmpeg and add its bin folder to Windows PATH.");
    process.exitCode = 1;
    return;
  }
  console.log("\nReady. Run the clip command shown in README.md.");
}

main().catch((error) => {
  console.error("[vice-worker] startup failed:", error);
  process.exitCode = 1;
});
