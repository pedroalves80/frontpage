![Momentum Mod](https://momentum-mod.org/assets/images/logo.svg)

> _Momentum Mod is a standalone game built on the Source Engine, aiming to
> centralize movement gamemodes found in CS:S, CS:GO, and TF2._

# frontpage

Tiny repo for Momentum's frontpage site (momentum-mod.org) and branding
guidelines (momentum-mod.org/branding).

Built using vanilla HTML and CSS, with Vite for auto reloading, TypeScript
compilation and various other goodies. There's a couple of custom plugins for
inlining HTML/SVGs in `/plugins`.

## Development

Use `git submodule update --remote` to ensure you have the `styling` submodule
fetched.

With Node installed, run `npm install`.

To launch a dev session with auto reloading, run `npm run dev`. Open the URL
Vite spits out and all should work.

For auto-formatting, run `npm run format`. I recommend the
[Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
to VSCode.
