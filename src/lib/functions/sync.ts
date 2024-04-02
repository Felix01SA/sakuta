import { GuildModel, UserModel } from '@database/entities'
import { Database } from '@services'
import { Client } from 'discordx'
import { container } from 'tsyringe'

export const syncUser = async (userId: string): Promise<void> => {
    const repo = container.resolve(Database).repo(UserModel)

    const userData = await repo.findOne({ where: { id: userId } })

    if (!userData) {
        const data = new UserModel()
        data.id = userId
        await repo.save(data)
    } else {
        userData.last_interaction = new Date()
        await repo.save(userData)
    }
}

export const syncGuild = async (
    guildId: string,
    client: Client
): Promise<void> => {
    const repo = container.resolve(Database).repo(GuildModel)

    const guildData = await repo.findOne({
        where: { id: guildId, deleted: false },
    })

    const fetchedGuild = await client.guilds.fetch(guildId).catch(() => null)

    if (!guildData) {
        const deletedGuildData = await repo.findOne({
            where: { id: guildId, deleted: true },
        })

        if (!deletedGuildData) {
            const newGuild = new GuildModel()
            newGuild.id = guildId

            await repo.save(newGuild)
        } else {
            deletedGuildData.deleted = false

            await repo.save(deletedGuildData)
        }
    } else if (!fetchedGuild) {
        guildData.deleted = true

        await repo.save(guildData)
    } else {
        guildData.last_interaction = new Date()
        await repo.save(guildData)
    }
}

export const syncAllGuilds = async (client: Client): Promise<void> => {
    const repo = container.resolve(Database).repo(GuildModel)

    const guilds = client.guilds.cache

    const gPromisses = []

    for (const guild of guilds) gPromisses.push(syncGuild(guild[1].id, client))

    const activeGuilds = await repo.find({ where: { deleted: false } })

    for (const guild of activeGuilds)
        gPromisses.push(syncGuild(guild.id, client))

    await Promise.all(gPromisses)
}
