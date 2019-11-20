import React, { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState<IActiveTab>({
    type: 'page',
    route: '/',
  });
  const [tabs, setTabs] = useState<ITab[]>([
    {
      id: '0',
      text: 'Home',
      type: 'page',
      payload: {
        route: '/',
      },
    },
    {
      id: '1',
      text: 'Blog',
      type: 'page',
      payload: {
        route: '/blog',
      },
    },
    {
      id: '2',
      text: 'Header',
      type: 'component',
      payload: {
        node: 'Header',
      },
    },
  ]);

  const onClick = (tab: ITab) => {
    if (tab.type === 'component') {
      setActiveTab({
        type: tab.type,
        node: tab.payload.node,
      });
      return;
    }

    if (tab.type === 'page') {
      setActiveTab({
        type: tab.type,
        route: tab.payload.route,
      });
      return;
    }
  };

  const onClose = (closingTab: ITab) => {
    setTabs((s) => s.filter((tab) => tab !== closingTab));
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
