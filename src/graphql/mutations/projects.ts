import gql from 'graphql-tag';

export const CREATE_PROJECT = gql`
  mutation (
    $name: String!
    $description: String!
    $isPrivate: Boolean!
    $type: String!
    $responsive: String!
  ) {
    createProject(
      name: $name
      description: $description
      isPrivate: $isPrivate
      type: $type
      responsive: $responsive
    ) {
      id
    }
  }
`;
