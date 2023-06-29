import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
	app.post('/register', async (req, reply) => {
		const createUserSchema = z.object({
			username: z.string().min(3, { message: 'Username must be have a min 3 characters.' }).max(50, { message: 'Username must be have a max 50 characters.' }),
			password: z.string().min(4, { message: 'Password must be have a min 4 characters.' }).max(255, { message: 'Password must be have a max 255 characters.' }),
		})

		const { username, password } = createUserSchema.parse(req.body)

		const existUserWithSameUsername = await knex('users').where({ username }).first()

		if (existUserWithSameUsername) {
			return reply.status(400).send({ message: 'Username arleady exists.' })
		}

		await knex('users').insert({
			id: randomUUID(),
			session_id: randomUUID(),
			username,
			password,
		})
    
		return reply.status(201).send()
	})

	app.post('/login', async (req, reply) => {
		const createUserSchema = z.object({
			username: z.string().min(3, { message: 'Username must be have a min 3 characters.' }).max(50, { message: 'Username must be have a max 50 characters.' }),
			password: z.string().min(4, { message: 'Password must be have a min 4 characters.' }).max(255, { message: 'Password must be have a max 255 characters.' }),
		})

		const { username, password } = createUserSchema.parse(req.body)

		const user = await knex('users').where({
			username,
			password,
		})
		.first()

		if (!user) {
			return reply.status(404).send({ message: 'Username or password are incorrects..' })
		}

		reply.cookie('sessionId', user.session_id, {
			path: '/',
			maxAge: 1000 * 60 * 60 * 24 * 7 //7 Dias
		})

		return reply.status(200).send({ user })
	})

	app.get('/clear-cookie', async (_, reply) => {
		reply.clearCookie('sessionId')

		return reply.status(200).send()
	})

	//Degut routes
	app.get('/all', async () => {
		const users = await knex('users').select('*')

		return { users }
	})

	app.delete('/delete', async (_, reply) => {
		await knex('users').delete('*')

		return reply.status(204).send()
	})
}
