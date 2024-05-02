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
})


export {
    getProducts,
    getProductById,
    updateProduct
};