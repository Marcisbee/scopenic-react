import { Action, action, createContextStore } from 'easy-peasy';

export interface IUiState {
  // Store
  panel: {
    left: {
      active: string;
    };
  };

  // Actions
  setPanelLeftActive: Action<IUiState, string>;
}

export const UiStore = createContextStore<IUiState>(
  (initialData: IUiState) => {
    return {
      // Store
      panel: {
        left: {
          active: 'layers',
        },
      },

      ...initialData,

      // Actions
      setPanelLeftActive: action((draft, data) => {
        draft.panel.left.active = data;
      }),
    };
  },
  {
    devTools: false,
  },
);
