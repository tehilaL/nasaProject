const mongoose = require('mongoose')
const Picture = require('./Picture')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 4,
        required: true
    },
    email: {
        type: String
    },
    pictures: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Picture' }
    ]

})

module.exports = mongoose.model('User', userSchema);
