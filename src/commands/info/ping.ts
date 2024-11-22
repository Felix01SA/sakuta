import { Discord, Slash } from "discordx";
import { inject, injectable } from "tsyringe";
import {
  bold,
  Colors,
  CommandInteraction,
  EmbedBuilder,
  inlineCode,
} from "discord.js";

import { Logger } from "../../services/logger";

@Discord()
@injectable()
export class PingCommand {
  constructor(@inject(Logger) private readonly logger: Logger) {}

  @Slash({ description: "Returns latency info." })
  async ping(interaction: CommandInteraction<"cached">) {
    const oldTime = Math.floor(Date.now() / 10);

    const embed = new EmbedBuilder({
      color: Colors.Yellow,
      description: "Calculando os dados.",
      title: "Pong! 🏓",
    });

    await interaction.reply({ embeds: [embed] });

    const apiLatency = interaction.client.ws.ping;
    const botLatency = Math.floor(Math.floor(Date.now() / 10) - oldTime);

    embed
      .setTitle("Aqui está as informações")
      .setDescription(
        [
          `${bold("API")}: ${inlineCode(`${apiLatency}ms`)}`,
          `${bold("BOT")}: ${inlineCode(`${botLatency}ms`)}`,
        ].join("\n"),
      )
      .setTimestamp()
      .setColor("Green");

    await interaction.editReply({ embeds: [embed] });
  }
}
