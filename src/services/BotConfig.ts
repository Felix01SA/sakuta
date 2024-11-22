import { singleton } from "tsyringe";

import { JSONStore } from "../lib/classes/JSONStore";

interface BotConfigProps {
  maintanceMode: boolean;
}

@singleton()
export class BotConfig extends JSONStore<BotConfigProps> {
  constructor() {
    super("botConfig");
  }

  get maintanceMode(): boolean {
    return this.get("maintanceMode") ?? false;
  }

  public async setMaintanceMode(value: boolean) {
    await this.set("maintanceMode", value);
  }
}
