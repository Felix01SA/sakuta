import { z } from 'zod';

const schema = z.object({
    BOT_TOKEN: z.string({
        required_error: 'Sem o token o bot não roda filho...',
    }),
});

export const env = schema.parse(process.env);

type IEnv = z.infer<typeof schema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IEnv {}
    }
}

export {};
