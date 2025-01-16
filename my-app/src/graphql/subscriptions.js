import { gql } from '@apollo/client';

export const VILLAGE_ADDED_SUBSCRIPTION = gql`
  subscription OnVillageAdded {
    villageAdded {
      id
      name
      region
      demographicData
    }
  }
`;
