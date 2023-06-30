import { it, describe, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import { execSync } from 'child_process'
import { app } from '../src/app'

describe('Meals routes', () => {
	beforeAll( async () => {
		await app.ready()
	})

	afterAll( async () => {
		await app.close()
	})

	beforeEach(() => {
		execSync('npm run knex -- migrate:rollback --all')
		execSync('npm run knex -- migrate:latest')
	})

	it('should be to create a new meal', async () => {
		await supertest(app.server)
			.post('/users/register')
			.send({
				username: 'teste',
				password: '123456',
			})

		
		const userLoginResponse = await supertest(app.server)
			.post('/users/login')
			.send({
				username: 'teste',
				password: '123456',
			})

		const cookie = userLoginResponse.get('Set-Cookie')

		await supertest(app.server)
			.post('/meals')
			.set('Cookie', cookie)
			.send({
				name: "Teste user 1",
				description: "teste",
				date: "12/05/2018",
				hour: "10:00",
				isInDiet: "yes"
			}).expect(201)
	})
})