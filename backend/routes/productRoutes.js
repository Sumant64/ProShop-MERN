import express from 'express';
import { getProductById, getProducts } from '../controllers/productController.js';
import checkObjectId from '../middleware/checkObjectId.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/').get(getProducts);


router.route('/:id').get(checkObjectId, protect, getProductById)


export default router;