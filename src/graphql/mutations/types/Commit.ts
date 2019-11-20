/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Commit
// ====================================================

export interface Commit_commit {
  __typename: "Commit";
  id: string;
  content: string;
}

export interface Commit {
  commit: Commit_commit | null;
}

export interface CommitVariables {
  name: string;
  description: string;
  content: string;
  project_id: string;
}
