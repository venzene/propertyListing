const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const importCsvToMongo = require('./utils/loadData');
const methodOverride = require('method-override');

const authRoutes = require('./routes/auth');
const browseRoutes = require('./routes/browseRoutes');
const adminRoutes = require('./routes/adminRoutes');

const User = require('./models/user'); 
const Property = require('./models/property');
const cookieParser = require('cookie-parser');
const isAuth = require('./middlewares/isAuth');

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://localhost:27017/propertyListing';

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(methodOverride('_method'));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: false }));

// Serve static files (CSS, JS, images, etc.) from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/browse', browseRoutes); // or /browse if you prefer
app.use('/admin', adminRoutes);

// Root route - render a homepage or dashboard (you can create views/home.ejs)
app.get('/', (req, res) => {
   res.render('auth/onboard',{isAuthenticated: req.isAuthenticated || false,})
});

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');

    // ====== CLEANUP DB ======
    try {
        // Clear existing data in User and Property collections
        await User.deleteMany({});
        await Property.deleteMany({});
        console.log('Database cleanup successful');
    } catch (cleanupErr) {
        console.error('Database cleanup failed:', cleanupErr);
    }

    // ====== IMPORT CSV DATA ======
    const filePath = path.join(__dirname, 'data', 'properties.csv');
    await importCsvToMongo(filePath);
    console.log('CSV data imported successfully');

    // ====== START SERVER ======
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error('MongoDB connection failed:', err);
});
