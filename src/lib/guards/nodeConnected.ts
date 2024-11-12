import { CommandInteraction, Interaction } from "discord.js";
import { GuardFunction } from "discordx";
import { container } from "tsyringe";

import { Lavalink } from "../../services";

export const NodeConnectedGuard: GuardFunction<Interaction> = async (
  interaction,
  _client,
  next,
) => {
  const lavalink = container.resolve(Lavalink);

  const nodes = lavalink.nodeManager.nodes.map((node) => node);

  const connectedNodes = nodes.filter((node) => node.connected);

  if (connectedNodes.length < 1) {
    for (const node of nodes) {
      if (node.connected) continue;

      node.connect(node.sessionId || undefined);
    }

    if (interaction instanceof CommandInteraction) {
      await interaction.reply({
        content:
          "Conectando-se ao serviço de músicas. Por favor tente novemente em instantes",
        ephemeral: true,
      });
    }

    return;
  }

  await next();
};
