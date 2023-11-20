const router = require("express").Router();
const { Users, validate } = require("../models/users.model");
const WithdrawOrders = require("../models/withdraw_orders.model");
const bcrypt = require("bcrypt");
//const storage = require("../megaStorage");
//const upload = require("express-fileupload");
const multer = require("multer");
const upload = multer();

// Create new user {POST request}
router.route("/signup").post(async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const username = await Users.findOne({ username: req.body.username });
        const email = await Users.findOne({ email: req.body.email });
        const phoneNumber = await Users.findOne({ phone_number: req.body.phone_number });
        if (username) {
            return res
                .status(409)
                .send({ message: "هذا الاسم مستخدم من قبل" });
        }

        if (email) {
            return res
                .status(409)
                .send({ message: "هذا البريد مستخدم من قبل" });
        }

        if (phoneNumber) {
            return res
                .status(409)
                .send({ message: "هذا الرقم مستخدم من قبل" })
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new Users({
            username: req.body.username,
            email: req.body.email,
            phone_number: req.body.phone_number,
            password: hashPassword,
        });
        await newUser
            .save()
            .then(() =>
                res
                    .status(201)
                    .send({ message: "User created successfully", id: newUser.id })
            );
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Fetch all users {GET request}
router.route("/").get((req, res) => {
    Users.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Find user by id {GET request}
router.route("/:id").get((req, res) => {
    Users.findById(req.params.id)
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Delete User {DELETE request}
router.route("/:id").delete((req, res) => {
    Users.findByIdAndDelete(req.params.id)
        .then(() => res.json(`user deleted`))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Get the list of notifications for a selected user {GET request}
router.route("/notification/:id").get((req, res) => {
    Users.findById(req.params.id)
        .then((user) => res.json(user.notification))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Send notification to selected user {POST request}
router.route("/notification/:id").post((req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        $push: {
            notification: {
                title: req.body.notification_title,
                body: req.body.notification_body,
            },
        },
    })
        .then(() => res.json(`Notification sent successfully`))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Delete notification {DELETE request}
router.route("/notification/:id").delete((req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        $pull: {
            notification: { _id: req.body.notification_id },
        },
    })
        .then(() => res.json(`Deleted Notification`))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Push notification to all users {POST request}
router.route("/notification").post((req, res) => {
    Users.updateMany(
        { isAdmin: false },
        {
            $push: {
                notification: {
                    title: req.body.notification_title,
                    body: req.body.notification_body,
                },
            },
        }
    )
        .then(() => res.json(`Pushed Notification to all non-admin users`))
        .catch((err) => res.status(400).json(err));
});

// Update basic data in the profile page {POST request}
router.route("/profile/update-basic/:id").post((req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        address: req.body.address,
        postal_code: req.body.postal_code,
        company: req.body.company,
        cliqAlias: req.body.cliqAlias,
    })
        .then(() => res.json(`User updated`))
        .catch((err) => res.statusCode(400).json(`Internal Server Error: ${err}`));
});

router.route("/profile/picture/:id").post(upload.single("profile_picture"), async (req, res) => {
    /*
    const file = await storage.upload({
        name: `${Math.random()}_pic.png`,
        size: 1000,
    }, req.file.buffer).complete;
    */

});

// Add items to shopping cart {POST request}
/*
{
  product_id: String,
  selling_price: Number,
  quantity: Number
}
*/
function returnIndexData(arr, wantedElement) {
    let wantedIndex;
    arr.map((element, index) => {
        if (element.product_id === wantedElement) wantedIndex = index;
        return true;
    });
    return wantedIndex;
}

// Add an item to shopping cart {POST request}
router.route("/add-to-cart/:id").post((req, res) => {
    const productId = req.body.product_id;
    const sellingPrice = req.body.selling_price;

    Users.findById(req.params.id)
        .then((user) => {
            if (
                user.shopping_cart.some((element) => element.product_id === productId)
            ) {
                user.shopping_cart[returnIndexData(user.shopping_cart, productId)]
                    .quantity++;
                user.save();
            } else {
                user
                    .updateOne({
                        $push: {
                            shopping_cart: Object({
                                product_id: productId,
                                selling_price: sellingPrice,
                                quantity: 1,
                            }),
                        },
                    })
                    .exec();
            }
            return user;
        })
        .then((userData) => res.json(`Added to Shopping Cart`))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Remove an item from the shopping cart {POST request}
router.route("/remove-from-cart/:userId").post((req, res) => {
    Users.findById(req.params.userId)
        .then((user) => {
            user
                .updateOne({
                    $pull: {
                        shopping_cart: {
                            product_id: req.body.product_id,
                        },
                    },
                })
                .exec();
            return user;
        })
        .then((data) => res.json(`deleted item form cart`))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Add product to favorite {POST request}
router.route("/add-to-fav/:id").post((req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        $push: {
            favorite_products: { product_id: req.body.productId },
        },
    })
        .then(() => res.json(`Added to favorite`))
        .catch((err) => res.statusCode(400).json(`Internal Server Error: ${err}`));
});

// Remove product from favorite {POST request}
router.route("/remove-from-favorite/:id").post((req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        $pull: {
            favorite_products: { product_id: req.body.productId },
        },
    })
        .then(() => res.json(`Removed from favorite`))
        .catch((err) => res.status(400).json(`Internal Server Error: ${err}`));
});

// Clear the Shopping Cart of a user {POST request}
router.route("/clear-shopping-cart/:id").post((req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        shopping_cart: [],
    })
        .then(() => res.json(`Cleared shopping cart`))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Add delivered order {POST request}
router.route("/delivered-order/:id").post((req, res) => {
    Users.findByIdAndUpdate(req.params.id, {
        $push: {
            delivered_orders: {
                orderId: req.body.orderId,
                createdAt: req.body.createdAt,
            },
        },
    })
        .then(() => res.json(`Success`))
        .catch((err) => res.status(400).json(err));
});

// Add Revenue {POST request}
router.route("/revenue/:id").post((req, res) => {
    Users.findById(req.params.id)
        .then((user) => {
            user.sellings_rev += +req.body.addedRev;
            user.save();
            res.json("Revenue Added");
        })
        .catch((err) => res.status(400).json(`Something went wrong`));
});

router.route("/withdraw/:id").post((req, res) => {
    Users.findById(req.params.id)
        .then((user) => {
            const totalRev = (user.prizes_rev || 0) + user.sellings_rev;

            if (totalRev < 6) {
                throw new Error("المبلغ أقل من 6 د.أ");
            }

            if (!user.cliqAlias) {
                throw new Error("No Cliq Alias");
            }

            const withdrawOrder = new WithdrawOrders({
                amount: totalRev,
                userId: user._id,
            });

            withdrawOrder.save().then(() => {
                res.status(201).json("Success");
            });

            user.update({
                $set: {
                    prizes_rev: 0,
                    sellings_rev: 0,
                }
            }).exec();

        })
        .catch((err) => res.status(400).json(`Something went wrong: ${err}`));
});

module.exports = router;
