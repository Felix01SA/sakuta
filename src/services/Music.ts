import { LavalinkManager } from 'lavalink-client';
import { Client } from './Client';
import { Logger } from './Logger';
import { env } from '@lib/env';

export class Music extends LavalinkManager {
    constructor(private client: Client, private readonly logger: Logger) {
        super({
            sendToShard(guildId, payload) {
                const guild = client.guilds.cache.get(guildId);

                if (guild) guild.shard.send(payload);
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
        });

        client.on('raw', (d) => this.sendRawData(d));

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
            );

        this.on('playerCreate', async (player) => {
            if (!player.connected) await player.connect();
        });
    }
}
