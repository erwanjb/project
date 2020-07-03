import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const router = express.Router()
const { JWT_KEY } = process.env;


router.get('/getToken', (_req, res) => {
    const token = jwt.sign({ 
        Home: {
            javascript: [false, false]
        } 
    }, JWT_KEY as string);
    res.send(token);
});

router.get('/getObjSteps', (req, res) => {
    const token = req.query.token;
    try {
        const decoded = jwt.verify(token, JWT_KEY as string);
        res.send(decoded);
    } catch (err) {
        res.send(err.message);
    }
})

router.get('/changeToken', (req, res) => {
    const token = req.query.token;
    try {
        const decoded = jwt.verify(token, JWT_KEY as string);
        const step = req.query.step;
        eval('decoded.' + step + ' = true');
        const newToken = jwt.sign(decoded, JWT_KEY as string);
       res.send(newToken);
    } catch (err) {
        res.send(err.message);
    }
})

export default router