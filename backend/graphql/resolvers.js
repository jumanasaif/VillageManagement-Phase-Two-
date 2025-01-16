const { GraphQLUpload } = require('graphql-upload');
const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');
const User = require('../models/User');
const Village = require('../models/Village');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ApolloError } = require('apollo-server');
const MessageChat = require('../models/MessagesChats');


const generateUniqueFilename = (filename) => {
  const timestamp = Date.now();
  const uniqueSuffix = `${timestamp}-${Math.round(Math.random() * 1e9)}`;
  return `${uniqueSuffix}-${filename}`;
};

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const MESSAGE_SENT = 'MESSAGE_SENT';

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    hello: () => 'Hello, world!',

    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) throw new ApolloError('User not found!', 'USER_NOT_FOUND');
        return user;
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error fetching user!', 'USER_FETCH_ERROR');
      }
    },


    getMessages: async (_, { userId, adminId }) => {
      console.log('getMessages inputs:', { userId, adminId }); 
    
      try {
        
        const user = await User.findById(userId);
        const admin = await User.findById(adminId);
    
        if (!user) throw new ApolloError('User not found!', 'USER_NOT_FOUND');
        if (!admin) throw new ApolloError('Admin not found!', 'ADMIN_NOT_FOUND');
    
        
        const messages = await MessageChat.find({
          $or: [
            { senderId: userId, recivedId: adminId },
            { senderId: adminId, recivedId: userId },
          ],
        }).sort({ timestamp: 1 }); 
    
        console.log('Messages fetched:', messages); 
    
        return messages;
      } catch (error) {
        console.error('Error in getMessages:', error);
        throw new ApolloError('Error fetching messages!', 'MESSAGE_FETCH_ERROR');
      }
    },
        
  
  

    getUsers: async () => {
      try {
        return await User.find();
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error fetching users!', 'USER_FETCH_ERROR');
      }
    },

    getVillages: async () => {
      try {
        return await Village.find();
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error fetching villages!', 'VILLAGE_FETCH_ERROR');
      }
    },

    getImages: async () => {
      try {
        return await Image.find();
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error fetching images!', 'IMAGE_FETCH_ERROR');
      }
    },


    getAdmins: async () => {
      try {
        
        const admins = await User.find({ role: 'admin' });
    
        if (!admins || admins.length === 0) {
          throw new ApolloError('No admins found.', 'ADMIN_NOT_FOUND');
        }
    
        return admins.map(admin => ({
          id: admin._id.toString(),
          fullName: admin.fullName,
          username: admin.username,
          role: admin.role,
        }));
      } catch (error) {
        console.error("Error fetching admins:", error);
        throw new ApolloError("Error fetching admins", "ADMIN_FETCH_ERROR");
      }
    },

    getttuserss: async () => {
      try {
          const users = await User.find({ role: 'User' });
          
          if (!users || users.length === 0) {
              throw new ApolloError('No users found.', 'USER_NOT_FOUND');
          }
  
          
          return users.map(user => ({
              id: user._id.toString(),
              fullName: user.fullName,
              username: user.username,
              role: user.role,
          }));
      } catch (error) {
          console.error("Error fetching users:", error);
          throw new ApolloError("Error fetching users", "USER_FETCH_ERROR");
      }
  },  
    

    

    getImage: async (_, { id }) => {
      try {
        const image = await Image.findById(id);
        if (!image) throw new ApolloError('Image not found!', 'IMAGE_NOT_FOUND');
        return image;
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error fetching image!', 'IMAGE_FETCH_ERROR');
      }
    },
  },
  Subscription: {
    messageSent: {
      subscribe: (_, { receiverId, senderId }) =>
        pubsub.asyncIterator([
          `${MESSAGE_SENT}_${receiverId}`,
          `${MESSAGE_SENT}_${senderId}`,
        ]),
    },
  },
  
  

  Mutation: {
    signup: async (_, { input }) => {
      try {
        const existingUser = await User.findOne({ username: input.username });
        if (existingUser) {
          throw new ApolloError('Username already exists.', 'USERNAME_EXISTS');
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const newUser = new User({
          ...input,
          password: hashedPassword,
          role: 'User', 
        });

        await newUser.save();
        return { message: 'User successfully created!' };
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error creating user!', 'USER_CREATION_ERROR');
      }
    },


    uploadImages: async (_, { description, file }) => {
      try {
        
        const { createReadStream } = await file;

        
        const buffer = await new Promise((resolve, reject) => {
          const chunks = [];
          const stream = createReadStream();
          
          stream.on('data', chunk => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
          stream.on('error', reject);
        });

        
        const newImage = new Image({
          url: `data:image/jpeg;base64,${buffer}`, 
          description,
        });

        
        await newImage.save();
        return newImage;
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error uploading image!', 'IMAGE_UPLOAD_ERROR');
      }
    },

    updateDemographic: async (_, { id, input }) => {
      try {
        const village = await Village.findById(id);
        if (!village) {
          throw new ApolloError('Village not found!', 'VILLAGE_NOT_FOUND');
        }
    
        
        if (input.genderRatio) {
          village.genderRatio = {
            male: parseFloat(input.genderRatio.male) || 0,
            female: parseFloat(input.genderRatio.female) || 0,
          };
        }
    
        
        if (input.populationDistribution) {
          const totalPercentage = input.populationDistribution.reduce((sum, entry) => sum + parseFloat(entry.percentage), 0);
          if (totalPercentage !== 100) {
            throw new ApolloError('Total percentage of age distribution must equal 100%', 'INVALID_PERCENTAGE');
          }
    
          village.populationDistribution = input.populationDistribution.map((entry) => ({
            ageRange: entry.ageRange.trim(),
            percentage: entry.percentage.trim(),
          }));
        }
    
        
        village.populationSize = input.populationSize || village.populationSize;
        village.populationGrowthRate = input.growthRate || village.populationGrowthRate;
    
        const updatedVillage = await village.save();
        return updatedVillage;
      } catch (error) {
        console.error('Error updating demographic data:', error.message);
        throw new ApolloError('Error updating demographic data!', 'DEMOGRAPHIC_UPDATE_ERROR');
      }
    },
    
  

    deleteVillage: async (_, { id }) => {
      try {
        const deletedVillage = await Village.findByIdAndDelete(id);
        if (!deletedVillage) {
          throw new ApolloError("Village not found!", "VILLAGE_NOT_FOUND");
        }
        return { message: "Village deleted successfully!" };
      } catch (error) {
        console.error('Error deleting village:', error.message);
        throw new ApolloError("Error deleting village!", "VILLAGE_DELETE_ERROR");
      }
    },

    login: async (_, { input }) => {
      try {
        const user = await User.findOne({ username: input.username });
        if (!user || !(await bcrypt.compare(input.password, user.password))) {
          return { success: false, message: 'Invalid username or password.' };
        }

        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET || 'defaultsecret',
          { expiresIn: '1h' }
        );

        return { success: true, message: 'Login successful!', token, user };
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error logging in!', 'LOGIN_ERROR');
      }
    },

    uploadImage: async (_, { description, file }) => {
      try {
        const { createReadStream } = await file;
    
        
        const buffer = await new Promise((resolve, reject) => {
          const chunks = [];
          const stream = createReadStream();
    
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
          stream.on("error", reject);
        });
    
       
        const newImage = new Image({
          url: `data:image/jpeg;base64,${buffer}`, 
          description,
        });
    
        
        await newImage.save();
        return newImage;
      } catch (error) {
        console.error(error);
        throw new ApolloError("Error uploading image!", "IMAGE_UPLOAD_ERROR");
      }
    },
    
    addImage: async (_, { input }) => {
      try {
        
        const imageSizeInBytes = Buffer.byteLength(input.url, 'base64');
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    
        if (imageSizeInBytes > maxSizeInBytes) {
          throw new ApolloError("Image size exceeds the 5MB limit.", "IMAGE_TOO_LARGE");
        }
    
        const newImage = new Image({ ...input });
    
        
        await newImage.save();
        return newImage;
      } catch (error) {
        console.error("Error adding image:", error.message);
        throw new ApolloError("Error adding image!", "IMAGE_ADD_ERROR");
      }
    },
    
    

    

    getVillage: async (_, { id }) => {
      try {
        const village = await Village.findById(id);
        if (!village) {
          throw new ApolloError("Village not found!", "VILLAGE_NOT_FOUND");
        }
        return village;
      } catch (error) {
        console.error(error);
        throw new ApolloError("Error fetching village!", "VILLAGE_FETCH_ERROR");
      }
    },

    sendMessage: async (_, { senderId, recivedId, content }) => {
      console.log('sendMessage inputs:', { senderId, recivedId, content }); 
    
      try {
        const sender = await User.findById(senderId);
        const receiver = await User.findById(recivedId);
    
        if (!sender) throw new ApolloError('Sender not found!', 'SENDER_NOT_FOUND');
        if (!receiver) throw new ApolloError('Receiver not found!', 'RECEIVER_NOT_FOUND');
    
        const newMessage = new MessageChat({ senderId, recivedId, content });
        const savedMessage = await newMessage.save();
    
        console.log('Message saved:', savedMessage); 
    
        pubsub.publish(`${MESSAGE_SENT}_${recivedId}`, { messageSent: savedMessage });
    
        return savedMessage;
      } catch (error) {
        console.error('Error in sendMessage:', error); 
        throw new ApolloError('Error sending message!', 'MESSAGE_SEND_ERROR');
      }
    },
    
       
  
    

    //   async sendMessage(_, { senderId, recivedId, content }) {
    //   try {
    //     // Find sender and receiver users
    //     const sender = await User.findById(senderId);
    //     const receiver = await User.findById(recivedId);

    //     if (!sender || !receiver) {
    //       throw new Error('Sender or Receiver not found');
    //     }

    //     // Create a new message
    //     const newMessage = new Message({
    //       senderId,
    //       recivedId,
    //       content,
    //     });

    //     // Save the message to the database
    //     const savedMessage = await newMessage.save();

    //     return {
    //       success: true,
    //       message: savedMessage,
    //     };
    //   } catch (error) {
    //     console.error(error);
    //     return {
    //       success: false,
    //       error: error.message,
    //     };
    //   }
    // },
    


    updateVillage: async (_, { id, input }) => {
      try {
        const updatedVillage = await Village.findByIdAndUpdate(id, input, { new: true });
        if (!updatedVillage) throw new ApolloError('Village not found!', 'VILLAGE_NOT_FOUND');
        return updatedVillage;
      } catch (error) {
        console.error(error);
        throw new ApolloError('Error updating village!', 'VILLAGE_UPDATE_ERROR');
      }
    },

    addVillage: async (_, { input }) => {
      try {
        const defaultPopulationGrowthRate = 0;
        const defaultPopulationSize = 0;
        const defaultGenderRatio = { male: 0, female: 0 };
        const defaultPopulationDistribution = [
          { ageRange: '0-18', percentage: '0%' },
          { ageRange: '19-35', percentage: '0%' },
          { ageRange: '36-60', percentage: '0%' },
          { ageRange: '60+', percentage: '0%' },
        ];
    
        console.log('Input data received for addVillage:', input);
    
        const newVillage = new Village({
          ...input,
          populationGrowthRate: input.populationGrowthRate || defaultPopulationGrowthRate,
          populationSize: input.populationSize || defaultPopulationSize,
          genderRatio: input.genderRatio || defaultGenderRatio,
          populationDistribution: input.populationDistribution?.length > 0
            ? input.populationDistribution
            : defaultPopulationDistribution,
        });
    
        await newVillage.save();
        return newVillage;
      } catch (error) {
        console.error('Error adding village:', error.message);
        throw new ApolloError('Error adding village!', 'VILLAGE_ADD_ERROR');
      }
    },
    
    
  },
};

module.exports = resolvers;
