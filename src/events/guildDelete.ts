import { GuildModel } from '@database/entities'
import { syncGuild } from '@lib/functions/sync'
import { Database, Logger } from '@services'
import { ArgsOf, Client, Discord, On } from 'discordx'
import { inject, injectable } from 'tsyringe'

@Discord()
@injectable()
export class GuildDelete {
    @On()
    async guildDelete([guild]: ArgsOf<'guildDelete'>, client: Client) {
        await syncGuild(guild.id, client)
    }
}
