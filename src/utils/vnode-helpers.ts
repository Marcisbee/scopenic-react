
export interface ILayerText {
  id: string;
  name?: string;
  className?: string;
  text: string;
  props: Record<string, any>;
}

export interface ILayerVar {
  id: string;
  name?: string;
  className?: string;
  var: string;
  props: Record<string, any>;
}

export interface ILayerComponent {
  id: string;
  name?: string;
  className?: string;
  component: string;
  props: Record<string, any>;
  children?: null | ILayerData[];
}

export interface ILayerNode {
  id: string;
  name?: string;
  className?: string;
  node: string;
  props: Record<string, any>;
  children?: null | ILayerData[];
}

export type ILayerData = ILayerText | ILayerVar | ILayerComponent | ILayerNode;

export function isText(data: ILayerData): data is ILayerText {
  return (data as ILayerText).text !== undefined;
}

export function isVar(data: ILayerData): data is ILayerVar {
  return (data as ILayerVar).var !== undefined;
}

export function isComponent(data: ILayerData): data is ILayerComponent {
  return (data as ILayerComponent).component !== undefined;
}

export function isNode(data: ILayerData): data is ILayerNode {
  return (data as ILayerNode).node !== undefined;
}
