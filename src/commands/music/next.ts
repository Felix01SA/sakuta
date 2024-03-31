import { Category } from '@discordx/utilities'
import { Discord, Guard, Slash, SlashOption } from 'discordx'
import { inject, injectable } from 'tsyringe'
import {
    ApplicationCommandOptionChoiceData,
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    CommandInteraction,
} from 'discord.js'

import { MusicGuard } from '@lib/guards'
import { Music } from '@services'
import { CommandCategory } from '@lib/types/global'

@Discord()
@Category(CommandCategory.MUSIC)
@injectable()
export class NextCommand {
    constructor(@inject(Music) private readonly music: Music) {}

    @Slash({ description: 'Pula para proxima musica ou uma especifica.' })
    @Guard(MusicGuard)
    async proxima(
        @SlashOption({
            name: 'musica',
            description: 'Vou tocar qual musica?',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        })
        music: string | undefined,
        interaction:
            | CommandInteraction<'cached'>
            | AutocompleteInteraction<'cached'>
    ) {
        const { guildId } = interaction

        const player = this.music.getPlayer(guildId)

        if (interaction.isAutocomplete()) {
            const response: ApplicationCommandOptionChoiceData<
                string | number
            >[] = []
            const focus = interaction.options.getFocused(true)

            if (focus.name === 'musica') {
                if (player.queue.tracks.length === 0) {
                    interaction.respond([
                        { name: 'Sem musicas a frente.', value: 'empty' },
                    ])
                } else {
                    player.queue.tracks.forEach((track, i) =>
                        response.push({
                            name: track.info.title,
                            value: i.toString(),
                        })
                    )
                    interaction.respond(
                        response
                            .filter((value) => value.name.includes(focus.value))
                            .slice(0, 11)
                    )
                }
            }
        }

        if (interaction.isCommand()) {
            if (player.queue.tracks.length === 0 || music === 'empty')
                return interaction.reply({
                    ephemeral: true,
                    content: `Sem musicas a frente.`,
                })

            if (music) await player.skip(parseInt(music) + 1, true)
            else await player.skip()

            interaction.reply({
                ephemeral: true,
                content: `Pulei para: ${player.queue.current?.info.title} de ${player.queue.current?.info.author}`,
            })
        }
    }
}
