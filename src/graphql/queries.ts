import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      first_name
      last_name
      avatar
      language
    }
  }
`;
