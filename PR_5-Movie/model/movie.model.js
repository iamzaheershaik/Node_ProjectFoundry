const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director: {
        type: String
    },
    releaseYear: {
        type: Number
    },
    genre: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 10
    },
    posterUrl: {
        type: String
    }
});

module.exports = mongoose.model("Movie", movieSchema);