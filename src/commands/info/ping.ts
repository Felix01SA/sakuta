import { Category } from '@discordx/utilities';
import { Client, Discord, Slash } from 'discordx';
import { CommandInteraction, EmbedBuilder, bold } from 'discord.js';

@Discord()
@Category('info')
export class Ping {
    @Slash({ description: 'Retorna a latência do BOT.' })
    async ping(interaction: CommandInteraction<'cached'>, client: Client) {
        const ping = client.ws.ping;

        const embed = new EmbedBuilder()
            .setColor('DarkGreen')
            .setTitle('Pong! 🏓 ')
            .setDescription(
                `A latência do servidor é: ${bold(String(ping + 'ms'))}`
            );

        interaction.reply({ ephemeral: true, embeds: [embed] });
    }
}
