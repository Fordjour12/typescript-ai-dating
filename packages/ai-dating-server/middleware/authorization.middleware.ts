import { NextFunction, Request, Response } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { MessageResponse } from '../interfaces/index.interfaces'
/**
 *  TODO: req auth header
 *  TODO: startswith (Bearer )
 *  TODO: split( )[1] =split first
 *  TODO: verify()=>er(),decode
 *  TODO: verify()=>er()=> 403
 *  TODO: verify()=>decode()=>
 *
 * */

const AuthenticationMiddleware = (
	request: Request,
	response: Response<MessageResponse>,
	next: NextFunction
	// eslint-disable-next-line consistent-return
) => {
	try {
		const authenticationHeaders = request.headers.authorization

		if (!authenticationHeaders?.startsWith('Bearer ')) {
			return response.sendStatus(403).json({
				message: 'Forbidden',
			})
		}

		const authToken = authenticationHeaders.split(' ')[1]

		if (!authToken) {
			return response.sendStatus(401).json({
				message: 'UnAuthorized',
			})
		}

		jwt.verify(authToken, String(process.env.ACCESS_JWT_TOKEN_SECRET))
		next()
	} catch (error) {
		next(error)
	}
}

export default AuthenticationMiddleware
