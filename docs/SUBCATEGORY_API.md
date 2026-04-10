# Subcategory API Documentation

Manage product subcategories. Subcategories are linked to a parent Category.

## Base URL
`/api/subcategories`

## Endpoints

### 1. Get All Subcategories
Retrieve a list of all subcategories, including their parent category details.

- **URL:** `/`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subcategories retrieved successfully",
  "count": 1,
  "data": [
    {
      "_id": "60d...s1",
      "name": "Laptops",
      "category": {
        "_id": "60d...c1",
        "category": "Electronics"
      },
      "img": "https://cloudinary.com/..."
    }
  ]
}
```

---

### 2. Get Subcategory By ID
Retrieve a single subcategory by its ID.

- **URL:** `/:id`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subcategory found",
  "data": {
    "_id": "60d...s1",
    "name": "Laptops",
    "category": { ... },
    "img": "..."
  }
}
```

---

### 3. Add Subcategory
Create a new subcategory with an image.

- **URL:** `/`
- **Method:** `POST`
- **Access:** Admin (JWT required)
- **Content-Type:** `multipart/form-data`
- **Body Params:**
    - `name` (string, required): Name of the subcategory.
    - `category` (string, required): MongoDB ID of the parent Category.
    - `img` (file, required): Image file (uploaded to Cloudinary).

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Subcategory created successfully",
  "data": {
    "_id": "60d...",
    "name": "Mice",
    "category": { ... },
    "img": "https://cloudinary.com/..."
  }
}
```

---

### 4. Update Subcategory
Update subcategory details or image.

- **URL:** `/:id`
- **Method:** `PUT`
- **Access:** Admin (JWT required)
- **Content-Type:** `multipart/form-data`
- **Body Params (All Optional):**
    - `name` (string)
    - `category` (string: Category ID)
    - `img` (file: New image file)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subcategory updated successfully",
  "data": { ... }
}
```

---

### 5. Delete Subcategory
Remove a subcategory by its ID.

- **URL:** `/:id`
- **Method:** `DELETE`
- **Access:** Admin (JWT required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subcategory deleted successfully"
}
```
