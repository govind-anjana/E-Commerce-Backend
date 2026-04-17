// //routes/PromoRoutes.js

import express from 'express';
import { applyPromo, PromoCreate, PromoDelete, PromoShow, PromoUpdate } from '../controllers/promoController.js';
// import { ApplyPromo,   PromoCreate, PromoDelete, PromoShow, PromoUpdate } from '../controller/PromoController.js';
// >>>>>>> 52fd14633c672ac4aea3c5f19e586923ba287965
// import { UserapplyPromo } from '../middleware/authUser.js';
// import { verifyAdminOrSubAdmin, checkPermission } from '../middleware/subAdminAuth.js';
const router=express.Router();


router.post("/apply", applyPromo);


// router.post("/apply",UserapplyPromo,ApplyPromo);
// // >>>>>>> 52fd14633c672ac4aea3c5f19e586923ba287965

// // Create Promo-code Show Details (Admin or Sub-Admin with promoCodes.view permission)
router.get("/show", PromoShow);

// // Create Promo-code Add Route (Admin or Sub-Admin with promoCodes.add permission)
router.post("/", PromoCreate);

// // Create Promo-code Update Route (Admin or Sub-Admin with promoCodes.edit permission)
router.put("/:id", PromoUpdate);

// //Create Promo-code Delete Route (Admin or Sub-Admin with promoCodes.delete permission)
router.delete("/:id", PromoDelete)

export default router