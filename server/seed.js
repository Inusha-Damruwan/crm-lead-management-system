const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Lead = require('./src/models/Lead');

// Sample Users
const sampleUsers = [

{
userId: 'ADM-0001',
name: 'Admin User',
email: 'admin@example.com',
password: 'password123',
role: 'admin',
},

{
userId: 'SAL-0001',
name: 'Kasun Perera',
email: '[kasun@gmail.com](mailto:kasun@gmail.com)',
password: 'password123',
role: 'salesperson',
},
{
userId: 'SAL-0002',
name: 'Nimal Fernando',
email: '[nimal.fernando@gmail.com](mailto:nimal.fernando@gmail.com)',
password: 'password123',
role: 'salesperson',
},
{
userId: 'SAL-0003',
name: 'Sachini Fernando',
email: '[sachini.fernando@gmail.com](mailto:sachini.fernando@gmail.com)',
password: 'password123',
role: 'salesperson',
},
{
userId: 'SAL-0004',
name: 'Yasara Wijesinghe',
email: '[yasara.wijesinghe@gmail.com](mailto:yasara.wijesinghe@gmail.com)',
password: 'password123',
role: 'salesperson',
},
{
userId: 'SAL-0005',
name: 'Dilshan Silva',
email: '[dilshan.silva@gmail.com](mailto:dilshan.silva@gmail.com)',
password: 'password123',
role: 'salesperson',
},
];


// Sample Leads
const sampleLeads = [
  {
    name: 'Kasun Perera',
    company: 'Dilshan Holdings',
    email: 'kasun@gmail.com',
    phone: '0771234567',
    source: 'Website',
    status: 'New',
    dealValue: 750000,
  },
  {
    name: 'Nimal Fernando',
    company: 'Lanka Tech Solutions',
    email: 'info@lankatech.lk',
    phone: '0714567890',
    source: 'Email',
    status: 'Contacted',
    dealValue: 950000,
  },
  {
    name: 'Sachini Fernando',
    company: 'Serendib Logistics (Pvt) Ltd',
    email: 'sales@serendiblogistics.lk',
    phone: '0763456789',
    source: 'Referral',
    status: 'Qualified',
    dealValue: 1200000,
  },
  {
    name: 'Yasara Wijesinghe',
    company: 'Ceylon Agro Exports',
    email: 'procurement@ceylonagro.lk',
    phone: '0749876543',
    source: 'Phone',
    status: 'Proposal Sent',
    dealValue: 1800000,
  },
  {
    name: 'Dilshan Silva',
    company: 'Blue Ocean Garments',
    email: 'team@blueoceangarments.lk',
    phone: '0752345678',
    source: 'Social Media',
    status: 'Won',
    dealValue: 2500000,
  },
  {
    name: 'Tharindu Jayasinghe',
    company: 'Metro Engineering Lanka',
    email: 'info@metroengineering.lk',
    phone: '0784561230',
    source: 'Trade Show',
    status: 'Lost',
    dealValue: 650000,
  },
];

async function seedDatabase() {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');

    // Clear old data
    await User.deleteMany({});
    await Lead.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Create Users
    const createdUsers = await User.create(sampleUsers);

    console.log(`✅ Created ${createdUsers.length} users`);

    // Get salespeople only
    const salespeople = createdUsers.filter(
      (user) => user.role === 'salesperson'
    );

    // Assign leads
    const leadsWithAssignee = sampleLeads.map((lead, index) => ({
      ...lead,
      assignedTo: salespeople[index % salespeople.length]._id,
    }));

    // Create Leads
    const createdLeads = await Lead.create(leadsWithAssignee);

    console.log(`✅ Created ${createdLeads.length} leads`);

    // Summary
    console.log('\n📊 Seed Data Summary:');
    console.log('======================');

    console.log(`Users: ${createdUsers.length}`);

    createdUsers.forEach((user) => {
      console.log(
        `- ${user.userId} | ${user.email} (${user.role})`
      );
    });

    console.log(`\nLeads: ${createdLeads.length}`);

    const statusCounts = {};

    createdLeads.forEach((lead) => {
      statusCounts[lead.status] =
        (statusCounts[lead.status] || 0) + 1;
    });

    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`- ${status}: ${count}`);
    });

    console.log('\n🎉 Seeding completed successfully!');

    console.log('\n📝 Test Credentials:');
    console.log('Email: admin@lankacrm.lk');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run Seed
seedDatabase();