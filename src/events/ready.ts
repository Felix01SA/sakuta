import { CronJob } from '@lib/decorators/CronJob'
import { syncAllGuilds } from '@lib/functions/sync'
import { Cron, Database, Logger, Music } from '@services'
import { ActivityType } from 'discord.js'
import { Client } from 'discordx'
import { ArgsOf, Discord, Once } from 'discordx'
import { inject, injectable } from 'tsyringe'

@Discord()
@injectable()
export class Ready {
    constructor(
        @inject(Database) private readonly database: Database,
        @inject(Music) private readonly music: Music,
        @inject(Logger) private readonly logger: Logger,
        @inject(Cron) private readonly cron: Cron,
        @inject(Client) private readonly client: Client
    ) {}

    @Once()
    async ready([event]: ArgsOf<'ready'>, client: Client) {
        await client.initApplicationCommands()

        this.music.init({ ...event.user })

        await syncAllGuilds(client)

        this.cron.startAllJobs()

        this.logger.success('Bot ON!')
    }

    @CronJob('*/30 * * * * *')
    private changeActivity() {
        const activities = [
            'Testes',
            'Desenvolvimento',
            'Beta',
            'Desenvolvido por Felix01SA',
        ]

        let activityIndex = Math.floor(Math.random() * activities.length)

        this.client.user
            ?.setActivity({
                type: ActivityType.Custom,
                name: activities[activityIndex],
                url: 'https://github.com/Felix01SA/sakuta.git',
            })
            .set({
                status: 'online',
            })
    }
}
