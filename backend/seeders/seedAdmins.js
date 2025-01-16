const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');


mongoose.connect('mongodb://localhost:27017/signup-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const admins = [
  { fullName: 'Jumana Saif', username: 'JumanaS', password: 'Jumana123', role: 'admin' },
  { fullName: 'Jullnar Haje', username: 'JullnarH', password: 'Jullnar123', role: 'admin' },
];

async function seedAdmins() {
  try {
    for (let admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      admin.password = hashedPassword;
    }
    await User.insertMany(admins);
    console.log('Admins seeded successfully.');
  } catch (error) {
    console.error('Error seeding admins:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmins();
