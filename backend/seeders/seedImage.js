const mongoose = require('mongoose');
const Image = require('../models/Image'); // Adjust the path to your Image model file

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/signup-app', {
//   useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Sample image data to seed into the database
const sampleImages = [
  {
    url: 'https://example.com/image1.jpg',
    description: 'A beautiful landscape with mountains and a lake.',
  },
  {
    url: 'https://example.com/image2.jpg',
    description: 'A sunset view over the ocean.',
  },
  {
    url: 'https://example.com/image3.jpg',
    description: 'A bustling cityscape at night.',
  },
  {
    url: 'https://example.com/image4.jpg',
    description: 'A field of blooming flowers in the spring.',
  },
  {
    url: 'https://example.com/image5.jpg',
    description: 'A calm forest trail with sunlight filtering through trees.',
  },
];

// Function to seed images
const seedImages = async () => {
  try {
    // Remove all existing images (optional, depends on your use case)
    await Image.deleteMany({});

    // Insert sample images into the database
    await Image.insertMany(sampleImages);
    console.log('Images seeded successfully!');
  } catch (err) {
    console.error('Error seeding images:', err);
  } finally {
    mongoose.connection.close(); // Close the database connection after seeding
  }
};

// Run the seeding function
seedImages();
