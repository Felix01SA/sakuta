import { dirname, importx } from '@discordx/importer';
import { env } from '@lib/env';
import { IntentsBitField } from 'discord.js';
import { Client } from 'discordx';

export const bot = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
    ],

    silent: true,

    simpleCommand: {
        prefix: '!',
    },
});

async function run() {
    await importx(`${dirname(import.meta.url)}/**/*.{ts,js}`);

    await bot.login(env.BOT_TOKEN).then(() => console.log('Bot ON'));
}

void run();
