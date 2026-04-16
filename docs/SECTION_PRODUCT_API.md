# Section Product API Documentation

This document describes the endpoints for assigning products to specific sections (e.g., adding products to "Trending", "Featured").

## Base URL
`/api/section-product`

## Endpoints

### 1. Get All Section Products
Retrieves all mappings of sections to their assigned products.

- **URL:** `/`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "message": "All Section Product Detail retrieved",
  "products": [
    {
      "_id": "64e3...",
      "section": "Trending",
      "products": ["prodId1", "prodId2"]
    }
  ]
}
```

---

### 2. Get Products By Section
Retrieve products corresponding to a specific section name (e.g. "Comic Style"). Returns a list of populated product details.

- **URL:** `/:section`
- **Method:** `GET`
- **Access:** Public
- **URL Params:**
    - `section` (string, required): Name of the section.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Trending products fetched successfully",
  "data": [
    {
      "_id": "prodId1",
      "name": "Cool Shirt",
      "price": 20
    }
  ]
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Section not found"
}
```

---

### 3. Add Product to Section
Assign a product ID to a specific section mapping. The section must exist in `SectionModel` first.

- **URL:** `/`
- **Method:** `POST`
- **Access:** Admin (JWT required, verified via `verifyAdmin`)
- **Body Params:**
    - `section` (string, required): Name of the section.
    - `products` (string, required): ID of the product to add.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product added successfully to section",
  "data": { ... }
}
```

---

### 4. Replace Product in Section
Swap an old product with a new product within a section mapping.

- **URL:** `/replace-product`
- **Method:** `POST`
- **Access:** Admin (JWT required, verified via `verifyAdmin`)
- **Body Params:**
    - `sectionName` (string, required): Name of the section.
    - `oldProductId` (string, required): ID of the existing product.
    - `newProductId` (string, required): ID of the new product to replace it.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product replaced successfully",
  "data": { ... }
}
```

---

### 5. Remove Product From Section
Remove a specific product ID from a section's product list.

- **URL:** `/product-remove`
- **Method:** `POST`
- **Access:** Admin (JWT required, verified via `verifyAdmin`)
- **Body Params:**
    - `section` (string, required): Name of the section.
    - `productId` (string, required): ID of the product to remove.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product removed from Trending section successfully",
  "data": { ... }
}
```
