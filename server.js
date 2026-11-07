const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Frontend files serve karne ke liye

// MongoDB Connection (Render par deploy karte waqt Environment Variable use karenge)
const MONGO_URI = process.env.MONGO_URI || 'Yahan apna local MongoDB URL ya direct string daal sakte hain testing ke liye';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas Successfully!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User Schema & Model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email aur password zaroori hain!' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Yeh email pehle se registered hai!' });
        }

        const newUser = new User({ email, password });
        await newUser.save();

        res.json({ success: true, message: 'Signup successful! Data permanently save ho gaya.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error ho gaya.' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (user) {
            res.json({ success: true, message: 'Login successful!' });
        } else {
            res.status(401).json({ success: false, message: 'Galat email ya password hai!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error ho gaya.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});