# Customer Bookings & Reviews API Reference

## Base URL
```
http://localhost:5000/api/v1/customer
```

## Authentication
All endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## Booking Endpoints

### Get All Bookings
**Request**
```http
GET /bookings
Authorization: Bearer TOKEN
```

**Response (200)**
```json
{
  "success": true,
  "count": 5,
  "bookings": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "hall": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Crystal Ballroom",
        "address": "123 Main St",
        "city": "Karachi",
        "images": ["url1", "url2"]
      },
      "menu": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "Premium Package",
        "items": "Biryani, Karahi...",
        "pricePerPlate": 500
      },
      "eventType": {
        "_id": "507f1f77bcf86cd799439014",
        "name": "Wedding",
        "priceModifier": 0.2
      },
      "timeSlot": {
        "_id": "507f1f77bcf86cd799439015",
        "date": "2026-06-15T00:00:00.000Z",
        "startTime": "18:00",
        "endTime": "23:00"
      },
      "functionType": "Mehndi",
      "guestCount": 200,
      "status": "confirmed",
      "basePrice": 75000,
      "menuPrice": 100000,
      "functionTypeCharge": 15000,
      "additionalCharges": [
        {
          "name": "Decoration",
          "price": 10000
        }
      ],
      "totalPrice": 200000,
      "notes": "Need extra seating for elderly guests",
      "createdAt": "2026-02-12T10:30:00.000Z",
      "updatedAt": "2026-02-12T10:30:00.000Z"
    }
  ]
}
```

**Status Codes**
- `200` - Success
- `401` - Unauthorized (invalid/missing token)
- `500` - Server error

---

### Cancel Booking
**Request**
```http
PATCH /bookings/:bookingId/cancel
Authorization: Bearer TOKEN
```

**URL Parameters**
- `bookingId` (required) - MongoDB ObjectId of the booking

**Response (200 - Success)**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "cancelled",
    "hall": { "name": "Crystal Ballroom" },
    "timeSlot": {
      "date": "2026-06-15T00:00:00.000Z"
    }
  }
}
```

**Error Responses**

400 - Invalid ID
```json
{
  "message": "Invalid booking ID"
}
```

404 - Booking not found
```json
{
  "message": "Booking not found"
}
```

403 - Ownership violation
```json
{
  "message": "You can only cancel your own bookings"
}
```

400 - Invalid status
```json
{
  "message": "Cannot cancel a booking with status: completed"
}
```

---

## Review Endpoints

### Submit Review
**Request**
```http
POST /reviews
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "hallId": "507f1f77bcf86cd799439012",
  "bookingId": "507f1f77bcf86cd799439011",
  "rating": 4,
  "comment": "Excellent venue with great amenities!"
}
```

**Request Body**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `hallId` | String | Yes | MongoDB ObjectId |
| `bookingId` | String | Yes | MongoDB ObjectId |
| `rating` | Number | Yes | Integer 1-5 |
| `comment` | String | No | Max 1000 characters |

**Response (201 - Created)**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "_id": "507f1f77bcf86cd799439016",
    "hall": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Crystal Ballroom",
      "address": "123 Main St",
      "city": "Karachi"
    },
    "customer": {
      "_id": "507f1f77bcf86cd799439001",
      "name": "Ahmad Khan"
    },
    "rating": 4,
    "comment": "Excellent venue with great amenities!",
    "createdAt": "2026-02-12T11:45:00.000Z"
  }
}
```

**Error Responses**

400 - Invalid input
```json
{
  "message": "Hall ID and rating are required"
}
```

400 - Invalid rating
```json
{
  "message": "Rating must be between 1 and 5"
}
```

404 - Hall not found
```json
{
  "message": "Hall not found"
}
```

403 - No completed booking
```json
{
  "message": "You can only review halls for which you have completed bookings"
}
```

400 - Duplicate review
```json
{
  "message": "You have already reviewed this hall"
}
```

---

### Get My Reviews
**Request**
```http
GET /reviews
Authorization: Bearer TOKEN
```

**Response (200)**
```json
{
  "success": true,
  "count": 3,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "hall": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Crystal Ballroom",
        "address": "123 Main St",
        "city": "Karachi",
        "images": ["url1", "url2"]
      },
      "customer": {
        "_id": "507f1f77bcf86cd799439001",
        "name": "Ahmad Khan"
      },
      "rating": 4,
      "comment": "Excellent venue!",
      "createdAt": "2026-02-12T11:45:00.000Z",
      "formattedDate": "February 12, 2026"
    }
  ]
}
```

**Status Codes**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### Delete Review
**Request**
```http
DELETE /reviews/:reviewId
Authorization: Bearer TOKEN
```

**URL Parameters**
- `reviewId` (required) - MongoDB ObjectId of the review

**Response (200 - Success)**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Responses**

400 - Invalid ID
```json
{
  "message": "Invalid review ID"
}
```

404 - Review not found
```json
{
  "message": "Review not found"
}
```

403 - Ownership violation
```json
{
  "message": "You can only delete your own reviews"
}
```

---

### Get Hall Reviews
**Request**
```http
GET /halls/:hallId/reviews
Authorization: Bearer TOKEN
```

**URL Parameters**
- `hallId` (required) - MongoDB ObjectId of the hall

**Response (200)**
```json
{
  "success": true,
  "hall": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Crystal Ballroom"
  },
  "totalReviews": 12,
  "averageRating": 4.5,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "hall": {
        "name": "Crystal Ballroom"
      },
      "customer": {
        "name": "Ahmad Khan"
      },
      "rating": 5,
      "comment": "Perfect for our wedding!",
      "createdAt": "2026-02-12T11:45:00.000Z",
      "formattedDate": "February 12, 2026"
    },
    {
      "_id": "507f1f77bcf86cd799439017",
      "hall": {
        "name": "Crystal Ballroom"
      },
      "customer": {
        "name": "Fatima Ali"
      },
      "rating": 4,
      "comment": "Great service, good food",
      "createdAt": "2026-02-11T15:30:00.000Z",
      "formattedDate": "February 11, 2026"
    }
  ]
}
```

---

## Example Usage with cURL

### Get all bookings
```bash
curl -X GET http://localhost:5000/api/v1/customer/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Cancel a booking
```bash
curl -X PATCH http://localhost:5000/api/v1/customer/bookings/507f1f77bcf86cd799439011/cancel \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Submit a review
```bash
curl -X POST http://localhost:5000/api/v1/customer/reviews \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "hallId": "507f1f77bcf86cd799439012",
    "bookingId": "507f1f77bcf86cd799439011",
    "rating": 5,
    "comment": "Excellent service and beautiful venue!"
  }'
```

### Get my reviews
```bash
curl -X GET http://localhost:5000/api/v1/customer/reviews \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Delete a review
```bash
curl -X DELETE http://localhost:5000/api/v1/customer/reviews/507f1f77bcf86cd799439016 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get hall reviews
```bash
curl -X GET http://localhost:5000/api/v1/customer/halls/507f1f77bcf86cd799439012/reviews \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Error Codes Reference

| Code | Meaning | Detail |
|------|---------|--------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input or request |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Currently no rate limiting. Consider implementing in production:
- 100 requests per minute per customer for booking operations
- 50 requests per minute per customer for review operations

---

## Data Validation Rules

### Rating
- Type: Integer
- Range: 1 to 5
- Required: Yes

### Comment
- Type: String
- Max length: 1000 characters
- Required: No
- Trimmed: Yes (leading/trailing whitespace removed)

### Booking Status
- Valid values: `pending`, `confirmed`, `rejected`, `cancelled`, `completed`
- Cancellable: `pending`, `confirmed` only

### Guest Count
- Type: Number
- Min: 1
- Required: Yes

---

## Constraints

### Booking Constraints
- Cannot cancel completed, rejected, or already cancelled bookings
- Time slot must exist and be marked as booked after confirmation
- Customer and hall must exist

### Review Constraints
- Cannot review without a completed booking
- One review per customer per hall (unique constraint)
- Cannot submit review if already exists
- Booking must belong to authenticated customer

---

## Success Response Format
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

## Error Response Format
```json
{
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

**Last Updated**: February 12, 2026
**API Version**: 1.0
**Status**: Production Ready
