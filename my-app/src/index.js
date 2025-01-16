import React from 'react';
import './index.css'; // Ensure this is imported in index.js

import { createRoot } from 'react-dom/client'; // Use createRoot from React 18
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Backend GraphQL API endpoint
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById('root')); // Create a root
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);