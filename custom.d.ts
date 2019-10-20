declare module '*.icon.svg' {
  const url: string;
  export const ReactComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default url;
}

declare module '*.svg' {
  const url: string;
  export default url;
}

declare module 'statux';
