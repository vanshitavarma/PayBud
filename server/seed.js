const mongoose = require('mongoose');
const User = require('./src/models/user.model');
const Bank = require('./src/models/bank.model');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/src/.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    const adminEmail = 'admin@paysplit.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists.');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        upiId: 'admin@paysplit',
        role: 'admin',
        walletBalance: 0 // Admin doesn't need personal balance, they use the bank
      });
      console.log('Admin user created successfully.');
    }

    // Ensure bank exists
    const bank = await Bank.findOne();
    if (!bank) {
        await Bank.create({ totalBalance: 1000000 });
        console.log('Central Bank initialized with ₹1,000,000.');
    }

    mongoose.disconnect();
    console.log('Seeding completed.');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedAdmin();
