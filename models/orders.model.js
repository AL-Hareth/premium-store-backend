const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ordersSchema = new Schema({
  total_products_cost: Number,
  total_products_profit: Number,
  taken_from_client: Number,
  delivery_cost: Number,
  sellerId: String,
  client: {
    name: String,
    city: String,
    client_phone_number: String,
    from_store: String,
    detailed_address: String
  },
  order_state: String,
  products: [{
    productId: String,
    sellingPrice: Number,
    quantity: Number
  }]
}, { timestamps: true });

const Orders = mongoose.model('Orders', ordersSchema);
module.exports = Orders;