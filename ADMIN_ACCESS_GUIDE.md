# Admin Dashboard Access Guide

## Overview
Your Event Booking Platform now has a complete admin dashboard for managing the platform. Here's how to access and use it.

---

## 📍 How to Access the Admin Dashboard

### Method 1: Direct URL
If you have admin credentials, you can:

1. **Login at**: `http://localhost:5173/auth/login` (or your frontend port)
2. **Enter your admin email and password** 
3. You'll be **automatically redirected to** `/admin/dashboard`

**OR** directly visit: `http://localhost:5173/admin/dashboard`

### Method 2: Create an Admin Account (Direct Database)

Since admin account creation is not typically exposed in the UI, you can create one directly:

```javascript
// Use Mongo Shell or MongoDB Atlas UI
db.users.insertOne({
  name: "Admin User",
  email: "admin@eventbooking.com",
  password: "hashed_password_here", // Use bcrypt
  role: "admin",
  isEmailVerified: true,
  isApproved: true,
  accountStatus: "active",
  googleId: null,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Or use the Node.js approach** in MongoDB:

```bash
# Connect to MongoDB
mongo
# Switch to your database
use eventbooking
# Create admin user (password will be hashed by pre-save hook)
db.users.create({
  name: "Admin",
  email: "admin@event.com",
  password: "AdminPassword123",
  role: "admin",
  isEmailVerified: true,
  isApproved: true,
  accountStatus: "active"
})
```

### Method 3: Using Google OAuth (If Setup)

1. Click **"Continue with Google"** on login page
2. You'll see a modal to select **"Booking Customer"** or **"Hall Owner"**
3. After login, you'll be directed to role selection page
4. Contact platform admin to upgrade your account to admin role via database

---

## 🎯 Admin Dashboard Features

### 1. **Admin Dashboard** (`/admin/dashboard`)
Main overview of your platform:
- Key statistics (total halls, bookings, users)
- System health indicators
- Quick action buttons

### 2. **Pending Hall Owners** (`/admin/pending-hall-owners`)
Manage hall owner approvals:
- View pending hall owner applications
- Review their profiles
- Approve or reject applications
- Set account status (active, suspended, pending)

### 3. **Halls Management** (`/admin/halls`)
Oversee all halls on the platform:
- View all registered halls
- See hall details and current status
- Monitor pricing and capacity
- Take down halls if necessary
- View hall owner information

### 4. **Enquiries** (`/admin/enquiries`)
Handle customer inquiries and support:
- View all customer enquiries
- Mark enquiries as resolved
- Send responses on behalf of support team
- Track unresolved issues

---

## 🔐 Role-Based Access Control

The system has **3 main roles**:

### 1. **Customer** 👤
- Access: `/customer/*`
- Permissions:
  - Search and browse halls
  - Make bookings
  - View booked events
  - Submit reviews
  - Manage profile

### 2. **Hall Owner** 🏢
- Access: `/hall-owner/*`
- Permissions:
  - Create and manage halls
  - Set menus and pricing
  - Create time slots
  - View bookings
  - Manage event types
  - View reviews and ratings

### 3. **Admin** 👨‍💼
- Access: `/admin/*`
- Permissions:
  - View all halls on platform
  - Approve/reject hall owners
  - Manage user accounts
  - View system enquiries
  - Monitor platform statistics
  - Suspend/activate accounts

---

## 🚀 Role Selection After Google Login

**NEW FEATURE**: When users login with Google, they now see a role selection screen:

### Customer Role
- 🛒 Search and book event halls
- ⭐ Submit reviews
- 📅 View booking history
- 💳 Manage bookings

### Hall Owner Role  
- 🏛️ List your event halls
- 💰 Set pricing and menus
- 📋 Manage time slots
- 📊 View bookings for your halls

---

## 📋 Admin Routes Reference

| Route | Purpose | Role |
|-------|---------|------|
| `/admin/dashboard` | Main admin overview | admin |
| `/admin/pending-hall-owners` | Approve hall owners | admin |
| `/admin/halls` | View all halls | admin |
| `/admin/enquiries` | Handle support tickets | admin |

---

## 🔧 Technical Setup for Admin Access

### Backend Configuration
1. Admin role is configured in [User Model](../server/src/models/User.js):
   ```javascript
   role: {
     type: String,
     enum: ['admin', 'hall_owner', 'customer'],
     default: 'customer'
   }
   ```

2. Admin routes are protected by [ProtectedRoute](../client/src/routes/ProtectedRoute.jsx):
   ```javascript
   <Route
     path="/admin/*"
     element={
       <ProtectedRoute allowedRoles={['admin']}>
         {/* Admin components */}
       </ProtectedRoute>
     }
   />
   ```

### Frontend Configuration
1. [AdminLayout](../client/src/layouts/AdminLayout.jsx) - Navigation and layout
2. [Admin Pages](../client/src/pages/):
   - AdminDashboardPage.jsx
   - AdminPendingHallOwnersPage.jsx
   - AdminHallsPage.jsx
   - AdminEnquiriesPage.jsx

---

## 📊 Admin Dashboard Modules

### Dashboard Overview
Shows:
- Total hall registrations
- Pending approvals
- Active bookings
- Platform revenue
- User growth chart
- Recent activities

### Hall Owner Approval System
- View pending applications
- Check hall owner details
- Review business documents
- Approve with conditions
- Send approval/rejection emails
- Track approval history

### Halls Management
- Search halls by location, capacity, price
- View full hall details
- Check booking history
- Monitor hall performance
- Suspend/remove problematic halls
- View hall owner contact info

### Enquiries & Support
- Track all customer inquiries
- Categorize by type
- Assign to support team
- Track resolution time
- Send bulk responses
- Maintain inquiry history

---

## 🔄 Google OAuth with Role Selection (NEW)

The new role selection feature works as follows:

1. **Step 1**: User clicks "Continue with Google"
2. **Step 2**: Modal appears asking to select role
   - 👤 Booking Customer
   - 🏢 Hall Owner
3. **Step 3**: Backend authenticates with Google
4. **Step 4**: User is marked for role selection
5. **Step 5**: Frontend shows role selection page
6. **Step 6**: User selects final role
7. **Step 7**: Backend updates user role via `/auth/update-role`
8. **Step 8**: User redirected to appropriate dashboard

---

## 🆘 Troubleshooting Admin Access

### "Access Denied" Error
- **Cause**: User role is not 'admin'
- **Solution**: Update role in database to 'admin'

### Can't See Admin Dashboard
- **Cause**: Not logged in or session expired
- **Solution**: Login again with admin credentials

### Role Selection Not Showing
- **Cause**: User logged in before with non-admin role
- **Solution**: Logout and login again with Google

### Admin Features Not Loading
- **Cause**: Backend API issues
- **Solution**: 
  1. Check server is running on port 5000
  2. Check MongoDB connection
  3. Verify JWT token in browser dev tools

---

## 📞 Support & Questions

For detailed information on specific admin features, check:
- Admin component files in `/client/src/pages/Admin*Page.jsx`
- Admin routes in `/server/src/routes/adminRoutes.js`
- Admin controller in `/server/src/controllers/adminController.js`

---

## ✅ Next Steps

1. **Create your admin account** (via database or contact platform owner)
2. **Login with admin credentials**
3. **Explore admin dashboard**
4. **Approve pending hall owners**
5. **Monitor platform activity**

Enjoy managing your Event Booking Platform! 🚀
