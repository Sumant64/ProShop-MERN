import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";


// @desc Fetch all products
// @route GET /api/products
// @access public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;

    // to find only in name
    // const keyword = req.query.keyword ?
    //     {
    //         name: {
    //             $regex: req.query.keyword,
    //             $options: 'i'
    //         }
    //     } : {};

    // to find in multiple keys: name, brand, category, description
    const keyword = req.query.keyword ? {
        $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {}

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
})


// @desc Create a product
// @route POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, brand, category, countInStock, description } = req.body;

    const product = new Product({
        name: name,
        price: price,
        user: req.user._id,
        brand: brand,
        rating: 0, //default is also 0 in product model
        category: category,
        countInStock: countInStock,
        numReviews: 0, //default is also 0 in product model
        description: description
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})


// @desc Fetch single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    // Note: checking for valid ObjectId to prevent CastError moved to separate
    // middleware. See readme for more info.

    const product = await Product.findById(req.params.id);
    if (product) {
        return res.json(product);
    } else {
        //Note: this wil run if a valid ObjectId but no product was found
        // i.e. product may be null
        res.status(400);
        throw new Error("Product not found");
    }
})


// @desc Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        // product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});


// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(product) {
        await Product.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
})


// @desc Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({rating: -1}).limit(3);

    res.json(products)
})


// @desc Create new review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler (async (req, res) => {
    const {rating, comment} = req.body;

    const product = await Product.findById(req.params.id);

    if(product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if(alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;

        product.rating = 
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;
        
        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
})


export {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getTopProducts,
    createProductReview
};