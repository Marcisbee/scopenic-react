import cc from 'classcat';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FieldError from '../field-error';

interface IFormInputProps {
  name: string;
  type?: 'vertical' | 'horizontal';
  label?: string;
  required?: boolean;
  className?: string;
  errorClassName?: string;
  component: (
    props: {
      name: string,
      className: string,
      ref: any,
    },
  ) => React.ReactNode;
}

const FormInput: React.FC<IFormInputProps> = ({
  name,
  type,
  label,
  required,
  className,
  errorClassName,
  component,
}) => {
  const { errors, register } = useFormContext();

  const hasError = !!(errors && errors[name]);

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
            {component({
              name,
              className: cc([
                className,
                hasError && errorClassName,
              ]),
              ref: register,
            })}
            <FieldError name={name} className="inline-error" />
          </span>
        </div>
      </label>
    );
  }

  return (
    <label className="pt-large pt-label pt-fill">
      {label && (
        <div className="m-b-10">
          {label}
          {requiredBlock}
        </div>
      )}
      {component({
        name,
        className: cc([
          className,
          hasError && errorClassName,
        ]),
        ref: register,
      })}
      <FieldError name={name} className="inline-error" />
    </label>
  );
};

export default FormInput;
