import 'reflect-metadata'
import { dirname, importx } from '@discordx/importer'
import { Client, Logger, Music, Server } from '@services'
import { DIService, tsyringeDependencyRegistryEngine } from 'discordx'
import { container } from 'tsyringe'

async function run() {
    DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)

    const logger = container.resolve(Logger)
    const server = container.resolve(Server)

    const client = new Client(logger)
    const music = new Music(client, logger)

    container.registerInstance(Client, client)
    container.registerInstance(Music, music)

    await importx(`${dirname(import.meta.url)}/{commands,events}/**/*.{ts,js}`)

    await client.start()
    await server.start()
}

void run()
