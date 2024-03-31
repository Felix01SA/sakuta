import {
    LavalinkManager,
    LavalinkNode,
    LavalinkNodeOptions,
    Player,
} from 'lavalink-client'
import { Client } from 'discordx'
import { Logger } from './Logger'
import { env } from '@lib/env'
import { findChannel, findMessage, brBuilder } from '@magicyan/discord'
import { ChannelType, EmbedBuilder, TextBasedChannel } from 'discord.js'
import { Store } from './Store'
import { filledBar } from 'string-progressbar'
import { container } from 'tsyringe'

const nodes: LavalinkNodeOptions[] = env.LAVALINK.map(
    ({ host, password, id, port, secure }) => ({
        host,
        authorization: password,
        port,
        id: id ?? 'Lavalink',
        secure,
    })
)
export class Music extends LavalinkManager {
    private store: Store

    constructor(private client: Client, private readonly logger: Logger) {
        super({
            nodes,
            sendToShard(guildId, payload) {
                const guild = client.guilds.cache.get(guildId)

                if (guild) guild.shard.send(payload)
            },
            client: { id: env.BOT_CLIENT_ID },
        })

        this.store = container.resolve(Store)

        client.on('raw', (d) => {
            this.sendRawData(d)
        })

        this.nodeManager
            .on('error', (node, error) =>
                logger.scope('LAVALINK').error(`${node.id} error: ${error}`)
            )
            .on('connect', (node) =>
                logger.scope('LAVALINK').success(`Conectado ao ${node.id}!`)
            )
            .on('disconnect', (node, reason) =>
                logger
                    .scope('LAVALINK')
                    .warn(`Desconectado do ${node.id}. Code: ${reason.code}`)
            )
            .on('reconnecting', (node) =>
                logger.scope('LAVALINK').warn(`Reconectando ao ${node.id}.`)
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

                this.store.update('musicMessagesId', (data) => {
                    return [
                        ...data,
                        {
                            guildId: player.guildId,
                            messageId: message.id,
                            oldMessageId: message.id,
                        },
                    ]
                })

                setTimeout(() => {
                    this.store.update('musicMessagesId', (data) => {
                        return [
                            ...data.filter(
                                (val) => val.guildId !== player.guildId
                            ),
                            {
                                guildId: player.guildId,
                                messageId: message.id,
                                oldMessageId: data.find(
                                    (val) => val.guildId === player.guildId
                                )?.messageId!,
                            },
                        ]
                    })
                }, 5000)
            })
            .on('trackStuck', (player, track, payload) => {
                logger.warn('Track stuck', payload.type)
            })
            .on('playerUpdate', (oldPlayer, player) => {
                const channel = findChannel(
                    client.guilds.cache.get(player.guildId)!,
                    ChannelType.GuildText
                ).byId(player.textChannelId!)

                const message = findMessage(channel!).byId(
                    this.store
                        .get('musicMessagesId')
                        .find((value) => value.guildId === player.guildId)
                        ?.messageId!
                )

                if (!message || !message.editable) return

                const embed = this.musicEmbed(player)

                message.edit({ embeds: [embed] })
            })
            .on('trackError', (player, track, payload) => {
                logger.warn('Track error:', payload.exception?.message)
            })
            .on('trackEnd', (player, track, payload) => {
                const channel = findChannel(
                    client.guilds.cache.get(player.guildId)!,
                    ChannelType.GuildText
                ).byId(player.textChannelId!)

                const message = findMessage(channel!).byId(
                    this.store
                        .get('musicMessagesId')
                        .find((value) => value.guildId === player.guildId)
                        ?.oldMessageId!
                )

                if (!message || !message.deletable) return

                message.delete()
            })
            .on('ChapterStarted', (player, track, payload) =>
                logger.debug(payload.chapter)
            )
            .on('SegmentsLoaded', (player, track, payload) =>
                logger.debug(payload.segments)
            )
            .on('queueEnd', (player) => {
                const channel = findChannel(
                    client.guilds.cache.get(player.guildId)!,
                    ChannelType.GuildText
                ).byId(player.textChannelId!)

                const message = findMessage(channel!).byId(
                    this.store
                        .get('musicMessagesId')
                        .find((value) => value.guildId === player.guildId)
                        ?.oldMessageId!
                )

                if (!message || !message.editable) return

                message.edit({ content: 'As músicas acabaram', embeds: [] })
            })
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
                value: `${formatTime(player.position)} | ${
                    filledBar(
                        currentTrack.info.duration,
                        player.position,
                        13
                    )[0]
                } | ${formatTime(currentTrack.info.duration)}`,
            })

        return embed
    }
}

function formatTime(ms: number) {
    let seconds = Math.floor((ms / 1000) % 60)
        .toString()
        .padStart(2, '0')
    let minutes = Math.floor((ms / 1000 / 60) % 60)
        .toString()
        .padStart(2, '0')
    let hors = Math.floor((ms / 1000 / 60 / 60) % 60)

    if (hors > 0) {
        return `${hors.toString().padStart(2, '0')}:${minutes}:${seconds}`
    }

    return `${minutes}:${seconds}`
}

function getVoiceChannel() {}
