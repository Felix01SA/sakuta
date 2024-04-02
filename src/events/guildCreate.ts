import { UserModel } from '@database/entities/User'
import { syncGuild } from '@lib/functions/sync'
import { Database, Logger } from '@services'
import { ArgsOf, Client, Discord, On } from 'discordx'
import { inject, injectable } from 'tsyringe'

@Discord()
@injectable()
export class GuildCreate {
    @On({ event: 'guildCreate' })
    async event([guild]: ArgsOf<'guildCreate'>, client: Client) {
        await syncGuild(guild.id, client)
    }
}
