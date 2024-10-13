import { ArgsOf, Client, Discord, On } from "discordx";
import { inject, injectable } from "tsyringe";

import { Logger } from "../../services/logger";

@Discord()
@injectable()
export class InteractionCreateEvent {
  constructor(@inject(Logger) private readonly logger: Logger) {}

  @On()
  async interactionCreate(
    [interaction]: ArgsOf<"interactionCreate">,
    client: Client,
  ) {
    await client.executeInteraction(interaction);
  }
}
