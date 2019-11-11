import React from 'react';

import { DatasetIcon } from '../../../components/icons';
import { IPluginInterface } from '../../../components/plugins/plugins';
import panelStyles from '../../../layouts/panel.module.scss';
import { useEditorDispatch, useEditorState } from '../../../routes/editor/context/editor-context';

import styles from './dataset.module.scss';

const Menu: React.FC = () => {
  return (
    <DatasetIcon className={panelStyles.menuIcon} />
  );
};

const LeftPanel: React.FC = () => {
  const { dataset } = useEditorState();
  const { setDataset } = useEditorDispatch();

  return (
    <div className={styles.wrapper}>
      <div>
        Dataset > <strong>articles</strong>
      </div>

      <div>
        <pre
          style={{ fontSize: 12 }}
          contentEditable={true}
          onBlur={(e) => {
            const value = JSON.parse(e.target.innerText);

            setDataset({
              articles: value,
            });
          }}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              dataset.articles,
              null,
              ' ',
            ),
          }}
        />
      </div>
      -----
      <div>
        Dataset > <strong>user</strong>
      </div>

      <div>
        <pre
          style={{ fontSize: 12 }}
          contentEditable={true}
          onBlur={(e) => {
            const value = JSON.parse(e.target.innerText);

            setDataset({
              user: value,
            });
          }}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              dataset.user,
              null,
              ' ',
            ),
          }}
        />
      </div>
    </div>
  );
};

const plugin: IPluginInterface = {
  'editor.panel.menu': {
    action: 'dataset',
    render: Menu,
  },
  'editor.panel.left': {
    action: 'dataset',
    render: LeftPanel,
  },
};

export = plugin;
