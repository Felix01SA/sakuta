import { GuardFunction } from "discordx";
import { CommandInteraction, Interaction } from "discord.js";

import { env } from "../environment";

export const DevsOnlyGuard: GuardFunction<Interaction> = async (
  interaction,
  client,
  next,
) => {
  const devs = env.DEVS;

  if (!devs.includes(interaction.user.id)) {
    if (interaction instanceof CommandInteraction) {
      await interaction.reply({
        content: "You are not a developer. This command is only for developers.",
        ephemeral: true,
      });

      return;
    }
  }

  return await next();
};
