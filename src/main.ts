import "reflect-metadata";

// eslint-disable-next-line perfectionist/sort-imports
import { importx } from "@discordx/importer";
import { GatewayIntentBits } from "discord.js";
import { Client, DIService, tsyringeDependencyRegistryEngine } from "discordx";
import { container } from "tsyringe";

const importPattern = `${__dirname}/{events,commands}/**/*.{js,ts}`;

async function main(): Promise<void> {
  DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

  const client = new Client({
    intents: Object.values(GatewayIntentBits).filter(
      (bit) => bit !== GatewayIntentBits.MessageContent,
    ) as GatewayIntentBits[],
    silent: true,
  });

  container.registerInstance(Client, client);

  await importx(importPattern);

  await client.login(process.env.BOT_TOKEN!);
}

void main();
