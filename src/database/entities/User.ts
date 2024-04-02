import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class UserModel extends BaseEntity {
    @PrimaryColumn({ type: 'varchar' })
    id: string

    @Column({ type: 'date' })
    last_interaction: Date = new Date()

    @Column({ type: 'boolean', default: false })
    premium: boolean
}
