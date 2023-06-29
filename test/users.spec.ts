import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import supertest from 'supertest'
import { execSync } from 'child_process'
import { app } from '../src/app'

describe('Users routes', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	beforeEach(() => {
		execSync('npm run knex -- migrate:rollback --all')
		execSync('npm run knex -- migrate:latest')
	})

	it('should be to create a new user', async () => {
		await supertest(app.server)
			.post('/users/register')
			.send({
				username: 'teste',
				password: '123456',
			}).expect(201)
	})

	it("should be to don't create a user when he has a same username with a user arleady create in the table", async () => {
		await supertest(app.server)
			.post('/users/register')
			.send({
				username: 'teste',
				password: '123456',
			})

		await supertest(app.server)
			.post('/users/register')
			.send({
				username: 'teste',
				password: '1234563543ege',
			}).expect(400)
	})

	it('should be to login user', async () => {
		const createUserResponse = await supertest(app.server)
			.post('/users/register')
			.send({
				username: 'teste',
				password: '123456',
			})

		const loginUserResponse = await supertest(app.server)
			.post('/users/login')
			.send({
				username: 'teste',
				password: '123456',
			})

		expect(loginUserResponse.body.user).toEqual(
			expect.objectContaining({
				username: 'teste',
				password: '123456',
			})
		)
	})
})