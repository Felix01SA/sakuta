import { inject, injectable } from "tsyringe";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import {
  ApplicationCommandOptionType,
  Colors,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";

import { BotConfig } from "../../services/BotConfig";

@Discord()
@injectable()
export class MaintenceCommand {
  constructor(@inject(BotConfig) private readonly botConfig: BotConfig) {}

  @Slash({ description: "Toggles the maintence mode.", name: "maintence" })
  async toggleMaintanceMode(
    @SlashChoice({
      name: "on",
      value: "true",
      nameLocalizations: { "pt-BR": "Ligado" },
    })
    @SlashChoice({
      name: "Off",
      value: "false",
      nameLocalizations: { "pt-BR": "Desligado" },
    })
    @SlashOption({
      name: "set_to",
      description: "The value to set.",
      type: ApplicationCommandOptionType.Boolean,
      required: true,
    })
    value: boolean,
    interaction: CommandInteraction<"cached">,
  ) {
    await interaction.deferReply();

    await this.botConfig.setMaintanceMode(value);

    const embed = new EmbedBuilder({
      color: Colors.Green,
      description: `The maintence mode has been ${value ? "enabled" : "disabled"}.`,
      title: "Maintence mode",
    });

    await interaction.editReply({ embeds: [embed] });
  }

  @Slash({
    description: "Returns the maintence mode status.",
    name: "maintence-status",
  })
  async getMaintanceModeStatus(interaction: CommandInteraction<"cached">) {
    await interaction.deferReply();

    const embed = new EmbedBuilder({
      color: Colors.Green,
      description: `The maintence mode is ${this.botConfig.maintanceMode ? "enabled" : "disabled"}.`,
      title: "Maintence mode",
    });

    await interaction.editReply({ embeds: [embed] });
  }
}
