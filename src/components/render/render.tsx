import React, { useEffect, useRef } from 'react';

import { useOverlayContext } from '../../routes/editor/components/workspace/context/overlay';
import { EditorStore } from '../../routes/editor/context/editor-context';
import { messageFormat } from '../../utils/messageformat';
import { useRefsContext } from '../../utils/refs-context';
import { ILayerData, isComponent, isNode, isText, isVar } from '../../utils/vnode-helpers';
import { ImageIcon, TypefaceIcon } from '../icons';

interface IRenderProps {
  data: ILayerData;
  path: string[];
  context?: Record<string, any>;
  isRepeated?: boolean;
}

export type ILayerKnobTypes = 'textarea';

interface ILocalComponetConfig {
  icon?: React.FC<{
    className?: string | undefined;
  }>,
  render: React.RefForwardingComponent<HTMLElement, any>;
  props: {
    css?: boolean;
    custom?: {
      [key: string]: {
        type: ILayerKnobTypes,
        name: string,
      };
    };
  };
}

export const ComponentsLocal: Record<string, ILocalComponetConfig> = {
  header: {
    render({ children }, ref) {
      return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Dropdown
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">Disabled</a>
              </li>
            </ul>
            {children}
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>
      );
    },
    props: {},
  },
  card: {
    render({ title, text, width, children }, ref) {
      return (
        <div className="card" style={{ width: width || '18rem' }}>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{text}</p>
            {children}
          </div>
        </div>
      );
    },
    props: {},
  },
  pagination: {
    render({ children }, ref) {
      return (
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">Previous</a>
            </li>
            <li className="page-item"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item">
              <a className="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      );
    },
    props: {},
  },
  text: {
    icon: TypefaceIcon,
    render({ text, ...rest }, ref) {
      return (
        <span ref={ref} {...rest}>{text}</span>
      );
    },
    props: {
      custom: {
        text: {
          type: 'textarea',
          name: 'Text',
        },
      },
      css: true,
    },
  },
  image: {
    icon: ImageIcon,
    render({ img, alt, ...rest }, ref) {
      return (
        <img ref={ref} img={img} alt={alt} {...rest} />
      );
    },
    props: {
      custom: {
        src: {
          type: 'textarea',
          name: 'Source',
        },
        alt: {
          type: 'textarea',
          name: 'Alt text',
        },
      },
      css: true,
    },
  },
  grid: {
    render({ children, ...rest }, ref) {
      return (
        <div ref={ref} {...rest} style={{ display: 'flex' }}>{children}</div>
      );
    },
    props: {},
  },
};

// const ComponentsCustom: Record<string, React.FC<any>> = {
//   card: ({ children }) => {
//     return (
//       <nav className="navbar navbar-expand-lg navbar-light bg-light">
//         <a className="navbar-brand" href="#">Navbar</a>
//         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//           <span className="navbar-toggler-icon" />
//         </button>

//         <div className="collapse navbar-collapse" id="navbarSupportedContent">
//           <ul className="navbar-nav mr-auto">
//             <li className="nav-item active">
//               <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link" href="#">Link</a>
//             </li>
//             <li className="nav-item dropdown">
//               <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                 Dropdown
//               </a>
//               <div className="dropdown-menu" aria-labelledby="navbarDropdown">
//                 <a className="dropdown-item" href="#">Action</a>
//                 <a className="dropdown-item" href="#">Another action</a>
//                 <div className="dropdown-divider" />
//                 <a className="dropdown-item" href="#">Something else here</a>
//               </div>
//             </li>
//             <li className="nav-item">
//               <a className="nav-link disabled" href="#" tabIndex={-1} aria-disabled="true">Disabled</a>
//             </li>
//           </ul>
//           {children}
//           <form className="form-inline my-2 my-lg-0">
//             <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
//             <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
//           </form>
//         </div>
//       </nav>
//     );
//   },
//   pagination: ({ children }) => {
//     return (
//       <nav aria-label="Page navigation example">
//         <ul className="pagination justify-content-center">
//           <li className="page-item disabled">
//             <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">Previous</a>
//           </li>
//           <li className="page-item"><a className="page-link" href="#">1</a></li>
//           <li className="page-item"><a className="page-link" href="#">2</a></li>
//           <li className="page-item"><a className="page-link" href="#">3</a></li>
//           <li className="page-item">
//             <a className="page-link" href="#">Next</a>
//           </li>
//         </ul>
//       </nav>
//     );
//   },
// };

const Render: React.FC<IRenderProps> = ({ data, context, isRepeated, path }) => {
  const el = useRef<HTMLElement>(null);
  const refs = useRefsContext();
  const [, setOverlayContext] = useOverlayContext();
  const dataset = EditorStore.useStoreState((s) => s.dataset);

  // useEffect(() => {
  //   if (el.current && isNode(data)) {
  //     const handleHover = (e: MouseEvent) => {
  //       const isRenderedElement = el.current === e.target;

  //       if (!isRenderedElement) {
  //         return true;
  //       }

  //       e.stopPropagation();
  //       e.preventDefault();

  //       const node = e.target as HTMLElement;

  //       if (!node) {
  //         return;
  //       }

  //       const boundingClientRect = node.getBoundingClientRect();

  //       if (refs.overlayElement) {
  //         Object.assign(
  //           refs.overlayElement,
  //           el,
  //         );
  //       }

  //       setOverlayContext((draft) => {
  //         draft.element = {
  //           id: data.id,
  //           node: data.node,
  //           className: data.className,
  //           path,
  //         };

  //         draft.position = {
  //           x: boundingClientRect.x,
  //           y: boundingClientRect.y,
  //           top: boundingClientRect.top,
  //           left: boundingClientRect.left,
  //           right: boundingClientRect.right,
  //           bottom: boundingClientRect.bottom,
  //           width: boundingClientRect.width,
  //           height: boundingClientRect.height,
  //         };
  //       });
  //     };

  //     el.current.addEventListener('mouseenter', handleHover, {});

  //     return () => {
  //       if (el.current) {
  //         el.current.removeEventListener('mouseenter', handleHover);
  //       }
  //     };
  //   }
  // }, []);

  if (data.hide) {
    return null;
  }

  if (!isRepeated && data.dataset && data.dataset.path) {
    const repeatSet = dataset[data.dataset.path];

    if (!repeatSet) {
      console.warn(`Dataset "${data.dataset.path}" not found`);
    }

    if (repeatSet instanceof Array) {
      return repeatSet.map((item, index) => {

        return <Render key={`${JSON.stringify(item)}-${index}`} data={data} context={item} path={path.concat(String(index))} isRepeated={true} />;
      }) as unknown as React.ReactElement<IRenderProps>;
    }

    console.warn(`Dataset "${data.dataset.path}" not found`);
  }

  const messageFormatValues = {
    dataset,
    context,
  };

  if (isText(data)) {
    return <>{messageFormat.compile(data.text)(messageFormatValues)}</>;
  }

  if (isVar(data)) {
    return <>{data.var}</>;
  }

  if (isComponent(data)) {
    const localComponentConfig = ComponentsLocal[data.component];
    const localComponent = localComponentConfig.render;
    const props: Record<string, any> = Object.keys(data.props).reduce((acc, key) => {
      return {
        ...acc,
        [key]: messageFormat.compile(data.props[key])(messageFormatValues),
      };
    }, {});

    if (!!localComponent) {
      const htmlElement = React.forwardRef(localComponent);
      return React.createElement(
        htmlElement,
        {
          ...props,
          ref: el,
          id: data.id,
          className: [props.className, data.className].filter((a) => !!a).join(' '),
        },
        data.children && data.children.map((childProps, n) => renderChild(childProps, path.concat(String(n)), context)),
      );
    }

    console.warn(`Component named "${data.component}" was not found.`);

    return null;
  }

  if (isNode(data)) {
    const props: Record<string, any> = Object.keys(data.props).reduce((acc, key) => {
      return {
        ...acc,
        [key]: messageFormat.compile(data.props[key])(messageFormatValues),
      };
    }, {});


    return React.createElement(
      data.node,
      {
        ...props,
        ref: el,
        id: data.id,
        className: [props.className, data.className].filter((a) => !!a).join(' '),
      },
      data.children && data.children.map((childProps: any, n) => renderChild(childProps, path.concat(String(n)), context)),
    );
  }

  return null;
};

export const renderChild = (child: ILayerData, path: string[] = ['0'], context?: Record<string, any>): JSX.Element => {
  return <Render key={child.id + path.toString()} data={child} path={path} context={context} />;
};

export default Render;
