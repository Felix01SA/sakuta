import { injectable } from "tsyringe";

import { PlayerEvent } from "../../../lib/decorators/lavalinkEvents";
import { PlayerArgs } from "../../../lib/types/lavalink";

@injectable()
export class PlayerCreateEvent {

  @PlayerEvent('playerCreate')
  async create([player]: PlayerArgs<'playerCreate'>) {
    if (!player.connected) {
      await player.connect()
    }
  }
}
