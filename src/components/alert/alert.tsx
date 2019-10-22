import React from 'react';

import { ReactComponent as AlertIcon } from '../../assets/svg/icons/alert.icon.svg';
import { ReactComponent as CheckIcon } from '../../assets/svg/icons/check.icon.svg';

export interface IAlertProps {
  title: string | undefined;
  description?: string;
  type: 'danger' | 'success';
  show?: boolean;
}

const Alert: React.FC<IAlertProps> = ({ type, show, title, description }) => {
  if (!show) {
    return null;
  }

  let icon = null;

  if (type === 'danger') {
    icon = <AlertIcon className="im" />;
  }

  if (type === 'success') {
    icon = <CheckIcon className="im" />;
  }

  return (
    <div className={`m-b-30 pt-callout pt-callout-icon pt-intent-${type}`}>
      {icon}
      <h4 className="pt-callout-title">{title}</h4>
      {description}
    </div>
  );
};

export default Alert;
