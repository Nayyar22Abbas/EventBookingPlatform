const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hall = require('./models/Hall');
const Menu = require('./models/Menu');
const EventType = require('./models/EventType');
const TimeSlot = require('./models/TimeSlot');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existingHalls = await Hall.countDocuments();
    if (existingHalls > 0) {
      console.log('Database already populated. Skipping seed.');
      process.exit(0);
    }

    // Create or get hall owner user
    let hallOwner = await User.findOne({ email: 'owner@evenbooking.com' });
    if (!hallOwner) {
      hallOwner = new User({
        name: 'Demo Hall Owner',
        email: 'owner@evenbooking.com',
        password: 'password123',
        role: 'hall_owner',
        isVerified: true
      });
      await hallOwner.save();
      console.log('✓ Created demo hall owner');
    }

    // Create halls with different images
    const hallsData = [
      {
        name: 'Grand Palace Banquet Hall',
        description: 'A luxurious banquet hall perfect for weddings, corporate events, and large celebrations. Features elegant decor, modern lighting, and spacious dance floor.',
        address: '123 Main Street, Downtown',
        city: 'Mumbai',
        capacity: 500,
        basePrice: 150000,
        amenities: ['Parking', 'AC', 'WiFi', 'Catering', 'Sound System', 'Stage'],
        images: ['http://localhost:5173/about1.jpg']
      },
      {
        name: 'Serene Garden Venue',
        description: 'An outdoor garden venue with beautiful landscaping, perfect for intimate weddings and garden parties. Open-air ambiance with covered sections.',
        address: '456 Park Avenue, Suburban Area',
        city: 'Pune',
        capacity: 300,
        basePrice: 100000,
        amenities: ['Garden Setup', 'Outdoor Seating', 'Lighting', 'Parking', 'WiFi', 'Bar Facility'],
        images: ['http://localhost:5173/about2.jpg']
      },
      {
        name: 'Corporate Excellence Center',
        description: 'Modern corporate venue with state-of-the-art conference facilities, breakout rooms, and business amenities. Ideal for conferences, seminars, and corporate events.',
        address: '789 Business Park, Tech Zone',
        city: 'Bangalore',
        capacity: 400,
        basePrice: 120000,
        amenities: ['WiFi', 'Projectors', 'Conference Rooms', 'Parking', 'Catering', 'Business Center'],
        images: ['http://localhost:5173/heroback.jpg']
      },
      {
        name: 'Royal Heritage Palace',
        description: 'A magnificent heritage venue with traditional architecture and modern amenities. Perfect for grand weddings and cultural events.',
        address: '321 Heritage Lane, Old City',
        city: 'Delhi',
        capacity: 600,
        basePrice: 200000,
        amenities: ['Heritage Decor', 'Multiple Halls', 'Parking', 'AC', 'Kitchen', 'Stage', 'Sound System'],
        images: ['http://localhost:5173/about1.jpg']
      }
    ];

    const createdHalls = [];
    for (const hallData of hallsData) {
      const hall = new Hall({
        owner: hallOwner._id,
        ...hallData
      });
      await hall.save();
      createdHalls.push(hall);
      console.log(`✓ Created hall: ${hall.name}`);
    }

    // Create menus for each hall
    const menusData = [
      { name: 'Vegetarian Deluxe', pricePerPlate: 500, items: ['Paneer Tikka', 'Dal Makhani', 'Naan', 'Rice', 'Dessert'] },
      { name: 'Non-Vegetarian Premium', pricePerPlate: 750, items: ['Tandoori Chicken', 'Butter Chicken', 'Biryani', 'Naan', 'Dessert'] },
      { name: 'Continental Fusion', pricePerPlate: 600, items: ['Grilled Fish', 'Pasta', 'Salad', 'Bread', 'Dessert'] }
    ];

    for (const hall of createdHalls) {
      for (const menuData of menusData) {
        const menu = new Menu({
          hall: hall._id,
          pricePerPlate: menuData.pricePerPlate,
          name: menuData.name,
          items: menuData.items
        });
        await menu.save();
      }
      console.log(`✓ Created 3 menus for ${hall.name}`);
    }

    // Create event types for each hall
    const eventTypesData = [
      { name: 'Wedding', priceModifier: 50 },
      { name: 'Corporate Event', priceModifier: 20 },
      { name: 'Birthday Party', priceModifier: 10 },
      { name: 'Conference', priceModifier: 15 },
      { name: 'Exhibition', priceModifier: 25 }
    ];

    for (const hall of createdHalls) {
      for (const eventData of eventTypesData) {
        const eventType = new EventType({
          hall: hall._id,
          name: eventData.name,
          priceModifier: eventData.priceModifier
        });
        await eventType.save();
      }
      console.log(`✓ Created 5 event types for ${hall.name}`);
    }

    // Create time slots for each hall (next 30 days)
    for (const hall of createdHalls) {
      const startDate = new Date();
      
      // Create time slots for the next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        // Create multiple time slots per day
        const timeSlots = [
          { startTime: '09:00', endTime: '12:00' },
          { startTime: '12:00', endTime: '15:00' },
          { startTime: '15:00', endTime: '18:00' },
          { startTime: '18:00', endTime: '21:00' },
          { startTime: '21:00', endTime: '23:59' }
        ];

        for (const slot of timeSlots) {
          const timeSlot = new TimeSlot({
            hall: hall._id,
            date: new Date(date.toISOString().split('T')[0]),
            startTime: slot.startTime,
            endTime: slot.endTime,
            status: 'available'
          });
          await timeSlot.save();
        }
      }
      console.log(`✓ Created 150 time slots for ${hall.name}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`Created ${createdHalls.length} halls with menus, event types, and time slots.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
