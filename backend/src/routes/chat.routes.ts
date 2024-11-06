import Router, { Request, Response } from 'express'

import { authenticateJWT } from '../middlewares/auth.middleware'

const router = Router()

/* @ts-expect-error: */
router.use(authenticateJWT)

/* @ts-expect-error: */
router.get('/messages', (req: Request, res: Response) => {
    return res.send("Oi")
})

export default router