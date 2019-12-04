import React, { useLayoutEffect, useState } from 'react';
import shortid from 'shortid';

import { EditorStore } from '../../../../context/editor-context';

import styles from './tabs.module.scss';

export interface ITabPage {
  id: string;
  text: string;
  type: 'page';
  payload: {
    route: string;
  };
}

export interface ITabComponent {
  id: string;
  text: string;
  type: 'component';
  payload: {
    node: string;
  };
}

export type ITab = ITabPage | ITabComponent;

export type IActiveTab = { type: 'page', route: string }
  | { type: 'component', node: string };

function getTabClass(active: IActiveTab, tab: ITab) {
  if (active.type === 'page'
    && tab.type === 'page'
    && active.route === tab.payload.route) {
    return styles.tabActive;
  }

  if (active.type === 'component'
    && tab.type === 'component'
    && active.node === tab.payload.node) {
    return styles.tabActive;
  }

  return styles.tab;
}

const Tabs: React.FC = () => {
  const { data: { pages }, activePage } = EditorStore.useStoreState((s) => s.state);
  const setActivePage = EditorStore.useStoreActions((s) => s.setActivePage);
  const activePageDetails = pages[activePage];
  const [activeTab, setActiveTab] = useState<IActiveTab>({
    type: 'page',
    route: activePage,
  });
  const [tabs, setTabs] = useState<ITab[]>([
    {
      id: shortid.generate(),
      text: activePageDetails.name,
      type: 'page',
      payload: {
        route: activePage,
      },
    },
    // {
    //   id: '1',
    //   text: 'Blog',
    //   type: 'page',
    //   payload: {
    //     route: '/blog',
    //   },
    // },
    // {
    //   id: '2',
    //   text: 'Header',
    //   type: 'component',
    //   payload: {
    //     node: 'Header',
    //   },
    // },
  ]);

  useLayoutEffect(() => {
    const existingTabPage = tabs.find((tab) => (
      tab.type === 'page' && tab.payload.route === activePage
    ));

    if (!existingTabPage) {
      setTabs((state) => state.concat({
        id: shortid.generate(),
        text: activePageDetails.name,
        type: 'page',
        payload: {
          route: activePage,
        },
      }));
    }

    setActiveTab({
      type: 'page',
      route: activePage,
    });
  }, [activePage]);

  const onClick = (tab: ITab) => {
    if (tab.type === 'component') {
      setActiveTab({
        type: tab.type,
        node: tab.payload.node,
      });
      return;
    }

    if (tab.type === 'page') {
      setActivePage({
        path: tab.payload.route,
      });
      return;
    }
  };

  const onClose = (closingTab: ITab) => {
    const index = tabs.findIndex((tab) => tab === closingTab);
    setTabs((s) => s.slice(0, index).concat(s.slice(index + 1)));

    const isClosingActivePage = closingTab.type === 'page'
      && activeTab.type === 'page'
      && closingTab.payload.route === activeTab.route;
    // Don't switch tabs if closing tab is not active tab
    if (!isClosingActivePage) {
      return;
    }

    const newTab = index !== undefined && (tabs[index + 1] || tabs[index - 1]);

    if (!newTab) {
      // Render empty page
      return;
    }

    if (newTab.type === 'component') {
      setActiveTab({
        type: newTab.type,
        node: newTab.payload.node,
      });
      return;
    }

    if (newTab.type === 'page') {
      setActivePage({
        path: newTab.payload.route,
      });
      return;
    }
  };

  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={getTabClass(activeTab, tab)}
          onClick={() => {
            onClick(tab);
          }}
        >
          <span className={styles.tabIcon}>
            {tab.type === 'page' && (
              <i className="im im-file-o" />
            )}
            {tab.type === 'component' && (
              <i className="im im-cube" />
            )}
          </span>

          <span className={styles.tabText}>
            {tab.text}
          </span>

          <span
            className={styles.close}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose(tab);
            }}
          >
            <i className="im im-x-mark" />
          </span>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
