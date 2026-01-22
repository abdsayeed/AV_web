# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-22T10:30:00.000Z",
  "uptime": 3600
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

### GET /auth/profile
Get current user profile. (Protected)

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-22T10:30:00.000Z"
  }
}
```

### POST /auth/logout
Logout current user.

**Response:**
```json
{
  "message": "Logout successful"
}
```

---

## Contact Endpoints

### POST /contact
Submit a contact form.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "company": "Example Corp",
  "message": "I'm interested in your services...",
  "services": ["Web Development", "SEO"],
  "budget": "$5,000 - $10,000"
}
```

**Response:**
```json
{
  "message": "Contact form submitted successfully",
  "id": "contact-submission-id"
}
```

### GET /contact
Get all contact submissions. (Admin only)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (new, contacted, closed)

**Response:**
```json
{
  "contacts": [
    {
      "id": "contact-id",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "company": "Example Corp",
      "message": "I'm interested in your services...",
      "services": ["Web Development", "SEO"],
      "budget": "$5,000 - $10,000",
      "status": "new",
      "createdAt": "2024-01-22T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### PATCH /contact/:id/status
Update contact submission status. (Admin only)

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Response:**
```json
{
  "message": "Status updated successfully",
  "contact": {
    "id": "contact-id",
    "status": "contacted",
    "updatedAt": "2024-01-22T10:35:00.000Z"
  }
}
```

---

## Services Endpoints

### GET /services
Get all active services.

**Response:**
```json
{
  "services": [
    {
      "id": "service-id",
      "name": "Web Development",
      "description": "Custom web development services...",
      "price": 2500,
      "features": [
        "Responsive Design",
        "SEO Optimized",
        "Fast Loading"
      ],
      "category": "Development",
      "order": 1,
      "active": true
    }
  ]
}
```

### GET /services/:id
Get a specific service by ID.

**Response:**
```json
{
  "service": {
    "id": "service-id",
    "name": "Web Development",
    "description": "Custom web development services...",
    "price": 2500,
    "features": [
      "Responsive Design",
      "SEO Optimized",
      "Fast Loading"
    ],
    "category": "Development",
    "order": 1,
    "active": true
  }
}
```

### POST /services
Create a new service. (Admin only)

**Request Body:**
```json
{
  "name": "SEO Optimization",
  "description": "Comprehensive SEO services...",
  "price": 1500,
  "features": [
    "Keyword Research",
    "On-page SEO",
    "Link Building"
  ],
  "category": "Marketing",
  "order": 2,
  "active": true
}
```

**Response:**
```json
{
  "message": "Service created successfully",
  "service": {
    "id": "new-service-id",
    "name": "SEO Optimization",
    "description": "Comprehensive SEO services...",
    "price": 1500,
    "features": [
      "Keyword Research",
      "On-page SEO",
      "Link Building"
    ],
    "category": "Marketing",
    "order": 2,
    "active": true,
    "createdAt": "2024-01-22T10:30:00.000Z"
  }
}
```

### PUT /services/:id
Update an existing service. (Admin only)

**Request Body:**
```json
{
  "name": "Advanced SEO Optimization",
  "price": 2000,
  "features": [
    "Keyword Research",
    "On-page SEO",
    "Link Building",
    "Technical SEO"
  ]
}
```

**Response:**
```json
{
  "message": "Service updated successfully",
  "service": {
    "id": "service-id",
    "name": "Advanced SEO Optimization",
    "price": 2000,
    "updatedAt": "2024-01-22T10:35:00.000Z"
  }
}
```

### DELETE /services/:id
Delete a service. (Admin only)

**Response:**
```json
{
  "message": "Service deleted successfully"
}
```

### GET /services/admin/all
Get all services including inactive ones. (Admin only)

**Response:**
```json
{
  "services": [
    {
      "id": "service-id",
      "name": "Web Development",
      "active": true
    },
    {
      "id": "service-id-2",
      "name": "Old Service",
      "active": false
    }
  ]
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

The API implements rate limiting:
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response**: 429 Too Many Requests

```json
{
  "message": "Too many requests from this IP, please try again later."
}
```