const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Upload

  type Image {
    id: ID!
    url: String!
    description: String!
  }

  type User {
    id: ID!
    fullName: String!
    username: String!
    role: String!
  }

type Admin {
  id: ID!
  fullName: String!
  username: String!
  role: String!
}

  type GenderRatio {
    male: Float!
    female: Float!
  }
type Message {
  id: ID!
  senderId: ID!
  recivedId: ID!   # Change receiverId to recivedId
  content: String!
  timestamp: String!
}

  

  type AgeDistribution {
    ageRange: String!
    percentage: String!
  }

  type Village {
    id: ID!
    name: String!
    region: String!
    landArea: Float!
    latitude: Float!
    longitude: Float!
    img: String!
    categories: [String!]!
    populationGrowthRate: Float!
    genderRatio: GenderRatio!
    populationDistribution: [AgeDistribution!]!
    populationSize:Float!
  }

  input SignupInput {
    fullName: String!
    username: String!
    password: String!
  }

  input AddImageInput {
  description: String!
  url: String!
}


  input LoginInput {
    username: String!
    password: String!
  }

 input VillageInput {
  name: String!
  region: String!
  landArea: Float!
  latitude: Float!
  longitude: Float!
  img: String!
  categories: [String!]!
  populationGrowthRate: Float!
  genderRatio: GenderRatioInput
  populationDistribution: [AgeDistributionInput]
  populationSize:Float!
}
  





  input GenderRatioInput {
    male: Float!
    female: Float!
  }

  input AgeDistributionInput {
    ageRange: String!
    percentage: String!
  }

  input DemographicInput {
  genderRatio: GenderRatioInput
  populationDistribution: [AgeDistributionInput]
  populationSize: Float
  growthRate: Float # Add growthRate field to the DemographicInput
}


  type MessageResponse {
    message: String!
  }

  type AuthResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
  }

type Query {
  hello: String
  getUser(id: ID!): User
  getUsers: [User]
  getImages: [Image!]!
  getImage(id: ID!): Image
  getVillage(id: ID!): Village
  getVillages: [Village!]! # Add this line
      getMessages(userId: ID!, adminId: ID!): [Message!] # Query to fetch messages between user and admin

    getAdmins: [Admin]
      getttuserss: [User!]!  # This defines the query to get all users with the 'User' role



}

  type Subscription {
  villageAdded: Village
messageSent(receiverId: ID!, senderId: ID!): Message!
}



  type Mutation {
    signup(input: SignupInput!): MessageResponse!
    login(input: LoginInput!): AuthResponse!
    uploadImage(description: String!, file: Upload!): Image!
    addVillage(input: VillageInput!): Village!
      deleteVillage(id: ID!): MessageResponse!
      updateVillage(id: ID!, input: VillageInput!): Village!
      getVillage(id: ID!): Village
      updateDemographic(id: ID!, input: DemographicInput!): Village!
      uploadImages(description: String!, file: String!): Image!
      addImage(input: AddImageInput!): Image!
  sendMessage(senderId: ID!, recivedId: ID!, content: String!): Message # Change receiverId to recivedId


  }
`;

module.exports = typeDefs;
