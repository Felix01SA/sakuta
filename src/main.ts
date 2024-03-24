import 'reflect-metadata'

import { dirname, importx } from '@discordx/importer'
import { DIService, tsyringeDependencyRegistryEngine } from 'discordx'
import { container } from 'tsyringe'

import { Client, Logger } from '@services'
import { Music } from './services/Music'

async function run() {
    DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)

    const logger = container.resolve(Logger)

    const client = new Client()
    const music = new Music(client, logger)

    container.registerInstance(Client, client)
    container.registerInstance(Music, music)

    await importx(`${dirname(import.meta.url)}/{commands,events}/**/*.{ts,js}`)

    await client.start()
}

void run()
