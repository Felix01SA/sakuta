import { Configuration, PlatformApplication } from '@tsed/common'
import { Inject } from '@tsed/di'
import { PlatformExpress } from '@tsed/platform-express'
import cookie from 'cookie-parser'
import { LoggerMiddleware } from '../api/middlewares/LoggerMiddleware'
import { InjectionToken, container, inject, singleton } from 'tsyringe'
import controllers from '../api/controllers'
import { Logger } from './Logger'

@Configuration({
    mount: {
        '/': [...controllers],
    },
    httpPort: 8080,
    httpsPort: false,
    logger: {
        level: 'off',
    },
    resolvers: [
        {
            get<T>(token: InjectionToken<T>) {
                return container.resolve(token)
            },
        },
    ],
})
@singleton()
export class Server {
    constructor(@inject(Logger) private readonly logger: Logger) {}

    @Inject(PlatformApplication)
    app: PlatformApplication

    $beforeRoutesInit() {
        this.app.use(LoggerMiddleware).use(cookie())
    }

    async start() {
        const platform = await PlatformExpress.bootstrap(Server, {})

        platform
            .listen(true)
            .then(() => this.logger.scope('API').info('API ON!'))
    }
}
