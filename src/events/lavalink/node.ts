import chalk from "chalk";
import { inject, injectable } from "tsyringe";

import { Logger } from "../../services/logger";
import { NodeArgs } from "../../lib/types/lavalink";
import { NodeEvent } from "../../lib/decorators/lavalinkEvents";

@injectable()
export class NodeEvents {
  constructor(@inject(Logger) private readonly logger: Logger) {}

  @NodeEvent("connect")
  async connect() {
    this.logger.info("Lavalink connected.");
  }

  @NodeEvent("create")
  async create([node]: NodeArgs<"create">) {
    this.logger.info(`New Lavalink added. ${chalk.whiteBright(node.id)}`);
  }

  @NodeEvent("disconnect")
  async disconect() {
    this.logger.warn("Lavalink disconected.");
  }

  @NodeEvent("error")
  async error([node, error]: NodeArgs<"error">) {
    this.logger.error(`An error occured in Lavalink ${chalk.blue(node.id)}`);
    this.logger.error(JSON.stringify(error, null, 2));
  }

  @NodeEvent("reconnecting")
  async reconnecting() {
    this.logger.pending("Trying to reconnect to Lavalink.");
  }

  @NodeEvent("reconnectinprogress")
  async reconnectingInProgress() {
    this.logger.await("Reconnecting to Lavalink.");
  }
}
