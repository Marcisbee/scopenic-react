import React from 'react';

import { ILayerComponent, ILayerData, ILayerNode, ILayerText, ILayerVar } from '../../utils/create-vnode';

interface IRenderProps {
  data: ILayerData;
}

function isText(data: ILayerData): data is ILayerText {
  return (data as ILayerText).text !== undefined;
}

function isVar(data: ILayerData): data is ILayerVar {
  return (data as ILayerVar).var !== undefined;
}

function isComponent(data: ILayerData): data is ILayerComponent {
  return (data as ILayerComponent).component !== undefined;
}

function isNode(data: ILayerData): data is ILayerNode {
  return (data as ILayerNode).node !== undefined;
}

const Render: React.FC<IRenderProps> = ({ data }) => {
  if (isText(data)) {
    return <>{data.text}</>;
  }

  if (isVar(data)) {
    return <>{data.var}</>;
  }

  if (isComponent(data)) {
    return <>{data.component}</>;
  }

  if (isNode(data)) {
    if (data.node === 'img') {
      return <>Image: {data.node}</>;
    }

    return React.createElement(
      data.node,
      {
        ...data.props,
        className: [data.props.className, data.id].filter((a) => !!a).join(' '),
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
