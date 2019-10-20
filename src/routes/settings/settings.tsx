import cc from 'classcat';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

import { ReactComponent as AlertIcon } from '../../assets/svg/icons/alert.icon.svg';
import { ReactComponent as CheckIcon } from '../../assets/svg/icons/check.icon.svg';
import { ReactComponent as PersonIcon } from '../../assets/svg/icons/person.icon.svg';
import { ReactComponent as ShieldCheckIcon } from '../../assets/svg/icons/shield-check.icon.svg';
import FormInput from '../../components/form-input';
import SettingsBlock from '../../components/settings-block';
import { useAuth } from '../../hooks/use-auth';
import styles from '../../shared.module.scss';
import { formatErrorMessage } from '../../utils/format-error-message';

const UpdateUserDataSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Field is required'),
  first_name: Yup.string()
    .required('Field is required'),
  last_name: Yup.string()
    .required('Field is required'),
});

const UpdateUserPasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Field is required'),

  confirmNewPassword: Yup.string()
    .required('Field is required')
    .oneOf([Yup.ref('newPassword'), null], 'New password must match'),
  newPassword: Yup.string()
    .required('Field is required'),
});

const Settings: React.FC = () => {
  const { user, updateUser, updatePassword } = useAuth();

  return (
    <div>
      <div className={styles.heading}>
        <h1>Settings</h1>
      </div>

      <SettingsBlock
        icon={
          <PersonIcon className="sc-settings-icon-fg" />
        }
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
                    <AlertIcon className="im" />
                    <h4 className="pt-callout-title">Error ocurred</h4>
                    {status.error}
                  </div>
                )}

                {status.success && (
                  <div className="m-b-30 pt-callout pt-callout-icon pt-intent-success">
                    <CheckIcon className="im" />
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
        icon={
          <ShieldCheckIcon className="sc-settings-icon-fg" />
        }
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
                    <AlertIcon className="im" />
                    <h4 className="pt-callout-title">Error ocurred</h4>
                    {status.error}
                  </div>
                )}

                {status.success && (
                  <div className="m-b-30 pt-callout pt-callout-icon pt-intent-success">
                    <CheckIcon className="im" />
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
