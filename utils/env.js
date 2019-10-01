const path = './.env';

module.exports = () => {
  const { parsed } = require('dotenv').config({ path });

  const raw = Object.keys(parsed)
    .reduce(
      (env, key) => {
        env[key] = parsed[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: '/',
      }
    );

  return raw;
}
