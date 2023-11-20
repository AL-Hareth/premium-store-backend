const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define an enum for products' categories
const categories = [
    "kitchen",
    "tech",
    "prefium",
    "watches",
    "gaming",
    "self care",
    "solar power",
    "other"
];

const productsSchema = new Schema({
    name: String,
    price: Number,
    SKU: String,
    suggested_price: Number,
    quality: String,
    country_of_origin: String,
    description: String,
    category: {
        type: String,
        enum: categories
    },
    pictures: [{
        pic_url: String
    }],
    video_url: String,
    availability: String,
    color: { type: String }
});

const Products = mongoose.model('Products', productsSchema);

module.exports = Products;
