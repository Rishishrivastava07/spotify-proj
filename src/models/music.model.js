const mongoose = require('mongoose');

const musicSchemema = new mongoose.Schema({
    uri: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    artist:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const musicModel = mongoose.model('Music', musicSchemema);  
module.exports = musicModel;