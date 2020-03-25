interface ILayerDatasetConfig {
  path: string;
}

export type ILayerDataset = null | ILayerDatasetConfig;

export interface ILayerText {
  id: string;
  version: string;
  name?: string;
  dataset: ILayerDataset;
  className?: string;
  text: string;
  props: Record<string, any>;
  hide: boolean;
}

export interface ILayerVar {
  id: string;
  version: string;
  name?: string;
  dataset: ILayerDataset;
  className?: string;
  var: string;
  props: Record<string, any>;
  hide: boolean;
}

export interface ILayerComponent {
  id: string;
  version: string;
  name?: string;
  dataset: ILayerDataset;
  className?: string;
  component: string;
  props: Record<string, any>;
  hide: boolean;
  children?: null | ILayerData[];
}

export interface ILayerNode {
  id: string;
  version: string;
  name?: string;
  dataset: ILayerDataset;
  className?: string;
  node: string;
  props: Record<string, any>;
  hide: boolean;
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
