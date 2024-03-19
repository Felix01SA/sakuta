import { Category } from '@discordx/utilities';
import { ChannelVerifications } from '@lib/guards/ChannelVerifications';
import { NodeDisconnected } from '@lib/guards/NodeDisconnected';
import { Client } from '@services';
import {
    ApplicationCommandOptionChoiceData,
    ApplicationCommandOptionType,
    AutocompleteInteraction,
    CommandInteraction,
} from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';

@Discord()
@Category('music')
@Guard(NodeDisconnected as any, ChannelVerifications as any)
export class NextCommand {
    @Slash({ description: 'Pula para proxima musica ou uma especifica.' })
    async proxima(
        @SlashOption({
            name: 'musica',
            description: 'Vou tocar qual musica?',
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
        })
        music: string | undefined,
        interaction:
            | CommandInteraction<'cached'>
            | AutocompleteInteraction<'cached'>,
        client: Client
    ) {
        const { guildId } = interaction;

        const player = client.music.getPlayer(guildId);

        if (interaction.isAutocomplete()) {
            const response: ApplicationCommandOptionChoiceData<
                string | number
            >[] = [];
            const focus = interaction.options.getFocused(true);

            if (focus.name === 'musica') {
                if (player.queue.tracks.length === 0) {
                    interaction.respond([
                        { name: 'Sem musicas a frente.', value: 'empty' },
                    ]);
                } else {
                    for (let i = 0; i < 10; i++) {
                        if (i > player.queue.tracks.length) continue;
                        const track = player.queue.tracks[i];

                        response.push({
                            name: track.info.title,
                            value: i.toString(),
                        });
                    }
                    interaction.respond(response);
                }
            }
        }

        if (interaction.isCommand()) {
            if (player.queue.tracks.length === 0)
                return interaction.reply({
                    ephemeral: true,
                    content: `Sem musicas a frente.`,
                });

            if (music) await player.skip(parseInt(music) + 1, true);
            else await player.skip();

            interaction.reply({
                ephemeral: true,
                content: `Pulei para: ${player.queue.current?.info.title} de ${player.queue.current?.info.author}`,
            });
        }
    }
}
