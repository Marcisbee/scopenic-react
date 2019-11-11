import shortid from 'shortid';

import { ILayerData, ILayerDataset } from './vnode-helpers';

export function createVNode(
  type: 'text' | 'node' | 'component' | 'var',
  node: string,
  name?: string,
  props: Record<string, any> = {},
  children: null | any[] = [],
  dataset: ILayerDataset = null,
): ILayerData {
  const id = `sc-${shortid.generate()}`;

  if (type === 'text') {
    return {
      id,
      name,
      dataset,
      text: node,
      props,
    };
  }

  if (type === 'var') {
    return {
      id,
      name,
      dataset,
      var: node,
      props,
    };
  }

  if (node === 'img') {
    return {
      id,
      name,
      dataset,
      node,
      props,
    };
  }

  if (type === 'component') {
    return {
      id,
      name,
      dataset,
      component: node,
      props,
      children,
    };
  }

  return {
    id,
    name,
    dataset,
    node,
    props,
    children,
  };
}
