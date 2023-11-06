const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Product = require('./models/productModel');
const app = express();
const url = 'mongodb+srv://yash:123@cluster0.gjrgdb3.mongodb.net/?retryWrites=true&w=majority';

// Set your JWT secret key. It's better to store this in an environment variable.
const JWT_SECRET = 'your-secret-key';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", false);

// Define a User model and schema (you may want to store users in your database)
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
}));

// Function to hash passwords
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// User registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    username,
    password: hashedPassword,
  });
//   const user = new User({
//     username:"Yash",
//     password: 123,
//   });

  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// User login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Create a JWT token
  const token = jwt.sign({ username: user.username }, JWT_SECRET);

  res.json({ token });
});

// Middleware to check for valid JWT before accessing protected routes
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // If the token is valid, add the user to the request object for further processing
    req.user = user;
    next();
  });
};

// Protected route: Insert a product with hardcoded values
app.post('/create', authenticateToken, async (req, res) => {
  try {
    // Hardcoded product values
    const newProduct = {
      name: 'Sample Product',
      quantity: 5,
      price: 19.99,
    };

    const product = await Product.create(newProduct);

    res.status(201).json(product); 
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get('/products', authenticateToken, async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('API app is running on port 3000');
    });
  })
  .catch((error) => {
    console.log(error);
  });
