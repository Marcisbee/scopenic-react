import cc from 'classcat';
import React, { useRef } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import * as Yup from 'yup';

import FormInput from '../../../../../components/form-input';
import { useOnClickOutside } from '../../../../../hooks/use-on-click-outside';
import { EditorStore } from '../../../../../routes/editor/context/editor-context';
import styles from '../../layers.module.scss';

interface IAddNewPageValues {
  name: string;
  route: string;
}

const validationSchema = Yup.object().shape<IAddNewPageValues>({
  name: Yup.string()
    .max(100),
  route: Yup.string()
    .min(1)
    .matches(/^\/|((\/[A-Za-z0-9_.-]+)+)$/, 'Field should be valid path, starting with "/"')
    .max(100)
    .required('Field is required'),
});

const AddPagePopup: React.FC<{ close: (event?: MouseEvent | TouchEvent) => void }> = ({ close }) => {
  const pageKeys = EditorStore.useStoreState((a) => Object.keys(a.state.data.pages));
  const addPage = EditorStore.useStoreActions((a) => a.addPage);
  const ref = useRef<any>();
  useOnClickOutside(ref, close);
  const {
    setActiveWorkspace,
  } = EditorStore.useStoreActions((a) => a);
  const formMethods = useForm<IAddNewPageValues>({
    validationSchema,
    defaultValues: {
      name: '',
      route: '',
    },
  });
  const {
    handleSubmit,
    formState: { dirty, isSubmitting },
    reset,
    setError,
  } = formMethods;

  const onSubmit = async (values: IAddNewPageValues) => {
    if (pageKeys.indexOf(values.route) > -1) {
      setError('route', 'existing', 'Page with this route already exists');
      return;
    }

    addPage({
      route: values.route,
      name: values.name,
      children: [],
    });

    reset();
    close();
    setActiveWorkspace({
      type: 'page',
      route: values.route,
    });
  };

  return (
    <div
      ref={ref}
      className={styles.addPageForm}
    >
      <strong>
        Create new page
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
                    <input {...props} type="text" />
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
                  Add page
                </button>
              </footer>
            </fieldset>
          </form>
        </FormContext>
      </div>
    </div>
  );
};

export default AddPagePopup;
