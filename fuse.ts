import {
  CSSModulesPlugin,
  CSSPlugin,
  EnvPlugin,
  FuseBox,
  ImageBase64Plugin,
  JSONPlugin,
  QuantumPlugin,
  SassPlugin,
  Sparky,
  SVGPlugin,
  TerserPlugin,
  WebIndexPlugin,
} from 'fuse-box';

// tslint:disable-next-line: no-implicit-dependencies
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

let production = false;
let options: any;

const DOT_ENV = dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

Sparky.task('options', () => {
  options = {
    homeDir: 'src',
    output: 'dist/$name.js',
    hash: production,
    target: 'browser',
    sourceMaps: true,
    showErrorsInBrowser: true,
    polyfillNonStandardDefaultUsage: true,
    debug: true,
    cache: !production,
    plugins: [
      EnvPlugin({
        ...DOT_ENV.parsed,
        NODE_ENV: production ? 'production' : 'development',
      }),
      JSONPlugin(),
      SVGPlugin(),
      ImageBase64Plugin(),
      [
        '*.module.scss',
        SassPlugin({
          importer: true,
        }),
        CSSModulesPlugin(),
        CSSPlugin({
          inject: true,
        }),
      ],
      [
        SassPlugin({
          importer: true,
          cache: true,
        }),
        CSSPlugin({
          inject: true,
        }),
      ],
      WebIndexPlugin({
        title: 'App Demo',
        template: 'public/index.html',
        path: '/',
        cssPath: '/css',
      }),
      production && QuantumPlugin({
        polyfills: ['Promise'],
        treeshake: true,
        uglify: false,
        css: true,
      }),
      production && TerserPlugin({
        mangle: {
          toplevel: true,
          ie8: false,
        },
      }),
    ],
  };
});

Sparky.task('build', () => {
  const fuse = FuseBox.init(options);

  if (!production) {
    // Configure development server
    fuse.dev({
      port: 3000,
      open: true,
      root: false,
      fallback: 'index.html',
    }, (server: any) => {
      const dist = path.join(__dirname, 'dist');
      const devAppServer = server.httpServer.app;
      devAppServer.use('/', express.static(dist));
      devAppServer.get('*', (req: any, res: any) => {
        res.sendFile(path.join(dist, 'index.html'));
      });
    });
  }

  // extract dependencies automatically
  const vendor = fuse.bundle('js/vendor')
    .instructions(`~ **/**!(.test).{ts,tsx} +tslib`);

  if (!production) { vendor.hmr(); }

  const app = fuse.bundle('js/app')
    // Code splitting ****************************************************************
    .splitConfig({ browser: '/', dest: 'js/chunks/' })

    // bundle the entry point without deps
    // bundle routes for lazy loading as there is not require statement in or entry point
    .instructions(`> [index.tsx] + [js/chunks/**/**!(.test).{ts, tsx}]`);

  if (!production) {
    app.hmr().watch();
  }

  return fuse.run();
});

// main task
Sparky.task('default', ['clean', 'options', 'build'], () => {
  //
});

// wipe it all
Sparky.task('clean', () => Sparky.src('dist/*').clean('dist/'));

// Sparky.task('copy-assets', () => {
//   return Sparky.src('./assets/**', { base: './src' }).dest(`dist/`);
// });

// Sparky.task('copy-html', () => Sparky.src('*.html', { base: './src/client/views' }).dest(`dist/`));

Sparky.task('set-production-env', () => production = true);

Sparky.task('dist', ['clean', 'set-production-env', 'options', 'build'], () => {
  //
});
