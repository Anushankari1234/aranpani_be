import express from 'express';
import paymentController from './controllers/payment.controller';
import projectDonationController from './controllers/projectDonation.controller';
import donorController from './controllers/donor.controller';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.send('API is running'));

app.get('/hello', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello World</title>
  </head>
  <body>
    <main>
      <p role="status">Service online</p>
      <h1>Hello, world.</h1>
      <p>The Aranani API is ready to receive requests.</p>
    </main>
  </body>
</html>`);
});

app.use('/api/v1/payments', paymentController);
app.use('/api/v1/project-donations', projectDonationController);
app.use('/api/v1/donors', donorController);

export default app;
