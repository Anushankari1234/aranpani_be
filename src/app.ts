import express from 'express';
import paymentController from './controllers/payment.controller';
import projectDonationController from './controllers/projectDonation.controller';
import donorController from './controllers/donor.controller';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('API is running'));
app.use('/api/v1/payments', paymentController);
app.use('/api/v1/project-donations', projectDonationController);
app.use('/api/v1/donors', donorController);

export default app;
