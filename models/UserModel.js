const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter your username']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        select: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model( 'User', UserSchema );

