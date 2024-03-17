import { Category } from '@discordx/utilities';
import { NodeDisconnected } from '@lib/guards/NodeDisconected';
import { type Client } from '@services';

import {
    ApplicationCommandOptionType,
    CommandInteraction,
    EmbedBuilder,
    bold,
    codeBlock,
    hyperlink,
} from 'discord.js';
import {
    Discord,
    Guard,
    GuardFunction,
    Slash,
    SlashChoice,
    SlashOption,
} from 'discordx';
import { SearchPlatform } from 'lavalink-client/dist/types';

@Discord()
@Category('music')
@Guard(NodeDisconnected as any as GuardFunction)
export class Play {
    @Slash({ description: 'Vamo curtir uma música?' })
    async play(
        @SlashOption({
            name: 'busca',
            description: 'Me diz o que quer ouvir',
            type: ApplicationCommandOptionType.String,
            required: true,
        })
        search: string,
        @SlashChoice({ name: 'YouTube', value: 'youtube' })
        @SlashChoice({ name: 'Spotify', value: 'spotify' })
        @SlashOption({
            name: 'provedor',
            description: 'De onde a musica vem?',
            type: ApplicationCommandOptionType.String,
        })
        engine: SearchPlatform,
        interaction: CommandInteraction,
        client: Client
    ) {
        if (!interaction.inCachedGuild()) return;
        await interaction.deferReply({ ephemeral: true });
        const { channelId, member, guildId, user } = interaction;

        const embed = new EmbedBuilder().setColor('Red').setTimestamp();

        if (!member.voice.channelId)
            return interaction.editReply({
                embeds: [
                    embed
                        .setTitle('Como você vai me ouvir?')
                        .setDescription(
                            `Você precisa entrar num canal de voz para usar esse comando.`
                        ),
                ],
            });

        const player = client.music.createPlayer({
            guildId: guildId,
            voiceChannelId: member.voice.channelId,
            textChannelId: channelId,
        });

        const { loadType, tracks, playlist, exception } = await player.search(
            { query: search, source: engine ?? 'ytm' },
            user.id
        );

        switch (loadType) {
            case 'track':
            case 'search':
                await player.queue.add(tracks[0]);
                interaction.editReply({
                    embeds: [
                        embed
                            .setTitle('Música adicionada!')
                            .setDescription(
                                hyperlink(
                                    tracks[0].info.title,
                                    tracks[0].info.uri!
                                )
                            )
                            .setThumbnail(tracks[0].info.artworkUrl!)
                            .setColor('DarkGreen'),
                    ],
                });
                break;

            case 'playlist':
                await player.queue.add(tracks);
                interaction.editReply({
                    embeds: [
                        embed
                            .setTitle('Playlist adicionada!')
                            .setDescription(bold(playlist!.name))
                            .setThumbnail(playlist?.thumbnail!)
                            .setColor('DarkGreen'),
                    ],
                });

                break;
            case 'error':
                // await player.destroy();

                interaction.editReply({
                    embeds: [
                        embed
                            .setTitle('Ocorreu um erro!')
                            .setDescription(
                                codeBlock(
                                    'json',
                                    JSON.stringify(exception, null, 2)
                                )
                            ),
                    ],
                });

                break;
            case 'empty':
                interaction.editReply({
                    embeds: [
                        embed.setTitle('Não encontrei nada!').setColor('Red'),
                    ],
                });
                break;

            default:
                break;
        }

        if (!player.playing && !player.paused) player.play();
    }
}
