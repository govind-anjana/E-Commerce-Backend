# Banner API Documentation

Manage promotional banners for the home page. Banners can optionally link to a specific Product.

## Base URL
`/api/banners`

## Endpoints

### 1. Get All Banners
Retrieve a list of all banners.

- **URL:** `/`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All banners retrieved",
  "data": [
    {
      "_id": "60d...b1",
      "img": "https://cloudinary.com/...",
      "isActive": true,
      "heading": "Summer Sale",
      "title": "50% Off on all summer wear",
      "productId": {
        "_id": "60d...p1",
        "name": "Floral Summer Dress",
        "price": 45
      }
    }
  ]
}
```

---

### 2. Add Banner
Upload a new banner.

- **URL:** `/`
- **Method:** `POST`
- **Access:** Admin (JWT required)
- **Content-Type:** `multipart/form-data`
- **Body Params:**
    - `img` (file, required): Banner image.
    - `heading` (string, optional): Large text on banner.
    - `title` (string, optional): Smaller description text.
    - `isActive` (boolean/string, optional): Default is `true`.
    - `productId` (string, optional): ID of a product to link to.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Banner uploaded successfully!",
  "data": { ... }
}
```

---

### 3. Update Banner
Update existing banner details.

- **URL:** `/:id`
- **Method:** `PUT`
- **Access:** Admin (JWT required)
- **Content-Type:** `multipart/form-data`
- **Body Params (All Optional):**
    - `img`, `heading`, `title`, `isActive`, `productId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Banner updated successfully!",
  "data": { ... }
}
```

---

### 4. Delete Banner
Remove a banner by its ID.

- **URL:** `/:id`
- **Method:** `DELETE`
- **Access:** Admin (JWT required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Banner deleted successfully"
}
```
