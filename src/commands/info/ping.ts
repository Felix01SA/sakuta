import { BaseCommand } from '@lib/bases/BaseCommand';
import { Category } from '@discordx/utilities';
import { Discord, Slash } from 'discordx';
import { CommandInteraction, bold } from 'discord.js';

@Discord()
@Category('info')
export class Ping extends BaseCommand {
    @Slash({ description: 'Retorna a latência do BOT.' })
    async ping(interaction: CommandInteraction<'cached'>) {
        const ping = this.client.ws.ping;

        const embed = this.embed
            .setTitle('Pong! 🏓 ')
            .setDescription(
                `A latência do servidor é: ${bold(String(ping + 'ms'))}`
            );

        interaction.reply({ ephemeral: true, embeds: [embed] });
    }
}
