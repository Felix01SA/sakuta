import { Client } from "discordx";
import { LavalinkManager } from "lavalink-client";
import { container } from "tsyringe";

import { LavalinkEvent, NodeEvents, PlayerEvents } from "../lib/types/lavalink";

export class Lavalink extends LavalinkManager {
  private _nodeEvents: LavalinkEvent[] = [];
  private _playerEvents: LavalinkEvent[] = [];

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

  loadEvents() {
    this._nodeEvents.forEach((event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clazz: any = container.resolve(event.target.constructor as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.nodeManager.on(event.event as keyof NodeEvents, (...args: any[]) =>
        clazz[event.propertyKey](args),
      );
    });

    this._playerEvents.forEach(event => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clazz: any = container.resolve(event.target.constructor as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.on(event.event as keyof PlayerEvents, (...args: any[]) =>
        clazz[event.propertyKey](args),
      );
    })
  }

  registerEvent(event: LavalinkEvent, eventType: "node" | "player") {
    if (eventType === "player") {
      this._playerEvents.push(event);
    } else {
      this._nodeEvents.push(event);
    }
  }
}
