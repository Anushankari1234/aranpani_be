import express from 'express';
import paymentController from './controllers/payment.controller';
import projectDonationController from './controllers/projectDonation.controller';
import donorController from './controllers/donor.controller';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello World</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Arial, sans-serif;
        background: #f4f1ea;
        color: #1e2a2d;
      }

      body {
        min-height: 100vh;
        margin: 0;
        display: grid;
        place-items: center;
      }

      h1 {
        margin: 0;
        font-size: clamp(2.5rem, 8vw, 5rem);
        letter-spacing: -0.04em;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Hello World</h1>
    </main>
  </body>
</html>`);
});
app.use('/api/v1/payments', paymentController);
app.use('/api/v1/project-donations', projectDonationController);
app.use('/api/v1/donors', donorController);

export default app;
