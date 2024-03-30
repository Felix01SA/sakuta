import { Music } from '@services'
import {
    AutocompleteInteraction,
    CommandInteraction,
    InteractionType,
} from 'discord.js'
import { GuardFunction } from 'discordx'
import { container } from 'tsyringe'

export const NodeDisconnected: GuardFunction<
    CommandInteraction | AutocompleteInteraction
> = async (interaction, client, next) => {
    const music = container.resolve(Music)
    if (!music.initiated) {
        music.init({ ...client.user! })

        switch (interaction.type) {
            case InteractionType.ApplicationCommand:
                return interaction.reply({
                    content: 'Sistema de musica não inicializado.',
                    ephemeral: true,
                })

            case InteractionType.ApplicationCommandAutocomplete:
                return interaction.respond([])

            default:
                break
        }
    }
    const node = Array.from(music.nodeManager.nodes.values())

    node.forEach((node) => {
        node.connect()
    })

    if (!node.map((node) => node.connected).includes(true)) {
        switch (interaction.type) {
            case InteractionType.ApplicationCommand:
                return interaction.reply({
                    content: 'Erro ao conectar-se ao sistema de musica.',
                    ephemeral: true,
                })

            case InteractionType.ApplicationCommandAutocomplete:
                return interaction.respond([])

            default:
                break
        }
    }

    await next()
}
