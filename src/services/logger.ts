import signale from "signale";
import { ILogger } from "discordx";
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


export class ClientLogger implements ILogger {
  constructor(private readonly logger: Logger) {
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  info(...args: unknown[]): void {
    this.logger.info(...args);
  }

  log(...args: unknown[]): void {
    this.logger.debug(...args);
  }

  warn(...args: unknown[]): void {
    this.logger.warn(...args);
  }
}
