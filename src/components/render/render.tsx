import React from 'react';
import { ILayerData, isComponent, isNode, isText, isVar } from '../../utils/vnode-helpers';

interface IRenderProps {
  data: ILayerData;
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
