import { importx } from "@discordx/importer";
import { GatewayIntentBits } from "discord.js";
import { Client } from "discordx";

const importPattern = `${__dirname}/events/**/*.{js,ts}`;

async function main(): Promise<void> {
  const client = new Client({
    intents: Object.values(GatewayIntentBits).filter(
      (bit) => bit !== GatewayIntentBits.MessageContent,
    ) as GatewayIntentBits[],
    silent: true,
  });

  await importx(importPattern);

  await client.login(process.env.BOT_TOKEN!);
}

void main();
