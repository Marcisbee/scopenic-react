import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation (
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      id
    }
  }
`;

export const UPDATE_USER_DATA = gql`
  mutation (
    $email: String!
    $first_name: String!
    $last_name: String!
    $avatar: String
    $language: String!
  ) {
    updateUserData(
      email: $email
      first_name: $first_name
      last_name: $last_name
      avatar: $avatar
      language: $language
    ) {
      email
      first_name
      last_name
      avatar
      language
    }
  }
`;
