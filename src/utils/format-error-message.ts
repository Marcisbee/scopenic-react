export function formatErrorMessage(error: any, setErrors: any): string | undefined {
  const firstError = error.graphQLErrors
    && error.graphQLErrors[0];

  if (firstError && firstError.extensions
    && firstError.extensions.code === 'BAD_USER_INPUT'
    && firstError.extensions.validation) {
    setErrors(firstError.extensions.validation);
    return;
  }

  return (firstError && firstError.message) || error.message;
}
