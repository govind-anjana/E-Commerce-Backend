# Subcategory API Documentation

This document describes the endpoints for managing subcategories. Subcategories are linked to a parent Category.

## Base URL
`/api/subcategories`

## Endpoints

### 1. Get All Subcategories
Fetches all subcategories with populated parent category details.

- **URL:** `/api/subcategories`
- **Method:** `GET`
- **Auth required:** No
- **Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subcategories retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Smartphones",
      "category": {
        "_id": "60d0fe4f5311236168a109cb",
        "category": "Electronics"
      },
      "img": "https://res.cloudinary.com/..."
    }
  ]
}
```

---

### 2. Get Subcategory By ID
Fetches details of a single subcategory by its ID.

- **URL:** `/api/subcategories/:id`
- **Method:** `GET`
- **Auth required:** No
- **Access:** Public
- **URL Params:**
    - `id` (string, required): MongoDB ObjectId of the subcategory

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subcategory found",
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "Smartphones",
    "category": {
      "_id": "60d0fe4f5311236168a109cb",
      "category": "Electronics"
    },
    "img": "https://res.cloudinary.com/..."
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Subcategory not found"
}
```

---

### 3. Create Subcategory
Creates a new subcategory with an image upload. 

- **URL:** `/api/subcategories`
- **Method:** `POST`
- **Auth required:** Yes (JWT)
- **Access:** Admin (requires `verifyAdmin` middleware)
- **Content-Type:** `multipart/form-data`
- **Body Params:**
    - `name` (string, required): Name of the subcategory
    - `category` (string, required): MongoDB ObjectId of the parent category
    - `img` (file, required): Image file for the subcategory

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Subcategory created successfully",
  "data": {
    "_id": "60d0fe4f5311236168a109cd",
    "name": "Laptops",
    "category": {
      "_id": "60d0fe4f5311236168a109cc",
      "category": "Electronics"
    },
    "img": "https://res.cloudinary.com/..."
  }
}
```

**Response (400 Bad Request - Image missing):**
```json
{
  "success": false,
  "message": "Subcategory image is required"
}
```

**Response (400 Bad Request - Duplicate name):**
```json
{
  "success": false,
  "message": "Subcategory with this name already exists in the selected category"
}
```

---

### 4. Update Subcategory
Updates subcategory details or image by ID.

- **URL:** `/api/subcategories/:id`
- **Method:** `PUT`
- **Auth required:** Yes (JWT)
- **Access:** Admin (requires `verifyAdmin` middleware)
- **Content-Type:** `multipart/form-data`
- **URL Params:**
    - `id` (string, required): MongoDB ObjectId of the subcategory
- **Body Params (all optional):**
    - `name` (string, optional)
    - `category` (string, optional)
    - `img` (file, optional): New image file to replace the existing one

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subcategory updated successfully",
  "data": {
    "_id": "60d0fe4f5311236168a109cd",
    "name": "Gaming Laptops",
    "category": {
      "_id": "60d0fe4f5311236168a109cc",
      "category": "Electronics"
    },
    "img": "https://res.cloudinary.com/..."
  }
}
```

---

### 5. Delete Subcategory
Deletes a subcategory by ID.

- **URL:** `/api/subcategories/:id`
- **Method:** `DELETE`
- **Auth required:** Yes (JWT)
- **Access:** Admin (requires `verifyAdmin` middleware)
- **URL Params:**
    - `id` (string, required): MongoDB ObjectId of the subcategory

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subcategory deleted successfully"
}
```

---

## Technical Details & Validation
- **Image Uploads**: Handled via `multer` to `Cloudinary`. Middleware catches size and format errors before reaching the controller.
- **Validation**: Performed via Joi schemas (`createSubCategorySchema`, `updateSubCategorySchema`) hooked through the `validateBody` middleware.
- **Populate**: Response payloads populate the `category` field mapping it to its parent category content.
