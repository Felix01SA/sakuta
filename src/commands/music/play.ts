import { inject, injectable } from "tsyringe";
import { Discord, Guard, Slash, SlashOption } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";

import { Logger } from "../../services/logger";
import { Lavalink } from "../../services/lavalink";
import { VoiceChannelGuard } from "../../lib/guards/voiceChannel";
import { NodeConnectedGuard } from "../../lib/guards/nodeConnected";
import { MaintenceModeGuard } from "../../lib/guards/maintenceMode";

@Discord()
@injectable()
export class PlayCommand {
  constructor(
    @inject(Logger) private readonly logger: Logger,
    @inject(Lavalink) private readonly lavalink: Lavalink,
  ) {}

  @Slash({ description: "Play a song.", name: "play" })
  @Guard(MaintenceModeGuard, NodeConnectedGuard, VoiceChannelGuard)
  async ping(
    @SlashOption({
      description: "Name or link of your song.",
      name: "search",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    search: string,
    interaction: CommandInteraction<"cached">,
  ) {
    await interaction.deferReply({ ephemeral: true });

    const { channel, guild, member } = interaction;

    const voiceChannel = member.voice.channel;

    const player = this.lavalink.createPlayer({
      guildId: guild.id,
      textChannelId: channel?.id,
      voiceChannelId: voiceChannel!.id,
    });

    const { exception, loadType, playlist, tracks } = await player.search(
      search,
      interaction.user,
    );

    switch (loadType) {
      case "search":
      case "track": {
        player.queue.add(tracks[0]);
        const msg =
          player.playing || player.paused
            ? `${tracks[0].info.title} added to queue`
            : `Playing now ${tracks[0].info.title}`;
        await interaction.editReply(msg);
        break;
      }
      case "playlist": {
        let i = 0;
        for (const track of tracks) {
          player.queue.add(track);
          i++;
        }

        await interaction.editReply(
          `${i} tracks were added from the ${playlist?.name} playlist.`,
        );
        break;
      }
      case "empty":
        await interaction.editReply("Nothing found for search.");
        break;
      case "error":
        this.logger.error(`Command ${interaction.commandName}`);
        this.logger.error(JSON.stringify(exception, null, 2));
        break;
    }

    if (!player.playing) await player.play();
  }
}
