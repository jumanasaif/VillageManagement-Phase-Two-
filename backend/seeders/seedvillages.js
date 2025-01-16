const mongoose = require('mongoose');
const Village = require('../models/Village'); // Adjust the path to your model file

mongoose.connect('mongodb://localhost:27017/signup-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  
  const newVillage = new Village({
    name: "Sample Village",
    region: "North",
    landArea: 15.4,
    latitude: 12.3456,
    longitude: 78.9012,
    img: "https://example.com/sample.jpg",
    categories: ["agriculture", "education"],
    populationDistribution: new Map([
      ["children", "30%"],
      ["adults", "60%"],
      ["seniors", "10%"]
    ]),
    genderRatio: {
      male: 49.0,
      female: 51.0
    },
    populationGrowthRate: 1.8
    
  });

  return newVillage.save();
})
.then(() => {
  console.log("Village saved successfully");
  mongoose.connection.close();
})
.catch(err => {
  console.error("Error:", err);
  mongoose.connection.close();
});
