import shortid from 'shortid';

import { ILayerData } from './vnode-helpers';

export function createVNode(type: 'text' | 'node' | 'component' | 'var', node: string, name?: string, props: Record<string, any> = {}, children: null | any[] = []): ILayerData {
  const id = `sc-${shortid.generate()}`;

  if (type === 'text') {
    return {
      id,
      name,
      text: node,
      props,
    };
  }

  if (type === 'var') {
    return {
      id,
      name,
      var: node,
      props,
    };
  }

  if (node === 'img') {
    return {
      id,
      name,
      node,
      props,
    };
  }

  if (type === 'component') {
    return {
      id,
      name,
      component: node,
      props,
      children,
    };
  }

  return {
    id,
    name,
    node,
    props,
    children,
  };
}
