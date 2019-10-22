import React from 'react';

const ScopeShape: React.FC<{ color?: string, className?: string }> = ({ color, className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      className={className}
    >
      <path d="M12 0c-9.432 0-12 2.568-12 12s2.551 12 12 12 12-2.551 12-12-2.568-12-12-12z" />
    </svg>
  );
};

export default ScopeShape;
