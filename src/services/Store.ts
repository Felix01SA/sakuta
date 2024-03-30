import { Store as RXStore } from 'rxeta'
import { singleton } from 'tsyringe'

interface ISpotifyToken {
    access_token: string
    refresh_token: string
    expires_in: number
}

type TVerifiedTokens = ISpotifyToken & { userId: string }

interface IStore {
    verifiedTokens: string[]
    spotifyVerifiedTokens: TVerifiedTokens[]
    musicMessagesId: {
        guildId: string
        messageId: string
        oldMessageId: string
    }[]
}

@singleton()
export class Store extends RXStore<IStore> {
    constructor() {
        super({
            musicMessagesId: [],
            spotifyVerifiedTokens: [],
            verifiedTokens: [],
        })
    }
}
