const mongoose = require('mongoose');
const Village = require('../models/Village');

mongoose.connect('mongodb://localhost:27017/signup-app', {// Use your correct database
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function addPopulationSize() {
  try {
    await Village.updateMany({}, { $set: { populationSize: 0 } });
    console.log('Population size added to all villages.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error updating villages:', error);
    mongoose.disconnect();
  }
}

addPopulationSize();
