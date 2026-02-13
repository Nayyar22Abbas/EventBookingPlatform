# Customer Bookings & Reviews Feature Documentation

## Overview
Complete implementation of customer booking management and review system for the Event Booking Platform. This feature allows customers to:
- View all their bookings with detailed information
- Track booking status changes
- Cancel pending bookings
- Submit reviews for completed events
- View their submitted reviews and delete them
- See reviews on hall details pages

## Implementation Summary

### Backend Implementation

#### 1. **Models** (Already Existed)
- **Review.js**: MongoDB schema for reviews with fields: hall, customer, rating (1-5), comment, createdAt
- **Booking.js**: Updated with complete pricing breakdown fields

#### 2. **Controllers** (customerController.js)
Added three new methods:

**`cancelBooking(bookingId)`**
- Route: `PATCH /api/v1/customer/bookings/:id/cancel`
- Validates booking ownership
- Only allows cancellation of 'pending' or 'confirmed' status
- Updates booking status to 'cancelled' and releases time slot
- Response includes updated booking details

**`getMyReviews()`**
- Route: `GET /api/v1/customer/reviews`
- Fetches all reviews submitted by logged-in customer
- Populates hall information (name, address, city, images)
- Returns array of reviews sorted by creation date (newest first)

**`deleteReview(reviewId)`**
- Route: `DELETE /api/v1/customer/reviews/:id`
- Validates review ownership
- Only customer who submitted the review can delete it
- Soft delete via findByIdAndDelete

#### 3. **Routes** (customerRoutes.js)
Added three new protected routes:
```javascript
PATCH /api/v1/customer/bookings/:id/cancel  // Cancel booking
GET   /api/v1/customer/reviews               // Get my reviews
DELETE /api/v1/customer/reviews/:id          // Delete review
```

### Frontend Implementation

#### 1. **API Layer** (api/customerApi.js)
New methods:
- `getBookings()` - Fetch all customer bookings
- `cancelBooking(bookingId)` - Cancel a pending booking
- `submitReview(hallId, bookingId, rating, comment)` - Submit a review
- `getMyReviews()` - Fetch customer's reviews
- `deleteReview(reviewId)` - Delete a submitted review
- `getHallReviews(hallId)` - Get all reviews for a specific hall

#### 2. **Components**

**CustomerBookingsPage.jsx** (`pages/CustomerBookingsPage.jsx`)
- Main booking management interface
- Features:
  - Displays all user bookings in grid layout (responsive)
  - Status badges with color coding (pending/confirmed/cancelled/completed)
  - Quick info: date, time, guests, event type
  - Expandable details showing:
    - Menu information
    - Price breakdown (base, menu, function type charges)
    - Additional charges
    - Total amount
    - Notes
  - Action buttons:
    - Show/Hide Details toggle
    - Cancel Booking (only for pending/confirmed)
    - Leave Review (only for completed)
  - Cancel confirmation modal with double-check
  - Empty state with link to search halls
  - Loading spinner
  - Error handling

**SubmitReviewModal.jsx** (`features/customer/SubmitReviewModal.jsx`)
- Modal for submitting reviews after booking completion
- Features:
  - Displays booking event information
  - Star rating (1-5) with hover preview
  - Rating label display (Poor/Fair/Good/Very Good/Excellent)
  - Optional comment textarea (max 1000 characters)
  - Character counter
  - Form validation (rating required)
  - Submit button disabled until rating selected
  - Error handling
  - Loading state during submission
  - Success callback to refresh bookings list

**MyReviewsPage.jsx** (`features/customer/MyReviewsPage.jsx`)
- Customer's review management interface
- Features:
  - Displays all submitted reviews in grid
  - For each review shows:
    - Hall name and location (address, city)
    - Star rating with visual stars
    - Comment text (if available)
    - Submission date
  - Delete button for each review
  - Delete confirmation modal
  - Empty state with link to bookings
  - Loading spinner
  - Error handling
  - Responsive grid layout

**HallDetailsPage.jsx** (Updated)
- Added reviews section showing:
  - Average rating with star display
  - Total number of reviews
  - Top 5 recent reviews
  - Customer name, rating, comment, date for each
  - "View all reviews" button if more than 5 reviews
  - Reviews fetch integrated with hall details fetch

#### 3. **Routes** (App.jsx - already configured)
- `/customer/bookings` → CustomerBookingsPage
- `/customer/reviews` → MyReviewsPage (maps to CustomerReviewsPage)
- `/customer/halls/:id` → HallDetailsPage (includes reviews section)

### Security Measures Implemented

#### Backend Security
1. **Authentication**: All customer routes protected with JWT middleware
2. **Authorization**: Role check ensures only 'customer' role users access endpoints
3. **Ownership Validation**:
   - Can only cancel own bookings
   - Can only delete own reviews
   - Can only view own bookings/reviews
4. **Business Logic Validation**:
   - Can only submit review for completed bookings
   - Prevents duplicate reviews (unique index on hall+customer)
   - Rating validation (1-5 only)
   - Cannot cancel non-pending/confirmed bookings
5. **Data Validation**: Input validation on all fields

#### Frontend Security
1. **Protected Routes**: All customer pages behind ProtectedRoute component
2. **Token Management**: Token stored in localStorage, included in all API requests
3. **Error Handling**: User feedback for auth failures
4. **UI Controls**: Buttons only shown for valid actions based on status

### User Experience Features

#### Booking Management
- **Status Tracking**: Visual badges indicate booking status
  - Pending: Yellow (⏳)
  - Confirmed: Green (✓)
  - Cancelled: Red (✕)
  - Completed: Blue (🎉)
- **Price Breakdown**: Expandable details show itemized pricing
- **Responsive Design**: Works on mobile, tablet, desktop
- **Animations**: Smooth Framer Motion transitions and interactions
- **Confirmation Dialogs**: Double-check before destructive actions
- **Empty States**: Helpful messages when no bookings exist

#### Review Submission
- **Easy Rating**: Interactive star rating with visual feedback
- **Optional Comments**: Extended feedback for venue improvements
- **Validation Feedback**: Clear error messages for invalid input
- **Character Limit**: Shows current/max character count
- **Loading States**: Spinner indicates submission in progress
- **Success Feedback**: Modal callback to refresh list

#### Review Management
- **View History**: See all submitted reviews in one place
- **Easy Deletion**: Simple delete button with confirmation
- **Detailed Info**: Shows venue details with reviews
- **Date Context**: Displays review submission date
- **Responsive Grid**: Adapts to screen size

### API Testing Examples

#### Cancel Booking
```bash
curl -X PATCH http://localhost:5000/api/v1/customer/bookings/123/cancel \
  -H "Authorization: Bearer TOKEN"
```

#### Submit Review
```bash
curl -X POST http://localhost:5000/api/v1/customer/reviews \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hallId": "123",
    "bookingId": "456",
    "rating": 4,
    "comment": "Great venue, excellent service!"
  }'
```

#### Get My Reviews
```bash
curl -X GET http://localhost:5000/api/v1/customer/reviews \
  -H "Authorization: Bearer TOKEN"
```

#### Delete Review
```bash
curl -X DELETE http://localhost:5000/api/v1/customer/reviews/789 \
  -H "Authorization: Bearer TOKEN"
```

### Database Schema

#### Review Document
```javascript
{
  _id: ObjectId,
  hall: ObjectId (ref: Hall),
  customer: ObjectId (ref: User),
  rating: Number (1-5),
  comment: String (max 1000),
  createdAt: Date,
  formattedDate: String (virtual)
}
```

#### Booking Document (Fields Used)
```javascript
{
  _id: ObjectId,
  hall: ObjectId (ref: Hall),
  customer: ObjectId (ref: User),
  functionType: String,
  guestCount: Number,
  status: String (pending|confirmed|rejected|cancelled|completed),
  basePrice: Number,
  menuPrice: Number,
  functionTypeCharge: Number,
  additionalCharges: Array,
  totalPrice: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Styling & Theme

All components follow the established design system:
- **Dark gradient**: `from-slate-900 via-slate-800 to-slate-900`
- **Gold accent**: `#bfa544`, `#ffd700`
- **Burgundy**: `#7a2222`
- **Glassmorphism**: `backdrop-blur-xl`, `border-white/10`
- **Animation**: Framer Motion with consistent timing
- **Responsive**: Mobile-first design, md/lg breakpoints

### Testing Checklist

- [ ] Cancel a pending booking successfully
- [ ] Try canceling a completed booking (should fail)
- [ ] Submit a review with rating and comment
- [ ] Submit a review with only rating
- [ ] Try submitting a duplicate review (should fail)
- [ ] View all submitted reviews
- [ ] Delete a submitted review
- [ ] Verify deleted review is removed from list
- [ ] View reviews on hall details page
- [ ] Verify star ratings display correctly
- [ ] Check responsive design on mobile/tablet/desktop
- [ ] Verify loading spinners appear
- [ ] Test error handling with invalid inputs
- [ ] Confirm modals appear for destructive actions
- [ ] Test JWT token validation

### Future Enhancements

1. **Advanced Analytics**
   - Rating distribution chart
   - Review sentiment analysis
   - Top-rated halls dashboard

2. **Review Features**
   - Review images/videos
   - Review moderation/approval
   - Review helpful voting
   - Review filtering/sorting
   - Reply to reviews by hall owners

3. **Booking Enhancements**
   - Booking status history
   - Booking details PDF export
   - Booking modification/rescheduling
   - Booking payment status tracking
   - Estimated profit calculation

4. **Notifications**
   - Email notifications on booking status changes
   - Review submission confirmations
   - New review on your venue alerts

5. **Performance**
   - Pagination for large booking/review lists
   - Caching of review data
   - Lazy loading for images in reviews

## Deployment Considerations

1. **Environment Variables**: Ensure JWT_SECRET and API_URL are set
2. **CORS**: Update CORS settings if frontend and backend on different domains
3. **Database**: MongoDB connection string must be valid
4. **Email**: Set up email service for notifications (future)
5. **File Storage**: Configure if review images are added (future)

## Support

For issues or questions regarding this feature implementation, refer to specific error messages and logs. The system provides comprehensive error handling and user feedback.
