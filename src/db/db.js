const mongoose = require('mongoose');


async function connectDB () {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('Missing MONGO_URI environment variable');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = { connectDB };
