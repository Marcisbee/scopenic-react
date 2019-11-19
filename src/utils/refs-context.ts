import React, { useContext } from 'react';
import Frame from 'react-frame-component';

interface IRefsContext {
  workspace: React.RefObject<Frame>;
  activeElement: React.RefObject<HTMLElement>;
  overlayElement: React.RefObject<HTMLElement>;
}

export const RefsContextInitial: IRefsContext = {
  workspace: React.createRef(),
  activeElement: React.createRef(),
  overlayElement: React.createRef(),
};

export const RefsContext = React.createContext<IRefsContext>(RefsContextInitial);

export const useRefsContext = () => {
  return useContext(RefsContext);
};
