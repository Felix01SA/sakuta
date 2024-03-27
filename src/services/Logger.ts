import signale from 'signale'
import { singleton } from 'tsyringe'

const { Signale } = signale

@singleton()
export class Logger extends Signale {
    constructor() {
        super({
            config: { displayTimestamp: true, displayScope: true },
            scope: 'BOT',
        })
    }
}
