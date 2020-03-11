import dlv from 'dlv';
import { Action, action, Computed, computed, createContextStore, debug } from 'easy-peasy';
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
  contributors: {
    id: string;
    first_name: string;
    last_name: string;
    avatar: string;
  }[] | null;
  data: {
    pages: Record<string, {
      name: string,
      children: ILayerData[],
    }>;
    css: Record<string, CSSProperties>;
  };
}

export type IActiveWorkspace = {
  type: 'page',
  route: string,
} | {
  type: 'component',
  node: string,
} | null;

export interface IState {
  data: {
    pages: Record<string, {
      name: string,
      children: ILayerData[],
    }>;
    css: Record<string, CSSProperties>;
  };
  activeWorkspace: IActiveWorkspace;
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

  // Computed
  isWorkspacePageActive: Computed<IEditorState, boolean | string>;
  isWorkspaceComponentctive: Computed<IEditorState, boolean | string>;

  // Actions
  setProject: Action<IEditorState, any>;
  setProjectData: Action<IEditorState, any>;
  setState: Action<IEditorState, any>;

  addPage: Action<IEditorState, { route: string, name: string, children: ILayerData[] }>;
  updatePage: Action<IEditorState, { target: string, route: string, name: string, children?: ILayerData[] }>;
  deletePage: Action<IEditorState, { route: string }>;

  setActiveWorkspace: Action<IEditorState, IActiveWorkspace>;
  setActiveElement: Action<IEditorState, { id: string | null, path: string[] }>;
  addElement: Action<IEditorState, { element: any, path?: string[] }>;
  removeElement: Action<IEditorState, { path?: string[] }>;
  updateElement: Action<IEditorState, { element: any, path?: string[] }>;
  duplicateElement: Action<IEditorState, { path?: string[] }>;
  moveElement: Action<IEditorState, { from: string[], to: string[] }>;

  updateStyle: Action<IEditorState, { id: string | null, className: string | undefined, style: any }>;
  updateStyleProperty: Action<IEditorState, {
    id: string | null,
    className: string | undefined,
    property: string,
    value: number | string | null,
    // @TODO: Control `width` with arrows of predefined grid sizes
    prefix: null
    | ':hover'
    | ':active'
    | ':focus'
    // @TODO: add media queries
    | '@media only screen and (min-width: 48em)'
    | '@media only screen and (min-width: 64em)'
    | '@media only screen and (min-width: 75em)',
  }>;

  setDataset: Action<IEditorState, { data: Record<string, any> }>;
}

export const EditorStore = createContextStore<IEditorState>(
  (initialData: IEditorState) => {
    return {
      // Store
      ...initialData,

      // Computed
      isWorkspacePageActive: computed((draft) => (
        !!draft.state.activeWorkspace
        && draft.state.activeWorkspace.type === 'page'
        && draft.state.activeWorkspace.route
      )),
      isWorkspaceComponentctive: computed((draft) => (
        !!draft.state.activeWorkspace
        && draft.state.activeWorkspace.type === 'component'
        && draft.state.activeWorkspace.node
      )),

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

      addPage: action((draft, payload) => {
        draft.state.data.pages[payload.route] = {
          name: payload.name,
          children: payload.children,
        };
      }),
      updatePage: action((draft, payload) => {
        const target = draft.state.data.pages[payload.target];
        const newData = {
          ...target,
          name: payload.name,
          children: payload.children || target.children,
        };

        delete draft.state.data.pages[payload.target];

        draft.state.data.pages[payload.route] = newData;
        draft.state.activeWorkspace = {
          type: 'page',
          route: payload.route,
        };
      }),
      deletePage: action((draft, payload) => {
        delete draft.state.data.pages[payload.route];
      }),

      setActiveWorkspace: action((draft, payload) => {
        draft.state.activeWorkspace = payload;
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

        if (typeof draft.isWorkspacePageActive === 'string') {
          const parent = dlv(draft.state.data.pages[draft.isWorkspacePageActive], path);

          if (parent) {
            parent.splice(lastIndex, 0, element);
          }

          draft.state.activeElement = {
            id: element.id,
            path: ['0', ...(addPath.length ? addPath : ['0'])],
          };
        }
      }),
      removeElement: action((draft, payload) => {
        const isSelf = !payload.path;
        const removePath = payload.path || draft.state.activeElement.path.slice(1);
        const { lastIndex, lastIndexInt, path } = parsePath(removePath);

        if (typeof draft.isWorkspacePageActive === 'string') {
          const layers = draft.state.data.pages[draft.isWorkspacePageActive];

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
        }
      }),
      updateElement: action((draft, payload) => {
        const updatePath = payload.path || draft.state.activeElement.path.slice(1);
        const { pathFull } = parsePath(updatePath);

        if (typeof draft.isWorkspacePageActive === 'string') {
          const layers = draft.state.data.pages[draft.isWorkspacePageActive];

          const item = dlv(
            layers,
            pathFull,
          );

          Object.assign(item, payload.element);
        }
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

        if (typeof draft.isWorkspacePageActive === 'string') {
          const item = dlv(
            draft.state.data.pages[draft.isWorkspacePageActive],
            path.concat(lastIndex),
            null,
          );

          if (!item) {
            return;
          }

          const newItem = copyVNode(item);

          const parent = dlv(
            draft.state.data.pages[draft.isWorkspacePageActive],
            path,
            null,
          );

          parent.splice(lastIndex, 0, newItem);

          draft.state.activeElement = {
            id: newItem.id,
            path: ['0', ...duplicatePath],
          };
        }
      }),
      moveElement: action((draft, { from, to }) => {
        if (typeof draft.isWorkspacePageActive === 'string') {
          const layers = draft.state.data.pages[draft.isWorkspacePageActive];

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
              draft.state.data.pages[draft.isWorkspacePageActive],
              'children',
              (item) => item.id === fromItem.id && item,
            );

            // @TODO: Fix issue where object is moved from children to previous sibling,
            // it changes index for selected element.

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
            draft.state.data.pages[draft.isWorkspacePageActive],
            'children',
            (item) => item.id === fromItem.id && item,
          );

          if (newEl) {
            draft.state.activeElement = {
              id: newEl.item.id,
              path: newEl.path,
            };
          }
        }
      }),
      updateStyle: action((draft, { id, className, style }) => {
        if (!id) {
          return;
        }

        if (typeof draft.isWorkspacePageActive === 'string') {
          const layers = draft.state.data.pages[draft.isWorkspacePageActive];

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
        }
      }),
      updateStyleProperty: action((draft, { id, className, property, value, prefix }) => {
        if (!id) {
          className = 'body';
        }

        if (typeof draft.isWorkspacePageActive === 'string') {
          const layers = draft.state.data.pages[draft.isWorkspacePageActive];
          const key = (className || id) as string;
          const style = draft.state.data.css[key] = {
            ...draft.state.data.css[key],
          };

          if (value !== undefined) {
            const updatedValue = {
              [property as string]: value,
            };

            if (prefix) {
              if (!(style as any)[prefix]) {
                (style as any)[prefix] = {};
              }
              Object.assign((style as any)[prefix], updatedValue);
            } else {
              Object.assign(style, updatedValue);
            }
          } else {
            if (prefix) {
              if ((style as any)[prefix]) {
                delete (style as any)[prefix][property];
              }
            } else {
              delete (style as any)[property];
            }
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
