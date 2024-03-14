import { Client, Logger } from '@services';
import { container } from 'tsyringe';

export abstract class BaseClass {
    public logger: Logger;
    public client: Client;

    constructor() {
        this.logger = container.resolve(Logger);
        this.client = container.resolve(Client);
    }
}
