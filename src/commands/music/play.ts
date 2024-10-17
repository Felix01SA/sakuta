import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { inject, injectable } from "tsyringe";

import { Lavalink } from "../../services/lavalink";
import { Logger } from "../../services/logger";

@Discord()
@injectable()
export class PlayCommand {
  constructor(@inject(Logger) private readonly logger: Logger, @inject(Lavalink) private readonly lavalink: Lavalink) {}

  @Slash({description: 'Play a song.', name: 'play'})
  async ping(@SlashOption({description: 'Name or link of your song.', name: 'search', required: true, type: ApplicationCommandOptionType.String}) search: string, interaction: CommandInteraction<'cached'>) {
    await interaction.deferReply({fetchReply: true})

    const {channel, guild, member} = interaction

    const voiceChannel = member.voice.channel

    if (!voiceChannel?.id) {
      await interaction.editReply('Connect to a voice channel, please.')
      return
    }

    const player = this.lavalink.createPlayer({
      guildId: guild.id,
      textChannelId: channel?.id,
      voiceChannelId: voiceChannel!.id
    })

    if (player.voiceChannelId !== voiceChannel.id) {
      await interaction.editReply('Connect to a my voice channel, please.')
      return
    }

    const {exception, loadType, playlist, tracks} = await player.search(search, interaction.user)

    switch (loadType) {
      case "search":
      case "track":
        { player.queue.add(tracks[0])
        const msg = player.playing || player.paused ? `${tracks[0].info.title} added to queue` : `Playing now ${tracks[0].info.title}`
        await interaction.editReply(msg)
        break }
      case "playlist":
        {
          let i = 0
          for (const track of tracks) {
            player.queue.add(track)
            i++
          }

          await interaction.editReply(`${i} tracks were added from the ${playlist?.name} playlist.`)
          break
        }
      case "empty":
        await interaction.editReply('Nothing found for search.')
        break
      case "error":
        this.logger.error(`Command ${interaction.commandName}`)
        this.logger.error(JSON.stringify(exception, null, 2))
        break
    }

    if (!player.playing && !player.paused) await player.play()
  }
}
