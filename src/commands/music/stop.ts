import { CommandInteraction } from 'discord.js'
import { Discord, Guard, Slash } from 'discordx'
import { inject, injectable } from 'tsyringe'

import { Music } from '@services'
import { MusicGuard } from '@lib/guards'

@Discord()
@injectable()
export class StopCommand {
    constructor(@inject(Music) private music: Music) {}

    @Slash({ description: 'Para e desconecta o bot do canal de voz.' })
    @Guard(MusicGuard)
    async stop(interaction: CommandInteraction<'cached'>) {
        const player = this.music.getPlayer(interaction.guild.id)

        player.destroy(undefined, true)
    }
}
