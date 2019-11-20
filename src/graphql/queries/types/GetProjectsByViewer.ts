/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectsByViewer
// ====================================================

export interface GetProjectsByViewer_projectsByViewer_contributors {
  __typename: "User";
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface GetProjectsByViewer_projectsByViewer_owner {
  __typename: "ProjectOwner";
  id: string;
  avatar: string;
  name: string;
}

export interface GetProjectsByViewer_projectsByViewer {
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
  contributors: GetProjectsByViewer_projectsByViewer_contributors[] | null;
  owner: GetProjectsByViewer_projectsByViewer_owner;
}

export interface GetProjectsByViewer {
  projectsByViewer: (GetProjectsByViewer_projectsByViewer | null)[] | null;
}
