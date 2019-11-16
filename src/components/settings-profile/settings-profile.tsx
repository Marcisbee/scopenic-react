import cc from 'classcat';
import React, { useState } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/use-auth';
import { formatErrorMessage } from '../../utils/format-error-message';
import Alert from '../alert';
import AvatarUpload from '../avatar-upload';
import FormInput from '../form-input';

interface ISettingsProfileValues {
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  avatar: string;
}

const validationSchema = Yup.object().shape<ISettingsProfileValues>({
  email: Yup.string()
    .email('Invalid email')
    .required('Field is required'),
  first_name: Yup.string()
    .required('Field is required'),
  last_name: Yup.string()
    .required('Field is required'),
  language: Yup.string()
    .required(),
  avatar: Yup.string(),
});

const SettingsProfile: React.FC = () => {
  const { user: defaultValues, updateUser } = useAuth();
  const [status, setStatus] = useState<Record<string, any>>({});
  const formMethods = useForm<ISettingsProfileValues>({
    validationSchema,
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { dirty, isSubmitting },
    reset,
    setError,
    getValues,
    setValue,
    triggerValidation,
   } = formMethods;

  const onSubmit = async (values: ISettingsProfileValues) => {
    setStatus({});

    await updateUser(values)
      .then((response) => {
        if (!response.data || !response.data.updateUserData) {
          throw new Error('Something went wrong');
        }

        reset(values);
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

          <div className="field">
            <FormInput
              type="horizontal"
              label="First name"
              name="first_name"
              required={true}
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => (
                <input {...props} type="text" />
              )}
            />
          </div>

          <div className="field">
            <FormInput
              type="horizontal"
              label="Last name"
              name="last_name"
              required={true}
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => (
                <input {...props} type="text" />
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
              name="email"
              required={true}
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => (
                <input {...props} type="email" autoComplete="email" />
              )}
            />
          </div>

          <hr />

          <div className="field">
            <FormInput
              type="horizontal"
              label="Avatar"
              name="avatar"
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => {
                props.ref({ name: props.name });

                const values = getValues();

                return (
                  <AvatarUpload
                    current={values.avatar}
                    userName={`${values.first_name} ${values.last_name}`}
                    onSetAvatar={async (avatarUrl) => {
                      await setValue('avatar', avatarUrl);
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="field">
            <FormInput
              type="horizontal"
              label="Language"
              name="language"
              className="pt-large pt-select"
              errorClassName="pt-intent-danger"
              component={(props) => {
                const { className, ...restProps } = props;

                return (
                  <div className={className}>
                    <select {...restProps} onChange={() => triggerValidation()}>
                      <option value="en">English</option>
                      <option value="lv">Latvian</option>
                    </select>
                  </div>
                );
              }}
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

export default SettingsProfile;
