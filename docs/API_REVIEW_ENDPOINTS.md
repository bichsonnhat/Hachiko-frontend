# Review API Endpoints

This document outlines the required API endpoints for the review system.

## Required Endpoints

### 1. Get Product Reviews
**Endpoint:** `GET /reviews/product/{productId}?userId={userId}`

**Description:** Get all reviews for a specific product, including the current user's review if exists.

**Parameters:**
- `productId` (path): The ID of the product
- `userId` (query): The ID of the current user to check if they have reviewed this product

**Response:**
```json
{
  "reviews": [
    {
      "id": "review123",
      "userId": "user456",
      "productId": "product789",
      "userName": "Nguyễn Văn A",
      "userAvatar": "https://example.com/avatar.jpg",
      "rating": 5,
      "comment": "Sản phẩm rất ngon!",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 10,
  "userReview": {
    "id": "review456",
    "userId": "user123",
    "productId": "product789",
    "rating": 4,
    "comment": "Khá ngon nhưng hơi ngọt",
    "createdAt": "2024-01-10T14:20:00Z"
  }
}
```

### 2. Create Review
**Endpoint:** `POST /reviews`

**Description:** Create a new review for a product.

**Request Body:**
```json
{
  "userId": "user123",
  "productId": "product789",
  "rating": 5,
  "comment": "Sản phẩm rất ngon và chất lượng!"
}
```

**Response:**
```json
{
  "id": "review123",
  "userId": "user123",
  "productId": "product789",
  "rating": 5,
  "comment": "Sản phẩm rất ngon và chất lượng!",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### 3. Update Review
**Endpoint:** `PUT /reviews/{reviewId}`

**Description:** Update an existing review.

**Parameters:**
- `reviewId` (path): The ID of the review to update

**Request Body:**
```json
{
  "userId": "user123",
  "productId": "product789",
  "rating": 4,
  "comment": "Cập nhật: Sản phẩm khá ngon nhưng hơi ngọt"
}
```

**Response:**
```json
{
  "id": "review123",
  "userId": "user123",
  "productId": "product789",
  "rating": 4,
  "comment": "Cập nhật: Sản phẩm khá ngon nhưng hơi ngọt",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-16T09:15:00Z"
}
```

### 4. Delete Review (Optional)
**Endpoint:** `DELETE /reviews/{reviewId}`

**Description:** Delete a review.

**Parameters:**
- `reviewId` (path): The ID of the review to delete

**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

## Business Rules

1. **One Review Per User Per Product:** Each user can only submit one review per product.
2. **Rating Range:** Rating must be between 1 and 5 stars.
3. **Comment Required:** Users must provide a comment when submitting a review.
4. **User Ownership:** Users can only update/delete their own reviews.
5. **Average Rating Calculation:** The system should calculate and return the average rating for each product.

## Database Schema Suggestions

### Reviews Table
```sql
CREATE TABLE reviews (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_product (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Indexes
```sql
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Rating must be between 1 and 5"
}
```

**403 Forbidden:**
```json
{
  "error": "You can only update your own reviews"
}
```

**404 Not Found:**
```json
{
  "error": "Review not found"
}
```

**409 Conflict:**
```json
{
  "error": "You have already reviewed this product"
}
```

## Implementation Notes

1. Consider implementing pagination for products with many reviews
2. Add input validation and sanitization for comments
3. Implement rate limiting to prevent spam reviews
4. Consider adding moderation features for inappropriate content
5. Add caching for frequently accessed review data