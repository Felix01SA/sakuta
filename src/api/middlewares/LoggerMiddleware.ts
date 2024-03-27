import { Logger } from '@services'
import {
    Context,
    Inject,
    Middleware,
    MiddlewareMethods,
    Next,
} from '@tsed/common'
import chalk from 'chalk'

@Middleware()
export class LoggerMiddleware implements MiddlewareMethods {
    @Inject(Logger)
    private logger: Logger
    use(@Context() context: Context, @Next() next: Next) {
        const { request } = context

        const message = `${chalk.yellow(request.method)} - ${request.url}`
        this.logger.scope('API').info(message)

        next()
    }
}
