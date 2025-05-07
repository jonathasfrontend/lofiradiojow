const mongoose = require('mongoose');

const Radio = new mongoose.Schema({
    Guild: {
        type: String,
        required: true,
    },
    Radio: {
        type: String,
        required: true,
    },
    oldradio: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('station', Radio);