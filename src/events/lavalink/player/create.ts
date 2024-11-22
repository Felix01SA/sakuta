import { injectable } from "tsyringe";

import { PlayerArgs } from "../../../lib/types/lavalink";
import { PlayerEvent } from "../../../lib/decorators/lavalinkEvents";

@injectable()
export class PlayerCreateEvent {

  @PlayerEvent('playerCreate')
  async create([player]: PlayerArgs<'playerCreate'>) {
    if (!player.connected) {
      await player.connect()
    }
  }
}
