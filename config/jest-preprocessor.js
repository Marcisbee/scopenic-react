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

// const { coreTransformerList, testTransform } = require('fuse-box');

// const compilerOptions = {
//   jsxFactory: 'React.createElement',
//   noEmit: true,
//   skipLibCheck: true,
//   skipDefaultLibCheck: true,
// };

// module.exports = {
//   canInstrument: true,
//   process(src, path) {
//     if (path.endsWith('.js') || path.endsWith('.ts') || path.endsWith('.tsx')) {
//       const result = testTransform({
//         code: src,
//         compilerOptions,
//         jsx: true,
//         props: { module: { absPath: path } },
//         transformers: coreTransformerList,
//       });

//       return result.code;
//     }

//     return src;
//   }
// };
