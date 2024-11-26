import "reflect-metadata";

import { container } from "tsyringe";
import { importx } from "@discordx/importer";
import { GatewayIntentBits } from "discord.js";
import { Client, DIService, tsyringeDependencyRegistryEngine } from "discordx";

import { env } from "./lib/environment";
import { Lavalink } from "./services/lavalink";

const importPattern = `${__dirname}/{events,commands}/**/*.{js,ts}`;

async function main(): Promise<void> {
  DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

  const client = new Client({
    intents: Object.values(GatewayIntentBits).filter(
      (bit) => bit !== GatewayIntentBits.MessageContent,
    ) as GatewayIntentBits[],
    silent: true,
  });

  const lavalink = new Lavalink(client);

  container.registerInstance(Client, client);
  container.registerInstance(Lavalink, lavalink);

  await importx(importPattern);

  await client.login(env.BOT_TOKEN!);
}

void main();
