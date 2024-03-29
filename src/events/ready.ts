import { CronJob } from '@lib/decorators/CronJob'
import { Client, Cron, Logger, Music } from '@services'
import { ActivityType } from 'discord.js'
import { ArgsOf, Discord, Once } from 'discordx'
import { inject, injectable } from 'tsyringe'

@Discord()
@injectable()
export class Ready {
    constructor(
        @inject(Music) private readonly music: Music,
        @inject(Logger) private readonly logger: Logger,
        @inject(Cron) private readonly cron: Cron,
        @inject(Client) private readonly client: Client
    ) {}

    @Once()
    async ready([event]: ArgsOf<'ready'>, client: Client) {
        await client.initApplicationCommands()

        this.music.init({ ...event.user })

        this.cron.startAllJobs()

        this.logger.success('Bot ON!')
    }

    @CronJob('*/30 * * * * *')
    private changeActivity() {
        const activites = [
            'Testes',
            'Desenvolvimento',
            'Beta',
            'Desenvolvido por Felix01SA',
        ]

        let activityIndex = Math.floor(Math.random() * activites.length)

        this.client.user
            ?.setActivity({
                type: ActivityType.Custom,
                name: activites[activityIndex],
                url: 'https://github.com/Felix01SA/sakuta.git',
            })
            .set({
                status: 'online',
            })
    }
}
