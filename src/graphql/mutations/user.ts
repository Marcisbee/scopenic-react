import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation Login (
    $email: String!
    $password: String!
  ) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const UPDATE_USER_DATA = gql`
  mutation UpdateUserData (
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
      token
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword (
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
