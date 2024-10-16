import { inject, injectable } from "tsyringe";

import { NodeEvent } from "../../lib/decorators/lavalinkEvents";
import { Logger } from "../../services/logger";

@injectable()
export class NodeEvents {
  constructor(@inject(Logger) private readonly logger: Logger) {}

  @NodeEvent("connect")
  async connect() {
    this.logger.info("Lavalink connected.");
  }
}
