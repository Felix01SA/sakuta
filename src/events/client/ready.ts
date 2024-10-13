import { Discord, Once } from "discordx";

@Discord()
export class ReadyEvent {
  @Once({ event: "ready" })
  async ready() {
    console.log("Bot running!");
  }
}
