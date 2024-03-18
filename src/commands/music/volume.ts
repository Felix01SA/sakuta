import { Category } from '@discordx/utilities';
import { NodeDisconnected } from '@lib/guards/NodeDisconnected';
import { Client } from '@services';
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Guard, GuardFunction, Slash, SlashOption } from 'discordx';

@Discord()
@Category('music')
@Guard(NodeDisconnected as any as GuardFunction)
export class Volume {
    @Slash({ description: 'Ajuste de volume.' })
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
        interaction: CommandInteraction,
        client: Client
    ) {
        if (!interaction.inCachedGuild()) return;
        const player = client.music.getPlayer(interaction.guildId);
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
