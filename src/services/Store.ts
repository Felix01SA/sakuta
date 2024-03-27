import pkg from '@datorama/akita'
import { injectable, singleton } from 'tsyringe'

interface IStore {
    verifiedTokens: any[]
}

const { Store: AkitaStore, StoreConfig } = pkg

@StoreConfig({ name: 'store' })
@singleton()
export class Store extends AkitaStore<IStore> {
    constructor() {
        super({ verifiedTokens: [] })
    }
}
