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
            {name: { $regex: req.query.keyword, $options: 'i'}},
            {brand: { $regex: req.query.keyword, $options: 'i'}},
            {category: { $regex: req.query.keyword, $options: 'i'}},
            {description: { $regex: req.query.keyword, $options: 'i'}}
        ]
    } : {}

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({products, page, pages: Math.ceil(count / pageSize)});
})



export {
    getProducts,
};