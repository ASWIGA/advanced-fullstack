const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://root:root@cluster0.6b0hpo2.mongodb.net/?appName=Cluster0')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


// ====================== USER MODEL ======================
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
const User = mongoose.model('User', UserSchema);


// ====================== FOOD MODEL ======================
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    daysSinceIAte: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});
const Food = mongoose.model('Food', foodSchema);


// ====================== MIDDLEWARE ======================
const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: 'No token provided' });

    token = token.replace("Bearer ", "");

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

        req.userId = decoded.userId;
        next();
    });
};


// ====================== AUTH ROUTES ======================
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).send("User registered");
});


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: "1h" });

    res.json({ token });
});


// ====================== FOOD CRUD ======================

// Create food
app.post('/api/food', verifyToken, async (req, res) => {
    const { name, daysSinceIAte } = req.body;

    const food = new Food({ name, daysSinceIAte, user: req.userId });
    await food.save();

    res.status(201).send("Food entry created");
});


// Read foods
app.get('/api/food', verifyToken, async (req, res) => {
    const foods = await Food.find({ user: req.userId });
    res.json(foods);
});


// Update food
app.put('/api/food/:id', verifyToken, async (req, res) => {
    const { daysSinceIAte, name } = req.body;

    await Food.updateOne(
        { _id: req.params.id, user: req.userId },
        { name, daysSinceIAte }
    );

    res.send("Food updated");
});


// Delete food
app.delete('/api/food/:id', verifyToken, async (req, res) => {
    await Food.deleteOne({ _id: req.params.id, user: req.userId });
    res.send("Food deleted");
});


// ====================== START SERVER ======================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
