import { ArgsOf, Discord, Once } from 'discordx'

import { Client, Logger, Music } from '@services'
import { ActivityType } from 'discord.js'
import { inject, injectable } from 'tsyringe'

@Discord()
@injectable()
export class Ready {
    constructor(
        @inject(Music) private readonly music: Music,
        @inject(Logger) private readonly logger: Logger
    ) {}

    @Once()
    async ready([event]: ArgsOf<'ready'>, client: Client) {
        await client.initApplicationCommands()

        this.music.init({ ...event.user })

        this.logger.success('Bot ON!')
    }
}
