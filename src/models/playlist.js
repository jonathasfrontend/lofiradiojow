const mongoose = require('mongoose');

const Playlist = new mongoose.Schema({
    Username: {
        type: String,
        required: false
    },
    UserId: {
        type: String,
        required: true
    },
    PlaylistName: {
        type: String,
        required: true
    },
    Playlist: {
        type: Array,
        required: true
    },
    CreatedOn: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('playlist', Playlist);