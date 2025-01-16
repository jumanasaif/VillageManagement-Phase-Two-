const mongoose = require('mongoose');
const MessageChat = require('../models/MessagesChats');
const User = require('../models/User'); // Make sure to import your User model

mongoose.connect('mongodb://localhost:27017/signup-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    // Create or find example users to seed message data
    const user1 = await User.findOne({ username: 'jullnar11' }); // Modify according to your actual user data
    const user2 = await User.findOne({ username: 'JumanaS' }); // Modify according to your actual user data

    if (user1 && user2) {
      // Seed message chat data
      const messages = [
        {
          senderId: user1._id,
          recivedId: user2._id,
          content: 'Hello, how are you?',
        },
        {
          senderId: user2._id,
          recivedId: user1._id,
          content: 'I am doing well, thanks for asking!',
        },
        {
          senderId: user1._id,
          recivedId: user2._id,
          content: 'What are you up to today?',
        },
      ];

      // Insert messages into the database
      await MessageChat.insertMany(messages);
      console.log('Message data seeded successfully!');
    } else {
      console.log('Users not found');
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
    mongoose.disconnect();
  });
