import { Knex } from 'knex'

declare module 'knex/types/tables' {
	interface Tables {
		users: {
			id: string
			session_id: string	
			username: string
			password: string
		}

		meals: {
			id: string
			user_id: string
			name: string
			description: string
			date: string
			hour: string
			isInDiet: 'yes' | 'no'
		}
	}
}