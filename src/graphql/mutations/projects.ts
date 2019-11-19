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

export const UPDATE_PROJECT = gql`
  mutation (
    $project_id: ID!
    $name: String!
    $description: String
    $icon: String!
    $type: String!
    $responsive: String!
  ) {
    updateProject(
      project_id: $project_id
      name: $name
      description: $description
      icon: $icon
      type: $type
      responsive: $responsive
    ) {
      id
    }
  }
`;

export const COMMIT = gql`
  mutation (
    $name: String!
    $description: String!
    $content: String!
    $project_id: ID!
  ) {
    commit(
      name: $name
      description: $description
      content: $content
      project_id: $project_id
    ) {
      id
      content
    }
  }
`;
