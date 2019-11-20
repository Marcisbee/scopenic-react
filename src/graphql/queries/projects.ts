import gql from 'graphql-tag';

export const GET_PROJECTS_BY_OWNER = gql`
  query GetProjectsByOwner (
    $owner_id: ID!
  ) {
    projectsByOwner(owner_id: $owner_id) {
      id
      name
      contributors {
        first_name
        last_name
      }
    }
  }
`;

export const GET_PROJECTS_BY_VIEWER = gql`
  query GetProjectsByViewer {
    projectsByViewer {
      id
      name
      image
      icon
      description
      createdAt
      updatedAt
      isPrivate
      isArchived
      url
      views
      type
      responsive
      contributors {
        id
        first_name
        last_name
        avatar
      }
      owner {
        id
        avatar
        name
      }
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById (
    $id: ID!
  ) {
    project(id: $id) {
      id
      name
      image
      icon
      description
      createdAt
      updatedAt
      isPrivate
      isArchived
      url
      views
      type
      responsive
      data
      contributors {
        id
        first_name
        last_name
        avatar
      }
      owner {
        id
        avatar
        name
      }
    }
  }
`;
