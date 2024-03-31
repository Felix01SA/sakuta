import 'reflect-metadata'
import { importx } from '@discordx/importer'
import { Logger, Music, Server } from '@services'
import { Client, DIService, tsyringeDependencyRegistryEngine } from 'discordx'
import { container } from 'tsyringe'
import {
    CustomPartials,
    CustomItents as CustomIntents,
} from '@magicyan/discord'
import { env } from '@lib/env'

async function run() {
    DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container)

    const logger = container.resolve(Logger)
    const server = container.resolve(Server)

    const client = new Client({
        intents: CustomIntents.All,
        partials: CustomPartials.All,
        silent: true,
    })
    const music = new Music(client, logger)

    container.registerInstance(Client, client)
    container.registerInstance(Music, music)

    await importx(`${import.meta.dirname}/{commands,events}/**/*.{ts,js}`)

    logger.await('Iniciando serviços.')
    await client.login(env.BOT_TOKEN)
    await server.start()
}

void run()
