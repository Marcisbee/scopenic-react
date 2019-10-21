import gql from 'graphql-tag';

export const GET_PROJECTS_BY_OWNER = gql`
  query(
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
  query {
    projectsByViewer {
      id
      name
      image
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
