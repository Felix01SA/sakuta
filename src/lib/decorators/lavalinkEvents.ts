import { container } from "tsyringe";

import type { NodeEvents, PlayerEvents } from "../types/lavalink";

import { Lavalink } from "../../services/lavalink";

const LavalinkEventBuilder = <T extends keyof NodeEvents | keyof PlayerEvents>(
  eventType: "node" | "player",
) => {
  const lavalink = container.resolve(Lavalink);

  return (event: T): MethodDecorator => {
    return (target: unknown, propertyKey) => {
      lavalink.registerEvent({ event, propertyKey, target }, eventType);
    };
  };
};

export const NodeEvent = LavalinkEventBuilder<keyof NodeEvents>("node");
export const PlayerEvent = LavalinkEventBuilder<keyof PlayerEvents>("player");
