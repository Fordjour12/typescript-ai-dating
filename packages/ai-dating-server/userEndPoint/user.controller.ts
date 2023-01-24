import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { NextFunction, Request, Response } from 'express'
import { MessageResponse } from '../interfaces/index.interfaces'

const prisma = new PrismaClient()

/**
 *
 * TODO: Ratelimiter form login
 * */

const createNewUserController = async (
	request: Request,
	response: Response<MessageResponse>,
	next: NextFunction
) => {
	try {
		const { email, password } = request.body

		/**
		 * TODO: Validation of the request body
		 * TODO: Regex expression for password to get check
		 */

		const existingUser = await prisma.user.findFirst({
			where: {
				email,
			},
		})

		if (existingUser) {
			response.status(409).json({
				message: 'User Exist Please Login Instead',
			})
		} else {
			const bcryptGenSalt = Number(process.env.BCRYPTSALT)
			const hashedPassword = await bcrypt.hash(password, bcryptGenSalt)

			const createNewUserInfoData = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
				},
			})

			response.status(201).json({
				message: 'Successful 👌🌍 ',
				data: createNewUserInfoData,
			})
		}
	} catch (error) {
		next(error)
	}
}

const signInUserController = async (
	request: Request,
	response: Response,
	next: NextFunction
	// eslint-disable-next-line consistent-return
) => {
	try {
		const { email, password } = request.body

		const existingUserInfoData = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!existingUserInfoData) {
			response.status(404).json({
				message: 'Sorry User Information Not Found 🧐🥹',
			})
		}

		const passwordMatch = await bcrypt.compare(
			password,
			String(existingUserInfoData?.password)
		)

		const csrfGenerator = crypto.randomUUID()
		const csrfTokenVerification = csrfGenerator

		if (!passwordMatch) {
			response.status(401).json({
				message: 'UnAuthorized User',
			})
		} else {
			const accessToken = jwt.sign(
				{
					userInfo: {
						name: existingUserInfoData?.name,
						isVerified: existingUserInfoData?.isEmailVerified,
						role: existingUserInfoData?.role,
					},
				},
				String(process.env.ACCESS_JWT_TOKEN_SECRET),
				{
					expiresIn: '1d',
					issuer: 'api.dating-tcs.com',
				}
			)

			const refreshToken = jwt.sign(
				{
					email: existingUserInfoData?.email,
					role: existingUserInfoData?.role,
				},
				String(process.env.REFRESH_JWT_TOKEN_SECRET),
				{
					expiresIn: '10d',
					issuer: 'api.dating-tcs.com',
				}
			)

			/**
			 * 7- days,24-hours,60-mins,60-sec,1000-ms
			 *  maxAge
			 */
			const cookieAge = 10 * 24 * 60 * 60 * 1000

			response.cookie('jwt', refreshToken, {
				// httpOnly: true,
				secure: true,
				maxAge: cookieAge,
				sameSite: 'none',
			})

			return response.status(200).json({
				message: 'Successful',
				data: {
					name: existingUserInfoData?.name,
					email: existingUserInfoData?.email,
					isVerified: existingUserInfoData?.isEmailVerified,
					role: existingUserInfoData?.role,
					csrfToken: csrfTokenVerification,
					accessToken,
					refreshToken,
				},
			})
		}
	} catch (error) {
		next(error)
	}
}

const refreshJwtTokenController = async (
	request: Request,
	response: Response<MessageResponse>,
	next: NextFunction
	// eslint-disable-next-line consistent-return
) => {
	/**
	 * TODO: check the request for cookie => !exits => 401
	 * TODO:  refreshToken assignment to a cookie
	 * TODO:  err => 403
	 * TODO: decode user by finding the user => !user => 401
	 * TODO: set Access token again
	 *
	 * */

	try {
		const { cookies } = request

		if (!cookies?.jwt)
			return response.status(401).json({ message: 'UnAuthorized' })

		const refreshToken = cookies.jwt

		jwt.verify(
			refreshToken,
			String(process.env.REFRESH_JWT_TOKEN_SECRET),
			// eslint-disable-next-line consistent-return, @typescript-eslint/no-explicit-any
			async (error: unknown, decoded: any) => {
				if (error)
					return response.status(403).json({ message: 'Forbidden' })

				const userDecodedData = await prisma.user.findUnique({
					where: {
						email: decoded.email,
					},
				})

				if (!userDecodedData)
					return response.status(401).json({
						message: 'UnAuthorized',
					})

				const accessToken = jwt.sign(
					{
						userInfo: {
							name: userDecodedData.name,
							isVerified: userDecodedData.isEmailVerified,
							role: userDecodedData.role,
						},
					},
					String(process.env.ACCESS_JWT_TOKEN_SECRET),
					{
						expiresIn: '50s',
						issuer: 'api.dating-tcs.com',
					}
				)
				response.status(200).json({
					message: 'Successfully',
					data: {
						accessToken,
					},
				})
			}
		)
	} catch (error) {
		next(error)
	}
}

const logoutController = async (
	request: Request,
	response: Response<MessageResponse>,
	next: NextFunction
	// eslint-disable-next-line consistent-return
) => {
	/**
	 * req(cookies)=> return jwt => !jwt =>204
	 * res.clear
	 * */

	try {
		const { cookies } = request

		if (!cookies?.jwt) return response.sendStatus(204)

		const cookieAge = 10 * 24 * 60 * 60 * 1000

		response.clearCookie('jwt', {
			httpOnly: true,
			secure: true,
			maxAge: cookieAge,
			sameSite: 'lax',
		})

		response.json({
			message: 'cookies cleared',
		})
	} catch (error) {
		next(error)
	}
}

export {
	createNewUserController,
	signInUserController,
	refreshJwtTokenController,
	logoutController,
}
