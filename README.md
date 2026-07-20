# Number Palace

Number Palace is a browser memory game that turns digits into vivid scenes.
Every player assigns a noun, adjective, and verb to the digits 0–9. Sequences
are grouped into memorable adjective → noun → verb rooms such as “golden Robin
Hood praying.”

The game includes:

- device-local player profiles and individual master lists
- three editable example codices for a fast start
- random number hashes from 3–36 digits, with multiples of 3 recommended
- named custom sequences with unique-name validation
- a guided number-by-number mode with three progressive hint tiers
- a whole-sequence mode that reveals the answer after three missed attempts
- saved routes, practice stats, responsive layouts, and keyboard-friendly forms

## Quick start

Prerequisite: Node.js 22.13 or newer.

```bash
npm install
npm run dev
npm run build
```

Open [http://localhost:3000](http://localhost:3000) after starting the
development server.

## How memory scenes work

Number Palace repeats this three-position pattern:

1. adjective
2. noun
3. verb

For the sequence `201`, the default mythic demo produces:

> golden Hercules singing

The stranger and more animated the mental image, the easier it is to retrieve
the exact digits later.

## Profiles and data

Player profiles are lightweight local profiles, not password-protected
accounts. Codices, saved routes, and practice records are stored in the
browser’s `localStorage` under `number-palace-v1`, so they remain on the same
browser and device. Use the quick demo to enter immediately with the mythic
example list.

## Project structure

- `app/NumberPalaceGame.tsx` contains the game flow and local persistence.
- `app/globals.css` contains the responsive visual system and interactions.
- `public/number-palace-environment.png` is the original generated game art.
- `.openai/hosting.json` contains Sites deployment metadata.

## Notes

- Clearing site data removes local profiles.
- Do not treat saved number sequences as securely stored secrets.
- The app is built with Next-compatible React through Vinext for Cloudflare
  Workers deployment.
