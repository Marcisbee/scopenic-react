import cc from 'classcat';
import React, { useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/use-auth';
import { formatErrorMessage } from '../../utils/format-error-message';
import Alert from '../alert';
import FormInput from '../form-input';

interface ISettingsSecurityValues {
  currentPassword: string;
  confirmNewPassword: string;
  newPassword: string;
}

const validationSchema = Yup.object().shape<ISettingsSecurityValues>({
  currentPassword: Yup.string()
    .required('Field is required'),
  newPassword: Yup.string()
    .required('Field is required'),
  confirmNewPassword: Yup.string()
    .required('Field is required')
    .oneOf([Yup.ref('newPassword'), null], 'New password must match'),
});

const SettingsSecurity: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [status, setStatus] = useState<Record<string, any>>({});
  const formMethods = useForm<ISettingsSecurityValues>({ validationSchema });
  const {
    handleSubmit,
    formState: { dirty, isSubmitting },
    reset,
    setError,
  } = formMethods;

  const onSubmit = async (values: ISettingsSecurityValues) => {
    setStatus({});

    await updatePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
      .then((response) => {
        if (!response.data || !response.data.updateUserPassword) {
          throw new Error('Something went wrong');
        }

        reset({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        setStatus({ success: 'Changes saved!' });
      })
      .catch((error) => {
        const errorMessage = formatErrorMessage(error, setError);

        if (!errorMessage) {
          return;
        }

        setStatus({ error: errorMessage });
      });
  };

  return (
    <FormContext {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="pure-form pure-form-stacked">
        <fieldset>
          <Alert
            show={!!status.error}
            type="danger"
            title="Error ocurred"
            description={status.error}
          />

          <Alert
            show={!!status.success}
            type="success"
            title={status.success}
          />

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
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => (
                <input {...props} type="password" autoComplete="current-password" />
              )}
            />
          </div>

          <hr />

          <div className="field">
            <FormInput
              type="horizontal"
              label="New password"
              name="newPassword"
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => (
                <input {...props} type="password" autoComplete="new-password" />
              )}
            />
          </div>

          <div className="field">
            <FormInput
              type="horizontal"
              label="Confirm new password"
              name="confirmNewPassword"
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => (
                <input {...props} type="password" autoComplete="new-password" />
              )}
            />
          </div>

          <hr />

          <div className="text-right">
            {dirty && (
              <span className="pt-text-small pt-text-muted m-r-20 text-color-warning">
                You have unsaved changes
              </span>
            )}
            <button
              type="submit"
              className={cc([
                'pt-button pt-large pt-intent-success',
                isSubmitting && 'pt-loading',
              ])}
              disabled={!dirty || isSubmitting}
            >
              Save changes
            </button>
          </div>
        </fieldset>
      </form>
    </FormContext>
  );
};

export default SettingsSecurity;
