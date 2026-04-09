import express from 'express';
const router = express.Router();
import categoryRoutes from './categoryRoute.js';
import subcategoryRoutes from './subcategoryRoute.js';
import productRoutes from './productRoute.js';
import authRoutes from './authRoute.js';


router.use('/auth', authRoutes);

router.use('/categories', categoryRoutes);

router.use('/subcategories', subcategoryRoutes);

router.use('/products', productRoutes);

export default router