/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserData
// ====================================================

export interface UpdateUserData_updateUserData {
  __typename: "Session";
  token: string;
}

export interface UpdateUserData {
  updateUserData: UpdateUserData_updateUserData | null;
}

export interface UpdateUserDataVariables {
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
  language: string;
}
