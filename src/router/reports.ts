import express from 'express';

import { list, show, create, edit, destroy } from "../controller/ReportController";
import { Verify } from '../middleware/verify';

export default (router: express.Router) => {
    router.get('/reports/list',  list);
    router.get('/reports/:id', show);
    router.post('/reports/create',  Verify, create);
    router.put('/reports/:id', Verify, edit);
    router.delete('/reports/:id', Verify, destroy);
};