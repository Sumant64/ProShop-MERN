import express from 'express';
import { getProductById, getProducts, updateProduct } from '../controllers/productController.js';
import checkObjectId from '../middleware/checkObjectId.js';
import { admin, protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/').get(getProducts);


router.route('/:id')
    .get(checkObjectId, getProductById)
    .put(protect, admin, checkObjectId, updateProduct)


export default router;