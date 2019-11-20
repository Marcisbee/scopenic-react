import cc from 'classcat';
import React, { useRef } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import * as Yup from 'yup';

import FormInput from '../../../../../components/form-input';
import { useOnClickOutside } from '../../../../../hooks/use-on-click-outside';
import { EditorStore } from '../../../../../routes/editor/context/editor-context';
import styles from '../../layers.module.scss';

interface IEditNewPageValues {
  name: string;
  route: string;
}

const validationSchema = Yup.object().shape<IEditNewPageValues>({
  name: Yup.string()
    .max(100),
  route: Yup.string()
    .min(1)
    .matches(/^\/|((\/[A-Za-z0-9_.-]+)+)$/, 'Field should be valid path, starting with "/"')
    .max(100)
    .required('Field is required'),
});

const EditPagePopup: React.FC<{
  route: string,
  close: () => void,
}> = ({ route, close }) => {
  const pages = EditorStore.useStoreState((a) => a.state.data.pages);
  const pageKeys = Object.keys(pages);
  const { setActivePage, updatePage, deletePage } = EditorStore.useStoreActions((a) => a);
  const ref = useRef<any>();
  useOnClickOutside(ref, close);
  const defaultValues = {
    route,
    name: pages[route] && pages[route].name,
  };
  const formMethods = useForm<IEditNewPageValues>({
    validationSchema,
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { dirty, isSubmitting },
    setError,
  } = formMethods;

  if (!pages[route]) {
    return null;
  }

  const onSubmit = async (values: IEditNewPageValues) => {
    if (defaultValues.route !== values.route && pageKeys.indexOf(values.route) > -1) {
      setError('route', 'existing', 'Page with this route already exists');
      return;
    }

    if (route === '/') {
      return;
    }

    updatePage({
      target: defaultValues.route,
      route: values.route,
      name: values.name,
    });
    close();
  };

  const onDelete = () => {
    if (route === '/') {
      return;
    }

    setActivePage({ path: '/' });
    deletePage({
      route,
    });
    close();
  };

  return (
    <div
      ref={ref}
      className={styles.editPageForm}
    >
      <strong>
        Update page
      </strong>

      <div>
        <FormContext {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)} className="pure-form pure-form-stacked">
            <fieldset>
              <div className="field">
                <FormInput
                  type="vertical"
                  label="Route name"
                  name="name"
                  className="pt-input"
                  errorClassName="pt-intent-danger"
                  component={(props) => (
                    <input {...props} type="text" autoFocus={true} />
                  )}
                />
              </div>

              <div className="field">
                <FormInput
                  type="vertical"
                  label="Route path"
                  name="route"
                  required={true}
                  className="pt-input"
                  errorClassName="pt-intent-danger"
                  component={(props) => (
                    <input {...props} disabled={route === '/'} type="text" />
                  )}
                />
              </div>

              <footer>
                <button type="button" className="pt-button m-r-10" onClick={close as any}>Cancel</button>
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
              </footer>
            </fieldset>
          </form>
        </FormContext>
      </div>

      <br />
      <hr />

      <strong>
        Delete page
      </strong>

      <div>
        {route === '/'
          ? (
            <p>Root page cannot be deleted</p>
          ) : (
            <p>This is irreversable action! Please be sure before doing this.</p>
          )}
        <button
          className="pt-button pt-fill pt-intent-danger"
          disabled={route === '/'}
          onClick={onDelete}
        >
          Delete page
        </button>
      </div>
    </div>
  );
};

export default EditPagePopup;
