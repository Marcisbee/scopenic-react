import shortid from 'shortid';

export interface ILayerText {
  id: string;
  name?: string;
  text: string;
}

export interface ILayerVar {
  id: string;
  name?: string;
  var: string;
}

export interface ILayerImg {
  id: string;
  name?: string;
  node: string;
}

export interface ILayerComponent {
  id: string;
  name?: string;
  component: string;
  children?: ILayerData[];
}

export interface ILayerNode {
  id: string;
  name?: string;
  node: string;
  children?: ILayerData[];
}

export type ILayerData = ILayerText | ILayerVar | ILayerImg | ILayerComponent | ILayerNode;

export function createVNode(type: 'text' | 'node' | 'component' | 'var' | 'img', node: string, name?: string, children: any[] = []): ILayerData {
  const id = shortid.generate();

  if (type === 'text') {
    const data: ILayerText = {
      id,
      name,
      text: node,
    };
    return data;
  }

  if (type === 'var') {
    return {
      id,
      name,
      var: node,
    };
  }

  if (type === 'img') {
    return {
      id,
      name,
      node,
    };
  }

  if (type === 'component') {
    return {
      id,
      name,
      component: node,
      children,
    };
  }

  return {
    id,
    name,
    node,
    children,
  };
}
