# Devpost Submission Copy

Use this as the source copy for the submission form. Replace every bracketed
item before submitting.

## Project name

Number Palace

## Track

Education

## One-line tagline

Turn exact number sequences into unforgettable noun-adjective-verb scenes, then
train yourself to recall every digit.

## Short description

Number Palace is an educational memory game that helps people learn exact
number sequences by translating digits into vivid mental scenes. Players build
a personal 0-9 codex of nouns, adjectives, and verbs, generate or save a
sequence, and practice recalling it either one digit at a time with progressive
hints or all at once.

## Full project description

Number Palace turns abstract digits into a repeatable visual language. Each
player assigns a noun, adjective, and verb to every digit from 0 through 9.
When a number sequence is generated, the game reads it in groups of three:
noun, adjective, then verb. A sequence such as `201` becomes a scene like
"Robin Hood, burning, singing." Because the roles repeat predictably, the
scene can be decoded back into the exact original digits.

Players can start immediately with one of three example codices or customize
every word in their own master list. They can generate a random sequence from
3 to 36 digits, with multiples of three recommended, or save a named custom
sequence for repeated study.

The game supports two retrieval styles. Number-by-number mode asks for each
digit and provides three deliberate hint tiers: the current word role, the
digit's full codex entry, and finally the digit itself. Whole-sequence mode asks
for the complete answer and reveals it after three missed attempts. Practice
statistics and saved routes are kept per local player profile.

The goal is not just to display a mnemonic. Number Palace lets the learner
construct a personal encoding system, rehearse it, request only as much help as
needed, and measure retrieval over time.

## How Codex and GPT-5.6 were used

Codex was the primary development environment for the project. Starting from a
plain-language product brief, GPT-5.6 in Codex helped:

- design the typed data model for profiles, codices, routes, and statistics
- implement the complete React and TypeScript game flow
- build and refine the responsive fantasy-palace interface
- create and integrate original image-generated environment art
- reason through hint progression and answer-reveal behavior
- identify and correct a role-order inconsistency so configuration, playback,
  and recall all use noun, adjective, verb
- add a production smoke test, deployment configuration, README, and contest
  materials

The most important decisions were made deliberately with Codex as a
collaborative implementation partner: a stable three-role grammar, a
multiple-of-three recommendation instead of a hard restriction, progressive
hints that preserve desirable difficulty, and local-first storage for a
frictionless prototype.

Before submitting, verify that the core Codex task shows GPT-5.6 and paste the
feedback receipt ID in the field below.

## What is technically notable

- One personalized codex can encode any number sequence.
- Both practice modes use the same source of truth for role and digit mapping.
- Progressive hints expose increasingly specific information without
  immediately discarding the retrieval attempt.
- Profiles, saved routes, and statistics persist without a backend.
- The production deployment targets Cloudflare Workers through OpenAI Sites.
- The project includes an original generated visual environment rather than a
  stock theme.

## Test flow for judges

1. Open the app and select **Enter the quick demo**.
2. Generate a 6-digit route.
3. Observe the noun-adjective-verb scene playback.
4. Try **Number by number** and open each hint tier.
5. Return home and try **Whole sequence**.
6. Create a named custom route and confirm it appears in saved routes.
7. Open the codex to see or edit the full 0-9 mapping.

No credentials or sample-data import are required.

## Submission URLs and IDs

- Working project: https://number-palace-memory-game.benkouzel372105.chatgpt.site/
- Code repository: [ADD PUBLIC GITHUB REPOSITORY URL]
- Public YouTube demo: [ADD PUBLIC YOUTUBE VIDEO URL]
- `/feedback` Codex Session ID: [ADD FEEDBACK RECEIPT ID]
- Core technical task reference: `019f7f72-c383-7112-a785-56f57afdfbfa`

The technical task reference above helps you locate the correct Codex task. It
is not a substitute for the receipt ID returned after submitting `/feedback`.

## Suggested tags

`education` `memory-training` `mnemonics` `browser-game` `react`
`typescript` `codex` `gpt-5-6` `cloudflare-workers` `openai-sites`

## Final disclosure check

Only submit factual claims. If the model label for the core task does not show
GPT-5.6, complete a meaningful final implementation and validation pass in a
GPT-5.6 Codex task and describe the division of work accurately.
