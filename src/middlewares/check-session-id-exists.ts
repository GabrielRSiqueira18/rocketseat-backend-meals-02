import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSessionIdExists(req :FastifyRequest, reply: FastifyReply) {
	const sessionId = req.cookies.sessionId

	if (!sessionId) {
		return reply.status(400).send({ message: 'Unathorized.' })
	}
}