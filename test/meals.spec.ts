import { it, describe, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import supertest from 'supertest'
import { execSync } from 'child_process'
import { app } from '../src/app'
import { randomUUID } from 'crypto'

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

	it('should be to not create a meal with same name', async () => {
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
			})

		await supertest(app.server)
			.post('/meals')
			.set('Cookie', cookie)
			.send({
				name: "Teste user 1",
				description: "teste",
				date: "12/05/2018",
				hour: "10:00",
				isInDiet: "yes"
			}).expect(400)
	})

	it('should be to edit a meal with id', async () => {
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
			})

		await supertest(app.server)
			.post('/meals')
			.set('Cookie', cookie)
			.send({
				name: "Teste user 2",
				description: "teste",
				date: "12/05/2018",
				hour: "10:00",
				isInDiet: "no"
			})

		const mealGetAll = await supertest(app.server)
			.get(`/meals/all`)
		
		const mealId = mealGetAll.body.meals[1].id

		await supertest(app.server)
			.put(`/meals/${mealId}`)
			.set('Cookie', cookie)
			.send({
				name: "Teste user 3",
				description: "teste",
				date: "12/05/2018",
				hour: "10:00",
				isInDiet: "no"
			}).expect(200)
	})

	it('should be to delete a meal with id', async () => {
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
			})

		await supertest(app.server)
			.post('/meals')
			.set('Cookie', cookie)
			.send({
				name: "Teste user 2",
				description: "teste",
				date: "12/05/2018",
				hour: "10:00",
				isInDiet: "no"
			})

		const mealGetAll = await supertest(app.server)
			.get(`/meals/all`)
		
		const mealId = mealGetAll.body.meals[1].id

		await supertest(app.server)
			.delete(`/meals/${mealId}`)
			.set('Cookie', cookie)
			.send({
				name: "Teste user 3",
				description: "teste",
				date: "12/05/2018",
				hour: "10:00",
				isInDiet: "no"
			}).expect(204)
	})
})