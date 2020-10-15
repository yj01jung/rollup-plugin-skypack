import axios from 'axios';
import findUp from 'find-up';
import { readJSON } from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
const MINIFIED_REGEX = /(?:Minified: )(.*)/;

export class SkypackResolver {
  private _optimize: boolean = true;
  private _host = 'https://cdn.skypack.dev/';
  private _cache = new Map<string, string>();
  constructor({ optimize, cdnHost }: { optimize: boolean; cdnHost?: string }) {
    this._optimize = optimize;
    if (cdnHost) this._host = cdnHost;
  }
  private async _getVersion(id: string): Promise<string | null> {
    try {
      const cwd = path.dirname(require.resolve(id));
      const pkgJson = await findUp('package.json', { cwd });
      if (!pkgJson) return null;
      const { version }: PackageJson = await readJSON(pkgJson);
      return version || null;
    } catch {
      return null;
    }
  }
  private _getUrl(id: string, version: string | null) {
    return version ? `${this._host + id}@${version}` : this._host + id;
  }
  private async _getOptimizedUrl(id: string, version: string | null) {
    try {
      const { data } = await axios.get<string>(this._getUrl(id, version));
      const matched = data.match(MINIFIED_REGEX);
      if (matched && matched[1]) return matched[1];
    } catch {}
    return this._getUrl(id, version); // fallback
  }
  async resolve(id: string) {
    if (this._cache.has(id)) return this._cache.get(id)!;
    const version = await this._getVersion(id);
    const url = this._optimize
      ? await this._getOptimizedUrl(id, version)
      : this._getUrl(id, version);
    this._cache.set(id, url);
    return url;
  }
}
