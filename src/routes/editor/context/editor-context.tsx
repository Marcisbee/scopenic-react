import dlv from 'dlv';
import { Action, action, createContextStore } from 'easy-peasy';
import { CSSProperties } from 'react';

import { copyVNode } from '../../../utils/copy-vnode';
import { ILayerData } from '../../../utils/vnode-helpers';

export function parsePath(path: string[] = []): { lastIndex: string, lastIndexInt: number, path: string[], pathFull: string[] } {
  const childSlice = 'children';
  const newPath = path.slice();
  const lastIndex = newPath.pop() || '0';
  const outPath = newPath.reduce((r, a) => r.concat(a, childSlice), [childSlice] as string[]);

  return {
    lastIndex,
    lastIndexInt: parseInt(lastIndex, 10),
    path: newPath.reduce((r, a) => r.concat(a, childSlice), [childSlice] as string[]),
    pathFull: outPath.concat(lastIndex),
  };
}

function findChildById<T = undefined>(source: any, prop: string, evaluation: (item: any) => any, path: string[] = ['0']): null | { item: T, path: string[] } {
  if (!source) {
    return null;
  }

  const target = source[prop];

  if (!(target instanceof Array)) {
    return null;
  }

  let result;
  let p;

  for (p in target) {
    if (target.hasOwnProperty(p) && typeof target[p] === 'object') {
      result = evaluation(target[p]);

      const newPath = path.concat(p);

      if (result) {
        return {
          item: result,
          path: newPath,
        };
      }

      if (!result) {
        result = findChildById(target[p], prop, evaluation, newPath);
      }

      if (result) {
        return result;
      }
    }
  }

  return null;
}

export interface IProjectState {
  id: string;
  name: string;
  image: string;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isArchived: boolean;
  url: string;
  views: number;
  type: string;
  responsive: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  contributors: Array<{
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  }> | null;
  data: {
    pages: Record<string, {
      name: string,
      children: ILayerData[],
    }>;
    css: Record<string, CSSProperties>;
  };
}

export interface IState {
  data: {
    pages: Record<string, {
      name: string,
      children: ILayerData[],
    }>;
    css: Record<string, CSSProperties>;
  };
  activePage: string;
  activeElement: {
    id: null | string,
    path: string[],
  };
}

export interface IEditorState {
  // Store
  project: IProjectState;
  settings: Record<string, any>;
  state: IState;
  dataset: Record<string, any>;

  // Actions
  setProject: Action<IEditorState, any>;
  setProjectData: Action<IEditorState, any>;
  setState: Action<IEditorState, any>;

  setActiveElement: Action<IEditorState, { id: string | null, path: string[] }>;
  addElement: Action<IEditorState, { element: any, path?: string[] }>;
  removeElement: Action<IEditorState, { path?: string[] }>;
  updateElement: Action<IEditorState, { element: any, path?: string[] }>;
  duplicateElement: Action<IEditorState, { path?: string[] }>;
  moveElement: Action<IEditorState, { from: string[], to: string[] }>;

  updateStyle: Action<IEditorState, { id: string | null, className: string | undefined, style: any }>;
  updateStylePropery: Action<IEditorState, { id: string | null, className: string | undefined, property: string, value: number | string | null }>;

  setDataset: Action<IEditorState, { data: Record<string, any> }>;
}

export const EditorStore = createContextStore<IEditorState>(
  (initialData: IEditorState) => {
    return {
      // Store
      ...initialData,

      // Actions
      setProject: action((draft, payload) => {
        draft.project = payload;
      }),
      setProjectData: action((draft, payload) => {
        draft.project.data = payload;
      }),
      setState: action((draft, payload) => {
        draft.state = payload;
      }),

      setActiveElement: action((draft, payload) => {
        draft.state.activeElement = {
          ...draft.state.activeElement,
          ...payload,
        };
      }),
      addElement: action((draft, { element, path: originalPath }) => {
        const addPath = originalPath || draft.state.activeElement.path.slice(1);
        const { lastIndex, path } = parsePath(addPath);

        const parent = dlv(draft.state.data.pages[draft.state.activePage], path);

        if (parent) {
          parent.splice(lastIndex, 0, element);
        }

        draft.state.activeElement = {
          id: element.id,
          path: ['0', ...(addPath || ['0'])],
        };
      }),
      removeElement: action((draft, payload) => {
        const isSelf = !payload.path;
        const removePath = payload.path || draft.state.activeElement.path.slice(1);
        const { lastIndex, lastIndexInt, path } = parsePath(removePath);
        const layers = draft.state.data.pages[draft.state.activePage];

        if (lastIndex === null || lastIndex === undefined) {
          return;
        }

        const parent = dlv(
          layers,
          path,
          null,
        );

        parent.splice(lastIndex, 1);

        if (isSelf) {
          const itemPath = removePath
            .slice(0, -1)
            .concat(lastIndexInt > 0 ? String(lastIndexInt - 1) : []);

          if (itemPath.length === 0) {
            draft.state.activeElement = {
              id: null,
              path: ['0'],
            };

            return;
          }

          const { path: newPath, lastIndex: newIndex } = parsePath(itemPath);

          const newParent = dlv(
            layers,
            newPath,
            null,
          );

          const item = newParent[newIndex];

          draft.state.activeElement = {
            id: item && item.id || null,
            path: ['0', ...itemPath],
          };
        }
      }),
      updateElement: action((draft, payload) => {
        const updatePath = payload.path || draft.state.activeElement.path.slice(1);
        const { pathFull } = parsePath(updatePath);
        const layers = draft.state.data.pages[draft.state.activePage];

        const item = dlv(
          layers,
          pathFull,
        );

        Object.assign(item, payload.element);
      }),
      duplicateElement: action((draft, payload) => {
        const duplicatePath = payload.path || draft.state.activeElement.path.slice(1);
        const { lastIndex, path } = parsePath(duplicatePath);

        if (duplicatePath.length === 0) {
          return;
        }

        if (lastIndex === null || lastIndex === undefined) {
          return;
        }

        const { activePage } = draft.state;
        const item = dlv(
          draft.state.data.pages[activePage],
          path.concat(lastIndex),
          null,
        );

        if (!item) {
          return;
        }

        const newItem = copyVNode(item);

        const parent = dlv(
          draft.state.data.pages[activePage],
          path,
          null,
        );

        parent.splice(lastIndex, 0, newItem);

        draft.state.activeElement = {
          id: newItem.id,
          path: ['0', ...duplicatePath],
        };
      }),
      moveElement: action((draft, { from, to }) => {
        const layers = draft.state.data.pages[draft.state.activePage];

        const fromPath = parsePath(from.slice(1));
        const toPath = parsePath(to.slice(1));

        const fromLayer = dlv(layers, fromPath.pathFull);

        const fromItemParent = dlv(layers, fromPath.path);
        const fromItem = fromItemParent[fromPath.lastIndexInt];

        if (fromPath.path.join('.') === toPath.path.join('.')) {
          // Both values are in the same array
          const hoverIndexAdjusted = fromPath.lastIndexInt < toPath.lastIndexInt ? toPath.lastIndexInt - 1 : toPath.lastIndexInt;

          fromItemParent.splice(fromPath.lastIndexInt, 1);
          fromItemParent.splice(hoverIndexAdjusted, 0, fromLayer);

          // Select new element
          const selectedElement = findChildById<any>(
            draft.state.data.pages[draft.state.activePage],
            'children',
            (item) => item.id === fromItem.id && item,
          );

          if (selectedElement) {
            draft.state.activeElement = {
              id: selectedElement.item.id,
              path: selectedElement.path,
            };
          }
          return;
        }

        // Different arrays
        const toParent = dlv(layers, toPath.path);

        fromItemParent.splice(fromPath.lastIndexInt, 1);
        toParent.splice(toPath.lastIndex, 0, fromLayer);

        // Select new element
        const newEl = findChildById<any>(
          draft.state.data.pages[draft.state.activePage],
          'children',
          (item) => item.id === fromItem.id && item,
        );

        if (newEl) {
          draft.state.activeElement = {
            id: newEl.item.id,
            path: newEl.path,
          };
        }
      }),
      updateStyle: action((draft, { id, className, style }) => {
        if (!id) {
          return;
        }

        const layers = draft.state.data.pages[draft.state.activePage];

        draft.state.data.css[className || id] = style;

        if (className) {
          return;
        }

        const { pathFull } = parsePath(
          draft.state.activeElement.path.slice(1),
        );

        const item = dlv(
          layers,
          pathFull,
          null,
        );

        if (item) {
          item.className = id;
        }
      }),
      updateStylePropery: action((draft, { id, className, property, value }) => {
        if (!id) {
          return;
        }

        const layers = draft.state.data.pages[draft.state.activePage];
        const style = draft.state.data.css[className || id] = {
          ...draft.state.data.css[className || id],
        };

        if (value !== undefined) {
          Object.assign(style, {
            [property as string]: value,
          });
        } else {
          delete (style as any)[property];
        }

        if (className) {
          return;
        }

        const { pathFull } = parsePath(
          draft.state.activeElement.path.slice(1),
        );

        const item = dlv(
          layers,
          pathFull,
          null,
        );

        if (item) {
          item.className = id;
        }
      }),
      setDataset: action((draft, { data }) => {
        Object.assign(draft.dataset, data);
      }),
    };
  },
  {
    devTools: true,
    name: '[Scopenic] Editor Store',
  },
);

// @TODO: Figure this out
// const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<StoreModel>();

// export default {
//   useStoreActions,
//   useStoreState,
//   useStoreDispatch,
//   useStore
// }
