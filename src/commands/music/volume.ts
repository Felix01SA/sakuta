import { Category } from '@discordx/utilities'
import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js'
import { Discord, Guard, GuardFunction, Slash, SlashOption } from 'discordx'
import { inject, injectable } from 'tsyringe'

import { Music } from '@services'
import { MusicGuard } from '@lib/guards'
import { CommandCategory } from '@lib/types/global'

@Discord()
@Category(CommandCategory.MUSIC)
@injectable()
export class Volume {
    constructor(@inject(Music) private readonly music: Music) {}

    @Slash({ description: 'Ajuste de volume.' })
    @Guard(MusicGuard)
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
        if (!interaction.inCachedGuild()) return
        const player = this.music.getPlayer(interaction.guildId)

        await player.setVolume(vol)

        interaction.reply({
            content: `Volume alterado para: ${player.volume}%`,
            ephemeral: true,
        })
    }
}
