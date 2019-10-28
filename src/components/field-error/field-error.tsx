import React from 'react';
import { useFormContext } from 'react-hook-form';

const FieldError: React.FC<{ name: string, className?: string }> = (props) => {
  const { errors } = useFormContext();
  const { name, ...childProps } = props;

  if (!errors) {
    return null;
  }

  if (!errors[name]) {
    return null;
  }

  return (
    <div {...childProps}>
      {(errors[name] as any).message}
    </div>
  );
};

export default FieldError;
