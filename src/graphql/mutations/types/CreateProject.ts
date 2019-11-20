/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateProject
// ====================================================

export interface CreateProject_createProject {
  __typename: "Project";
  id: string;
}

export interface CreateProject {
  createProject: CreateProject_createProject | null;
}

export interface CreateProjectVariables {
  name: string;
  description: string;
  isPrivate: boolean;
  type: string;
  responsive: string;
}
