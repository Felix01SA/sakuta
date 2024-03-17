import { Client as XClient } from 'discordx';
import { singleton, container } from 'tsyringe';
import {
    CustomItents as CustomIntents,
    CustomPartials,
} from '@magicyan/discord';
import { Logger, Music } from '@services';
import { env } from '@lib/env';

@singleton()
export class Client extends XClient {
    private _logger: Logger;
    public readonly music: Music;
    constructor() {
        super({
            intents: CustomIntents.All,
            partials: CustomPartials.All,
            silent: true,
        });

        this._logger = container.resolve(Logger);
        this.music = new Music(this, this._logger);
    }

    public async start() {
        this._logger.await('Iniciando serviços.');
        await this.login(env.BOT_TOKEN);
    }
}
