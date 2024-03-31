import { Logger } from '@services'
import {
    Context,
    Inject,
    Middleware,
    MiddlewareMethods,
    Next,
} from '@tsed/common'

@Middleware()
export class LoggerMiddleware implements MiddlewareMethods {
    @Inject(Logger)
    private logger: Logger
    use(@Context() context: Context, @Next() next: Next) {
        const { request } = context

        const message = `${request.method} | ${request.url}`
        this.logger.scope('API').info(message)

        next()
    }
}
