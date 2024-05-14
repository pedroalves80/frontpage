// Simplified from https://github.com/donnikitos/vite-plugin-html-inject
// Replaces [[ inject <path> ]] with that file's contents.
// Example: [[ inject map-selector ]]
import { normalizePath, Plugin } from 'vite';
import * as path from 'node:path';
import * as fs from 'node:fs';

const ROOT = 'src/';

export default function (): Plugin {
  const tagMatcher = /\[\[ inject (.+) ]]/gi;

  const fileList = new Set<string>();

  async function renderSnippets(html: string) {
    const matches = html.matchAll(tagMatcher);

    for (const match of matches) {
      let [tag, src] = match;

      const filePath = normalizePath(path.join(ROOT, `${src}.html`));
      fileList.add(filePath);

      let out = tag;
      if (!fs.existsSync(filePath)) {
        throw new Error(`html-inject: failed to find file ${filePath}`);
      }
      try {
        out = await renderSnippets(fs.readFileSync(filePath, 'utf8'));
      } catch (error) {
        if (error instanceof Error) {
          throw new Error('html-inject: ' + error.message);
        }
        throw new Error(`${error}`);
      }

      html = html.replace(tag, out);
    }

    return html;
  }

  return {
    name: 'html-inject',
    handleHotUpdate({ file, server }) {
      if ([...fileList].some((name) => file.includes(name))) {
        server.hot.send({
          type: 'full-reload',
          path: '*'
        });
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return renderSnippets(html);
      }
    }
  };
}
