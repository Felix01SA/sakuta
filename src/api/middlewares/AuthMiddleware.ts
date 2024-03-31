import { Logger, Store } from '@services'
import { Context, Middleware, MiddlewareMethods, Next } from '@tsed/common'
import { Unauthorized, BadRequest } from '@tsed/exceptions'
import { container } from 'tsyringe'

@Middleware()
export class AuthMiddleware implements MiddlewareMethods {
    async use(@Context() context: Context, @Next() next: Next) {
        const store = container.resolve(Store)
        const logger = container.resolve(Logger)
        const { headers } = context.request

        const authHeader = headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer '))
            throw new BadRequest('Formato do token invalido.')

        const token = authHeader.split(' ')[1]

        if (!token) {
            throw new BadRequest('Token não informado.')
        }

        if (store.get('verifiedTokens').includes(token)) return next()

        try {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })

            const user = await response.json()

            if (!user.id) {
                throw new Unauthorized('Token invalido.')
            }

            store.update('verifiedTokens', (tokens) => [...tokens, token])

            setTimeout(() => {
                store.update('verifiedTokens', (tokens) =>
                    tokens.filter((t) => t !== token)
                )
            }, 1000 * 60 * 60 * 24 * 7)

            return next()
        } catch (err) {
            logger.error(err)
            throw new Unauthorized('Invalid Token')
        }
    }
}
