# Number Palace

![Number Palace](public/og.png)

Number Palace is a browser memory game that turns number sequences into vivid
noun-adjective-verb scenes, then helps players recall the original digits.

## Project links

- **Play the game:** [number-palace-memory-game.benkouzel372105.chatgpt.site](https://number-palace-memory-game.benkouzel372105.chatgpt.site/)
- **Public source code:** [github.com/benkouzel-code/Number-palace](https://github.com/benkouzel-code/Number-palace)

The `chatgpt.site` link opens the running game. The `github.com` link is the
public code repository for judges and developers.

## Try the game

1. Open the **Play the game** link above.
2. Select **Enter the quick demo**.
3. Generate a number sequence or save a custom sequence.
4. Practice it **Number by number** or as a **Whole sequence**.

## What it does

- Lets each player assign a noun, adjective, and verb to digits 0-9
- Includes three editable example word sets for a quick start
- Generates random sequences from 3 to 36 digits
- Saves named custom sequences for repeated practice
- Plays scenes in noun-adjective-verb order
- Provides progressive hints in number-by-number practice
- Reveals the answer after three misses in whole-sequence practice
- Stores profiles, saved sequences, and statistics on the current device

## How the memory system works

The role pattern repeats as **noun, adjective, verb**.

Using the included Mythic demo:

| Digit | Noun | Adjective | Verb |
| --- | --- | --- | --- |
| 0 | Hercules | burning | lifting |
| 1 | Cthulhu | frozen | singing |
| 2 | Robin Hood | golden | praying |

The sequence `201` becomes:

> Robin Hood, burning, singing.

The player remembers the unusual scene and decodes it back into `201`.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Validation:

```bash
npm run lint
npm test
```

## Built with

React 19, TypeScript, Vinext, Vite, Tailwind CSS 4, Cloudflare Workers, OpenAI
Sites, browser localStorage, and original OpenAI-generated environment art.

## Codex and GPT-5.6

Codex was used to turn the initial game brief into the React application,
implement both practice modes, generate and integrate the visual assets, test
the production build, and deploy the working game. GPT-5.6 helped reason
through the mnemonic system and keep configuration, playback, hints, and
practice consistently ordered as noun, adjective, verb.

## Data and privacy

Profiles are device-local conveniences, not password-protected accounts.
Clearing browser data removes saved profiles and sequences. Do not store real
PINs or other sensitive numbers in the game.

## License

[MIT](LICENSE)
