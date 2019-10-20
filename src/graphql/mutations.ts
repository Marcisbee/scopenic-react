import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation (
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const UPDATE_USER_DATA = gql`
  mutation (
    $email: String!
    $first_name: String!
    $last_name: String!
    $avatar: URI
    $language: String!
  ) {
    updateUserData(
      email: $email
      first_name: $first_name
      last_name: $last_name
      avatar: $avatar
      language: $language
    ) {
      token
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation (
    $newPassword: String!
    $currentPassword: String!
  ) {
    updateUserPassword(
      newPassword: $newPassword
      currentPassword: $currentPassword
    ) {
      id
    }
  }
`;
