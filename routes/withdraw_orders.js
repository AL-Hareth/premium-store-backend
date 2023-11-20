const { Users } = require("../models/users.model");
const WithdrawOrders = require("../models/withdraw_orders.model");
const router = require("express").Router();

router.route("/").get((req, res) => {
    WithdrawOrders.find()
        .then((withdrawOrders) => res.json(withdrawOrders))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.route("/approve/:id").post((req, res) => {
    WithdrawOrders.findByIdAndUpdate(req.params.id, {
        state: "approved",
    })
        .then((order) => {
            const userId = order.userId;
            Users.findByIdAndUpdate(userId, {
                $inc: {
                    total_withdrawed: order.amount
                }
            }).then(() => res.json("Order Approved"));
        })
        .catch((err) => res.status(400).json(`Server Error: ${err}`));
});

router.route("/reject/:id").post((req, res) => {
    WithdrawOrders.findByIdAndUpdate(req.params.id, {
        state: "rejected",
    })
        .then(() => res.json("Order Rejected"))
        .catch((err) => res.status(400).json(`Server Error: ${err}`));
});

module.exports = router;
