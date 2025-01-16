# 🏡 Village Management System

## 📖 Application Description

The **Village Management System** is designed to manage and display information about various villages, including their demographics, geographical data, and administrative details.

---

## 👥 Roles

### 1. **User Role:**
- Explore village demographics, geographical data, and public facilities.
- No permissions for adding, editing, or managing data.

### 2. **Admin Role:**
- Full management access to village data, including CRUD operations for village information.

---

## 🚀 Technology Stack and Setup

**Technologies Used:**

- **React**: For building a dynamic and interactive user interface.
- **Tailwind CSS**: For responsive and customizable styling.
- **Node.js**: For the back-end server to handle logic and data processing.
- **GraphQL**: For efficient data querying and management.
- **MongoDB**: As the database to store and manage application data.
- **WebSocket**: To enable real-time communication for chat functionality.

---
## ✨ Features

### 🧑‍🤝‍🧑 User Management
- **User registration and authentication**: Secure sign-up, login, and session management for users.
- **Fetch user details**: View the profile and details of the logged-in user.
- **List all users**: Display a list of all registered users.

### 🏘️ Village Management
- **Add, update, delete, and retrieve village details**: Admins can manage village data including name, demographics, and geographical data.
- **Manage demographic data**: Includes gender ratio, population distribution, and growth rate for each village.

### 💬 Messaging System
- **Real-time messaging**: Enables real-time communication between users and admins using subscriptions.
- **Query message history**: Users and admins can query past messages between them to view previous conversations.

### 🖼️ Image Management
- **Upload and manage images**: Users and admins can upload images related to villages or user profiles.
- **Fetch image details and list all uploaded images**: View and manage the images uploaded in the system.

### 📡 GraphQL Subscriptions
- **Real-time updates**: Get instant updates for messaging and village additions through GraphQL subscriptions.

---
## 🛠️ Project Components Built

### 1. **Login_Signup**
- Allows users to log in or register with form validation and error handling for both login and signup processes.

### 2. **Dashboard**
- Provides navigation links to key sections such as Village Overview, Village Management, Gallery, and Chat, allowing users to easily access and manage different parts of the application.

### 3. **Overview**
- Displays an interactive map with village markers.
- Shows key statistics (total villages, urban areas, population, and average land area).
- Visualizes age distribution, gender ratios, and population size with charts.

### 4. **Village Management**
- Displays a list of villages with features like search, pagination, and sorting.
- Allows adding, viewing, updating, and deleting villages.
- Supports demographic updates for each village.
- Conditional rendering based on user roles.

### 5. **Chat**
- A component for users and admins to send and receive messages in real-time.

### 6. **Gallery**
- Displays images pertinent to the village, allowing admins to upload new images, while users can only view them.

---


