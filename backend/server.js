const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Replace with your MongoDB URL)
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_NAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}.mongodb.net/shopsy`;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  priceCents: { type: Number, required: true },
  keywords: [String],
  image: { type: String, required: true },
  rating: {
    stars: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  prime: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  category: { type: String, default: 'General' }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true, unique: true },
  products: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    priceCents: { type: Number, required: true },
    estimatedDeliveryTime: { type: Date, required: true }
  }],
  totalCostCents: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  deliveryAddress: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderTime: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    deliveryOptionId: { type: String, default: '1' }
  }],
  updatedAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

// JWT Secret (Replace with your secret)
const JWT_SECRET = 'your-secret-key-here';

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Load initial products from JSON file
const loadInitialProducts = async () => {
  try {
    const fs = require('fs');
    const productsData = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
    
    for (const productData of productsData) {
      await Product.findOneAndUpdate(
        { id: productData.id },
        productData,
        { upsert: true, new: true }
      );
    }
    console.log('Initial products loaded successfully');
  } catch (error) {
    console.error('Error loading initial products:', error);
  }
};

// API Routes

// 1. User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address: address || ''
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Update User Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address !== undefined) updates.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Get All Products
app.get('/api/products', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.priceCents = {};
      if (minPrice) query.priceCents.$gte = parseInt(minPrice);
      if (maxPrice) query.priceCents.$lte = parseInt(maxPrice);
    }

    // Sort options
    let sortOption = {};
    if (sort === 'price-low') sortOption.priceCents = 1;
    else if (sort === 'price-high') sortOption.priceCents = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else sortOption.name = 1;

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 6. Get Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 7. Cart Operations
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, products: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, products: [] });
    }

    // Check if product already exists in cart
    const existingProductIndex = cart.products.findIndex(
      item => item.productId === productId
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, deliveryOptionId: '1' });
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.json({
      message: 'Product added to cart',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/cart/update', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 0) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (quantity === 0) {
      cart.products = cart.products.filter(item => item.productId !== productId);
    } else {
      const productIndex = cart.products.findIndex(item => item.productId === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
      }
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.json({
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/cart/clear', authenticateToken, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { products: [], updatedAt: new Date() }
    );
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/cart/delivery-option', authenticateToken, async (req, res) => {
  try {
    const { productId, deliveryOptionId } = req.body;
    if (!productId || !deliveryOptionId) {
      return res.status(400).json({ error: 'Product ID and delivery option ID are required' });
    }
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const product = cart.products.find(item => item.productId === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }
    product.deliveryOptionId = deliveryOptionId;
    cart.updatedAt = new Date();
    await cart.save();
    res.json({ message: 'Delivery option updated', cart });
  } catch (error) {
    console.error('Update delivery option error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 8. Order Operations
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { cart, deliveryAddress } = req.body;

    if (!cart || !deliveryAddress) {
      return res.status(400).json({ error: 'Cart and delivery address are required' });
    }

    // Calculate delivery time
    let deliveryDays = 7; // Default

    const products = [];
    let totalCents = 0;

    // Process each cart item
    for (const item of cart) {
      const product = await Product.findOne({ id: item.productId });
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }

      const itemTotal = product.priceCents * item.quantity;
      totalCents += itemTotal;

      products.push({
        productId: item.productId,
        quantity: item.quantity,
        priceCents: product.priceCents,
        estimatedDeliveryTime: new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000)
      });
    }

    // Create order
    const order = new Order({
      userId: req.user._id,
      orderId: uuidv4(),
      products,
      totalCostCents: totalCents,
      deliveryAddress,
      status: 'pending'
    });

    await order.save();

    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { products: [], updatedAt: new Date() }
    );

    // --- Send SMS Notification ---
    try {
        const user = await User.findById(req.user._id);
        const userPhoneNumber = user.phone;
        const message = `Thank you for your order, ${user.name}! Your order #${order.orderId} has been placed successfully.`;

        // Check if Twilio credentials are set
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: `+${userPhoneNumber}` // Ensure phone number includes country code
            });
            console.log(`SMS notification sent to ${userPhoneNumber}`);
        } else {
            console.log('Twilio credentials not set. Skipping SMS. Message:', message);
        }
    } catch (smsError) {
        console.error('Error sending SMS notification:', smsError);
        // Do not fail the order if SMS fails
    }
    // --- End SMS Notification ---

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ orderTime: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      orderId: req.params.orderId,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Legacy routes for backward compatibility
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Legacy products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { cart } = req.body;
    const products = [];
    let totalCents = 0;

    for (const item of cart) {
      const product = await Product.findOne({ id: item.productId });
      if (product) {
        totalCents += product.priceCents * item.quantity;
        products.push({
          productId: item.productId,
          quantity: item.quantity,
          estimatedDeliveryTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      }
    }

    const order = {
      id: uuidv4(),
      orderTime: new Date(),
      products,
      totalCostCents: totalCents
    };

    res.json(order);
  } catch (error) {
    console.error('Legacy order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await loadInitialProducts();
});
