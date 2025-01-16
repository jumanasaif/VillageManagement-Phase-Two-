// server.js
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { PubSub } = require('graphql-subscriptions');

// Port configuration
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/signup-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }

  // Initialize Express app
  const app = express();

  // Increase the payload size limit
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Middleware for handling file uploads
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use('/uploads', express.static(path.resolve('uploads')));

  // Create the schema
  const pubsub = new PubSub();
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Create an HTTP server
  const httpServer = createServer(app);

  // Setup WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer({
    schema,
    context: () => ({ pubsub }), // Pass pubsub to subscriptions
  }, wsServer);

  // Apollo Server setup with Express
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      req,
      pubsub, // Pass pubsub to resolvers
    }),
    uploads: false,
  });

  // Start Apollo Server
  await server.start();
  server.applyMiddleware({ app });

  // Start both HTTP and WebSocket servers
  httpServer.listen(PORT, () => {
    console.log(`\uD83D\uDE80 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`\uD83D\uDD17 WebSocket server running at ws://localhost:${PORT}/graphql`);
  });
})();
