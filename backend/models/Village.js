const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  landArea: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  img: { type: String, required: true },
  categories: { type: [String], required: true },
  populationDistribution: [
    {
      ageRange: { type: String, required: true },
      percentage: { type: String, required: true },
    },
  ],
  genderRatio: {
    male: { type: Number, required: true },
    female: { type: Number, required: true },
  },
  populationGrowthRate: { type: Number, required: true },
  populationSize: { type: Number, required: true },
});

const Village = mongoose.model('Village', villageSchema);

module.exports = Village;
