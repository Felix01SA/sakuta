import 'dotenv/config'
import { z } from 'zod'

const lavalinkSchema = z.object({
    host: z.string(),
    port: z.number(),
    password: z.string(),
    secure: z.boolean(),
    id: z.string().optional()
})

const envSchema = z.object({
    BOT_TOKEN: z.string(),
    BOT_CLIENT_ID: z.string(),
    BOT_CLIENT_SECRET: z.string(),
    //Lavalink
    LAVALINK: z.string().transform(val => z.array(lavalinkSchema).parse(JSON.parse(val)))
})


export const env = envSchema.parse(process.env)



type IEnv = z.infer<typeof envSchema>

declare global {
    namespace NodeJS {
        interface ProcessEnv extends IEnv { }
    }
}

export { }
