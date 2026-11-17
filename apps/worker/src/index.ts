import { Worker } from "bullmq";
import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  console.error("[vice-worker] REDIS_URL is required; worker not started.");
  process.exit(1);
}

const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
const worker = new Worker("vice-media", async (job) => {
  console.info("[vice-worker] received job", { id: job.id, name: job.name });
  if (job.name === "health-check") return { ok: true, processedAt: new Date().toISOString() };
  throw new Error(`Unsupported job type: ${job.name}`);
}, { connection, concurrency: Number(process.env.WORKER_CONCURRENCY ?? 1) });

worker.on("completed", (job) => console.info("[vice-worker] completed", job.id));
worker.on("failed", (job, error) => console.error("[vice-worker] failed", job?.id, error.message));
console.info("[vice-worker] listening on queue vice-media");
