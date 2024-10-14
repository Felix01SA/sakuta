import { Client } from "discordx";
import { LavalinkManager } from "lavalink-client";

export class Lavalink extends LavalinkManager {
  constructor(client: Client) {
    super({
      nodes: [
        {
          authorization: "23138800",
          host: "localhost",
          id: "Local",
          port: 2333,
          secure: false,
        },
      ],
      playerOptions: {
        defaultSearchPlatform: "spotify",
      },
      sendToShard: (guildId, payload) =>
        client.guilds.cache.get(guildId)?.shard.send(payload),
    });

    client.on("raw", (data) => this.sendRawData(data));
  }
}
