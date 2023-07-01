import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { randomUUID } from 'crypto'

export async function mealsRoutes(app :FastifyInstance) {
	app.post('/', {
		preHandler: [ checkSessionIdExists ]
	},async (req, reply) => {
		const createMealSchema = z.object({
			name: z.string(),
			description: z.string(),
			date: z.string().regex(/^[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]$/),
			hour: z.string().regex(/^[0-9][0-9]:[0-9][0-9]$/),
			isInDiet: z.enum(['yes', 'no']),
		})

		const { name, description, date, hour, isInDiet } = createMealSchema.parse(req.body)

		const  existMealName = await knex('meals').where({ name }).first()

		if (existMealName) {
			return reply.status(400).send({ message: 'Meal with same name arleady exists.' })
		}

		const session_id = req.cookies.sessionId

		const user = await knex('users').where({ session_id }).first()

		if (!user) {
			return reply.status(400).send({ message: "User dont't exist." })
		}

		await knex('meals').insert({
			id: randomUUID(),
			user_id: user.id,
			name,
			description,
			date, 
			hour, 
			isInDiet,
		})

		return reply.status(201).send()
	})

	app.get('/', {
		preHandler: [ checkSessionIdExists ]
	},async (req, reply) => {
		const session_id = req.cookies.sessionId

		const user = await knex('users').where({ session_id }).first()
		
		if (!user) {
			return reply.status(400).send({ message: "User dont't exist." })
		}

		const meals = await knex('meals').where({
			user_id: user.id
		})

		return { meals }
	})

	app.put('/:id', {
		preHandler: [ checkSessionIdExists ]
	},async (req, reply) => {
		const createMealSchema = z.object({
			name: z.string(),
			description: z.string(),
			date: z.string().regex(/^[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]$/),
			hour: z.string().regex(/^[0-9][0-9]:[0-9][0-9]$/),
			isInDiet: z.enum(['yes', 'no']),
		})

		const paramsSchema = z.object({
			id: z.string(),
		})

		const { id } = paramsSchema.parse(req.params)

		const { name, description, date, hour, isInDiet } = createMealSchema.parse(req.body)

		const session_id = req.cookies.sessionId

		const user = await knex('users').where({ session_id }).first()

		if (!user) {
			return reply.status(400).send({ message: "User dont't exist." })
		}

		await knex('meals').where({
			id,
			user_id: user.id,
		})
		.update({
			name,
			description,
			date,
			hour,
			isInDiet,
		})

		return reply.status(200).send()
	})

	app.delete('/:id', async (req, reply) => {
		const paramsSchema = z.object({
			id: z.string(),
		})

		const { id } = paramsSchema.parse(req.params)

		const session_id = req.cookies.sessionId

		const user = await knex('users').where({ session_id }).first()

		if (!user) {
			return reply.status(400).send({ message: "User dont't exist." })
		}

		await knex('meals').where({
			id,
			user_id: user.id,
		})
		.delete('*')

		return reply.status(204).send()
	})


	//Debug routes
	app.get('/all', async () => {
		const meals = await knex('meals').select('*')

		return { meals }
	})

	app.delete('/delete', async (_, reply) => {
		const meals = await knex('meals').delete('*')

		return reply.status(204).send()
	})
}