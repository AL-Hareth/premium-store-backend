const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const pwCplx = require('joi-password-complexity');
const Joi = require('joi');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    sellings_rev: {
        type: Number,
        default: 0
    },
    prizes_rev: {
        type: Number,
        default: 0
    },
    total_withdrawed: {
        type: Number,
        default: 0
    },
    delivered_orders: [{
        orderId: String,
        createdAt: Date
    }],
    address: String,
    postal_code: Number,
    company: String,
    profile_picture: {
        type: Buffer
    },
    favorite_products: [{
        product_id: String
    }],
    orders: [{
        product_id: String
    }],
    shopping_cart: [{
        product_id: String,
        selling_price: Number,
        quantity: Number
    }],
    cliqAlias: {
        type: String,
        default: ''
    },
    notification: [{
        title: String,
        body: String
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, permission: this.permission }, process.env.JWTPRIVATEKEY, { expiresIn: "7d" });
    return token;
}

const Users = mongoose.model('User', userSchema);

const validate = data => {
    const schema = Joi.object({
        username: Joi.string().required().label('Username'),
        email: Joi.string().required().label('email'),
        phone_number: Joi.string().required().label('phone_number'),
        password: pwCplx().required().label('password')
    });
    return schema.validate(data);
};

module.exports = { Users, validate };
