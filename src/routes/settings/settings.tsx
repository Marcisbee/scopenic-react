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

interface IFormInputProps {
  type?: 'vertical' | 'horizontal';
  label?: string;
  required?: boolean;
  input?: React.InputHTMLAttributes<HTMLInputElement>;
  error?: string;
}

const FormInput: React.FC<IFormInputProps> = ({
  type,
  label,
  required,
  error,
  children,
}) => {
  const errorBlock = error && (
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
  const { user, updateUser } = useAuth();

  return (
    <div>
      <div className={styles.heading}>
        <h1>Settings</h1>
      </div>

      <SettingsBlock
        icon="id-card"
        color="#0a8ffb"
        title="Profile details"
        description="Lorem ipsum"
      >
        <Formik
          initialValues={user}
          validationSchema={UpdateUserDataSchema}
          onSubmit={async (values, actions) => {
            await updateUser(values)
              .then((response: any) => {
                if (!response.data || !response.data.updateUserData) {
                  throw new Error('Something went wrong');
                }

                actions.setStatus({ success: 'Changes saved!' });
              })
              .catch((error: any) => {
                actions.setStatus({ error: error.message });
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          }}
        >
          {({ touched, isValidating, isSubmitting, status = {}, errors }) => {
            const unsavedChanges = Object.values(touched).indexOf(true) > -1;

            return (
              <Form className="pure-form pure-form-stacked">
                <fieldset disabled={isSubmitting}>
                  {status.error && (
                    <div>{status.error}</div>
                  )}

                  {status.success && (
                    <div>{status.success}</div>
                  )}

                  <div className="field">
                    <FormInput
                      type="horizontal"
                      label="First name"
                      required={true}
                      error={errors.first_name}
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
                    {unsavedChanges && (
                      <span className="pt-text-small pt-text-muted m-r-20">You have unsaved changes</span>
                    )}
                    <button
                      type="submit"
                      className="pt-button pt-large pt-intent-success"
                      disabled={isSubmitting || isValidating}
                    >
                      Save changes
                    </button>
                  </div>
                </fieldset>
              </Form>
            );
          }}
        </Formik>

      </SettingsBlock>

      <p>Lalala</p>
    </div>
  );
};

export default Settings;
