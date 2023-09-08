const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');
const validateCreditCard = require('./validateCreditCard');

const app = express();
app.use(cors());
app.use(express.json());

// Custom route for credit card validation and storing in JSON database
app.post('/credit-cards/validate', (req, res) => {
  const { cardNumber, cardHolderName, expiryMonth, expiryYear, cvv } = req.body;

  // Perform server-side validation using a custom validation function
  const validationResult = validateCreditCard(cardNumber, cardHolderName, expiryMonth, expiryYear, cvv);

  if (validationResult.isValid) {
    // If card is valid, store the data in the JSON database
    const db = jsonServer.createDatabase();
    const creditCards = db.get('credit-cards');
    const newCard = {
      cardNumber,
      cardHolderName,
      expiryMonth,
      expiryYear,
      cvv,
    };
    creditCards.push(newCard).write();

    res.json({ message: 'Card data stored successfully' });
  } else {
    // If card is invalid, return the error message
    res.status(400).json({ error: validationResult.error });
  }
});

// JSON Server routes
const router = jsonServer.router('db.json');
app.use('api',router);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
