import { ICategory } from '@discordx/utilities';
import {
    ApplicationCommandType,
    AutocompleteInteraction,
    CommandInteraction,
    EmbedBuilder,
} from 'discord.js';
import { DApplicationCommand, IGuard, MetadataStorage } from 'discordx';

export const ChannelVerifications: IGuard<
    CommandInteraction | AutocompleteInteraction
> = async (interaction, client, next) => {
    if (!interaction.inCachedGuild()) return;

    const { member, guild } = interaction;
    const player = client.music.getPlayer(guild.id);

    const musicCommands = MetadataStorage.instance.applicationCommands
        .filter(
            (cmd: DApplicationCommand & ICategory) => cmd.category === 'music'
        )
        .map((command) => command.name);

    if (
        interaction.isAutocomplete() &&
        musicCommands.includes(interaction.commandName)
    ) {
        if (player) return next();
        else
            return interaction.respond([
                { name: 'Fila vazia.', value: 'empty' },
            ]);
    }

    if (!interaction.isCommand()) return;

    const embed = new EmbedBuilder()
        .setTitle('Ops... Deu ruim. 😲')
        .setColor('Red')
        .setTimestamp();

    if (interaction.commandName === 'play') return await next();

    if (!player || !player.queue.current)
        return interaction.reply({
            embeds: [
                embed.setDescription('Não estou tocando nada no momento.'),
            ],
            ephemeral: true,
        });

    if (!member.voice.channelId)
        return interaction.reply({
            embeds: [
                embed.setDescription(
                    'Entre em um canal de voz para usar esse comando.'
                ),
            ],
            ephemeral: true,
        });

    if (player.voiceChannelId !== member.voice.channelId)
        return interaction.reply({
            embeds: [
                embed.setDescription(
                    'Entre no meu canal de voz para usar esse comando.'
                ),
            ],
            ephemeral: true,
        });

    await next();
};
