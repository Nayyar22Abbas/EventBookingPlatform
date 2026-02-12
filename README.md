# Event Booking Platform

A comprehensive event booking platform built with modern web technologies, enabling users to search for event halls, book time slots, manage reservations, and leave reviews.

## 🎯 Project Overview

The Event Booking Platform is a full-stack web application that connects event customers with hall owners. It provides a complete booking workflow including authentication, image galleries, dynamic pricing, time slot management, and review systems.

**Live Repository:** https://github.com/Nayyar22Abbas/EventBookingPlatform

## ✨ Features Implemented

### User Authentication & Roles
- ✅ JWT-based authentication with Google OAuth integration
- ✅ Three role-based access levels: **Admin**, **Hall Owner**, **Customer**
- ✅ Account activation system for new registrations
- ✅ Secure credential management with environment variables

### Hall Management (Hall Owner Module)
- ✅ Create and manage event halls
- ✅ Upload multiple images (up to 10 files, 5MB limit per file)
- ✅ Drag-and-drop image upload interface
- ✅ Image preview and deletion management
- ✅ Hall details: name, address, capacity, amenities, pricing

### Image Upload & Gallery System
- ✅ Multer diskStorage configuration for file uploads
- ✅ Static file serving via Express middleware
- ✅ Airbnb-style image gallery with thumbnails
- ✅ Image count badges on hall cards
- ✅ Full-screen image viewer with navigation arrows
- ✅ Images stored at `/server/uploads/` and accessible via HTTP

### Event Types & Dynamic Pricing
- ✅ Create event types with custom pricing modifiers
- ✅ Support for wedding, corporate, birthday, anniversary, and custom events
- ✅ Real-time price calculation based on event type and capacity
- ✅ Price modifiers applied to base rates
- ✅ Event type dropdown in booking system

### Time Slot Management
- ✅ Create custom time slots for halls
- ✅ UTC timezone handling and proper date parsing
- ✅ Time slot status tracking: `available`, `blocked`, `booked`, `completed`
- ✅ Automatic status updates based on booking lifecycle

### Booking System
- ✅ Complete booking workflow with approval process
- ✅ Booking creation with automatic time slot blocking
- ✅ Hall owner booking approval/rejection
- ✅ Customer booking cancellation with time slot release
- ✅ Booking history and status tracking
- ✅ Real-time price calculation during booking

### Review & Rating System
- ✅ Customer reviews with 1-5 star ratings
- ✅ Review creation and deletion
- ✅ Ownership verification for review management
- ✅ Review display on hall detail pages
- ✅ Average rating calculation

### Dashboard & Statistics
- ✅ Hall Owner dashboard with statistics
- ✅ Customer dashboard with booking overview
- ✅ Admin dashboard with platform statistics
- ✅ Real-time data updates

### Search & Filtering
- ✅ Search halls by name, location, and other criteria
- ✅ Filter by amenities and features
- ✅ Display all halls by default on search page
- ✅ Responsive grid layout (6-column on desktop)
- ✅ Compact filter section (50% smaller UI)
- ✅ Optimized hall cards (reduced height and padding)

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **File Upload:** Multer (diskStorage)
- **Authentication:** JWT + Google OAuth
- **Port:** 5000

### Frontend
- **Framework:** React with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **HTTP Client:** Axios with JWT interceptors
- **Port:** 5174 (or 5175 if port conflict)

### DevOps & Deployment
- **Version Control:** Git & GitHub
- **Package Manager:** npm
- **Environment:** .env configuration files

## 📁 Project Structure

```
EventBookingPlatform/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── features/               # Feature modules (admin, customer, hall_owner)
│   │   ├── services/               # API services (axios client)
│   │   ├── App.jsx                 # Main app with routes
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── models/                 # MongoDB schemas
│   │   ├── controllers/            # Business logic
│   │   ├── routes/                 # API endpoints
│   │   ├── middleware/             # Auth, upload, error handling
│   │   └── server.js               # Express app setup
│   ├── uploads/                    # Image storage directory
│   ├── .env.example                # Environment variables template
│   └── package.json
│
├── .git/                           # Version control
├── .gitignore                      # Git ignore rules
├── package.json                    # Root package file
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB Atlas** account (free tier available)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nayyar22Abbas/EventBookingPlatform.git
   cd EventBookingPlatform
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Setup backend environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your credentials:
   # - MONGO_URI: MongoDB connection string
   # - GOOGLE_CLIENT_ID: Google OAuth client ID
   # - GOOGLE_CLIENT_SECRET: Google OAuth client secret
   # - JWT_SECRET: Your secret key for JWT
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

**Terminal 1 - Start Backend Server**
```bash
cd server
node server.js
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend Development Server**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5174 (or 5175 if port conflicted)
```

### Access the Application
- **Frontend:** http://localhost:5174
- **API:** http://localhost:5000
- **Images:** http://localhost:5000/uploads/{filename}

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login

### Hall Management
- `GET /api/halls` - Get all halls
- `GET /api/halls/:id` - Get hall details
- `POST /api/halls` - Create new hall (Hall Owner)
- `POST /api/halls/:id/images` - Upload hall images

### Event Types
- `GET /api/event-types` - Get all event types
- `POST /api/event-types` - Create event type (Hall Owner)
- `GET /api/halls/:hallId/event-types` - Get hall's event types

### Bookings
- `POST /api/bookings` - Create booking (Customer)
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/cancel` - Cancel booking (Customer)
- `PATCH /api/bookings/:id/accept` - Accept booking (Hall Owner)
- `PATCH /api/bookings/:id/reject` - Reject booking (Hall Owner)

### Reviews
- `GET /api/reviews/:hallId` - Get hall reviews
- `POST /api/reviews` - Create review (Customer)
- `DELETE /api/reviews/:id` - Delete review (Verified owner)

### Time Slots
- `GET /api/time-slots/:hallId` - Get hall's time slots
- `POST /api/time-slots` - Create time slot (Hall Owner)

## 🎨 UI/UX Features

### Design Elements
- **Color Scheme:** Gold (#bfa544) and Dark Slate-900 theme
- **Animations:** Framer Motion for smooth transitions
- **Icons:** Lucide React for consistent iconography
- **Responsive Design:** Mobile-first approach with Tailwind CSS

### Optimized Components
- **Search Filters:** Compact layout (50% reduced size)
- **Hall Cards:** Optimized dimensions for better performance
- **Image Gallery:** Airbnb-style with thumbnails and count badges
- **Forms:** Modal-based with real-time validation

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Google OAuth integration for secure logins
- ✅ Environment variables for sensitive data
- ✅ .env files excluded from version control
- ✅ Request validation and error handling
- ✅ Role-based access control (RBAC)
- ✅ Ownership verification for resource management

## 📊 User Roles & Permissions

### Admin
- View platform statistics
- Manage all users
- Oversee all bookings and halls
- System administration

### Hall Owner
- Create and manage event halls
- Upload and manage images
- Create event types with pricing
- Manage time slots
- Accept/reject bookings
- View dashboard statistics

### Customer
- Search and browse halls
- Book available time slots
- Cancel bookings
- Leave reviews and ratings
- View booking history
- Access customer dashboard

## 🗄️ Database Models

### User
- Email, password, name, phone
- Role (admin, hall_owner, customer)
- Account status (active/inactive)

### Hall
- Name, description, capacity
- Address, city, area
- Amenities array
- Images array (references to uploaded files)
- Owner reference (Hall Owner)
- Base pricing

### EventType
- Name, price modifier
- Description
- Hall reference

### Booking
- Customer reference
- Hall reference
- EventType reference
- Booking dates and time slot
- Status (pending, approved, rejected, cancelled)
- Total price

### TimeSlot
- Hall reference
- Date and time
- Status (available, booked, blocked, completed)
- Duration

### Review
- Customer reference
- Hall reference
- Rating (1-5 stars)
- Comment
- Created date

## 📝 File Upload System

- **Storage Location:** `/server/uploads/`
- **Max File Size:** 5MB per file
- **Max Files:** 10 files per upload
- **Supported Formats:** jpg, jpeg, png, gif, webp
- **Accessibility:** Static files served via Express middleware at `/uploads/{filename}`

## 🐛 Known Workflow

### Booking Lifecycle
1. Customer creates booking with selected time slot
2. Time slot status changes to `blocked` (pending approval)
3. Hall Owner reviews and approves/rejects
4. If approved: Status → `booked`
5. If rejected: Status → `available` (released)
6. Customer can cancel anytime: Status → `available`

### Price Calculation
- Base price determined by hall capacity
- Event type applies price modifier (e.g., wedding +30%, corporate +20%)
- Final price = base_price × event_type_modifier

## 🌐 Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

## 📦 Deployment

The application is ready for deployment on platforms like:
- **Heroku** (Backend & Frontend)
- **AWS** (EC2, S3 for images)
- **DigitalOcean** (App Platform)
- **Netlify/Vercel** (Frontend only)

### Pre-deployment Checklist
- ✅ All environment variables configured
- ✅ MongoDB Atlas cluster setup
- ✅ Google OAuth credentials obtained
- ✅ Image storage directory permissions set
- ✅ CORS properly configured
- ✅ JWT secrets secured

## 🤝 Contributing

This is a personal project. For improvements or bug fixes:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to GitHub
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Contact & Support

For questions or support regarding this project:
- **GitHub:** https://github.com/Nayyar22Abbas/
- **Repository Issues:** Report bugs and feature requests

## 🎉 Acknowledgments

Built with modern web technologies and best practices in mind. Special thanks to:
- MongoDB for cloud database services
- Google for OAuth integration
- Tailwind CSS and Framer Motion communities

---

**Last Updated:** February 13, 2026
**Status:** ✅ Feature Complete - Ready for Production

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Getting Started](https://vitejs.dev/guide/)
