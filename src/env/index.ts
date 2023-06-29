import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
	PORT: z.number().default(2020),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('Invarioments variables incorrect!', _env.error.format())

	throw new Error('Invarioments variables incorrect!')
}

export const env = _env.data