# API Documentation - Super IDE

## Base URL
```
http://localhost:3000/api
```

## Health Check

### GET /health
Check if server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Super IDE Server is running",
  "version": "1.0.0"
}
```

---

## Editor APIs

### POST /editor/save
Save code file.

**Body:**
```json
{
  "filename": "index.html",
  "content": "<h1>Hello</h1>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم حفظ الملف",
  "file": {
    "id": "uuid",
    "filename": "index.html",
    "size": 15,
    "saved_at": "2026-09-04T12:00:00Z"
  }
}
```

### POST /editor/load
Load code file.

**Body:**
```json
{
  "filename": "index.html"
}
```

**Response:**
```json
{
  "success": true,
  "filename": "index.html",
  "content": "<h1>Hello</h1>"
}
```

### POST /editor/execute
Execute code.

**Body:**
```json
{
  "code": "console.log('Hello');",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "output": "تم تنفيذ الأكواد بنجاح",
  "language": "javascript",
  "executed_at": "2026-09-04T12:00:00Z"
}
```

---

## Game Engine APIs

### POST /game/create
Create new game.

**Body:**
```json
{
  "name": "My Game",
  "width": 800,
  "height": 600
}
```

**Response:**
```json
{
  "success": true,
  "game": {
    "id": "uuid",
    "name": "My Game",
    "width": 800,
    "height": 600,
    "created_at": "2026-09-04T12:00:00Z"
  }
}
```

### GET /game/:id
Get game details.

**Response:**
```json
{
  "success": true,
  "game": {
    "id": "uuid",
    "name": "My Game",
    "width": 800,
    "height": 600,
    "status": "running"
  }
}
```

---

## File Manager APIs

### POST /files/upload
Upload file.

**Content-Type:** multipart/form-data

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "uuid",
    "filename": "image.png",
    "size": 102400,
    "type": "image/png",
    "uploaded_at": "2026-09-04T12:00:00Z"
  }
}
```

### GET /files/list
List all files.

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "name": "index.html",
      "size": 1024,
      "type": "file"
    },
    {
      "name": "assets",
      "size": 0,
      "type": "folder"
    }
  ]
}
```

---

## Web Scraper APIs

### POST /scraper/fetch
Fetch data from URL.

**Body:**
```json
{
  "url": "https://example.com",
  "selector": ".class-name"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "data": ["item1", "item2"],
  "fetched_at": "2026-09-04T12:00:00Z"
}
```

### POST /scraper/extract
Extract specific data from HTML.

**Body:**
```json
{
  "html": "<html>...</html>",
  "type": "emails"
}
```

**Types:** emails, links, images

**Response:**
```json
{
  "success": true,
  "type": "emails",
  "count": 5,
  "data": ["email@example.com"]
}
```

---

## Authentication APIs

### POST /auth/login
User login.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST /auth/register
User registration.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Filename and content required"
}
```

### 404 Not Found
```json
{
  "error": "Not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error",
  "message": "Error details here"
}
```

---

## Rate Limiting
- **Limit:** 100 requests per 15 minutes
- **Headers:** `X-RateLimit-*`

---

## CORS
All requests support CORS. Frontend can make requests from any origin.
