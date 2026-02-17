const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String
    },
    authorname: {
        type: String
    },
    authorImage: {
        type: String
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date
    },
    category: {
        type: String
    },
    blogImage: {
        type: String
    }
})

module.exports = mongoose.model('blogs', blogSchema)