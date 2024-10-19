import { CommandInteraction, Interaction } from "discord.js";
import { GuardFunction } from "discordx";
import { container } from "tsyringe";

import { Lavalink } from "../../services/lavalink";

export const VoiceChannelGuard: GuardFunction<Interaction> = async (interactionType, client, next) => {
  const interaction = interactionType

  const lavalink = container.resolve(Lavalink)

  if (interaction instanceof CommandInteraction) {
    if (!interaction.inCachedGuild()) return

    const {guild, member} = interaction

    const voiceChannel = member.voice.channel

    if (!voiceChannel?.id) {
      await interaction.reply({content: 'Connect to a voice channel, please.', ephemeral: true})
      return
    }

    const player = lavalink.getPlayer(guild.id)

    if (player && player.voiceChannelId !== voiceChannel.id) {
      await interaction.reply({content: 'Connect to my voice channel, please.', ephemeral: true})
      return
    }

    await next()
  }
}
