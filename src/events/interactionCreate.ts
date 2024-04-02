import { syncGuild, syncUser } from '@lib/functions/sync'
import { Client } from 'discordx'
import { ArgsOf, Discord, On } from 'discordx'

@Discord()
export class InteractionCreate {
    @On()
    async interactionCreate(
        [interaction]: ArgsOf<'interactionCreate'>,
        client: Client
    ) {
        if (interaction.guild) await syncGuild(interaction.guild.id, client)

        await syncUser(interaction.user.id)

        client.executeInteraction(interaction)
    }
}
