import { getValkeyClient } from "../common/cache/velkeyClient";

const withTimeout = async <T>(promise: Promise<T>, ms: number, message: string): Promise<T> => {
  return (await Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ])) as T;
};

export const checkRedisConnection = async () => {
  const redis = await getValkeyClient();

  try {
    const cacheKey = `url:32CGk5W`;

    const cached = await withTimeout(
      redis.get(cacheKey),
      2000,
      "Redis GET timeout"
    );
    console.log("cached found: ", cached);

    if (cached) {
      return { url: cached };
    }

    await withTimeout(
      redis.set(
        cacheKey,
        String("https://www.npmjs.com/package/uuid#uuidv7options-buffer-offset"),
        {
          EX: 3600,
        }
      ),
      2000,
      "Redis SET timeout"
    );

    return { url: "#" };
  } finally {
    try {
      await redis.quit();
    } catch {
      // ignore
    }
  }
};