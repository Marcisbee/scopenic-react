import cc from 'classcat';
import { Field, Form, Formik } from 'formik';
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
  type?: 'vertical' | 'horizontal';
  label?: string;
  required?: boolean;
  input?: React.InputHTMLAttributes<HTMLInputElement>;
  touched?: boolean;
  error?: string;
}

const FormInput: React.FC<IFormInputProps> = ({
  type,
  label,
  required,
  error,
  touched,
  children,
}: any) => {
  const errorBlock = touched && error && (
    <div>{error}</div>
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
            {children}
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
      {children}
    </label>
  );
};

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
                    error={errors.first_name}
                    touched={touched.first_name}
                  >
                    <Field
                      name="first_name"
                      className="pt-large pt-input"
                      type="text"
                    />
                  </FormInput>
                </div>

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Last name"
                    required={true}
                    error={errors.last_name}
                    touched={touched.last_name}
                  >
                    <Field
                      name="last_name"
                      className="pt-large pt-input"
                      type="text"
                    />
                  </FormInput>
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
                    error={errors.email}
                    touched={touched.email}
                  >
                    <Field
                      name="email"
                      className="pt-large pt-input"
                      type="email"
                      autoComplete="email"
                    />
                  </FormInput>
                </div>

                <hr />

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Avatar"
                    required={true}
                    error={errors.avatar}
                    touched={touched.avatar}
                  >
                    <Field
                      name="avatar"
                      className="pt-large pt-input"
                      type="text"
                    />
                  </FormInput>
                </div>

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Language"
                    required={true}
                    error={errors.language}
                    touched={touched.language}
                  >
                    <Field
                      name="language"
                      className="pt-large pt-input"
                      type="text"
                    />
                  </FormInput>
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
                    touched={touched.currentPassword}
                    error={errors.currentPassword}
                  >
                    <Field
                      name="currentPassword"
                      className="pt-large pt-input"
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormInput>
                </div>

                <hr />

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="New password"
                    touched={touched.newPassword}
                    error={errors.newPassword}
                  >
                    <Field
                      name="newPassword"
                      className="pt-large pt-input"
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormInput>
                </div>

                <div className="field">
                  <FormInput
                    type="horizontal"
                    label="Confirm new password"
                    touched={touched.confirmNewPassword}
                    error={errors.confirmNewPassword}
                  >
                    <Field
                      name="confirmNewPassword"
                      className="pt-large pt-input"
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormInput>
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
