import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization

    dotenv.config()

    if(!authHeader) {
        return res.status(401).json({error: "Cabeçalho de Autorização faltando"})
    }

    const token = authHeader.split(' ')[1]


    try {
        jwt.verify(token, process.env.JWT_SECRET as string)

        next()

    } catch(error) {
        return res.status(403).json({error: 'Token inválido ou expirado'})
    }   

}