declare module '*.inline.scss' {
  const style: string;
  export default style;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.jpeg";
declare module "*.jpg";
declare module "*.gif";
declare module "*.png";
declare module "*.svg";

declare module 'statux';
