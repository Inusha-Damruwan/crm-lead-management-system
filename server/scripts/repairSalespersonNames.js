require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../src/models/User');
const Lead = require('../src/models/Lead');

const nameMappings = [
  { from: 'John Salesperson', to: 'Kasun Perera' },
  { from: 'Sarah Sales', to: 'Sachini Fernando' },
  { from: 'Sales Person', to: 'Nimal Fernando' },
];

async function repairSalespersonNames() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const mapping of nameMappings) {
      const userResult = await User.updateMany(
        { name: mapping.from },
        { $set: { name: mapping.to } }
      );

      const leadResult = await Lead.updateMany(
        { name: mapping.from },
        { $set: { name: mapping.to } }
      );

      console.log(
        `🔁 ${mapping.from} → ${mapping.to} | users: ${userResult.modifiedCount} | leads: ${leadResult.modifiedCount}`
      );
    }

    console.log('🎉 Salesperson name repair completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Repair failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

repairSalespersonNames();