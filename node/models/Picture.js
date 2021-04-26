const mongoose = require('mongoose')
const User = require('./User');

const pictureSchema = mongoose.Schema({
    date: {
        type: Date,
    },
    explanation: {
        type: String
    },
    "media_type": {
        type: String
    },
    "title": {
        type: String
    },
    "url": {
        type: String
    },
    userId: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]

})
module.exports = mongoose.model('Picture', pictureSchema);
