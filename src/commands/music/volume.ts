import { Category } from '@discordx/utilities';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Guard, GuardFunction, Slash, SlashOption } from 'discordx';
import { inject, injectable } from 'tsyringe';

import { NodeDisconnected, ChannelVerifications } from '@lib/guards';
import { Music } from '@services';
import { CommandCategory } from '@lib/types/global';

@Discord()
@Category(CommandCategory.MUSIC)
@injectable()
export class Volume {
    constructor(@inject(Music) private readonly music: Music) {}

    @Slash({ description: 'Ajuste de volume.' })
    @Guard(NodeDisconnected, ChannelVerifications)
    async volume(
        @SlashOption({
            name: 'porcentagem',
            description: 'Defina o volume.',
            type: ApplicationCommandOptionType.Integer,
            required: true,
            minValue: 0,
            maxValue: 200,
        })
        vol: number,
        interaction: CommandInteraction
    ) {
        if (!interaction.inCachedGuild()) return;
        const player = this.music.getPlayer(interaction.guildId);
        if (!player)
            return interaction.reply({
                content: 'Não estou conectado.',
                ephemeral: true,
            });
        if (
            !interaction.member.voice.channelId ||
            interaction.member.voice.channelId !== player.voiceChannelId
        )
            return interaction.reply({
                content: 'Entre no meu canal de voz.',
                ephemeral: true,
            });

        if (!player.queue.current)
            return interaction.reply({
                content: 'Não estou tocando nada agora.',
                ephemeral: true,
            });

        await player.setVolume(vol);

        interaction.reply({
            content: `Volume alterado para: ${player.volume}%`,
            ephemeral: true,
        });
    }
}
