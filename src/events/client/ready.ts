import { Discord, Once } from "discordx";
import { inject, injectable } from "tsyringe";

import { Logger } from "../../services/logger";

@Discord()
@injectable()
export class ReadyEvent {
  constructor(@inject(Logger) private readonly logger: Logger) {}
  @Once({ event: "ready" })
  async ready() {
    this.logger.success("Bot running!");
  }
}
