import { Client } from '@services';
import { ArgsOf, Discord, On } from 'discordx';

@Discord()
export abstract class InteractionCreate {
    @On()
    async interactionCreate(
        [interaction]: ArgsOf<'interactionCreate'>,
        client: Client
    ) {
        client.executeInteraction(interaction);
    }
}
