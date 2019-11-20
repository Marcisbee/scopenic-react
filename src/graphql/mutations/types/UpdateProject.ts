/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateProject
// ====================================================

export interface UpdateProject_updateProject {
  __typename: "Project";
  id: string;
}

export interface UpdateProject {
  updateProject: UpdateProject_updateProject | null;
}

export interface UpdateProjectVariables {
  project_id: string;
  name: string;
  description?: string | null;
  icon: string;
  type: string;
  responsive: string;
}
