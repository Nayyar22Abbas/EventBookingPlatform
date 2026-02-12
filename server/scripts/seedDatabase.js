require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const Hall = require('../src/models/Hall');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event-booking-platform';

// Dummy data
const dummyAdmins = [
  {
    name: 'Admin User',
    email: 'admin@event-booking.com',
    password: 'Admin@123456',
    role: 'admin',
    isEmailVerified: true,
    isApproved: true,
    accountStatus: 'active'
  }
];

const dummyHallOwners = [
  {
    name: 'Ahmed Khan',
    email: 'ahmed.khan@hallowner.com',
    password: 'HallOwner@123456',
    role: 'hall_owner',
    isEmailVerified: true,
    isApproved: true,
    accountStatus: 'active'
  },
  {
    name: 'Fatima Events',
    email: 'fatima.events@hallowner.com',
    password: 'HallOwner@234567',
    role: 'hall_owner',
    isEmailVerified: true,
    isApproved: true,
    accountStatus: 'active'
  },
  {
    name: 'Grand Banquet Halls',
    email: 'grand.banquet@hallowner.com',
    password: 'HallOwner@345678',
    role: 'hall_owner',
    isEmailVerified: true,
    isApproved: true,
    accountStatus: 'active'
  }
];

const dummyCustomers = [
  {
    name: 'Ali Ahmed',
    email: 'ali.ahmed@customer.com',
    password: 'Customer@123456',
    role: 'customer',
    isEmailVerified: true,
    isApproved: true,
    accountStatus: 'active'
  },
  {
    name: 'Zainab Hassan',
    email: 'zainab.hassan@customer.com',
    password: 'Customer@234567',
    role: 'customer',
    isEmailVerified: true,
    isApproved: true,
    accountStatus: 'active'
  },
  {
    name: 'Muhammad Hassan',
    email: 'muhammad.hassan@customer.com',
    password: 'Customer@345678',
    role: 'customer',
    isEmailVerified: true,
    isApproved: true,
    accountStatus: 'active'
  },
  {
    name: 'Ayesha Khan',
    email: 'ayesha.khan@customer.com',
    password: 'Customer@456789',
    role: 'customer',
    isEmailVerified: true,
    isApproved: true,
    accountStatus: 'active'
  }
];

// Dummy halls data
const createHalls = (ownerIds) => [
  {
    owner: ownerIds[0],
    name: 'Royal Grand Palace',
    description: 'Luxurious hall perfect for grand weddings and events',
    address: '123 Main Street, Downtown',
    city: 'Karachi',
    capacity: 500,
    amenities: ['AC', 'Parking', 'Kitchen', 'Stage', 'Sound System', 'Decoration'],
    basePrice: 500000,
    supportedFunctions: ['Mehndi', 'Baraat', 'Waleema', 'Reception'],
    additionalCharges: [
      { name: 'Extra Hour', price: 50000 },
      { name: 'Catering', price: 5000 }
    ]
  },
  {
    owner: ownerIds[0],
    name: 'Azure Haven',
    description: 'Modern hall with traditional elegance',
    address: '456 Elite Road, North Karachi',
    city: 'Karachi',
    capacity: 300,
    amenities: ['AC', 'Parking', 'Kitchen', 'WiFi', 'Stage'],
    basePrice: 300000,
    supportedFunctions: ['Mehndi', 'Engagement', 'Birthday'],
    additionalCharges: [
      { name: 'Extra Hour', price: 30000 }
    ]
  },
  {
    owner: ownerIds[1],
    name: 'Pearl Events Hall',
    description: 'Elegant venue with world-class facilities',
    address: '789 Garden Avenue, Gulshan',
    city: 'Karachi',
    capacity: 400,
    amenities: ['AC', 'Parking', 'Kitchen', 'Stage', 'Dance Floor', 'Lounge'],
    basePrice: 400000,
    supportedFunctions: ['Waleema', 'Reception', 'Birthday', 'Engagement'],
    additionalCharges: [
      { name: 'Extra Hour', price: 40000 },
      { name: 'Decoration', price: 100000 }
    ]
  },
  {
    owner: ownerIds[1],
    name: 'Crescent Banquet',
    description: 'Traditional Pakistani style with modern amenities',
    address: '321 Heritage Lane, Old City',
    city: 'Lahore',
    capacity: 250,
    amenities: ['AC', 'Parking', 'Kitchen', 'Courtyard'],
    basePrice: 250000,
    supportedFunctions: ['Mehndi', 'Baraat', 'Waleema'],
    additionalCharges: [
      { name: 'Extra Hour', price: 25000 }
    ]
  },
  {
    owner: ownerIds[2],
    name: 'Sunset Terrace',
    description: 'Outdoor venue with indoor backup',
    address: '654 Riverside, Defence',
    city: 'Lahore',
    capacity: 600,
    amenities: ['AC', 'Parking', 'Kitchen', 'Terrace', 'Garden', 'Stage'],
    basePrice: 600000,
    supportedFunctions: ['Reception', 'Birthday', 'Engagement', 'Other'],
    additionalCharges: [
      { name: 'Extra Hour', price: 60000 },
      { name: 'Catering', price: 5000 },
      { name: 'Decoration', price: 150000 }
    ]
  },
  {
    owner: ownerIds[2],
    name: 'Elegant Pavilion',
    description: 'Semi-outdoor venue perfect for intimate gatherings',
    address: '987 Park Road, Clifton',
    city: 'Karachi',
    capacity: 200,
    amenities: ['AC', 'Parking', 'Kitchen', 'WiFi'],
    basePrice: 200000,
    supportedFunctions: ['Engagement', 'Birthday', 'Other'],
    additionalCharges: [
      { name: 'Extra Hour', price: 20000 }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Hall.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create admins
    const createdAdmins = await User.insertMany(dummyAdmins);
    console.log(`✓ Created ${createdAdmins.length} admin user(s)`);

    // Create hall owners
    const createdHallOwners = await User.insertMany(dummyHallOwners);
    console.log(`✓ Created ${createdHallOwners.length} hall owner(s)`);

    // Create customers
    const createdCustomers = await User.insertMany(dummyCustomers);
    console.log(`✓ Created ${createdCustomers.length} customer(s)`);

    // Create halls
    const hallOwnerIds = createdHallOwners.map(owner => owner._id);
    const hallsData = createHalls(hallOwnerIds);
    const createdHalls = await Hall.insertMany(hallsData);
    console.log(`✓ Created ${createdHalls.length} hall(s)`);

    // Prepare credentials file
    const credentials = {
      admin: createdAdmins.map((admin, index) => ({
        name: admin.name,
        email: admin.email,
        password: dummyAdmins[index].password,
        role: admin.role,
        userId: admin._id
      })),
      hallOwners: createdHallOwners.map((owner, index) => ({
        name: owner.name,
        email: owner.email,
        password: dummyHallOwners[index].password,
        role: owner.role,
        userId: owner._id
      })),
      customers: createdCustomers.map((customer, index) => ({
        name: customer.name,
        email: customer.email,
        password: dummyCustomers[index].password,
        role: customer.role,
        userId: customer._id
      })),
      halls: createdHalls.map((hall, index) => {
        const ownerIndex = Math.floor(index / 2); // 2 halls per owner
        return {
          name: hall.name,
          city: hall.city,
          capacity: hall.capacity,
          basePrice: hall.basePrice,
          owner: hall.owner,
          ownerName: createdHallOwners[ownerIndex].name,
          hallId: hall._id
        };
      })
    };

    // Generate markdown file
    const markdownContent = generateCredentialsMarkdown(credentials);
    
    const credentialsPath = path.join(__dirname, '../../DUMMY_CREDENTIALS.md');
    fs.writeFileSync(credentialsPath, markdownContent);
    console.log(`✓ Credentials saved to DUMMY_CREDENTIALS.md`);

    console.log('\n✅ Database seeding completed successfully!');
    
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

const generateCredentialsMarkdown = (credentials) => {
  let md = `# Dummy Credentials for Event Booking Platform

**Generated on:** ${new Date().toLocaleString()}

---

## 🔐 Admin Accounts

`;

  credentials.admin.forEach((admin, index) => {
    md += `
### Admin ${index + 1}
- **Name:** ${admin.name}
- **Email:** ${admin.email}
- **Password:** \`${admin.password}\`
- **Role:** ${admin.role}
- **User ID:** \`${admin.userId}\`

`;
  });

  md += `---

## 🏢 Hall Owner Accounts

`;

  credentials.hallOwners.forEach((owner, index) => {
    md += `
### Hall Owner ${index + 1}
- **Name:** ${owner.name}
- **Email:** ${owner.email}
- **Password:** \`${owner.password}\`
- **Role:** ${owner.role}
- **User ID:** \`${owner.userId}\`

`;
  });

  md += `---

## 👥 Customer Accounts

`;

  credentials.customers.forEach((customer, index) => {
    md += `
### Customer ${index + 1}
- **Name:** ${customer.name}
- **Email:** ${customer.email}
- **Password:** \`${customer.password}\`
- **Role:** ${customer.role}
- **User ID:** \`${customer.userId}\`

`;
  });

  md += `---

## 🏛️ Sample Halls Created

| Hall Name | City | Capacity | Base Price | Owner |
|-----------|------|----------|-----------|-------|
`;

  credentials.halls.forEach(hall => {
    md += `| ${hall.name} | ${hall.city} | ${hall.capacity} | Rs. ${hall.basePrice.toLocaleString()} | ${hall.ownerName} |
`;
  });

  md += `

---

## 🔗 Quick Links

| Role | Login URL | Dashboard URL |
|------|-----------|---------------|
| Admin | \`http://localhost:5173/auth/login\` | \`http://localhost:5173/admin/dashboard\` |
| Hall Owner | \`http://localhost:5173/auth/login\` | \`http://localhost:5173/hall-owner/dashboard\` |
| Customer | \`http://localhost:5173/auth/login\` | \`http://localhost:5173/customer/dashboard\` |

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

**Generated:** ${new Date().toISOString()}
`;

  return md;
};

// Run the seed script
seedDatabase();
