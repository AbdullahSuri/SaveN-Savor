const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
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
    if (req.file || req.body) {
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
        ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : [],
        emissions: req.body.emissions ? JSON.parse(req.body.emissions) : {}
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
    
    console.log('Received food item:', itemData);
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
        ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : undefined,
        emissions: req.body.emissions ? JSON.parse(req.body.emissions) : undefined
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