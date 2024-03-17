import { CommandInteraction } from 'discord.js';
import { IGuard } from 'discordx';

export const NodeDisconnected: IGuard<CommandInteraction> = async (
    interaction,
    client,
    next,
    data
) => {
    const music = client.music;
    if (!music.initiated) {
        music.init({ ...client.user! });

        return interaction.reply({
            content: 'Sistema de musica não inicializado.',
            ephemeral: true,
        });
    }
    const node = Array.from(music.nodeManager.nodes.values())[0];
    if (!node.connected) {
        node.connect();

        return interaction.reply({
            content: 'Não conectado ao provedor de musicas.',
            ephemeral: true,
        });
    }

    await next();
};
