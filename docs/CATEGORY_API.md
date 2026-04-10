# Category API Documentation

Manage product categories.

## Base URL
`/api/categories`

## Endpoints

### 1. Get All Categories
Retrieve a list of all categories.

- **URL:** `/`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "60d...1",
      "category": "Electronics",
      "createdAt": "2024-04-10T..."
    },
    {
      "_id": "60d...2",
      "category": "Clothing",
      "createdAt": "2024-04-10T..."
    }
  ]
}
```

---

### 2. Get Category By ID
Retrieve a single category by its ID.

- **URL:** `/:id`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category found",
  "data": {
    "_id": "60d...",
    "category": "Electronics"
  }
}
```

---

### 3. Add Category
Create a new category.

- **URL:** `/`
- **Method:** `POST`
- **Access:** Admin (JWT required)
- **Body Params:**
    - `category` (string, required): Name of the category (min 2 chars).

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Category added successfully",
  "data": {
    "_id": "60d...",
    "category": "Home Decor"
  }
}
```

---

### 4. Update Category
Update an existing category name.

- **URL:** `/:id`
- **Method:** `PUT`
- **Access:** Admin (JWT required)
- **Body Params:**
    - `category` (string, required): New name for the category.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "60d...",
    "category": "Kitchenware"
  }
}
```

---

### 5. Delete Category
Remove a category by its ID.

- **URL:** `/:id`
- **Method:** `DELETE`
- **Access:** Admin (JWT required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```
