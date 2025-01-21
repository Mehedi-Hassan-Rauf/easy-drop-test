require('dotenv').config();
const express = require('express');
const knex = require('knex')(require('./knexfile'));
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MySQL
knex.raw('select 1+1 as result')
  .then(() => console.log('Connected to MySQL'))
  .catch(err => console.log('Database connection error', err));

// User Registration and Login Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  knex('users').insert({ username, password: hashedPassword })
    .then(async () => {
      // After successful registration, generate a token
      const token = jwt.sign({ username }, process.env.JWT_SECRET);
      res.status(201).json({ token }); // Send the token in the response
    })
    .catch(err => res.status(500).send(err));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await knex('users').where({ username }).first();
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Cart Routes
app.post('/cart', (req, res) => {
  const { userId, productId, quantity } = req.body;
  knex('cart').insert({ user_id: userId, product_id: productId, quantity })
    .then(() => res.status(201).send('Product added to cart'))
    .catch(err => res.status(500).send(err));
});

app.get('/cart/:userId', (req, res) => {
  knex('cart')
    .join('products', 'cart.product_id', '=', 'products.id')
    .where({ user_id: req.params.userId })
    .then(cart => res.json(cart))
    .catch(err => res.status(500).send(err));
});

app.delete('/cart/:userId/:productId', (req, res) => {
  knex('cart')
    .where({ user_id: req.params.userId, product_id: req.params.productId })
    .del()
    .then(() => res.status(200).send('Product removed from cart'))
    .catch(err => res.status(500).send(err));
});

app.put('/cart/:userId/:productId', (req, res) => {
  const { quantity } = req.body;
  knex('cart')
    .where({ user_id: req.params.userId, product_id: req.params.productId })
    .update({ quantity })
    .then(() => res.status(200).send('Cart updated'))
    .catch(err => res.status(500).send(err));
});

// Check if a specific product exists in the cart
app.get('/cart/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  knex('cart')
    .where({ user_id: userId, product_id: productId })
    .first()
    .then((item) => {
      if (item) {
        res.json({ exists: true }); // Product exists in the cart
      } else {
        res.json({ exists: false }); // Product does not exist in the cart
      }
    })
    .catch((err) => res.status(500).send(err));
});

// Checkout Route
app.post('/checkout/:userId', (req, res) => {
  res.send('Congratulations on your purchase!');
});

// Products Route
app.get('/products', (req, res) => {
  knex('products')
    .select('*')
    .then(products => res.json(products))
    .catch(err => res.status(500).send('Error fetching products'));
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
