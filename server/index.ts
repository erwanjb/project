import express from 'express';
import router from './routes/index';
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();
const app = express();
const { PORT, NODE_ENV } = process.env;

if (NODE_ENV === 'development') {
    app.use(cors({
        origin: 'http://localhost:8080'
    }))
}

app.use(router);
app.use('/', express.static(__dirname + '/dist-react/'));

app.use('/vue', express.static(__dirname + '/dist-vue/'));

app.listen(PORT);