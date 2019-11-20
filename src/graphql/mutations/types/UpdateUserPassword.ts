/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserPassword
// ====================================================

export interface UpdateUserPassword_updateUserPassword {
  __typename: "User";
  id: string;
}

export interface UpdateUserPassword {
  updateUserPassword: UpdateUserPassword_updateUserPassword | null;
}

export interface UpdateUserPasswordVariables {
  newPassword: string;
  currentPassword: string;
}
