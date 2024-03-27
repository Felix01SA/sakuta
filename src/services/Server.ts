import { PlatformApplication, Configuration } from '@tsed/common'
import { Inject } from '@tsed/di'
import { join } from 'path'
import { PlatformExpress } from '@tsed/platform-express'
import { inject, singleton, InjectionToken, container } from 'tsyringe'
import cookie from 'cookie-parser'
import { Logger } from './Logger'
import controllers from '../api/controllers'
import { LoggerMiddleware } from 'src/api/middlewares/LoggerMiddleware'

const rootDir = join(import.meta.url, '..', '..')

@Configuration({
    rootDir,
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
