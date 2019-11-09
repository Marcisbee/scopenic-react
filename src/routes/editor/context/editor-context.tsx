import dlv from 'dlv';
import immutableUpdate from 'immutability-helper';
import React, { createContext } from 'react';
import Frame from 'react-frame-component';
import { copyVNode } from '../../../utils/copy-vnode';

type Action = { type: 'SET_PROJECT', payload: any }
  | { type: 'SET_STATE', payload: any }

  | { type: 'SET_ACTIVE_ELEMENT', payload: { id: string | null, path: string[] } }
  | { type: 'ADD_ELEMENT', payload: any, path?: string[] }
  | { type: 'REMOVE_ELEMENT', path?: string[] }
  | { type: 'DUPLICATE_ELEMENT', path?: string[] }
  | { type: 'UPDATE_ELEMENT', payload: any, path: string[] }
  | { type: 'MOVE_ELEMENT', from: string[], to: string[] }

  | { type: 'UPDATE_STYLE', payload: any, id: string };

type Dispatch = (action: Action) => void;

interface IEditorState {
  project: Record<string, any>;
  settings: Record<string, any>;
  state: Record<string, any>;
  workspaceRef: React.RefObject<Frame>;
}

interface IEditorProviderProps {
  initialState: IEditorState;
  children: React.ReactNode;
}

const createPath = (obj: Record<string, any>, path: string[], value: any = null): Record<string, any> => {
  let current = obj;
  while (path.length > 1) {
    const [head, ...tail] = path;
    path = tail;
    if (current[head] === undefined) {
      current[head] = {};
    }
    current = current[head];
  }
  current[path[0]] = value;
  return obj;
};

const EditorStateContext = createContext<IEditorState | undefined>(undefined);
const EditorDispatchContext = createContext<Dispatch | undefined>(undefined);

function editorReducer(state: IEditorState, action: Action): IEditorState {
  switch (action.type) {
    case 'SET_PROJECT': {
      return {
        ...state,
        project: action.payload,
      };
    }

    case 'SET_STATE': {
      return {
        ...state,
        state: action.payload,
      };
    }

    case 'SET_ACTIVE_ELEMENT': {
      return {
        ...state,
        state: {
          ...state.state,
          activeElement: {
            ...state.state.activeElement,
            ...action.payload,
          },
        },
      };
    }

    case 'ADD_ELEMENT': {
      const addPath = action.path || state.state.activeElement.path.slice(1);
      const lastIndex = addPath.slice(-1)[0] || 0;
      const childPath = addPath.slice(0, -1).join('.children.');
      const childPathFull = childPath
        ? `children.${childPath}.children`.split('.')
        : ['children'];

      const updateData = createPath(
        {
          state: {
            activeElement: {
              id: {
                $set: action.payload.id,
              },
              path: {
                $set: ['0'].concat(addPath),
              },
            },
          },
        },
        ['state', 'data', state.state.activePage, ...childPathFull],
        { $splice: [[lastIndex, 0, action.payload]] },
      );
      const newState = immutableUpdate(state, updateData);

      return newState;
    }

    case 'REMOVE_ELEMENT': {
      const isSelf = !action.path;
      const removePath = action.path || state.state.activeElement.path.slice(1);

      const index = removePath.slice(-1)[0];
      const childPathFull = ['children']
        .concat(removePath.slice(0, -1).join('.children.').split('.'))
        .filter((s) => !!s);

      if (index === null || index === undefined) {
        return state;
      }

      if (childPathFull.length > 1) {
        childPathFull.push('children');
      }

      const newActivePath = ['0'].concat(
        removePath.slice(0, -1).concat(
          parseInt(index, 20) > 0
            ? parseInt(index, 20) - 1
            : [],
        ),
      );
      const item = dlv(
        state.state.data,
        [state.state.activePage, 'children'].concat(newActivePath.slice(1).join('.children.').split('.')),
      );

      const updateData = createPath(
        isSelf
          ? {
            state: {
              activeElement: {
                id: {
                  $set: item && item.id,
                },
                path: {
                  $set: newActivePath,
                },
              },
            },
          }
          : {},
        ['state', 'data', state.state.activePage, ...childPathFull],
        { $splice: [[index, 1]] },
      );
      const newState = immutableUpdate(state, updateData);

      return newState;
    }

    case 'DUPLICATE_ELEMENT': {
      const duplicatePath = action.path || state.state.activeElement.path.slice(1);

      const index = duplicatePath.slice(-1)[0];
      const childPathFull = ['children']
        .concat(duplicatePath.join('.children.').split('.'))
        .filter((s) => !!s);

      if (index === null || index === undefined) {
        return state;
      }

      const item = dlv(
        state.state.data,
        [state.state.activePage].concat(childPathFull),
      );

      if (!item) {
        return state;
      }

      const newItem = copyVNode(item);

      return editorReducer(state, {
        type: 'ADD_ELEMENT',
        payload: newItem,
      });
    }

    case 'UPDATE_ELEMENT': {
      const childPathFull = ['children'].concat(action.path.join('.children.').split('.'));

      const updateData = createPath(
        {},
        ['state', 'data', state.state.activePage, ...childPathFull],
        { $merge: action.payload },
      );
      const newState = immutableUpdate(state, updateData);

      return newState;
    }

    case 'MOVE_ELEMENT': {
      const layers = state.state.data[state.state.activePage].children;

      const dragPath = action.from;
      const hoverPath = action.to;

      const dragLayer = dlv(layers, dragPath.slice(1).join('.children.'));

      const dragIndex = parseInt(dragPath.slice(-1)[0], 10);
      const dragParentPath = (dragPath.slice(0, -1).join('.children.') + '.children').split('.').slice(1);

      const hoverIndex = parseInt(hoverPath.slice(-1)[0], 10);
      const hoverParentPath = (hoverPath.slice(0, -1).join('.children.') + '.children').split('.').slice(1);

      // @TODO: Reselect active element if current element is active

      let newState;
      if (dragParentPath.join('.') === hoverParentPath.join('.')) {
        // Both values are in the same array
        const hoverIndexAdjusted = dragIndex < hoverIndex ? hoverIndex - 1 : hoverIndex;
        const updateData = createPath(
          {},
          ['state', 'data', state.state.activePage, ...dragParentPath],
          { $splice: [[dragIndex, 1], [hoverIndexAdjusted, 0, dragLayer]] },
        );

        newState = immutableUpdate(state, updateData);
      } else {
        // Different arrays
        const updateSequenceConfig = [
          [
            ['state', 'data', state.state.activePage, ...dragParentPath],
            { $splice: [[dragIndex, 1]] },
          ],
          [
            ['state', 'data', state.state.activePage, ...hoverParentPath],
            { $splice: [[hoverIndex, 0, dragLayer]] },
          ],
        ];
        const updateSequence = dragParentPath.length > hoverParentPath.length
          ? [1, 0]
          : [0, 1];
        const updateDataPre = createPath(
          {},
          // @ts-ignore - we have valid input (ts just doesn't accept spread)
          ...updateSequenceConfig[updateSequence[0]],
        );
        const updateData = createPath(
          updateDataPre,
          // @ts-ignore - we have valid input (ts just doesn't accept spread)
          ...updateSequenceConfig[updateSequence[1]],
        );

        newState = immutableUpdate(state, updateData);
      }

      return newState;
    }

    case 'UPDATE_STYLE': {
      const newState = immutableUpdate(state, {
        state: {
          css: {
            [action.id]: {
              $set: action.payload,
            },
          },
        },
      });

      return newState;
    }

    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
  }
}

function EditorProvider({ initialState, children }: IEditorProviderProps) {
  const [state, dispatch] = React.useReducer(editorReducer, initialState);

  return (
    <EditorStateContext.Provider value={state}>
      <EditorDispatchContext.Provider value={dispatch}>
        {children}
      </EditorDispatchContext.Provider>
    </EditorStateContext.Provider>
  );
}

function useEditorState() {
  const context = React.useContext(EditorStateContext);

  if (context === undefined) {
    throw new Error('useEditorState must be used within a EditorProvider');
  }

  return context;
}

function useEditorDispatch() {
  const context = React.useContext(EditorDispatchContext);

  if (context === undefined) {
    throw new Error('useEditorDispatch must be used within a EditorProvider');
  }

  return {
    setProject(payload: any) {
      const action: Action = {
        type: 'SET_PROJECT',
        payload,
      };
      return context(action);
    },

    setState(payload: any) {
      const action: Action = {
        type: 'SET_STATE',
        payload,
      };
      return context(action);
    },

    setActiveElement(id: string | null, path: string[]) {
      const action: Action = {
        type: 'SET_ACTIVE_ELEMENT',
        payload: {
          id,
          path,
        },
      };
      return context(action);
    },

    addElement(payload: any, path?: string[]) {
      const action: Action = {
        type: 'ADD_ELEMENT',
        payload,
        path,
      };
      return context(action);
    },

    removeElement(path?: string[]) {
      const action: Action = {
        type: 'REMOVE_ELEMENT',
        path,
      };
      return context(action);
    },

    duplicateElement(path?: string[]) {
      const action: Action = {
        type: 'DUPLICATE_ELEMENT',
        path,
      };
      return context(action);
    },

    updateElement(path: string[], payload: any) {
      const action: Action = {
        type: 'UPDATE_ELEMENT',
        payload,
        path,
      };
      return context(action);
    },

    moveElement(from: string[], to: string[]) {
      const action: Action = {
        type: 'MOVE_ELEMENT',
        from,
        to,
      };
      return context(action);
    },

    updateStyle(id: string, payload: any) {
      const action: Action = {
        type: 'UPDATE_STYLE',
        payload,
        id,
      };
      return context(action);
    },
  };
}

export { EditorProvider, useEditorState, useEditorDispatch };
