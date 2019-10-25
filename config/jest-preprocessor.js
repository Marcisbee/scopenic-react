const tsc = require('typescript');
const fs = require('fs');

const config = tsc.readConfigFile(
  './tsconfig.json',
  (path) => fs.readFileSync(path).toString(),
);

const compilerOptions = {
  ...config.config.compilerOptions,
  esModuleInterop: true,

  module: tsc.ModuleKind.CommonJS,
  jsx: tsc.JsxEmit.React,
  noEmit: true,
  skipLibCheck: true,
  skipDefaultLibCheck: true,
};

module.exports = {
  process: function (src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(
        src,
        compilerOptions,
        path,
        [],
      );
    }

    return src;
  }
};
