const router = require("express").Router();
const Products = require("../models/products.model");

// Create new product {POST request}
router.route("/add").post((req, res) => {
    if (
        req.body.name == "" ||
        req.body.price == 0 ||
        req.body.description == ""
    ) {
        res.status(400).json(`Sorry you can't send the data like this`);
    } else {
        const product = new Products({
            name: req.body.name,
            price: req.body.price,
            SKU: req.body.SKU,
            suggested_price: req.body.suggested_price,
            quality: req.body.quality,
            country_of_origin: req.body.country_of_origin,
            description: req.body.description,
            pictures: req.body.pictures,
            category: req.body.category,
            video_url: req.body.video_url,
            coloe: req.body.color,
            availability: req.body.availability,
        });

        product
            .save()
            .then(() => res.json(`Product Created`))
            .catch((err) => res.status(400).json(err));
    }
});

// Fetch all products {GET request}
router.route("/").get((req, res) => {
    Products.find()
        .then((products) => res.json(products))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Paginated Request {GET request} -No longer used for better performance-
    // router.route('/get-items').get((req, res) => {
        //   const page = req.query.page;
        //   const startIndex = 0;
        //   const endIndex = page * 12;
        //   Products.find()
        //     .then(products => res.json(products.slice(startIndex, endIndex)))
        //     .catch(err => res.status(400).json(`Internal Server Error: ${err}`));
        // });

// Fetch a product by its id {GET request}
router.route("/:id").get((req, res) => {
    Products.findById(req.params.id)
        .then((product) => res.json(product))
        .catch((err) => res.status(400).json(err));
});

// Edit product data {POST request}
router.route("/edit/:id").post((req, res) => {
    Products.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            price: req.body.price,
            SKU: req.body.SKU,
            suggested_price: req.body.suggested_price,
            quality: req.body.quality,
            country_of_origin: req.body.country_of_origin,
            description: req.body.description,
            pictures: req.body.pictures,
            category: req.body.category,
            video_url: req.body.video_url,
            color: req.body.color,
            availability: req.body.availability,
        },
    })
        .then(() => res.json(`Edited`))
        .catch((err) => res.json(err));
});

//Delete Products By Id {DELETE request}
router.route("/:id").delete((req, res) => {
    Products.findByIdAndDelete(req.params.id)
        .then(() => res.json(`Deleted Product`))
        .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
