import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import {startSyncScheduler} from './services/syncScheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Shopify Ingestion Service API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Start the sync scheduler
    startSyncScheduler();
});
