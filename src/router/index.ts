
import express from 'express';

import reports from './reports';
import auth from './auth';

const router = express.Router();

export default (): express.Router => {
    auth(router);
    reports(router);
    return router;
};