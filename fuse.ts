// tslint:disable-next-line: no-implicit-dependencies
import { fusebox, pluginSass, sparky } from 'fuse-box';
import * as path from 'path';
// tslint:disable-next-line: no-implicit-dependencies
// import { pluginTypeChecker } from 'fuse-box-typechecker';

// tslint:disable-next-line: no-implicit-dependencies
const DOT_ENV = require('dotenv').config({
  path: '.env',
});

class Context {
  public isProduction: boolean;
  public runServer: any;
  public getConfig() {
    return fusebox({
      cache: { enabled: true, root: './.cache' },
      devServer: this.runServer,
      entry: 'src/index.tsx',
      modules: [
        'node_modules',
      ],
      env: {
        __CLIENT__: 'true',
        __SERVER__: 'false',
        __DEVELOPMENT__: String(this.isProduction),
        NODE_ENV: this.isProduction ? 'production' : 'development',
        ...DOT_ENV.parsed,
      },
      hmr: true,
      logging: {
        level: 'succinct',
      },
      plugins: [
        // pluginTypeChecker({
        //   name: 'typecheck',
        //   basePath: 'src',
        //   throwOnSyntactic: this.isProduction,
        //   throwOnSemantic: this.isProduction,
        //   throwOnGlobal: this.isProduction,
        // }),
        pluginSass('*.module.scss', {
          asModule: {
            scopeBehaviour: 'local',
          },
        }),
        pluginSass('*.inline.scss', {
          asText: true,
          useDefault: true,
        }),
      ],
      target: 'browser',
      webIndex: {
        template: 'public/index.html',
      },
    });
  }
}

function runTypeChecker() {
  // tslint:disable-next-line: no-implicit-dependencies
  const typeChecker = require('fuse-box-typechecker').TypeChecker({
    name: 'typecheck',
    throwOnSyntactic: true,
    throwOnSemantic: true,
    throwOnGlobal: true,
  });
  // to run it right away
  typeChecker.printSettings();

  return typeChecker.inspectAndPrint();
}

const { task, rm } = sparky<Context>(Context);

task('default', async (ctx) => {
  process.env.NODE_ENV = 'development';

  ctx.runServer = {
    enabled: true,
    open: false,
    httpServer: {
      enabled: true,
      port: 3000,
    },
    hmrServer: true,
  };
  const fuse = ctx.getConfig();
  await fuse.runDev({
    bundles: {
      distRoot: path.join(__dirname, 'dist'),
      app: { path: 'app.js' },
    },
  });
});

task('preview', async (ctx) => {
  rm('./dist');
  process.env.NODE_ENV = 'production';

  ctx.runServer = {
    enabled: true,
    open: false,
    httpServer: {
      enabled: true,
      port: 3000,
    },
    hmrServer: false,
  };
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({
    buildTarget: 'ES5',
    uglify: false,
    bundles: {
      distRoot: path.join(__dirname, 'dist'),
      app: { path: 'app.$hash.js' },
    },
    cleanCSS: {
      compatibility: {
        properties: { urlQuotes: true },
      },
    },
  });
});

task('typecheck', () => {
  runTypeChecker();
});

task('dist', async (ctx) => {
  rm('./dist');
  process.env.NODE_ENV = 'production';

  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({
    buildTarget: 'ES5',
    uglify: true,
    bundles: {
      distRoot: path.join(__dirname, 'dist'),
      app: { path: 'app.$hash.js' },
    },
    cleanCSS: {
      compatibility: {
        properties: { urlQuotes: true },
      },
    },
  });
});
