# Product API Documentation

Manage e-commerce products. Products are linked to a Category and a Subcategory.

## Base URL
`/api/products`

## Endpoints

### 1. Get All Products
Retrieve a list of all products with populated relations.

- **URL:** `/`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "count": 5,
  "data": [
    {
      "_id": "60d...p1",
      "name": "Gaming Laptop Pro",
      "price": 1200,
      "originalPrice": 1500,
      "quantity": 10,
      "rating": 4.5,
      "category": { "category": "Electronics" },
      "subCategory": { "name": "Laptops" },
      "img": ["url1", "url2"],
      "sizes": [{ "size": "15 inch", "stock": 5 }]
    }
  ]
}
```

---

### 2. Get Product By ID
Retrieve a single product by its ID.

- **URL:** `/:id`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product found",
  "data": { ... }
}
```

---

### 3. Add Product
Create a new product with multiple images.

- **URL:** `/`
- **Method:** `POST`
- **Access:** Admin (JWT required)
- **Content-Type:** `multipart/form-data`
- **Body Params:**
    - `name` (string, required)
    - `price` (number, required)
    - `originalPrice` (number, optional)
    - `quantity` (number, required)
    - `category` (string: Category ID, required)
    - `subCategory` (string: Subcategory ID, required)
    - `productDetails` (string, optional)
    - `productDescription` (string, optional)
    - `sizes` (JSON string, optional): e.g., `'[{"size":"XL","stock":10}]'`
    - `img` (files, required): Up to 4 image files.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { ... }
}
```

---

### 4. Update Product
Update product details or replace images.

- **URL:** `/:id`
- **Method:** `PUT`
- **Access:** Admin (JWT required)
- **Content-Type:** `multipart/form-data`
- **Body Params (All Optional):**
    - `name`, `price`, `quantity`, `category`, `subCategory`, etc.
    - `img` (files): If provided, these will **replace** existing images.
    - `sizes` (JSON string)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

---

### 5. Delete Product
Remove a product by its ID.

- **URL:** `/:id`
- **Method:** `DELETE`
- **Access:** Admin (JWT required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```
