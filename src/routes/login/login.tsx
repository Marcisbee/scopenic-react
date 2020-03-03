import cc from 'classcat';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { Redirect } from 'react-router';
import * as Yup from 'yup';

import FieldError from '../../components/field-error';
import { useAuth, useLoggedInGuard } from '../../hooks/use-auth';

interface ILoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape<ILoginFormValues>({
  email: Yup.string()
    .email('Invalid email')
    .required('Field is required'),
  password: Yup.string()
    .required('Field is required'),
});

const Login: React.FC<any> = () => {
  const { signin } = useAuth();
  const redirect = useLoggedInGuard();
  const formMethods = useForm<ILoginFormValues>({ validationSchema });
  const [status, setStatus] = useState<Record<string, any>>({});
  const { register, errors, handleSubmit, formState } = formMethods;

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  const onSubmit = async (values: ILoginFormValues) => {
    await signin(values.email, values.password)
      .then((response) => {
        if (!response.data || !response.data.login) {
          throw new Error('Something went wrong');
        }
      })
      .catch((error) => {
        const errorMessage = error.graphQLErrors
          && error.graphQLErrors[0]
          && error.graphQLErrors[0].message
          || error.message;

        setStatus({ error: errorMessage });
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <FormContext {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            {status.error && (
              <div>{status.error}</div>
            )}
            <div className="field">
              <input
                name="email"
                className={cc({ error: errors.email })}
                type="email"
                autoComplete="email"
                ref={register}
              />
              <FieldError name="email" />
            </div>
            <div className="field">
              <input
                name="password"
                className={cc({ error: errors.password })}
                type="password"
                autoComplete="current-password"
                ref={register}
              />
              <FieldError name="password" />
            </div>
            <button className="pure-button" type="submit" disabled={formState.isSubmitting}>Login</button>
          </fieldset>
        </form>
      </FormContext>
    </div>
  );
};

export default Login;
