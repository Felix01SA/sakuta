import { Client as XClient } from 'discordx'
import { singleton, container } from 'tsyringe'
import {
    CustomItents as CustomIntents,
    CustomPartials,
} from '@magicyan/discord'
import { Logger } from '@services'
import { env } from '@lib/env'

export class Client extends XClient {
    constructor(private _logger: Logger) {
        super({
            intents: CustomIntents.All,
            partials: CustomPartials.All,
            silent: true,
        })
    }

    public async start() {
        this._logger.await('Iniciando serviços.')

        await this.login(env.BOT_TOKEN)
    }
}
