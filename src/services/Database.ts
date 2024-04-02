import { Logger } from '@services'
import * as entities from '@database/entities'
import { inject, singleton } from 'tsyringe'
import { DataSource, EntityTarget } from 'typeorm'

@singleton()
export class Database {
    private _orm: DataSource

    constructor(@inject(Logger) private logger: Logger) {
        this._orm = new DataSource({
            type: 'better-sqlite3',
            database: 'database/database.sql',
            entities: [...Object.values(entities)],
            synchronize: true,
        })
    }

    get orm() {
        return this._orm
    }

    repo<T extends object>(entity: EntityTarget<T>) {
        return this._orm.getRepository(entity)
    }

    async init() {
        try {
            this.logger.info('Database ON!')
            await this._orm.initialize()
        } catch (error) {
            this.logger.error(error)
            process.exit(1)
        }
    }
}
