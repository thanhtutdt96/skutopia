import { config } from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import log from './utils/logger';
import indexRoutes from './routes';

config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(indexRoutes);

const port = process.env.API_PORT || 3000;

app.listen(port, () => {
  log.info(`Server is listening on port ${port}`);
});
