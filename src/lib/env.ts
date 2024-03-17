import { z } from 'zod';

const schema = z.object({
    BOT_TOKEN: z.string({
        required_error: 'Sem o token o bot não roda filho...',
    }),
    BOT_CLIENT_ID: z.string(),
    //Lavalink
    LAVALINK_HOST: z.string(),
    LAVALINK_PORT: z.string().transform((val) => parseInt(val)),
    LAVALINK_PASSWORD: z.string(),
    LAVALINK_SECURE: z.string().transform((val) => val === 'true'),
});

export const env = schema.parse(process.env);

type IEnv = z.infer<typeof schema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IEnv {}
    }
}

export {};
