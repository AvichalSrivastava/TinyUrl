import { createClient } from "redis";
import * as dotenv from "dotenv";
dotenv.config();

export const getValkeyClient = async () => {
  const host = process.env.VALKEY_HOST;

  if (!host) {
    throw new Error("VALKEY is not configured");
  }

  const client = createClient({
    // Valkey cluster has "encryption in transit" enabled, so use TLS
    url: `rediss://${host}:6379`,
    socket: {
      connectTimeout: 2000,
      // Disable automatic reconnect loops so we fail fast in Lambda
      reconnectStrategy: () => new Error("Redis reconnect disabled"),
    },
  });

  client.on("error", (err) => {
    console.log("Redis Client Error", err);
  });

  try {
    // Hard cap connection time so Lambda doesn't hit its overall timeout
    await Promise.race([
      client.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Redis connect timeout")), 2000)
      ),
    ]);
  } catch (err) {
    try {
      await client.quit();
    } catch {
      // ignore
    }
    throw err;
  }

  return client;
};