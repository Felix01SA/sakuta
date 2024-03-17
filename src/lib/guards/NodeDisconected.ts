import { Client } from '@services';
import { CommandInteraction } from 'discord.js';
import { GuardFunction } from 'discordx';
import { container } from 'tsyringe';

export const NodeDisconnected: GuardFunction<CommandInteraction> = async (
    args,
    client,
    next,
    data
) => {
    const exClient = container.resolve(Client);

    const node = Array.from(exClient.music.nodeManager.nodes.values());

    if (node[0].connected) await next();

    args.reply({
        content:
            'Ocorreu um error ao conectar-se ao provedor de música...\nTente novamente.',
        ephemeral: true,
    });

    node[0].connect();
};
