import { Music } from '@services'
import {
    AutocompleteInteraction,
    CommandInteraction,
    EmbedBuilder,
} from 'discord.js'
import { GuardFunction } from 'discordx'
import { container } from 'tsyringe'

export const MusicGuard: GuardFunction<
    CommandInteraction | AutocompleteInteraction
> = async (interaction, client, next) => {
    const music = container.resolve(Music)

    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTimestamp()
        .setTitle('Ops... :confused:.')

    // Lavalink não iniciado
    if (!music.initiated) {
        music.init({ ...client.user! })

        if (interaction.isAutocomplete()) {
            return interaction.respond([])
        }

        return interaction.reply({
            embeds: [
                embed.setDescription(
                    'Sistema de música não iniciado.\nTente Novamente.'
                ),
            ],
        })
    }

    const nodes = Array.from(music.nodeManager.nodes.values())

    // Nenhum node conectado
    if (!nodes.map((node) => node.connected).includes(true)) {
        nodes.forEach((node) => node.connect())

        if (interaction.isAutocomplete()) {
            return interaction.respond([])
        }

        return interaction.reply({
            embeds: [
                embed.setDescription(
                    'Sistema de música não conectado.\nTente Novamente.'
                ),
            ],
        })
    }

    if (!interaction.inCachedGuild()) return

    const player = music.getPlayer(interaction.guildId)

    if (player && interaction.isAutocomplete()) return await next()

    if (!interaction.isCommand()) return

    const { member } = interaction

    if (!member.voice.channelId)
        return interaction.reply({
            embeds: [
                embed.setDescription(
                    'Entre em um canal de voz para usar esse comando.'
                ),
            ],
            ephemeral: true,
        })

    if (interaction.commandName === 'play') {
        if (player && player.voiceChannelId !== member.voice.channelId)
            return interaction.reply({
                embeds: [
                    embed.setDescription(
                        'Entre no meu canal de voz para usar esse commando.'
                    ),
                ],
                ephemeral: true,
            })

        return await next()
    }

    if (!player)
        return interaction.reply({
            embeds: [
                embed.setDescription('Não estou tocando nada no momento.'),
            ],
            ephemeral: true,
        })

    if (player.connected && player.voiceChannelId !== member.voice.channelId)
        return interaction.reply({
            embeds: [
                embed.setDescription(
                    'Entre no meu canal de voz para usar esse commando.'
                ),
            ],

            ephemeral: true,
        })

    await next()
}
