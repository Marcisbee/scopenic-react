import shortid from 'shortid';

import { ILayerData, isText, isVar } from './vnode-helpers';

export function copyVNode(node: ILayerData): ILayerData {
  const id = `sc-${shortid.generate()}`;

  if (isText(node) || isVar(node) || !node.children) {
    return {
      ...node,
      id,
    };
  }

  return {
    ...node,
    children: node.children.map((data) => copyVNode(data)),
    id,
  };
}
