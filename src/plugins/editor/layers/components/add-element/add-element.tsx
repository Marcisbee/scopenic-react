import cc from 'classcat';
import React, { Suspense, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import ModalPortal from '../../../../../components/modal-portal';
import { useOnClickOutside } from '../../../../../hooks/use-on-click-outside';
import { EditorStore } from '../../../../../routes/editor/context/editor-context';
import { createVNode } from '../../../../../utils/create-vnode';
import { ILayerData } from '../../../../../utils/vnode-helpers';

import { CheckIcon, ComponentIcon, ContainerIcon, ImageIcon, LayersIcon, SearchIcon, TextIcon, TypefaceIcon } from '../../../../../components/icons';
import styles from './add-element.module.scss';

interface IAddElementProps {
  children?: React.FC<{ onClick: () => void }>;
  showOnKeyboard?: boolean;
  showOnClick?: boolean;
  showInitially?: boolean;
}

const itemStyle = cc([
  'col-xs-4 col-sm-3 col-md-2',
  styles.item,
]);

interface IElementNodeConfig {
  type: 'text' | 'node' | 'component' | 'var';
  node: string;
  text?: string;
  props?: Record<string, any>;
  children?: IElementNode[] | null;
}

interface IElementNode {
  icon: React.FC | null;
  text: string;
  config: IElementNodeConfig;
}

const ELEMENTS_LIST: IElementNode[] = [
  {
    icon: ContainerIcon,
    text: 'Container',
    config: {
      type: 'node',
      node: 'div',
      text: 'Container',
    },
  },
  {
    icon: TypefaceIcon,
    text: 'Text block',
    config: {
      type: 'text',
      node: 'Lorem ipsum',
      children: null,
    },
  },
  {
    icon: ImageIcon,
    text: 'Image',
    config: {
      type: 'node',
      node: 'img',
      text: 'Image',
      children: null,
    },
  },
  {
    icon: null,
    text: 'Button',
    config: {
      type: 'node',
      node: 'button',
      text: 'Button',
      props: { type: 'button' },
    },
  },
  {
    icon: null,
    text: 'Input',
    config: {
      type: 'node',
      node: 'input',
      text: 'Input',
      props: { type: 'text' },
      children: null,
    },
  },
  {
    icon: CheckIcon,
    text: 'Checkbox',
    config: {
      type: 'node',
      node: 'input',
      text: 'Checkbox',
      props: { type: 'checkbox' },
      children: null,
    },
  },
  {
    icon: TextIcon,
    text: 'Anchor (link)',
    config: {
      type: 'node',
      node: 'a',
      text: 'Anchor',
      props: { href: '#' },
    },
  },
];

const COMPONENTS_LIST: IElementNode[] = [
  {
    icon: ComponentIcon,
    text: 'Header',
    config: {
      type: 'component',
      node: 'header',
      text: 'Header component',
    },
  },
  {
    icon: ComponentIcon,
    text: 'Pagination',
    config: {
      type: 'component',
      node: 'pagination',
      text: 'Pagination component',
    },
  },
  {
    icon: ComponentIcon,
    text: 'Card',
    config: {
      type: 'component',
      node: 'card',
      text: 'Card component',
      props: {
        title: 'Card title',
        text: 'Lorem ipsum',
        width: '15rem',
      },
    },
  },
];

const ComponentsList: React.FC<{
  handleEnterKeyPress: any,
  addElementToTree: any,
}> = ({ handleEnterKeyPress, addElementToTree }) => {
  // @TODO: Load `COMPONENTS_LIST` from API
  return (
    <div className="row">
      {COMPONENTS_LIST.map(({ icon: Icon, text, config }) => (
        <div
          key={`add-layer-${text}`}
          tabIndex={0}
          className={itemStyle}
          onClick={() => addElementToTree(config)}
          onKeyPress={handleEnterKeyPress(() => addElementToTree(config))}
        >
          <div>
            {React.createElement(Icon || ComponentIcon)}
            <span>
              {text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const AddElement: React.FC<IAddElementProps> = ({
  children: Children,
  showOnKeyboard = false,
  showOnClick = false,
  showInitially = false,
}) => {
  const ref: React.RefObject<HTMLDivElement> = useRef({} as any);
  const inputRef: React.RefObject<HTMLInputElement> = useRef({} as any);
  const { addElement } = EditorStore.useStoreActions((s) => s);
  const [showElements, setShowElements] = useState(true);
  const [showComponents, setShowComponents] = useState(false);
  const [showModal, setShowModal] = useState(showInitially);
  useOnClickOutside(ref, () => showModal && setShowModal(false));

  useHotkeys('/', (e) => {
    if (!showModal) {
      return;
    }

    if (!inputRef || !inputRef.current || !inputRef.current.focus) {
      return;
    }

    // Don't allow for key "/" to be used somewhere else too
    e.stopImmediatePropagation();
    e.preventDefault();
    inputRef.current.focus();
  }, [showModal]);

  useHotkeys('ctrl+n', (e) => {
    if (showModal) {
      return;
    }

    e.preventDefault();
    setShowModal(true);
  }, [showModal]);

  useHotkeys('esc', (e) => {
    if (!showModal) {
      return;
    }

    e.preventDefault();
    setShowModal(false);
  }, [showModal]);

  function addNodeToTree(node: ILayerData) {
    addElement({ element: node });
    setShowModal(false);
  }

  function handleSearchEsc({ key }: React.KeyboardEvent) {
    if (key === 'Escape') {
      setShowModal(false);
    }
  }

  function handleEnterKeyPress(click: () => void) {
    return ({ key }: React.KeyboardEvent) => {
      if (key === 'Enter') {
        click();
      }
    };
  }

  function addElementToTree(config: IElementNodeConfig) {
    addNodeToTree(createVNode(
      config.type,
      config.node,
      config.text,
      config.props,
      config.children,
    ));
  }

  return (
    <>
      {showOnClick && Children && (
        <Children onClick={() => setShowModal(true)} />
      )}

      <ModalPortal>
        {showModal && (
          <div className={styles.wrapper}>
            <div ref={ref} className={styles.modal}>
              <div className={styles.search}>
                <label className={styles.searchInput}>
                  {/* @TODO: Make search actually work */}
                  <input
                    ref={inputRef}
                    autoFocus={true}
                    type="text"
                    onKeyUp={handleSearchEsc}
                    placeholder="Search element ('/' to focus)"
                  />
                  <SearchIcon className={styles.searchIcon} />
                </label>
              </div>

              <div className={styles.title} onClick={() => {
                setShowElements((s) => !s);
              }}>
                <strong>
                  Standart Elements
                </strong>
                <i className={cc([
                  'im',
                  showElements ? 'im-angle-up' : 'im-angle-down',
                  styles.titleIcon,
                ])} />
              </div>

              <div className={styles.content}>
                {showElements && (
                  <div className="row">
                    {ELEMENTS_LIST.map(({ icon: Icon, text, config }) => (
                      <div
                        key={`add-layer-${text}`}
                        tabIndex={0}
                        className={itemStyle}
                        onClick={() => addElementToTree(config)}
                        onKeyPress={handleEnterKeyPress(() => addElementToTree(config))}
                      >
                        <div>
                          {React.createElement(Icon || LayersIcon)}
                          <span>
                            {text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.title} onClick={() => {
                setShowComponents((s) => !s);
              }}>
                <strong>
                  Custom Components
                </strong>
                <i className={cc([
                  'im',
                  showComponents ? 'im-angle-up' : 'im-angle-down',
                  styles.titleIcon,
                ])} />
              </div>

              <div className={styles.content}>
                {showComponents && (
                  <Suspense fallback={<h2>Loading...</h2>}>
                    <ComponentsList
                      addElementToTree={addElementToTree}
                      handleEnterKeyPress={handleEnterKeyPress}
                    />
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        )}
      </ModalPortal>
    </>
  );
};

export default AddElement;
