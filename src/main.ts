import 'reflect-metadata';

import { dirname, importx } from '@discordx/importer';
import { DIService, tsyringeDependencyRegistryEngine } from 'discordx';
import { container } from 'tsyringe';

import { Client } from '@services';

async function run() {
    DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);

    const client = new Client();

    container.registerInstance(Client, client);

    await importx(`${dirname(import.meta.url)}/{commands,events}/**/*.{ts,js}`);

    await client.start();
}

void run();
