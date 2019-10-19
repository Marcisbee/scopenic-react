import cc from 'classcat';
import { Field, Form, Formik, FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import SettingsBlock from '../../components/settings-block';
import { useAuth } from '../../hooks/use-auth';
import styles from '../../shared.module.scss';

const UpdateUserDataSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  first_name: Yup.string()
    .required('Required'),
  last_name: Yup.string()
    .required('Required'),
});

const UpdateUserPasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Required'),

  confirmNewPassword: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('newPassword'), null], 'New password must match'),
  newPassword: Yup.string()
    .required('Required'),
});

interface IFormInputProps {
  name: string;
  type?: 'vertical' | 'horizontal';
  label?: string;
  required?: boolean;
  input?: React.InputHTMLAttributes<HTMLInputElement>;
  touched?: FormikTouched<any>;
  error?: FormikErrors<any>;
  component: (props: { name: string, touched: boolean, error: boolean, hasError: boolean }) => React.ReactNode;
}

const FormInput: React.FC<IFormInputProps> = ({
  name,
  type,
  label,
  required,
  error: errorRecord,
  touched: touchedRecord,
  component,
}: any) => {
  const touched = touchedRecord && touchedRecord[name];
  const error = errorRecord && errorRecord[name];

  const errorBlock = touched && error && (
    <div className="inline-error">{error}</div>
  );
  const requiredBlock = required && (
    <span className="pt-text-muted">(required)</span>
  );

  if (type === 'horizontal') {
    return (
      <label className="pt-large pt-label pt-fill pt-inline">
        <div className="grid">
          <span className="column">
            {label && (
              <>
                {label}
                {requiredBlock}
              </>
            )}
          </span>
          <span className="column bigger">
            {component({ name, touched, error, hasError: !!errorBlock })}
            {errorBlock}
          </span>
        </div>
      </label>
    );
  }

  return (
    <label className="pt-large pt-label">
      {label && (
        <div>
          {label}
          {requiredBlock}
          {errorBlock}
        </div>
      )}
      {component({ name, touched, error, hasError: !!errorBlock })}
    </label>
  );
};

function formatErrorMessage(error: any, setErrors: any): string | undefined {
  const firstError = error.graphQLErrors
    && error.graphQLErrors[0];

  if (firstError.extensions
    && firstError.extensions.code === 'BAD_USER_INPUT'
    && firstError.extensions.validation) {
    setErrors(firstError.extensions.validation);
    return;
  }

  return firstError.message || error.message;
}

const Settings: React.FC = () => {
  const { user, updateUser, updatePassword } = useAuth();

  return (
    <div>
      <div className={styles.heading}>
        <h1>Settings</h1>
      </div>

      <SettingsBlock
        icon="id-card"
        color="#0a8ffb"
        title="Profile details"
        description="General profile information"
        open={true}
      >
        <Formik
          initialValues={user}
          validationSchema={UpdateUserDataSchema}
          onSubmit={async (values, actions) => {
            actions.setStatus();

            await updateUser(values)
              .then((response) => {
                if (!response.data || !response.data.updateUserData) {
                  throw new Error('Something went wrong');
                }

                actions.resetForm();
                actions.setStatus({ success: 'Changes saved!' });
              })
              .catch((error) => {
                const errorMessage = formatErrorMessage(error, actions.setErrors);

                if (!errorMessage) {
                  return;
                }

                actions.setStatus({ error: errorMessage });
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
        >
          {({ touched, dirty, isValidating, isSubmitting, status = {}, errors }) => (
            <Form className="pure-form pure-form-stacked">
              <fieldset>
                {status.error && (
                  <div className="m-b-30 pt-callout pt-callout-icon pt-intent-danger">
                    <i className="im im-warning" />
                    <h4 className="pt-callout-title">Error ocurred</h4>
                    {status.error}
                  </div>
                )}

                {status.success && (
                  <div className="m-b-30 pt-callout pt-callout-icon pt-intent-success">
                    <i className="im im-check-mark" />
                    <h4 className="pt-callout-title">{status.success}</h4>
                  </div>
                )}

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="First name"
                    required={true}
                    name="first_name"
                    touched={touched}
                    error={errors}
                    component={({ hasError, name }) => (
                      <Field
                        name={name}
                        className={cc([
                          'pt-large pt-input',
                          hasError && 'pt-intent-danger',
                        ])}
                        type="text"
                      />
                    )}
                  />
                </div>

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Last name"
                    required={true}
                    name="last_name"
                    touched={touched}
                    error={errors}
                    component={({ hasError, name }) => (
                      <Field
                        name={name}
                        className={cc([
                          'pt-large pt-input',
                          hasError && 'pt-intent-danger',
                        ])}
                        type="text"
                      />
                    )}
                  />
                </div>

                <hr />

                <p className="pt-text-small pt-text-muted">
                  E-mail is only visible to you and organization members
                  you are part of (you login to your account with it).
                </p>

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="E-mail address"
                    required={true}
                    name="email"
                    touched={touched}
                    error={errors}
                    component={({ hasError, name }) => (
                      <Field
                        name={name}
                        className={cc([
                          'pt-large pt-input',
                          hasError && 'pt-intent-danger',
                        ])}
                        type="email"
                        autoComplete="email"
                      />
                    )}
                  />
                </div>

                <hr />

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Avatar"
                    name="avatar"
                    touched={touched}
                    error={errors}
                    component={({ hasError, name }) => (
                      <Field
                        name={name}
                        className={cc([
                          'pt-large pt-input',
                          hasError && 'pt-intent-danger',
                        ])}
                        type="text"
                      />
                    )}
                  />
                </div>

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Language"
                    name="language"
                    touched={touched}
                    error={errors}
                    component={({ hasError, name }) => (
                      <Field name={name}>
                        {({ field }: any) => (
                          <div
                            className={cc([
                              'pt-large pt-select',
                              hasError && 'pt-intent-danger',
                            ])}
                          >
                            <select {...field}>
                              <option value="en">English</option>
                              <option value="lv">Latvian</option>
                            </select>
                          </div>
                        )}
                      </Field>
                    )}
                  />
                </div>

                <hr />

                <div className="text-right">
                  {dirty && (
                    <span className="pt-text-small pt-text-muted m-r-20">You have unsaved changes</span>
                  )}
                  <button
                    type="submit"
                    className={cc([
                      'pt-button pt-large pt-intent-success',
                      (isSubmitting || isValidating) && 'pt-loading',
                    ])}
                    disabled={!dirty || isSubmitting || isValidating}
                  >
                    Save changes
                  </button>
                </div>
              </fieldset>
            </Form>
          )}
        </Formik>

      </SettingsBlock>

      <SettingsBlock
        icon="shield"
        color="#d62828"
        title="Security settings"
        description="Change current password, enable two-factor authentification"
      >
        <Formik
          initialValues={{
            currentPassword: '',

            confirmNewPassword: '',
            newPassword: '',
          }}
          validationSchema={UpdateUserPasswordSchema}
          onSubmit={async (values, actions) => {
            actions.setStatus();

            await updatePassword({
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            })
              .then((response) => {
                if (!response.data || !response.data.updateUserPassword) {
                  throw new Error('Something went wrong');
                }

                actions.resetForm({
                  currentPassword: '',

                  confirmNewPassword: '',
                  newPassword: '',
                });
                actions.setStatus({ success: 'Changes saved!' });
              })
              .catch((error) => {
                const errorMessage = formatErrorMessage(error, actions.setErrors);

                if (!errorMessage) {
                  return;
                }

                actions.setStatus({ error: errorMessage });
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
        >
          {({ touched, dirty, isValidating, isSubmitting, status = {}, errors }) => (
            <Form className="pure-form pure-form-stacked">
              <fieldset>
                {status.error && (
                  <div className="m-b-30 pt-callout pt-callout-icon pt-intent-danger">
                    <i className="im im-warning" />
                    <h4 className="pt-callout-title">Error ocurred</h4>
                    {status.error}
                  </div>
                )}

                {status.success && (
                  <div className="m-b-30 pt-callout pt-callout-icon pt-intent-success">
                    <i className="im im-check-mark" />
                    <h4 className="pt-callout-title">{status.success}</h4>
                  </div>
                )}

                <input
                  hidden={true}
                  defaultValue={user.email}
                  type="email"
                  autoComplete="email"
                />

                <p className="pt-text-small pt-text-muted">
                  Old password is your current password.
                </p>

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Old password"
                    name="currentPassword"
                    touched={touched}
                    error={errors}
                    component={({ hasError, name }) => (
                      <Field
                        name={name}
                        className={cc([
                          'pt-large pt-input',
                          hasError && 'pt-intent-danger',
                        ])}
                        type="password"
                        autoComplete="current-password"
                      />
                    )}
                  />
                </div>

                <hr />

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="New password"
                    name="newPassword"
                    touched={touched}
                    error={errors}
                    component={({ hasError, name }) => (
                      <Field
                        name={name}
                        className={cc([
                          'pt-large pt-input',
                          hasError && 'pt-intent-danger',
                        ])}
                        type="password"
                        autoComplete="new-password"
                      />
                    )}
                  />
                </div>

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Confirm new password"
                    name="confirmNewPassword"
                    touched={touched}
                    error={errors}
                    component={({ hasError, name }) => (
                      <Field
                        name={name}
                        className={cc([
                          'pt-large pt-input',
                          hasError && 'pt-intent-danger',
                        ])}
                        type="password"
                        autoComplete="new-password"
                      />
                    )}
                  />
                </div>

                <hr />

                <div className="text-right">
                  {dirty && (
                    <span className="pt-text-small pt-text-muted m-r-20">You have unsaved changes</span>
                  )}
                  <button
                    type="submit"
                    className={cc([
                      'pt-button pt-large pt-intent-success',
                      (isSubmitting || isValidating) && 'pt-loading',
                    ])}
                    disabled={!dirty || isSubmitting || isValidating}
                  >
                    Save changes
                  </button>
                </div>
              </fieldset>
            </Form>
          )}
        </Formik>
      </SettingsBlock>
    </div>
  );
};

export default Settings;
