import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from 'typeorm'

@Entity()
export class GuildModel extends BaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id: string

    @Column({ type: 'date' })
    last_interaction: Date = new Date()

    @Column({ type: 'boolean', default: false })
    premium: boolean

    @Column({ type: 'boolean', default: false })
    deleted: boolean

    @CreateDateColumn()
    created_at: Date
}
