# Promo Code API Documentation

Manage promotional codes for the application. Promo codes can offer a universal discount or be restricted to a specific product or subcategory.

## Base URL
`/api/promo` *(or however it is mounted in `index.js`, typically `/api/promo` or `/api/promocodes`)*

## Endpoints

### 1. Get All Promo Codes
Retrieve a list of all promotional codes.

- **URL:** `/show`
- **Method:** `GET`
- **Access:** Admin / Sub-Admin

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All promo codes retrieved",
  "promo": [
    {
      "_id": "60d...p1",
      "code": "SUMMER50",
      "discountValue": 50,
      "startDate": "2023-06-01T00:00:00.000Z",
      "expiryDate": "2023-06-30T00:00:00.000Z",
      "usageLimit": 100,
      "usedCount": 5,
      "usedBy": ["user@example.com"],
      "isActive": true,
      "applicableSubCategory": null,
      "applicableProduct": null
    }
  ]
}
```

---

### 2. Create Promo Code
Create a new promotional code. Note that a promo code can only be applied to *either* a subcategory or a product, but not both at once.

- **URL:** `/`
- **Method:** `POST`
- **Access:** Admin / Sub-Admin
- **Content-Type:** `application/json`
- **Body Params:**
    - `code` (string, required): The unique promo code string.
    - `discountValue` (number, required): The value of the discount.
    - `startDate` (datetime, optional): Defaults to the current time if not provided.
    - `expiryDate` (datetime, required): Expiration time/date for the code.
    - `usageLimit` (number, optional): Maximum amount of times the code can be utilized globally.
    - `applicableSubCategory` (ObjectId string, optional): Limit promo to a specific SubCategory.
    - `applicableProduct` (ObjectId string, optional): Limit promo to a specific Product.

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Promo created successfully",
  "promo": { 
    // PromoCode Object
  }
}
```

---

### 3. Update Promo Code
Update existing promo code details. Providing `applicableCategory` or `applicableProduct` automatically resets the counterpart to `null` to ensure rule consistency.

- **URL:** `/:id`
- **Method:** `PUT`
- **Access:** Admin / Sub-Admin
- **Content-Type:** `application/json`
- **Body Params (All Optional):**
    - `code` (string)
    - `discountValue` (number)
    - `usageLimit` (number)
    - `startDate` (datetime)
    - `expiryDate` (datetime)
    - `applicableSubCategory` (ObjectId string) - *Updates applicable SubCategory or sets to null*
    - `applicableProduct` (ObjectId string) - *Updates applicable Product or sets to null*

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Promo updated successfully",
  "promo": {
     // Updated PromoCode Object
  }
}
```

---

### 4. Delete Promo Code
Remove a promo code entirely by its ID.

- **URL:** `/:id`
- **Method:** `DELETE`
- **Access:** Admin / Sub-Admin

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Promo deleted successfully"
}
```

---

### 5. Apply Promo Code (Note: Currently disabled/commented out in routes)
Apply a promo code to evaluate if it's valid for a user/product layout.

- **URL:** `/apply`
- **Method:** `POST`
- **Access:** Authenticated Users
- **Content-Type:** `application/json`
- **Body Params:**
    - `code` (string, required): Promo code string.
    - `productId` (ObjectId string, optional): Needed if promo targets product.
    - `subCategoryId` (ObjectId string, optional): Needed if promo targets subcategory.
    - `userEmail` (string, required): Used to track `usedBy`.

**Response (200 OK):**
```json
{
  "success": true,
  "discount": 50,
  "message": "Promo applied successfully"
}
```
