import express from 'express';
import bodyParser from 'body-parser';
import ApiRouter from './routers/ApiRouter.js';

const PORT = 3000;
const app = express();

app.use('/static', express.static('src/public'));
app.use(bodyParser.json());
app.use('/api', ApiRouter);

app.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);
});