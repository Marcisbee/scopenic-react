import { useApolloClient } from '@apollo/react-hooks';
import cc from 'classcat';
import React, { useEffect, useState } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import * as Yup from 'yup';

import { CREATE_PROJECT } from '../../graphql/mutations/projects';
import { CreateProject, CreateProjectVariables } from '../../graphql/mutations/types/CreateProject';
import { formatErrorMessage } from '../../utils/format-error-message';
import Alert from '../alert';
import FormInput from '../form-input';
import Modal from '../modal';

interface ICreateNewProjectValues {
  name: string;
  description: string;
  responsive: string;
  type: string;
  isPrivate: boolean;
}

const validationSchema = Yup.object().shape<ICreateNewProjectValues>({
  name: Yup.string()
    .min(3)
    .max(100)
    .required('Field is required'),
  description: Yup.string()
    .max(500),
  responsive: Yup.string()
    .matches(/^([,]?(mobile|tablet|desktop)){1,3}$/)
    .required('Field is required'),
  type: Yup.string()
    .matches(/^mobile|webpage$/)
    .required('Field is required'),
  isPrivate: Yup.bool(),
});

const CreateNewProject: React.FC = () => {
  const history = useHistory();
  const client = useApolloClient();
  const [newProject, setNewProject] = useState(false);
  const [status, setStatus] = useState<Record<string, any>>({});
  const formMethods = useForm<ICreateNewProjectValues>({
    validationSchema,
    defaultValues: {
      name: '',
      description: '',
      responsive: 'mobile,tablet,desktop',
      type: 'webpage',
      isPrivate: false,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { dirty, isSubmitting },
    reset,
    setError,
    triggerValidation,
  } = formMethods;

  useEffect(() => {
    register({ name: 'responsive' });
  }, []);

  const onSubmit = async (values: ICreateNewProjectValues) => {
    setStatus({});

    await client.mutate<CreateProject, CreateProjectVariables>({
      mutation: CREATE_PROJECT,
      variables: values,
    })
      .then(({ data }) => {
        if (!data || !data.createProject) {
          throw new Error('Something went wrong');
        }

        const projectId = data.createProject.id;

        reset();
        setStatus({ success: 'Project created' });

        // @TODO: Add some kind of onboarding value in history state
        history.push(`/editor/${projectId}`, {
          isNewProject: true,
        });
      })
      .catch((err) => {
        const errorMessage = formatErrorMessage(err, setError);

        if (!errorMessage) {
          return;
        }

        setStatus({ error: errorMessage });
      });
  };

  function closeModal() {
    setNewProject(false);
  }

  return (
    <>
      <button
        onClick={() => setNewProject(true)}
        className="pt-button pt-intent-success"
        style={{ paddingLeft: 20, paddingRight: 20 }}
      >
        Create project
      </button>

      {newProject && (
        <Modal title="Create new project" close={closeModal}>
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
                    type="vertical"
                    label="Project name"
                    name="name"
                    required={true}
                    className="pt-large pt-input"
                    errorClassName="pt-intent-danger"
                    component={(props) => (
                      <input {...props} type="text" autoFocus={true} />
                    )}
                  />
                </div>

                <div className="field">
                  <FormInput
                    type="vertical"
                    label="Description"
                    name="description"
                    className="pt-large pt-input"
                    errorClassName="pt-intent-danger"
                    component={(props) => (
                      <input {...props} type="text" />
                    )}
                  />
                </div>

                <div className="field">
                  <FormInput
                    type="vertical"
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

                <div className="field">
                  <FormInput
                    type="vertical"
                    name="isPrivate"
                    errorClassName="pt-intent-danger"
                    component={(props) => (
                      <label className="m-t-20 pt-control pt-switch pt-large">
                        <input {...props} type="checkbox" />
                        <span className="pt-control-indicator" />
                        Private project
                      </label>
                    )}
                  />
                </div>

                <footer>
                  <button type="button" className="pt-button m-r-10" onClick={closeModal}>Cancel</button>
                  <button
                    type="submit"
                    className={cc([
                      'pt-button pt-intent-success',
                      isSubmitting && 'pt-loading',
                    ])}
                    disabled={!dirty || isSubmitting}
                  >
                    Create project
                  </button>
                </footer>
              </fieldset>
            </form>
          </FormContext>
        </Modal>
      )}
    </>
  );
};

export default CreateNewProject;
