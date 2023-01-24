import { PrismaClient } from '@prisma/client'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import morgan from 'morgan'
import AuthenticationMiddleware from './middleware/authorization.middleware'

import middlewareHandler from './middleware/errorHandler.middleware'
import userRouter from './userEndPoint/user.routes'

const prisma = new PrismaClient()
const app = express()

app.use(cors({ allowedHeaders: ['Content-Type', 'Authorization'] }))
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

// String(process.env.COOKIE_PARSER_SECRET)
const port = process.env.PORT
const host = process.env.HOST

app.get(
	'/',
	AuthenticationMiddleware,
	(request: Request, response: Response) => {
		response.send('ai-Dating-server')
	}
)

app.use('/api/v1/auth', userRouter)

app.use(middlewareHandler.notFoundHandler)
app.use(middlewareHandler.errorHandler)

app.listen(port, async (): Promise<void> => {
	// eslint-disable-next-line no-console
	console.log(`server up 🚀 Example app listening on port ${host}:${port}`)
	await prisma.$disconnect()
})
