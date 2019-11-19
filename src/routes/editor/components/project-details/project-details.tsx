import { useMutation } from '@apollo/react-hooks';
import cc from 'classcat';
import React, { useState } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import * as Yup from 'yup';

import Alert from '../../../../components/alert/alert';
import FormInput from '../../../../components/form-input/form-input';
import IconUpload from '../../../../components/icon-upload';
import { UPDATE_PROJECT } from '../../../../graphql/mutations/projects';
import { formatErrorMessage } from '../../../../utils/format-error-message';
import { EditorStore } from '../../context/editor-context';

const validationSchema = Yup.object().shape<any>({
  name: Yup.string()
    .required('Field is required'),
  description: Yup.string()
    .required('Field is required'),
  type: Yup.string()
    .required('Field is required'),
  icon: Yup.string()
    .required('Field is required'),
});

const ProjectDetails: React.FC = () => {
  const [updateProject] = useMutation(UPDATE_PROJECT);
  const [status, setStatus] = useState<Record<string, any>>({});
  const project = EditorStore.useStoreState((s) => s.project);
  const setProject = EditorStore.useStoreActions((s) => s.setProject);
  const formMethods = useForm<any>({
    validationSchema,
    defaultValues: {
      name: project.name,
      description: project.description,
      icon: project.icon,
      type: project.type,
      responsive: project.responsive,
    },
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

  const onSubmit = async (values: any) => {
    setStatus({});

    await updateProject({
      variables: {
        project_id: project.id,
        name: values.name || project.name,
        description: values.description || project.description,
        icon: values.icon || project.icon,
        type: values.type || project.type,
        responsive: values.responsive || project.responsive,
      },
    })
      .then((response) => {
        if (!response.data || !response.data.updateProject) {
          throw new Error('Something went wrong');
        }

        reset(values);
        setStatus({ success: 'Changes saved!' });
        setProject({
          ...project,
          ...values,
        });
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
              label="Project name"
              name="name"
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
              label="Description"
              name="description"
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => (
                <input {...props} type="text" />
              )}
            />
          </div>

          <hr />

          <div className="field">
            <FormInput
              type="horizontal"
              label="Icon (favicon)"
              name="icon"
              className="pt-large pt-input"
              errorClassName="pt-intent-danger"
              component={(props) => {
                props.ref({ name: props.name });

                const values = getValues();

                return (
                  <IconUpload
                    current={values.icon}
                    onSetIcon={async (iconUrl) => {
                      await setValue('icon', iconUrl);
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="field">
            <FormInput
              type="horizontal"
              label="Project type"
              name="type"
              className="pt-large pt-select"
              errorClassName="pt-intent-danger"
              component={(props) => {
                const { className, ...restProps } = props;

                return (
                  <div className={className}>
                    <select {...restProps} onChange={() => triggerValidation()}>
                      <option value="webpage">Desktop webpage</option>
                      <option disabled={true} value="mobile-app">Mobile application (SOON)</option>
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
                'pt-button pt-intent-success',
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

export default ProjectDetails;
