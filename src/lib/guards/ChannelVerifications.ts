import { ICategory } from '@discordx/utilities'
import { CommandCategory } from '@lib/types/global'
import { Music } from '@services'
import {
    AutocompleteInteraction,
    CommandInteraction,
    EmbedBuilder,
} from 'discord.js'
import { DApplicationCommand, GuardFunction, MetadataStorage } from 'discordx'

import { container } from 'tsyringe'

export const ChannelVerifications: GuardFunction<
    CommandInteraction | AutocompleteInteraction
> = async (interaction, client, next) => {
    if (!interaction.inCachedGuild()) return

    const music = container.resolve(Music)

    const { member, guild } = interaction

    const player = music.getPlayer(guild.id)

    const musicCommands = MetadataStorage.instance.applicationCommands
        .filter(
            (cmd: DApplicationCommand & ICategory) =>
                cmd.category === CommandCategory.MUSIC
        )
        .map((command) => command.name)

    if (
        interaction.isAutocomplete() &&
        musicCommands.includes(interaction.commandName)
    ) {
        if (player.queue) return next()

        return interaction.respond([{ name: 'Fila vazia.', value: 'empty' }])
    }

    if (!interaction.isCommand()) return

    const embed = new EmbedBuilder()
        .setTitle('Ops... Deu ruim. 😲')
        .setColor('Red')
        .setTimestamp()

    if (interaction.commandName === 'play') return await next()

    if (!player || !player.queue.current)
        return interaction.reply({
            embeds: [
                embed.setDescription('Não estou tocando nada no momento.'),
            ],
            ephemeral: true,
        })

    if (!member.voice.channelId)
        return interaction.reply({
            embeds: [
                embed.setDescription(
                    'Entre em um canal de voz para usar esse comando.'
                ),
            ],
            ephemeral: true,
        })

    if (player.voiceChannelId !== member.voice.channelId)
        return interaction.reply({
            embeds: [
                embed.setDescription(
                    'Entre no meu canal de voz para usar esse comando.'
                ),
            ],
            ephemeral: true,
        })

    await next()
}
