import { Music } from '@services'
import { Client } from 'discordx'
import { Controller, Get, Inject, UseBefore } from '@tsed/common'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'

@Controller({ path: '/bot' })
@UseBefore(AuthMiddleware)
export class BotStatus {
    @Inject(Client)
    private client: Client

    @Inject(Music)
    private music: Music

    @Get('/online')
    botOn(): boolean {
        return this.client.isReady()
    }

    @Get('/guilds')
    guilds() {
        return this.client.guilds.cache
    }

    @Get('/lavalink')
    lavalink() {
        return this.music.nodeManager.nodes.map((node) => ({
            info: node.info,
            id: node.id,
            stats: node.stats,
        }))
    }
}
