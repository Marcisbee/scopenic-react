import React from 'react';

import { EditorStore } from '../../routes/editor/context/editor-context';
import { messageFormat } from '../../utils/messageformat';
import { ILayerData, isComponent, isNode, isText, isVar } from '../../utils/vnode-helpers';

interface IRenderProps {
  data: ILayerData;
  context?: Record<string, any>;
  isRepeated?: boolean;
}

const ComponentsLocal: Record<string, React.FC<any>> = {
  header: ({ children }) => {
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
  card: ({ title, text, width }) => {
    return (
      <div className="card" style={{ width: width || '18rem' }}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{text}</p>
          <a href="#" className="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    );
  },
  pagination: ({ children }) => {
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

const Render: React.FC<IRenderProps> = ({ data, context, isRepeated }) => {
  const dataset = EditorStore.useStoreState((s) => s.dataset);

  if (!isRepeated && data.dataset && data.dataset.path) {
    const repeatSet = dataset[data.dataset.path];

    if (!repeatSet) {
      console.warn(`Dataset "${data.dataset.path}" not found`);
    }

    if (repeatSet instanceof Array) {
      return repeatSet.map((item, index) => {

        return <Render key={`${JSON.stringify(item)}-${index}`} data={data} context={item} isRepeated={true} />;
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
    const localComponent = ComponentsLocal[data.component];
    const props: Record<string, any> = Object.keys(data.props).reduce((acc, key) => {
      return {
        ...acc,
        [key]: messageFormat.compile(data.props[key])(messageFormatValues),
      };
    }, {});

    if (!!localComponent) {
      return React.createElement(
        localComponent,
        {
          ...props,
        },
        data.children && data.children.map(renderChild),
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

    if (data.node === 'img') {
      return <>Image: {data.node}</>;
    }

    return React.createElement(
      data.node,
      {
        ...props,
        className: [props.className, data.className].filter((a) => !!a).join(' '),
      },
      data.children && data.children.map(renderChild),
    );
  }

  return null;
};

export const renderChild = (child: ILayerData): JSX.Element => {
  return <Render key={child.id} data={child} />;
};

export default Render;
