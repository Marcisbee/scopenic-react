import dlv from 'dlv';
import React, { createContext } from 'react';
import Frame from 'react-frame-component';

type Action = { type: 'SET_PROJECT', payload: any }
  | { type: 'SET_STATE', payload: any }
  | { type: 'SET_ACTIVE_ELEMENT', payload: { id: string | null, path: string[] } }
  | { type: 'ADD_ELEMENT', payload: any, path?: string[] }
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

const EditorStateContext = createContext<IEditorState | undefined>(undefined);
const EditorDispatchContext = createContext<Dispatch | undefined>(undefined);

function editorReducer(state: IEditorState, action: Action) {
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
      const lastIndex = addPath.slice(-1)[0];
      const childPath = addPath.slice(0, -1).join('.children.');
      const childPathFull = childPath ? `children.${childPath}.children` : 'children';
      const childList = dlv(state.state.data[state.state.activePage], childPathFull);

      // Insert new node
      childList.splice(lastIndex, 0, action.payload);

      // Select newly created node
      state.state.activeElement.id = action.payload.id;
      state.state.activeElement.path = ['0'].concat(addPath);

      return {
        ...state,
      };
    }
    case 'UPDATE_ELEMENT': {
      const newState = state.state.data[state.state.activePage];
      const nestedValue = dlv(newState, ['children'].concat(action.path.join('.children.')), null);

      if (nestedValue) {
        Object.assign(nestedValue, action.payload);
      }

      return {
        ...state,
      };
    }
    case 'MOVE_ELEMENT': {
      const layers = state.state.data[state.state.activePage].children;

      const dragPath = action.from.slice(1);
      const hoverPath = action.to.slice(1);

      const dragLayer = dlv(layers, dragPath.join('.children.'));

      const dragIndex = parseInt(dragPath.slice(-1)[0], 10);
      const dragParentPath = dragPath.slice(0, -1);
      const dragParent = dlv(layers, dragParentPath.join('.children.') + '.children') || layers;

      const hoverIndex = parseInt(hoverPath.slice(-1)[0], 10);
      const hoverParentPath = hoverPath.slice(0, -1);
      const hoverParent = dlv(layers, hoverParentPath.join('.children.') + '.children') || layers;

      dragParent.splice(dragIndex, 1);

      if (dragParent === hoverParent) {
        hoverParent.splice(dragIndex < hoverIndex ? hoverIndex - 1 : hoverIndex, 0, dragLayer);
      } else {
        hoverParent.splice(hoverIndex, 0, dragLayer);
      }

      return {
        ...state,
      };
    }
    case 'UPDATE_STYLE': {
      const nestedValue = state.state.css[action.id];

      if (nestedValue) {
        Object.assign(nestedValue, action.payload);
      }

      return {
        ...state,
      };
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
  return context;
}

export { EditorProvider, useEditorState, useEditorDispatch };
