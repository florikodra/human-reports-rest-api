import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../model/user';
import jwt from 'jsonwebtoken';
import { BlackListModel } from '../model/blacklist';
import { SECRET_ACCESS_TOKEN } from "../config";

interface AuthenticatedRequest extends Request {
    user?: {
      id: string;
    };
  }

export async function Verify (req: AuthenticatedRequest, res: Response, next: NextFunction)  {
    const authHeader = req.headers['cookie'];

    console.log

    if (!authHeader) return res.sendStatus(401);
    const cookie = authHeader.split('=')[1];

    const checkIfBlacklisted = await BlackListModel.findOne({ token: cookie });

    if (checkIfBlacklisted)
        return res
            .status(401)
            .json({ message: 'This session has expired. Please re-login' });

    jwt.verify(cookie, SECRET_ACCESS_TOKEN, async (err: any, decoded: any) => {
        if (err) {
            return res.sendStatus(403);
        }

        const { id } = decoded;
        const user: any = await UserModel.findById(id);
        const { password, ...data } = user._doc;
        req.user = { id: decoded.id };

        next();
    });
}
