import React, { useContext } from 'react';
import Frame from 'react-frame-component';

interface IRefsContext {
  workspace: React.RefObject<Frame>;
}

export const RefsContext = React.createContext<IRefsContext>({
  workspace: React.createRef(),
});

export const useRefsContext = () => {
  return useContext(RefsContext);
};
