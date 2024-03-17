import type { Client } from '@services';
import { Next } from 'discordx';

declare module 'discordx' {
    export type IGuard<T = any, D = any> = (
        args: T,
        client: Client,
        next: Next,
        data: D
    ) => any;
}
