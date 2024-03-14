import { BaseEvent } from '@lib/bases/BaseEvent';
import { ArgsOf, Discord, Once } from 'discordx';

import { Client, Logger } from '@services';
import { ActivityType } from 'discord.js';

@Discord()
export abstract class Ready extends BaseEvent {
    @Once()
    async ready(_: ArgsOf<'ready'>, client: Client) {
        await client.initApplicationCommands();

        client.user?.setPresence({
            activities: [
                {
                    name: 'Testes',
                    type: ActivityType.Custom,
                },
                {
                    name: 'Desenvolvimento',
                    type: ActivityType.Watching,
                },
            ],
            status: 'idle',
        });

        client.user?.setAvatar(
            'https://avatars.githubusercontent.com/u/90576743?v=4'
        );

        this.logger.success('Bot ON!');
    }
}
