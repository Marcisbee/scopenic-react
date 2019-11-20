/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectById
// ====================================================

export interface GetProjectById_project_contributors {
  __typename: "User";
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface GetProjectById_project_owner {
  __typename: "ProjectOwner";
  id: string;
  avatar: string;
  name: string;
}

export interface GetProjectById_project {
  __typename: "Project";
  id: string;
  name: string;
  image: string;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isArchived: boolean;
  url: string;
  views: number;
  type: string;
  responsive: string;
  data: string;
  contributors: GetProjectById_project_contributors[] | null;
  owner: GetProjectById_project_owner;
}

export interface GetProjectById {
  project: GetProjectById_project | null;
}

export interface GetProjectByIdVariables {
  id: string;
}
