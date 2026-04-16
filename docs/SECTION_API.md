# Section API Documentation

This document describes the endpoints for managing sections (e.g., promotional or thematic categories).

## Base URL
`/api/sections`

## Endpoints

### 1. Get All Sections
Retrieve a list of all sections.

- **URL:** `/`
- **Method:** `GET`
- **Access:** Public

**Response (200 OK):**
```json
{
  "message": "All Section Detail retrieved",
  "products": [
    {
      "_id": "64d2...",
      "section": "Featured"
    }
  ]
}
```

---

### 2. Add Section
Create a new section name.

- **URL:** `/`
- **Method:** `POST`
- **Access:** Admin (JWT required, verified via `verifyAdmin`)
- **Body Params:**
    - `section` (string, required): Name of the section (e.g., "Trending").

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Section added successfully!"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "section already exists"
}
```

---

### 3. Update Section
Update an existing section's name. This will also update the section name inside any related `SectionProModel` documents.

- **URL:** `/:id`
- **Method:** `PUT`
- **Access:** Admin (JWT required, verified via `verifyAdmin`)
- **URL Params:**
    - `id` (string, required): MongoDB ID of the section.
- **Body Params:**
    - `section` (string, required): New name for the section.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Section updated successfully in both collections!",
  "data": {
    "_id": "64d2...",
    "section": "New Featured Name"
  }
}
```

---

### 4. Delete Section
Delete a section by its ID. This will also delete any associated products mapping in the `SectionProModel`.

- **URL:** `/:id`
- **Method:** `DELETE`
- **Access:** Admin (JWT required, verified via `verifyAdmin`)
- **URL Params:**
    - `id` (string, required): MongoDB ID of the section.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Section 'Trending' and its related SectionPro deleted successfully!"
}
```
