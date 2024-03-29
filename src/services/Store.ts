import { Store as RXStore } from 'rxeta'
import { singleton } from 'tsyringe'

interface IStore {
    verifiedTokens: any[]
}

@singleton()
export class Store extends RXStore<IStore> {}
