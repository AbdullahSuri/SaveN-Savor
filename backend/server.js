const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const http = require('http'); // Using built-in http for internal API calls
require('dotenv').config();

const app = express();
const emissionsRoutes = require('./routes/emissions');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to calculate emissions internally
function calculateEmissions(dishName, ingredients) {
  return new Promise((resolve, reject) => {
    // Create the request payload
    const data = JSON.stringify({
      dishName: dishName,
      ingredients: ingredients
    });
    
    // Set up request options for internal API call
    const port = process.env.PORT || 5000;
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/emissions/calculate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    // Make internal HTTP request to the emissions endpoint
    const req = http.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        try {
          // Parse the JSON response
          const parsedResponse = JSON.parse(responseBody);
          resolve(parsedResponse);
        } catch (error) {
          console.error('Error parsing emissions response:', error);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Error calling emissions endpoint:', error);
      reject(error);
    });
    
    // Send the request
    req.write(data);
    req.end();
  });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Add your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/emissions', emissionsRoutes);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/savensavor';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Food Item Schema with Base64 image storage
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: String, required: true },
  description: { type: String, default: '' },
  dietary: [{ type: String }],
  vendor: {
    name: { type: String, required: true },
    id: { type: String, required: true },
    location: { type: String, required: true }
  },
  ingredients: [{ type: String }],
  emissions: {
    saved: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  image: { 
    data: { type: String, default: '' }, // Base64 string
    contentType: { type: String, default: '' } // MIME type
  },
  createdAt: { type: Date, default: Date.now }
}, { 
  timestamps: true
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

// User Schema with orders
const addressSchema = new mongoose.Schema(
  {
    line1: String,
    city: String,
    state: String,
    zip: String,
  },
  { _id: false },
);

const paymentSchema = new mongoose.Schema(
  {
    cardNumberLast4: String,
    expiry: String,
    nameOnCard: String,
  },
  { _id: false },
);

// Order item schema
const orderItemSchema = new mongoose.Schema(
  {
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
    name: { type: String, required: true },
    vendor: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
  },
  { _id: false },
);

// Order schema
const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    serviceFee: { type: Number, default: 2.0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready for pickup", "completed", "cancelled"],
      default: "pending",
    },
    pickupAddress: { type: String, required: true },
    pickupTime: { type: String, required: true },
    paymentMethod: { type: String },
    impact: {
      foodSaved: { type: Number, default: 0 }, // in kg
      co2Saved: { type: Number, default: 0 }, // in kg
    },
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: [addressSchema],
    paymentMethods: [paymentSchema],
    orders: {
      type: [orderSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

// Add a debugging middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Routes

// GET all food items
app.get('/api/food-items', async (req, res) => {
  try {
    const items = await FoodItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific food item
app.get('/api/food-items/:id', async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET image route
app.get('/api/food-items/:id/image', async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    if (!item || !item.image.data) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Send the base64 data
    res.setHeader('Content-Type', item.image.contentType);
    res.send(item.image.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new food item with image upload
app.post('/api/food-items', upload.single('image'), async (req, res) => {
  try {
    let itemData = {};
    
    // Check if we have form data or JSON
    if (req.file || req.body.name) {
      // Parse form data
      itemData = {
        name: req.body.name,
        category: req.body.category,
        originalPrice: parseFloat(req.body.originalPrice),
        discountedPrice: parseFloat(req.body.discountedPrice),
        quantity: parseInt(req.body.quantity),
        expiryDate: req.body.expiryDate,
        description: req.body.description || '',
        dietary: req.body.dietary ? JSON.parse(req.body.dietary) : [],
        vendor: req.body.vendor ? JSON.parse(req.body.vendor) : {},
        ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : []
      };
      
      // Handle image upload if present
      if (req.file) {
        itemData.image = {
          data: req.file.buffer.toString('base64'),
          contentType: req.file.mimetype
        };
      }
    } else {
      // JSON body
      itemData = req.body;
    }
    
    // Calculate emissions based on ingredients
    try {
      console.log('Calculating emissions for:', itemData.name);
      const emissionsData = await calculateEmissions(itemData.name, itemData.ingredients);
      console.log('Emissions calculation result:', emissionsData);
      itemData.emissions = emissionsData;
    } catch (emissionsError) {
      console.error('Error calculating emissions:', emissionsError);
      // Fallback to simple estimation
      itemData.emissions = {
        total: itemData.ingredients.length * 0.5, // Simple estimation: 0.5kg CO2 per ingredient
        saved: itemData.ingredients.length * 0.35, // 70% of total
      };
      console.log('Using fallback emissions:', itemData.emissions);
    }
    
    console.log('Saving food item with emissions:', itemData.emissions);
    const foodItem = new FoodItem(itemData);
    const savedItem = await foodItem.save();
    console.log('Saved food item:', savedItem._id);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error saving food item:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) food item
app.put('/api/food-items/:id', upload.single('image'), async (req, res) => {
  try {
    let updateData = {};
    
    // Check if we have form data or JSON
    if (req.file || req.body.name) {
      // Parse form data
      updateData = {
        name: req.body.name,
        category: req.body.category,
        originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
        discountedPrice: req.body.discountedPrice ? parseFloat(req.body.discountedPrice) : undefined,
        quantity: req.body.quantity ? parseInt(req.body.quantity) : undefined,
        expiryDate: req.body.expiryDate,
        description: req.body.description,
        dietary: req.body.dietary ? JSON.parse(req.body.dietary) : undefined,
        vendor: req.body.vendor ? JSON.parse(req.body.vendor) : undefined,
        ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : undefined
      };
      
      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      // Handle image upload if present
      if (req.file) {
        updateData.image = {
          data: req.file.buffer.toString('base64'),
          contentType: req.file.mimetype
        };
      }
    } else {
      // JSON body
      updateData = req.body;
    }
    
    // If ingredients changed, recalculate emissions
    if (updateData.ingredients) {
      try {
        const dishName = updateData.name || (await FoodItem.findById(req.params.id)).name || 'Food Item';
        console.log('Recalculating emissions for:', dishName);
        
        const emissionsData = await calculateEmissions(dishName, updateData.ingredients);
        console.log('Updated emissions calculation:', emissionsData);
        updateData.emissions = emissionsData;
      } catch (emissionsError) {
        console.error('Error recalculating emissions:', emissionsError);
        // Fallback to simple estimation
        updateData.emissions = {
          total: updateData.ingredients.length * 0.5,
          saved: updateData.ingredients.length * 0.35
        };
        console.log('Using fallback emissions:', updateData.emissions);
      }
    }
    
    const item = await FoodItem.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE food item
app.delete('/api/food-items/:id', async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ORDERS API ROUTES

// GET all orders for a vendor
app.get('/api/vendor/orders', async (req, res) => {
  try {
    // Extract vendor ID from token or query - use the ACTUAL vendor name from your database
    const vendorId = req.query.vendorId || "Spice Garden"; // Updated to match your DB
    const status = req.query.status;
    
    console.log(`Searching for orders with vendor: ${vendorId}`);
    
    // Find all users with orders that contain items from this vendor
    let usersQuery = { 'orders.items.vendor': vendorId };
    
    // Add status filter if provided
    if (status) {
      usersQuery['orders.status'] = status;
      console.log(`Filtering by status: ${status}`);
    }
    
    const users = await User.find(usersQuery);
    console.log(`Found ${users.length} users with matching orders`);
    
    // Extract and format orders with vendor items
    const vendorOrders = [];
    
    for (const user of users) {
      // Filter orders to include only those with items from this vendor
      const userOrders = user.orders.filter(order => 
        order.items.some(item => item.vendor === vendorId)
      );
      
      console.log(`User ${user.name} has ${userOrders.length} matching orders`);
      
      // Add user details to orders
      for (const order of userOrders) {
        // Filter by status if requested
        if (status && order.status !== status) continue;
        
        // Convert MongoDB document to plain object
        const orderObj = order.toObject ? order.toObject() : JSON.parse(JSON.stringify(order));
        
        vendorOrders.push({
          ...orderObj,
          _id: order._id.toString(),
          customerName: user.name,
          customerEmail: user.email,
          userId: user._id.toString()
        });
      }
    }
    
    // Sort by date, newest first
    vendorOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log(`Returning ${vendorOrders.length} vendor orders`);
    res.json(vendorOrders);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET order counts by status
app.get('/api/vendor/orders/counts', async (req, res) => {
  try {
    // Extract vendor ID from token or query - use the ACTUAL vendor name from your database
    const vendorId = req.query.vendorId || "Spice Garden"; // Updated to match your DB
    console.log(`Fetching order counts for vendor: ${vendorId}`);
    
    // Find all users with orders that contain items from this vendor
    const users = await User.find({ 'orders.items.vendor': vendorId });
    console.log(`Found ${users.length} users with orders from vendor ${vendorId}`);
    
    // Initialize counts
    const counts = {
      total: 0,
      pending: 0,
      confirmed: 0,
      ready: 0,
      completed: 0,
      cancelled: 0
    };
    
    // Count orders by status
    for (const user of users) {
      const vendorOrders = user.orders.filter(order => 
        order.items.some(item => item.vendor === vendorId)
      );
      
      counts.total += vendorOrders.length;
      
      for (const order of vendorOrders) {
        switch (order.status) {
          case 'pending':
            counts.pending++;
            break;
          case 'confirmed':
            counts.confirmed++;
            break;
          case 'ready for pickup':
            counts.ready++;
            break;
          case 'completed':
            counts.completed++;
            break;
          case 'cancelled':
            counts.cancelled++;
            break;
        }
      }
    }
    
    console.log('Order counts:', counts);
    res.json(counts);
  } catch (error) {
    console.error('Error fetching order counts:', error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE order status
app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    console.log(`Updating order ${orderId} status to ${status}`);
    
    if (!orderId || !status) {
      return res.status(400).json({ message: 'Order ID and status are required' });
    }
    
    // Find user with the specified order
    const user = await User.findOne({ 'orders._id': orderId });
    
    if (!user) {
      console.log(`Order ${orderId} not found in any user document`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update the order status
    const orderIndex = user.orders.findIndex(order => order._id.toString() === orderId);
    
    if (orderIndex === -1) {
      console.log(`Order ${orderId} found in user ${user._id} but index couldn't be determined`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log(`Found order at index ${orderIndex} for user ${user._id}`);
    user.orders[orderIndex].status = status;
    await user.save();
    console.log(`Updated order ${orderId} status to ${status}`);
    
    // Return the updated order with user info
    const updatedOrder = {
      ...user.orders[orderIndex].toObject(),
      _id: user.orders[orderIndex]._id.toString(),
      customerName: user.name,
      customerEmail: user.email,
      userId: user._id.toString()
    };
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE inventory when order is completed
app.put('/api/orders/:orderId/complete', async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`Completing order ${orderId} and updating inventory`);
    
    // Find the order
    const user = await User.findOne({ 'orders._id': orderId });
    
    if (!user) {
      console.log(`Order ${orderId} not found in any user document`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const orderIndex = user.orders.findIndex(order => order._id.toString() === orderId);
    
    if (orderIndex === -1) {
      console.log(`Order ${orderId} found in user ${user._id} but index couldn't be determined`);
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = user.orders[orderIndex];
    console.log(`Found order with ${order.items.length} items`);
    
    // Update the order status to completed
    order.status = 'completed';
    await user.save();
    console.log(`Updated order ${orderId} status to completed`);
    
    // Update inventory for each item in the order
    for (const item of order.items) {
      try {
        console.log(`Updating inventory for item ${item.foodItemId}`);
        const foodItem = await FoodItem.findById(item.foodItemId);
        
        if (foodItem) {
          console.log(`Found food item ${foodItem._id}, current quantity: ${foodItem.quantity}`);
          foodItem.quantity = Math.max(0, foodItem.quantity - item.quantity);
          await foodItem.save();
          console.log(`Updated food item ${foodItem._id}, new quantity: ${foodItem.quantity}`);
        } else {
          console.log(`Food item ${item.foodItemId} not found in inventory`);
        }
      } catch (itemError) {
        console.error(`Error updating inventory for item ${item.foodItemId}:`, itemError);
        // Continue with other items even if one fails
      }
    }
    
    res.json({ 
      message: 'Order completed and inventory updated',
      updatedItems: order.items.length
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ message: error.message });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for frontend at port 3000`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});