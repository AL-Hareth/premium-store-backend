const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const withdrawOrdersRoute = require("./routes/withdraw_orders");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.NODE_ENV !== "production" ? process.env.URI : process.env.PROD_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log(`Connected to Database`);
});

app.get("/", (req, res) => {
    res.send("OK");
});

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/withdraw-orders', withdrawOrdersRoute);

app.listen(port, () => {
    console.log(`App working on http://localhost:${port}`);
});

module.exports = app;
