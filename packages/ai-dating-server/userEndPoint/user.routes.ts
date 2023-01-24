import { Request, Response, Router } from 'express'
import { MessageResponse } from '../interfaces/index.interfaces'
import {
	createNewUserController,
	logoutController,
	refreshJwtTokenController,
	signInUserController,
} from './user.controller'

const userRouter = Router()

userRouter.get('/', (req: Request, res: Response<MessageResponse>) => {
	res.json({
		message: 'Welcome To User Authentication  🌍😁🚀',
	})
})

userRouter.post('/signup', createNewUserController)
userRouter.post('/login', signInUserController)
userRouter.post('/refresh', refreshJwtTokenController)
userRouter.post('/logout', logoutController)

export default userRouter
