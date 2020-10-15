# rollup-plugin-skypack

Skypack https://www.skypack.dev/
Everything on npm, delivered directly to your browser.

Can boost load for commonly used module with cdn (like react, lodash)

# WARNING THIS PLUGIN IS UNOFFICIAL

## Features

- Auto resolving PINNED urls

## Install

```sh
yarn add rollup-plugin-skypack
```

## Usage

it is recommended to install the local dependencies with npm and yarn (but optional, default use latest version)

```js
//> rollup.config.js

import skypack from 'rollup-plugin-skypack';

module.exports = {
  input: 'src/index.js',
  output: {
    format: 'es',
  },
  plugins: [
    skypack({
      modules: ['axios', 'react', 'react-dom'],
      optimize: true, // USE PINNED URL, false for lookup url
    }),
  ],
};
```

## Options

```ts
interface SkypackPluginOptions {
  /**
   * desired module would load with skypack cdn, and remove at the bundle
   */
  modules: string[];
  /**
   * @see https://docs.skypack.dev/lookup-urls/pinned-urls-optimized
   *
   * if true use pinned url (load fast but build is slow, for production)
   *
   * if false use lookup url (build fast)
   *
   * @example optimize: process.env.NODE_ENV === 'production'
   */
  optimize: boolean;
}
```
