import { Plugin } from 'vite';
import * as mdi from '@mdi/js';
import * as si from 'simple-icons';
import * as mom from '../src/js/paths';

const icons = {
  mdi: mdi,
  si: {
    steam: si.siSteam.path,
    discord: si.siDiscord.path,
    twitter: si.siTwitter.path,
    github: si.siGithub.path,
    youtube: si.siYoutube.path,
    twitch: si.siTwitch.path,
    opencollective: si.siOpencollective.path
  },
  mom: mom
};

// Simple SVG inliner script.
// Example:
// [[ icon mdi/account ]]
// [[ icon si/steam ]]
export default function (): Plugin {
  const tagMatcher = /\[\[ path (.+) ]]/gi;

  function transformer(html: string) {
    const matches = html.matchAll(tagMatcher);

    for (const match of matches) {
      const [tag, src] = match;
      let [type, name] = src?.split('/') ?? [];

      if (type === 'mdi') {
        name = camelize(`mdi-${name}`);
      }

      const path = icons[type]?.[name];
      if (!path) {
        throw new Error(
          `svg-inline: failed to load icon ${src}! Tell Tom if this script seems broken!`
        );
      }

      html = html.replace(tag, `<path fill="currentColor" d="${path}"></path>`);
    }

    return html;
  }

  return {
    name: 'svg-inliner',
    transformIndexHtml: {
      handler(html) {
        return transformer(html);
      }
    }
  };
}

//         _
//     .--' |
//    /___^ |     .--.
//        ) |    /    \
//       /  |  /`      '.
//      |   '-'    /     \
//      \         |      |\
//       \    /   \      /\|
//        \  /'----`\   /
//        |||       \\ |
//        ((|        ((|
//        |||        |||
// jgs   //_(       //_(
const camelize = (s) => s.replace(/-./g, ([_, x]) => x.toUpperCase());
