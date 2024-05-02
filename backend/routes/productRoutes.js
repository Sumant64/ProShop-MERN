import express from 'express';
import { deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController.js';
import checkObjectId from '../middleware/checkObjectId.js';
import { admin, protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/').get(getProducts);


router.route('/:id')
    .get(checkObjectId, getProductById)
    .put(protect, admin, checkObjectId, updateProduct)
    .delete(protect, admin, checkObjectId, deleteProduct);


export default router;