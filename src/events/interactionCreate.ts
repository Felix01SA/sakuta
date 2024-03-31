import { Client } from 'discordx'
import { ArgsOf, Discord, On } from 'discordx'

@Discord()
export abstract class InteractionCreate {
    @On()
    async interactionCreate(
        [interaction]: ArgsOf<'interactionCreate'>,
        client: Client
    ) {
        client.executeInteraction(interaction)
    }
}
