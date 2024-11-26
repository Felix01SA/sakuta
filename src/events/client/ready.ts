import { inject, injectable } from "tsyringe";
import { ArgsOf, Client, Discord, Once } from "discordx";

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
    await this.lavalink.init({ ...readyClient.user });
    this.logger.success("Bot running!");
  }
}
