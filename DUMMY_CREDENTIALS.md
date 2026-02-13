# Dummy Credentials for Event Booking Platform

**Generated on:** 2/12/2026, 4:36:49 AM

---

## 🔐 Admin Accounts


### Admin 1
- **Name:** Admin User
- **Email:** admin@event-booking.com
- **Password:** `Admin@123456`
- **Role:** admin
- **User ID:** `698d12914fa8283b99811c50`

---

## 🏢 Hall Owner Accounts


### Hall Owner 1
- **Name:** Ahmed Khan
- **Email:** ahmed.khan@hallowner.com
- **Password:** `HallOwner@123456`
- **Role:** hall_owner
- **User ID:** `698d12914fa8283b99811c53`


### Hall Owner 2
- **Name:** Fatima Events
- **Email:** fatima.events@hallowner.com
- **Password:** `HallOwner@234567`
- **Role:** hall_owner
- **User ID:** `698d12914fa8283b99811c54`


### Hall Owner 3
- **Name:** Grand Banquet Halls
- **Email:** grand.banquet@hallowner.com
- **Password:** `HallOwner@345678`
- **Role:** hall_owner
- **User ID:** `698d12914fa8283b99811c55`

---

## 👥 Customer Accounts


### Customer 1
- **Name:** Ali Ahmed
- **Email:** ali.ahmed@customer.com
- **Password:** `Customer@123456`
- **Role:** customer
- **User ID:** `698d12914fa8283b99811c57`


### Customer 2
- **Name:** Zainab Hassan
- **Email:** zainab.hassan@customer.com
- **Password:** `Customer@234567`
- **Role:** customer
- **User ID:** `698d12914fa8283b99811c58`


### Customer 3
- **Name:** Muhammad Hassan
- **Email:** muhammad.hassan@customer.com
- **Password:** `Customer@345678`
- **Role:** customer
- **User ID:** `698d12914fa8283b99811c59`


### Customer 4
- **Name:** Ayesha Khan
- **Email:** ayesha.khan@customer.com
- **Password:** `Customer@456789`
- **Role:** customer
- **User ID:** `698d12914fa8283b99811c5a`

---

## 🏛️ Sample Halls Created

| Hall Name | City | Capacity | Base Price | Owner |
|-----------|------|----------|-----------|-------|
| Royal Grand Palace | Karachi | 500 | Rs. 500,000 | Ahmed Khan |
| Azure Haven | Karachi | 300 | Rs. 300,000 | Ahmed Khan |
| Pearl Events Hall | Karachi | 400 | Rs. 400,000 | Fatima Events |
| Crescent Banquet | Lahore | 250 | Rs. 250,000 | Fatima Events |
| Sunset Terrace | Lahore | 600 | Rs. 600,000 | Grand Banquet Halls |
| Elegant Pavilion | Karachi | 200 | Rs. 200,000 | Grand Banquet Halls |


---

## 🔗 Quick Links

| Role | Login URL | Dashboard URL |
|------|-----------|---------------|
| Admin | `http://localhost:5173/auth/login` | `http://localhost:5173/admin/dashboard` |
| Hall Owner | `http://localhost:5173/auth/login` | `http://localhost:5173/hall-owner/dashboard` |
| Customer | `http://localhost:5173/auth/login` | `http://localhost:5173/customer/dashboard` |

---

## ⚠️ Important Notes

1. All passwords are plain text here for reference only. They are hashed in the database.
2. All accounts are already verified and approved (should be).
3. Hall owners have halls pre-assigned to them.
4. Customers can book any hall from the search page.
5. Admin has full access to manage all platform features.

---

## 🧪 Testing Scenarios

### Test 1: Customer Login & Search
1. Login with any customer account
2. Go to Search Halls page
3. Search and filter halls by city/capacity
4. Create a booking

### Test 2: Hall Owner Login & Manage
1. Login with any hall owner account
2. View your halls in dashboard
3. Update hall information
4. View bookings for your halls

### Test 3: Admin Access
1. Login with admin account
2. Access admin dashboard
3. View platform statistics
4. Approve/reject hall owners
5. Manage all halls and bookings

---

**Generated:** 2026-02-11T23:36:49.602Z
