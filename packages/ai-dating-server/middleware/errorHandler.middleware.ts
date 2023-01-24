import { NextFunction, Request, Response } from 'express'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
function notFoundHandler(
	request: { originalUrl: any },
	response: { status: (arg0: number) => void },
	next: (arg0: Error) => void
) {
	const error = new Error(`Not found - ${request.originalUrl}`)
	response.status(404)
	next(error)
}

// eslint-disable-next-line no-unused-vars
function errorHandler(
	error: any,
	request: Request,
	response: Response,
	next: NextFunction
) {
	const status = error.statusCode || 500
	const { message } = error
	const { data } = error
	response.status(status).json({
		status,
		message,
		data,
		stack:
			process.env.NODE_ENV === 'production' ? 'development' : error.stack,
		errors: error.errors || undefined,
	})
}

export default {
	notFoundHandler,
	errorHandler,
}
