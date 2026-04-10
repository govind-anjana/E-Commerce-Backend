# Authentication API Documentation

This document describes the User Authentication flow and endpoints.

## Base URL
`/api/userauth`

## Endpoints

### 1. User Signup (Initiate)
Starts the registration process by sending OTPs.

- **URL:** `/api/userauth/signup`
- **Method:** `POST`
- **Auth required:** No
- **Rate Limit:** 10 attempts per hour (IP-based)
- **Body Params:**
    - `username` (string, required): 3-30 chars
    - `email` (string, required): Valid email
    - `phone` (string, required): 10-15 digits
    - `password` (string, required): Min 6 chars

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent to your email and phone. It will expire in 5 minutes.",
  "emailOtp": "123456",
  "phoneOtp": "654321"
}
```

---

### 2. Verify OTP (Complete Registration)
Verifies the OTPs and creates the user in the database.

- **URL:** `/api/userauth/verify-otp`
- **Method:** `POST`
- **Auth required:** No
- **Rate Limit:** 3 attempts per 5 minutes
- **Body Params:**
    - `email` (string, required)
    - `phone` (string, required)
    - `emailOtp` (string, required)
    - `phoneOtp` (string, required)

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully, please login"
}
```

---

### 3. User Login
Authenticates user and returns a JWT token.

- **URL:** `/api/userauth/login`
- **Method:** `POST`
- **Auth required:** No
- **Rate Limit:** 5 attempts per 15 minutes
- **Body Params:**
    - `email` (string, required)
    - `password` (string, required)

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "USER_ID",
    "username": "example",
    "email": "user@example.com"
  }
}
```

---

## Security Notes
- **Passwords**: All passwords are hashed using `Bcrypt` with 10 rounds before being saved to MongoDB.
- **Tokens**: JWTs are signed with a secret key and expire in 1 day.
- **Rate Limiting**: Implemented on all authentication endpoints to prevent brute-force attacks.
- **Input Validation**: All inputs are validated using `Joi` schemas.
