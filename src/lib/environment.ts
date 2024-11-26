import { z } from "zod";
import { config } from "dotenv";
import { globSync } from "glob";
import { join } from "node:path";

const basePath = process.cwd();

const envFiles = globSync(join(basePath, ".env*"), {
  ignore: [".env.exemple"],
});

config({ path: [...envFiles] });

const envSchema = z.object({
  BOT_TOKEN: z.string(),
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  DEVS: z.string().transform((value) => JSON.parse(value) as string[]),
  DEV_GUILD: z.string().optional(),
  NODE_ENV: z.enum(["development", "production"]).optional().default('development'),
});

export const env = envSchema.parse(process.env);
