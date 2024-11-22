import { container } from "tsyringe";
import { GuardFunction } from "discordx";
import { CommandInteraction, Interaction } from "discord.js";

import { BotConfig } from "../../services/BotConfig";

export const MaintenceModeGuard: GuardFunction<Interaction> = async (
  interaction,
  client,
  next,
) => {
  const botConfig = container.resolve(BotConfig);

  if (botConfig.maintanceMode) {
    if (interaction instanceof CommandInteraction) {
      await interaction.reply({
        content: "The bot is in maintenance mode. Please try again later.",
        ephemeral: true,
      });
      return;
    }
  }

  return await next();
};
