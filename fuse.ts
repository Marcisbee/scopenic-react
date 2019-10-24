// tslint:disable-next-line: no-implicit-dependencies
import { fusebox, pluginSass, sparky } from 'fuse-box';
import { pluginTypeChecker } from 'fuse-box-typechecker';

// tslint:disable-next-line: no-implicit-dependencies
const DOT_ENV = require('dotenv').config({
  path: '.env',
});

class Context {
  public isProduction: boolean;
  public runServer: any;
  public getConfig() {
    return fusebox({
      target: 'browser',
      output: 'dist',
      entry: 'index.tsx',
      useSingleBundle: false,
      webIndex: {
        publicPath: '/',
        template: 'public/index.html',
      },
      turboMode: true,
      plugins: [
        pluginTypeChecker({
          name: 'App',
          throwOnSyntactic: true,
          throwOnSemantic: true,
          throwOnGlobal: true,
          throwOnOptions: true,
        }),
        pluginSass('*.module.scss', {
          asModule: {
            scopeBehaviour: 'local',
          },
        }),
      ],
      tsConfig: 'tsconfig.json',
      // dependencies: {
        // ignorePackages: [
          // 'react-dom/cjs',
        //   'react',
        //   'react-dom',
        //   'react-router',
        //   'react-router-dom',
        //   'formik',
        //   'apollo-boost',
        //   '@apollo/react-hooks',
        //   'graphql',
        //   'graphql-tag',
        //   'react-app-polyfill',
        //   'yup',
        //   'tslib',
        // ],
        // ignoreAllExternal: true,
      // },
      homeDir: 'src',
      modules: [
        'node_modules',
      ],
      cache: {
        root: '.cache',
        enabled: true,
        FTL: true,
      },
      env: {
        __CLIENT__: 'true',
        __SERVER__: 'false',
        __DEVELOPMENT__: String(this.isProduction),
        NODE_ENV: this.isProduction ? 'production' : 'development',
        ...DOT_ENV.parsed,
      },
      watch: true,
      hmr: true,
      codeSplitting: {
        useHash: true,
        maxPathLength: 0,
      },
      devServer: this.runServer,
      logging: { level: 'succinct' },
    });
  }
}

const { task, exec } = sparky<Context>(Context);

task('default', async (ctx) => {
  process.env.NODE_ENV = 'development';

  ctx.runServer = {
    enabled: true,
    open: true,
    httpServer: {
      enabled: true,
      port: 3000,
    },
    hmrServer: true,
  };
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async (ctx) => {
  process.env.NODE_ENV = 'production';

  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({
    target: 'ES5',
    screwIE: false,
    uglify: false,
    cleanCSS: false,
  });
});

task('dist', async (ctx) => {
  process.env.NODE_ENV = 'production';

  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
