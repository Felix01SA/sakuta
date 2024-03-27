import DiscordOAuth2 from 'discord-oauth2'
import { env } from './env'

export const discordOAuth = new DiscordOAuth2({
    clientId: env.BOT_CLIENT_ID,
    clientSecret: env.BOT_CLIENT_SECRET,
})
