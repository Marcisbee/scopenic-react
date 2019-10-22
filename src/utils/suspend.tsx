import React from 'react';

export const Suspend: React.FC = () => {
  throw new Promise((r) => r());
};
