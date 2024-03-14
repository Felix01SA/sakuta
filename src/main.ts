import 'reflect-metadata';
import { dirname, importx } from '@discordx/importer';
import { CustomItents as CustomIntents } from '@magicyan/discord';
import { Client, DIService, tsyringeDependencyRegistryEngine } from 'discordx';
import { container } from 'tsyringe';

import { env } from '@lib/env';
import { Logger } from './services/Logger';

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

export const bot = new Client({
    intents: CustomIntents.All,

    silent: true,

    simpleCommand: {
        prefix: '!',
    },
});

async function run() {
    const logger = container.resolve(Logger);
    await importx(`${dirname(import.meta.url)}/{commands,events}/**/*.{ts,js}`);

    await bot.login(env.BOT_TOKEN).then(() => logger.info('Bot ON'));
}

void run();
