import React from 'react';
import cc from 'classcat';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/react-hooks';

import { useAuth } from '../../context/auth';
import FieldError from '../../components/field-error';
import { LOGIN } from '../../graphql/mutations';

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
          await login({ variables: values })
            .then((response) => {
              if (!response.data || !response.data.login) {
                throw new Error('Email or password was incorrect!');
              }

              actions.setStatus({ success: response.data.login });
              setAuthToken(response.data.login.id);
            })
            .catch((error) => {
              actions.setStatus({ error: error.message });
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
}

export default Login;
