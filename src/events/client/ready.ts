import { ArgsOf, Client, Discord, Once } from "discordx";
import { inject, injectable } from "tsyringe";

import { Lavalink } from "../../services/lavalink";
import { Logger } from "../../services/logger";

@Discord()
@injectable()
export class ReadyEvent {
  constructor(
    @inject(Logger) private readonly logger: Logger,
    @inject(Lavalink) private readonly lavalink: Lavalink,
  ) {}
  @Once({ event: "ready" })
  async ready([readyClient]: ArgsOf<"ready">, client: Client) {
    await client.initApplicationCommands();
    await this.lavalink.init({ ...readyClient.user });
    this.lavalink.loadEvents();
    this.logger.success("Bot running!");
  }
}
