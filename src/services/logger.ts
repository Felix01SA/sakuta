import signale from "signale";
import { singleton } from "tsyringe";

@singleton()
export class Logger extends signale.Signale {
  constructor() {
    super({
      config: {
        displayDate: true,
        displayTimestamp: true,
        uppercaseLabel: true,
      },
    });
  }
}
