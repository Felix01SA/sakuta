import chalk from "chalk";
import { inject, injectable } from "tsyringe";
import { ArgsOf, Client, Discord, MetadataStorage, Once } from "discordx";

import { env } from "../../lib/environment";
import { Logger } from "../../services/logger";
import { Lavalink } from "../../services/lavalink";

@Discord()
@injectable()
export class ReadyEvent {
  constructor(
    @inject(Logger) private readonly logger: Logger,
    @inject(Lavalink) private readonly lavalink: Lavalink,
  ) {}
  @Once({ event: "ready" })
  async ready([readyClient]: ArgsOf<"ready">, client: Client) {
    if (env.DEV_GUILD) {
      await client.clearApplicationCommands(env.DEV_GUILD)
    }
    await client.initApplicationCommands();
    this.startupLog()

    await this.lavalink.init({ ...readyClient.user });
    this.logger.success("Bot running!");
  }

  private startupLog() {
    // Events
    const events = MetadataStorage.instance.events.length
    const usedEvents = MetadataStorage.instance.usedEvents.length

    this.logger.log(`╔══ ${chalk.yellow("Events")} - ${chalk.bold(events)} loaded`);
    this.logger.log(`║ ${chalk.dim(`${usedEvents} used events`)}`);

    // Commands
    const slashCommands = MetadataStorage.instance.applicationCommandSlashes.length
    const simpleCommands = MetadataStorage.instance.simpleCommands.length
    const totalCommands = slashCommands + simpleCommands
    this.logger.log(`╠══ ${chalk.blue(`Commands`)} - ${chalk.bold(totalCommands)} loaded`);
    this.logger.log(`║ ${chalk.dim(`${slashCommands} slash commands`)}`);
    this.logger.log(`║ ${chalk.dim(`${simpleCommands} simple commands`)}`);

    // Interactions
    const buttons = MetadataStorage.instance.buttonComponents.length
    const modals = MetadataStorage.instance.modalComponents.length
    const selectMenus = MetadataStorage.instance.selectMenuComponents.length
    const totalComponents = buttons + modals + selectMenus
    this.logger.log(`╠══ ${chalk.green("Components")} - ${chalk.bold(totalComponents)} loaded`);
    this.logger.log(`║ ${chalk.dim(`${buttons} buttons`)}`);
    this.logger.log(`║ ${chalk.dim(`${modals} modals`)}`);
    this.logger.log(`║ ${chalk.dim(`${selectMenus} select menus`)}\n\n`);
  }
}
