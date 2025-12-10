const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },
    daySinceAte: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("food", foodSchema);
