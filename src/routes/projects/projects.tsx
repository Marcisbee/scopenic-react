import { useApolloClient, useQuery } from '@apollo/react-hooks';
import cc from 'classcat';
import { Field, Form, Formik } from 'formik';
import React, { Suspense, useState } from 'react';
import { useHistory } from 'react-router';
import * as Yup from 'yup';

import Alert from '../../components/alert/alert';
import FormInput from '../../components/form-input';
import Modal from '../../components/modal';
import ProjectPreview from '../../components/project-preview';
import Spinner from '../../components/spinner';
import { CREATE_PROJECT } from '../../graphql/mutations/projects';
import { GET_PROJECTS_BY_VIEWER } from '../../graphql/queries';
import sharedStyles from '../../shared.module.scss';
import { formatErrorMessage } from '../../utils/format-error-message';
import { Suspend } from '../../utils/suspend';

const NewProjectSchema = Yup.object().shape({
  description: Yup.string()
    .max(500),

  name: Yup.string()
    .min(3)
    .max(100)
    .required('Field is required'),

  responsive: Yup.string()
    .matches(/^([,]?(mobile|tablet|desktop)){1,3}$/)
    .required('Field is required'),

  type: Yup.string()
    .matches(/^mobile|webpage$/)
    .required('Field is required'),

  isPrivate: Yup.string()
    .matches(/^true|false$/),
});

const Projects: React.FC = () => {
  const history = useHistory();
  const [newProject, setNewProject] = useState(false);
  const client = useApolloClient();
  const { loading, error, data } = useQuery(GET_PROJECTS_BY_VIEWER, {
    fetchPolicy: 'cache-and-network',
  });

  const projects = data && data.projectsByViewer || [];

  function closeModal() {
    setNewProject(false);
  }

  return (
    <div className={sharedStyles.wrapperLarge}>
      <div className={sharedStyles.heading}>
        <div className="row">
          <h1 className="col-xs-6">Projects</h1>

          <div className="col-xs-6 text-right m-t-10">
            <button
              onClick={() => setNewProject(true)}
              className="pt-button pt-intent-success"
              style={{ paddingLeft: 20, paddingRight: 20 }}
            >
              Create project
            </button>
            {newProject && (
              <Modal
                title="Create new project"
                close={closeModal}
              >
                <Formik
                  initialValues={{
                    description: '',
                    isPrivate: false,
                    name: '',
                    responsive: 'mobile,tablet,desktop',
                    type: 'webpage',
                  }}
                  validateOnBlur={false}
                  validationSchema={NewProjectSchema}
                  onSubmit={async (values, actions) => {
                    actions.setStatus();

                    await client.mutate({
                      mutation: CREATE_PROJECT,
                      variables: values,
                    })
                      .then((response) => {
                        if (!response.data || !response.data.createProject) {
                          throw new Error('Something went wrong');
                        }

                        const projectId = response.data.createProject.id;

                        actions.resetForm();
                        actions.setStatus({ success: 'Project created' });

                        // @TODO: Add some kind of onboarding value in history state
                        history.push(`/editor/${projectId}`, {
                          isNewProject: true,
                        });
                      })
                      .catch((err) => {
                        const errorMessage = formatErrorMessage(err, actions.setErrors);

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
                            required={true}
                            name="name"
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
                                autoFocus={true}
                              />
                            )}
                          />
                        </div>

                        <div className="field">
                          <FormInput
                            type="vertical"
                            label="Description"
                            name="description"
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
                            type="vertical"
                            label="Project type"
                            name="type"
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
                                      <option value="webpage">Desktop webpage</option>
                                      <option disabled={true} value="mobile-app">Mobile application (SOON)</option>
                                    </select>
                                  </div>
                                )}
                              </Field>
                            )}
                          />
                        </div>

                        <div className="field">
                          <Field name="isPrivate">
                            {({ field }: any) => (
                              <label className="m-t-20 pt-control pt-switch pt-large">
                                <input {...field} type="checkbox" />
                                <span className="pt-control-indicator" />
                                Private project
                              </label>
                            )}
                          </Field>
                        </div>

                        <footer>
                          <button type="button" className="pt-button m-r-10" onClick={closeModal}>Cancel</button>
                          <button
                            type="submit"
                            className={cc([
                              'pt-button pt-intent-success',
                              (isSubmitting || isValidating) && 'pt-loading',
                            ])}
                            disabled={!dirty || isSubmitting || isValidating}
                          >
                            Create Project
                          </button>
                        </footer>
                      </fieldset>
                    </Form>
                  )}
                </Formik>
              </Modal>
            )}
          </div>
        </div>
      </div>

      <Alert
        show={!!error}
        type="danger"
        title={error && error.message}
      />

      {/* @TODO: Create skeletons for loading projects */}
      <Suspense fallback={<Spinner type="full" />}>
        {loading && <Suspend />}

        <div className="row">
          {projects.map((project: any, index: number) => (
            <div key={`${project.id}-${index}`} className="col-xs-12 col-sm-6 col-md-4">
              <ProjectPreview
                id={project.id}
                image={project.image}
                name={project.name}
                owner={project.owner}
                description={project.description}
                contributors={project.contributors}
                comments={[]}
                views={project.views}
                isPrivate={project.isPrivate}
              />
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default Projects;
