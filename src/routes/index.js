import express from 'express';
const router = express.Router();
import userauthRoutes from './userauthRoute.js'
import categoryRoutes from './categoryRoute.js';
import subcategoryRoutes from './subcategoryRoute.js';
import productRoutes from './productRoute.js';
import authRoutes from './authRoute.js';
import bannerRoutes from './bannerRoute.js';
import dashboardRoutes from './dashboard.js'
import contactRoutes from './contactRoute.js';
import sectionProductRoutes from './sectionProductRoute.js';
import sectionRoutes from './sectionRoute.js';

router.use('/admin', authRoutes);

router.use('/admin-dashboard', dashboardRoutes);

router.use('/userauth', userauthRoutes);

router.use('/categories', categoryRoutes);

router.use('/subcategories', subcategoryRoutes);

router.use('/products', productRoutes);

router.use('/banners', bannerRoutes);

router.use('/contacts', contactRoutes);

router.use('/sections', sectionRoutes);

router.use('/section-products', sectionProductRoutes);

export default router