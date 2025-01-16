import { gql } from '@apollo/client';

export const GET_IMAGES = gql`
  query GetImages {
    getImages {
      id
      url
      description
    }
  }
`;

export const UPLOAD_IMAGE = gql`
mutation uploadImage($description: String!, $file: Upload!) {
  uploadImage(description: $description, file: $file) {
    id
    url
    description
  }
}

`;




export const GET_VILLAGES = gql`
  query GetVillages {
    getVillages {
      id
      name
      region
      landArea
      latitude
      longitude
      img
      categories
      populationGrowthRate
     populationSize
      genderRatio {
      male
      female
    }
 
  }
}
`;

export const ADD_VILLAGE = gql`
mutation AddVillage($input: VillageInput!) {
  addVillage(input: $input) {
    id
    name
    region
    landArea
    latitude
    longitude
    img
    categories
    populationGrowthRate
    populationSize
    genderRatio {
      male
      female
    }
    populationDistribution {
      ageRange
      percentage
    }
  }
}
`;



export const GET_VILLAGE_BY_ID = gql`
  query GetVillageById($id: ID!) {
    getVillage(id: $id) {
      id
      name
      region
      landArea
      latitude
      longitude
      img
      categories
      populationGrowthRate
    }
  }
`;

export const DELETE_VILLAGE = gql`
  mutation DeleteVillage($id: ID!) {
    deleteVillage(id: $id) {
      message
    }
  }
`;

export const UPDATE_VILLAGE = gql`
  mutation UpdateVillage($id: ID!, $input: VillageInput!) {
    updateVillage(id: $id, input: $input) {
      id
      name
      region
      landArea
      latitude
      longitude
      img
      



    }
  }
`;

export const GET_DEMOGRAPHIC = gql`
  query GetDemographicData($id: ID!) {
    village(id: $id) {
      id
      name
      populationSize
      genderRatio {
        male
        female
      }
      populationDistribution {
        ageRange
        percentage
      }
      populationGrowthRate
    }
  }
`;




export const GET_ADMINS = gql`
  query GetAdmins {
    getAdmins {
      id
      fullName
      username
     
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($senderId: ID!, $receiverId: ID!, $content: String!) {
    sendMessage(senderId: $senderId, receiverId: $receiverId, content: $content) {
      id
      content
    }
  }
`;

export const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageSent($receiverId: ID!) {
    messageSent(receiverId: $receiverId) {
      id
      content
      senderId
    }
  }
`;


