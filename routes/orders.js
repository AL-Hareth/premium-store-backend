const router = require("express").Router();
const Orders = require("../models/orders.model");
const Products = require("../models/products.model");

// Create new order {POST request}
router.route("/new").post((req, res) => {
  if (req.body.products.length === 0 || req.body.sellerId === "") {
    res.status(400).json(`You can't order this list`);
  }

  const order = new Orders({
    total_products_cost: req.body.total_products_cost,
    total_products_profit: req.body.total_profit,
    taken_from_client: req.body.taken_from_client,
    delivery_cost: 2.75,
    sellerId: req.body.sellerId,
    order_state: "معلقة",
    products: req.body.products,
    client: {
      name: req.body.client.name,
      city: req.body.client.city,
      client_phone_number: req.body.client.client_phone,
      from_store: req.body.client.from_store,
      detailed_address: req.body.client.detailed_address,
    },
  });

  order
    .save()
    .then(() => res.json("Order Created"))
    .catch((err) => res.status(400).json(`Server Error: ${err}`));
});

// Fetch all orders {GET request}
router.route("/").get((req, res) => {
  Orders.find()
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json(`Server Error: ${err}`));
});

// Find one order by id {GET request}
router.route("/:id").get((req, res) => {
  Orders.findById(req.params.id)
    .then(async (order) => {
      const newOrder = {
        ...order._doc,
        products: await Promise.all(order.products.map(async (product) => {
          return { 
            ...(await Products.findById(product.productId))._doc,
            quantity: product.quantity,
            sellingPrice: product.sellingPrice
          };
        }))
      };

      return res.json(newOrder);
    })
    .catch((err) => res.status(400).json(`Server Error: ${err}`));
});

// Change order state by id {POST request}
router.route("/:id").post((req, res) => {
  Orders.findByIdAndUpdate(req.params.id, {
    order_state: req.body.order_state,
  })
    .then(() => res.json(`Changed order state`))
    .catch((err) => res.status(400).json(`Server Error: ${err}`));
});

// Change order state to caneled by id {POST request}
router.route("/cancel/:id").post((req, res) => {
  Orders.findByIdAndUpdate(req.params.id, {
    order_state: "ملغية",
  })
    .then(() => res.json(`Changed order state`))
    .catch((err) => res.status(400).json(`Server Error: ${err}`));
})

// Get All Orders for one user by Id {GET request}
router.route("/get-users-orders/:id").get((req, res) => {
  Orders.find({
    sellerId: req.params.id,
  })
    .then((orders) => res.json(orders))
    .catch((err) => res.status(400).json(`Server Error: ${err}`));
});

module.exports = router;
