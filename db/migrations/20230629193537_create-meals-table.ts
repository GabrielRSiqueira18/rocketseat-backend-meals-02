import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('meals', (table) => {
		table.uuid('id').primary()
		table.uuid('user_id').index()
		table.string('name').notNullable()
		table.string('description').notNullable()
		table.date('date').notNullable()
		table.time('hour').notNullable()
		table.enu('isInDiet', ['yes', 'no'])
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('meals')
}

