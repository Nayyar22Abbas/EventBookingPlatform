require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function activateAllAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update all users with pending status to active
    const result = await User.updateMany(
      { accountStatus: 'pending' },
      { accountStatus: 'active', isApproved: true }
    );

    console.log(`\n✅ Activation Complete!`);
    console.log(`   Updated ${result.modifiedCount} pending account(s) to active`);
    console.log(`   Matched ${result.matchedCount} account(s)`);

    // Show all users
    const allUsers = await User.find({}, 'name email role accountStatus isApproved');
    console.log('\n📋 All Users:');
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) | Role: ${user.role} | Status: ${user.accountStatus}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

activateAllAccounts();
