import express from 'express';
const router = express.Router();
import userauthRoutes from './userauthRoute.js'
import categoryRoutes from './categoryRoute.js';
import subcategoryRoutes from './subcategoryRoute.js';
import productRoutes from './productRoute.js';
import authRoutes from './authRoute.js';
import bannerRoutes from './bannerRoute.js';

router.use('/auth', authRoutes);

router.use('/userauth', userauthRoutes);

router.use('/categories', categoryRoutes);

router.use('/subcategories', subcategoryRoutes);

router.use('/products', productRoutes);

router.use('/banners', bannerRoutes);

export default router