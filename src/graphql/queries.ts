import gql from 'graphql-tag';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
    }
  }
`;

export const LOGIN = gql`
  mutation Login(
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      id
    }
  }
`;
