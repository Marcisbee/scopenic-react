import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';

interface IFormInputProps {
  name: string;
  type?: 'vertical' | 'horizontal';
  label?: string;
  required?: boolean;
  input?: React.InputHTMLAttributes<HTMLInputElement>;
  touched?: FormikTouched<any>;
  error?: FormikErrors<any>;
  component: (props: { name: string, touched: boolean, error: boolean, hasError: boolean }) => React.ReactNode;
}

const FormInput: React.FC<IFormInputProps> = ({
  name,
  type,
  label,
  required,
  error: errorRecord,
  touched: touchedRecord,
  component,
}: any) => {
  const touched = touchedRecord && touchedRecord[name];
  const error = errorRecord && errorRecord[name];

  const errorBlock = touched && error && (
    <div className="inline-error">{error}</div>
  );
  const requiredBlock = required && (
    <span className="pt-text-muted">(required)</span>
  );

  if (type === 'horizontal') {
    return (
      <label className="pt-large pt-label pt-fill pt-inline">
        <div className="row">
          <span className="col-xs-4">
            {label && (
              <>
                {label}
                {requiredBlock}
              </>
            )}
          </span>
          <span className="col-xs-8">
            {component({ name, touched, error, hasError: !!errorBlock })}
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
      {component({ name, touched, error, hasError: !!errorBlock })}
    </label>
  );
};

export default FormInput;
