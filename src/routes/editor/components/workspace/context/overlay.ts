import { createStore } from '../../../../../utils/create-context';

export const OverlayContext = createStore<{
  element: null | {
    id: string,
    node: string,
    className?: string,
    path: string[],
  },
  position: null | {
    x: number,
    y: number,
    top: number,
    left: number,
    right: number,
    bottom: number,
    width: number,
    height: number,
  },
}>({
  element: null,
  position: null,
});

export const useOverlayContext = OverlayContext.useStore;
