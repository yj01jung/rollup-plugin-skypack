import { Plugin } from 'rollup';
import { SkypackResolver } from './SkypackResolver';

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

/**
 * ## Rollup Skypack Plugin (unofficial)
 * Everything on npm, delivered directly to your browser.
 *
 * can boost load for commonly used module with cdn (like react, lodash)
 *
 * @see https://www.skypack.dev/
 * @param options options for skypack plugin
 */
function skypackPlugin({ modules, optimize }: SkypackPluginOptions) {
  const resolver = new SkypackResolver({ optimize });

  const plugin: Plugin = {
    name: 'skypack',
    async resolveId(id: string) {
      if (modules.includes(id)) {
        const url = await resolver.resolve(id);

        return {
          id: url,
          external: true,
        };
      }
    },
  };
  return plugin;
}

export default skypackPlugin;
