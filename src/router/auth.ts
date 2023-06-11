import express from 'express';

import { login, register, logout } from "../controller/AuthController";
import { Verify } from '../middleware/verify';

export default (router: express.Router) => {
    router.post('/auth/login', login);
    router.post('/auth/register', register);
    router.get('/auth/logout', Verify, logout);
};