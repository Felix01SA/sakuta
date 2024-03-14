import { BaseEvent } from '@lib/bases/BaseEvent';
import { Client } from '@services';
import { ArgsOf, Discord, On } from 'discordx';

@Discord()
export abstract class InteractionCreate extends BaseEvent {
    @On()
    async interactionCreate(
        [interaction]: ArgsOf<'interactionCreate'>,
        client: Client
    ) {
        if (interaction.user.bot) return;

        client.executeInteraction(interaction);
    }
}
