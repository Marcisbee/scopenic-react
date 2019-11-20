/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectsByOwner
// ====================================================

export interface GetProjectsByOwner_projectsByOwner_contributors {
  __typename: "User";
  first_name: string;
  last_name: string;
}

export interface GetProjectsByOwner_projectsByOwner {
  __typename: "Project";
  id: string;
  name: string;
  contributors: GetProjectsByOwner_projectsByOwner_contributors[] | null;
}

export interface GetProjectsByOwner {
  projectsByOwner: (GetProjectsByOwner_projectsByOwner | null)[] | null;
}

export interface GetProjectsByOwnerVariables {
  owner_id: string;
}
