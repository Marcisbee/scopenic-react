import React from 'react';
import cc from 'classcat';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/react-hooks';

import { useAuth } from '../../context/auth';
import FieldError from '../../components/field-error';
import { LOGIN } from '../../graphql/queries';

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .required('Required'),
});

const Login: React.FC<any> = () => {
  const { setAuthToken } = useAuth();
  const [login] = useMutation(LOGIN);

  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={SignupSchema}
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
          actions.setError(null);

          await login({ variables: values })
            .then((response) => {
              if (!response.data || !response.data.login) {
                throw new Error('Email or password was incorrect!');
              }

              actions.setStatus({ response, success: 'Logged in' });
              setAuthToken(response.data.login.id);
            })
            .catch((error) => {
              actions.setError(error.message);
            })
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
      >
        {({ isValidating, isSubmitting, status, error, errors }) => (
          <Form>
            <fieldset disabled={isSubmitting}>
              <div>{status && status.success}</div>
              <div>{error}</div>
              <br/>
              <Field
                name="email"
                className={cc({ error: errors.email })}
                type="email"
                autoComplete="current-email"
              />
              <ErrorMessage component={FieldError} name="email" />
              <Field
                name="password"
                className={cc({ error: errors.password })}
                type="password"
                autoComplete="current-password"
              />
              <ErrorMessage component={FieldError} name="password" />
              <button type="submit" disabled={isSubmitting || isValidating}>Login</button>
            </fieldset>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
