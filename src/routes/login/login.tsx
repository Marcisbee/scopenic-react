import cc from 'classcat';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React from 'react';
import { Redirect } from 'react-router';
import * as Yup from 'yup';

import FieldError from '../../components/field-error';
import { useAuth, useLoggedInGuard } from '../../hooks/use-auth';

const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .required('Required'),
});

const Login: React.FC<any> = () => {
  const redirect = useLoggedInGuard();
  const { signin } = useAuth();

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={SigninSchema}
        // validate={async (values) => {
        //   const errors: Record<string, any> = {};
        //   await sleep(1000);

        //   if (values.name[0] !== 'M') {
        //     errors.name = 'Name should start with "M"!!';
        //   }

        //   if (Object.keys(errors).length) {
        //     throw errors;
        //   }
        // }}
        onSubmit={async (values, actions) => {
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

              actions.setStatus({ error: errorMessage });
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
      >
        {({ isValidating, isSubmitting, status = {}, errors }) => (
          <Form className="pure-form pure-form-stacked">
            <fieldset disabled={isSubmitting}>
              {status.error && (
                <div>{status.error}</div>
              )}
              <div className="field">
                <Field
                  name="email"
                  className={cc({ error: errors.email })}
                  type="email"
                  autoComplete="email"
                />
                <ErrorMessage component={FieldError} name="email" />
              </div>
              <div className="field">
                <Field
                  name="password"
                  className={cc({ error: errors.password })}
                  type="password"
                  autoComplete="current-password"
                />
                <ErrorMessage component={FieldError} name="password" />
              </div>
              <button className="pure-button" type="submit" disabled={isSubmitting || isValidating}>Login</button>
            </fieldset>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
