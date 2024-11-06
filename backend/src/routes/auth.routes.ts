import Router, { Request, Response } from 'express'
import { login as loginController, register as registerController, users as usersController, message as messageController, getMessages as getMessagesController } from '../controllers/auth.controller'

const router = Router()

router.post('/login', loginController as any)

router.post('/register', registerController as any)

router.get('/logout', (req: Request, res: Response) => {
    res.send('Logout route')
})

router.get('/users', usersController as any)

router.post('/message', messageController as any)

router.get('/getMessages', getMessagesController as any)

export default router