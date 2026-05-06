/**
 * Migration Script: Generate userId for existing users
 * This script generates professional formatted User IDs for any users that don't have one
 * Format: ADM-XXXX for admins, SAL-XXXX for salespersons
 * 
 * Usage: node server/scripts/migrateUserIds.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/crm_db');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const migrateUserIds = async () => {
  try {
    console.log('\n🔄 Starting User ID migration...\n');

    // Find users without userId
    const usersWithoutId = await User.find({ userId: { $exists: false } });
    
    if (usersWithoutId.length === 0) {
      console.log('✅ All users already have User IDs. No migration needed.');
      return;
    }

    console.log(`Found ${usersWithoutId.length} users without User IDs\n`);

    let adminCount = await User.countDocuments({ role: 'admin', userId: { $exists: true } });
    let salespersonCount = await User.countDocuments({ role: 'salesperson', userId: { $exists: true } });

    console.log(`Current counts:`)
    console.log(`  • Admins with ID: ${adminCount}`)
    console.log(`  • Salespersons with ID: ${salespersonCount}\n`);

    // Migrate each user
    for (const user of usersWithoutId) {
      const rolePrefix = user.role === 'admin' ? 'ADM' : 'SAL';
      
      if (user.role === 'admin') {
        adminCount++;
        user.userId = `${rolePrefix}-${String(adminCount).padStart(4, '0')}`;
      } else {
        salespersonCount++;
        user.userId = `${rolePrefix}-${String(salespersonCount).padStart(4, '0')}`;
      }

      await user.save();
      console.log(`✅ ${user.name} → ${user.userId}`);
    }

    console.log(`\n✅ Migration complete! Generated ${usersWithoutId.length} User IDs\n`);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB\n');
  }
};

// Run migration
connectDB().then(migrateUserIds);
