import { LavalinkManager, Player } from 'lavalink-client'
import { Client } from './Client'
import { Logger } from './Logger'
import { env } from '@lib/env'
import { findChannel, findMessage, brBuilder } from '@magicyan/discord'
import {} from '@discordx/utilities'
import { ChannelType, EmbedBuilder, TextBasedChannel } from 'discord.js'

export class Music extends LavalinkManager {
    private message: string

    constructor(private client: Client, private readonly logger: Logger) {
        super({
            sendToShard(guildId, payload) {
                const guild = client.guilds.cache.get(guildId)

                if (guild) guild.shard.send(payload)
            },
            nodes: [
                {
                    host: env.LAVALINK_HOST,
                    port: env.LAVALINK_PORT,
                    authorization: env.LAVALINK_PASSWORD,
                    secure: env.LAVALINK_SECURE,
                },
            ],
            client: { id: env.BOT_CLIENT_ID },
        })

        client.on('raw', (d) => this.sendRawData(d))

        this.nodeManager
            .on('error', (node, error) =>
                logger.error(`Lavalink error: ${error.message}`)
            )
            .on('connect', (node) => logger.success(`Conectado ao Lavalink!`))
            .on('disconnect', (node, reason) =>
                logger.warn(
                    `Desconectado do Lavalink. Motivo: ${reason.reason}`
                )
            )
            .on('reconnecting', (node) =>
                logger.warn(`Reconectando ao Lavalink.`)
            )

        this.on('playerCreate', async (player) => {
            if (!player.connected) await player.connect()
        })
            .on('playerDestroy', (player, reason) => {
                logger.info('Player destroyed', reason)
            })
            .on('playerSocketClosed', (player, payload) => {
                logger.warn(payload.reason)
            })
            .on('trackStart', async (player, track) => {
                const channel = findChannel(
                    client.guilds.cache.get(player.guildId)!,
                    ChannelType.GuildText
                ).byId(player.textChannelId!) as TextBasedChannel

                const embed = this.musicEmbed(player)

                const message = await channel.send({ embeds: [embed] })

                this.message = message.id
            })
            .on('trackStuck', (player, track, payload) => {
                logger.warn('Track stuck', payload.type)
            })
            .on('playerUpdate', (oldPlayer, player) => {
                const channel = findChannel(
                    client.guilds.cache.get(player.guildId)!,
                    ChannelType.GuildText
                ).byId(player.textChannelId!)

                const message = findMessage(channel!).byId(this.message)

                if (!message) return

                const embed = this.musicEmbed(player)

                message.edit({ embeds: [embed] })
            })
            .on('trackError', (player, track, payload) =>
                logger.warn(
                    'Track error',
                    payload.error,
                    payload.exception?.message
                )
            )
    }

    private musicEmbed(player: Player) {
        const queue = player.queue.tracks
        const currentTrack = player.queue.current!

        const embed = new EmbedBuilder()
            .setAuthor({
                name: currentTrack.info.author,
            })
            .setTitle(currentTrack.info.title)
            .setDescription(
                brBuilder(
                    'Proximas:',
                    queue.map(
                        (track, i) =>
                            `${i + 1} - ${track.info.title.substring(0, 30)}`
                    )
                )
            )
            .setImage(currentTrack.info.artworkUrl || null)
            .setThumbnail(currentTrack.pluginInfo.artistArtworkUrl || null)
            .setTimestamp()
            .addFields({
                name: 'Progresso',
                value: `${currentTrack.info.duration} - ${player.position} | ${player.lastPosition}`,
            })

        return embed
    }
}
