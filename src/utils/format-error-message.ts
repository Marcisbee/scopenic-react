export function formatErrorMessage(error: any, setError: any): string | undefined {
  const firstError = error.graphQLErrors
    && error.graphQLErrors[0];

  if (firstError && firstError.extensions
    && firstError.extensions.code === 'BAD_USER_INPUT'
    && firstError.extensions.validation) {
    const keys = Object.keys(firstError.extensions.validation);
    keys.forEach((key) => {
      setError(
        key,
        'apiValidation',
        firstError.extensions.validation[key],
      );
    });
    return;
  }

  return (firstError && firstError.message) || error.message;
}
