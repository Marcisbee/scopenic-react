import shortid from 'shortid';

export interface ILayerText {
  id: string;
  name?: string;
  text: string;
  props: Record<string, any>;
}

export interface ILayerVar {
  id: string;
  name?: string;
  var: string;
  props: Record<string, any>;
}

export interface ILayerImg {
  id: string;
  name?: string;
  node: string;
  props: Record<string, any>;
}

export interface ILayerComponent {
  id: string;
  name?: string;
  component: string;
  props: Record<string, any>;
  children?: ILayerData[];
}

export interface ILayerNode {
  id: string;
  name?: string;
  node: string;
  props: Record<string, any>;
  children?: ILayerData[];
}

export type ILayerData = ILayerText | ILayerVar | ILayerImg | ILayerComponent | ILayerNode;

export function createVNode(type: 'text' | 'node' | 'component' | 'var' | 'img', node: string, name?: string, props: Record<string, any> = {}, children: any[] = []): ILayerData {
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

  if (type === 'img') {
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
