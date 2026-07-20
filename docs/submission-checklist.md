# Number Palace Submission Checklist

Work through this list from top to bottom. Items marked **manual** need an
account action or information only the project owner can provide.

## 1. Confirm eligibility and model use

- [ ] **Manual:** Open the Codex task where the core game was built.
- [ ] **Manual:** Verify that its model label is GPT-5.6.
- [ ] If it is not, use GPT-5.6 in Codex for a meaningful final feature,
  accessibility, test, or release pass. Describe the model history accurately;
  do not imply earlier work used GPT-5.6 if it did not.
- [ ] Keep the task containing the majority of the core functionality available
  until the submission is complete.

Core technical task reference:

```text
019f7f72-c383-7112-a785-56f57afdfbfa
```

## 2. Validate the repository

- [ ] Run `npm install`.
- [ ] Run `npm run lint`.
- [ ] Run `npm test`.
- [ ] Confirm the MIT license contains the correct copyright holder.
- [ ] Search the repository for secrets, tokens, private URLs, or personal data.
- [ ] Replace `YOUR_GITHUB_USERNAME` in `README.md` after the repository exists.
- [ ] Confirm every link in the README works from GitHub.

## 3. Publish to GitHub

Repository: [benkouzel-code/Number-palace](https://github.com/benkouzel-code/Number-palace)

- [x] Sign in to GitHub.
- [x] Create the `benkouzel-code/Number-palace` repository.
- [x] Make it **public** for the simplest judging path.
- [ ] Add the GitHub repository as the local `origin`.
- [ ] Merge the initial GitHub commit with the local project history.
- [ ] Push the `main` branch.
- [x] Add the repository URL to `README.md` and
  `docs/devpost-submission.md`.
- [ ] Add the suggested repository topics:
  `education`, `memory-training`, `mnemonics`, `browser-game`, `react`,
  `typescript`, `codex`, and `gpt-5-6`.
- [ ] Open the public repository in a logged-out/private browser window.

If the repository must remain private, invite both required judge accounts:

```text
testing@devpost.com
build-week-event@openai.com
```

Public is recommended because GitHub collaboration invitations are normally
sent to GitHub usernames rather than arbitrary email addresses and can create
avoidable access problems.

## 4. Make the working project judge-accessible

Current deployment:

```text
https://number-palace-memory-game.benkouzel372105.chatgpt.site/
```

- [ ] **Manual:** Open the deployment in a private/incognito window.
- [ ] If it requests the owner's ChatGPT sign-in, publish a judge-accessible
  deployment or adjust access before submitting.
- [ ] Run the full judge test flow from
  `docs/devpost-submission.md` on the deployed build.
- [ ] Confirm refresh persistence, mobile layout, and both practice modes.
- [ ] Never include a real PIN or sensitive number as sample data.

## 5. Record and publish the demo

- [ ] Follow `docs/demo-video-script.md`.
- [ ] Keep the final video under 3 minutes.
- [ ] Include spoken explanation of how both Codex and GPT-5.6 were used.
- [ ] Show the app working, not just slides or source code.
- [ ] Add captions.
- [ ] Upload to YouTube with **Public** visibility.
- [ ] Test the video URL while logged out.
- [ ] Paste the URL into `docs/devpost-submission.md` and the Devpost form.

Suggested video title:

```text
Number Palace - Build Week Education Demo | Codex + GPT-5.6
```

## 6. Submit `/feedback` from the core Codex task

- [ ] **Manual:** Return to the core Number Palace Codex task.
- [ ] Type `/feedback` in the message composer.
- [ ] Choose to share the existing session/task with the feedback.
- [ ] Submit the feedback.
- [ ] Copy the session ID returned by the feedback dialog.
- [ ] Paste that returned ID into the Devpost form and
  `docs/devpost-submission.md`.

Important: the returned feedback ID is the contest field. The technical task
reference listed in section 1 is only a locator and may not be accepted as a
replacement.

## 7. Complete the Devpost form

- [ ] Project: **Number Palace**
- [ ] Category: **Education**
- [ ] Add the one-line tagline and full description from
  `docs/devpost-submission.md`.
- [ ] Add the public working-project URL.
- [ ] Add the GitHub repository URL.
- [ ] Add the public YouTube demo URL.
- [ ] Add the `/feedback` receipt ID.
- [ ] Explain where Codex accelerated the build.
- [ ] Name the key product decisions.
- [ ] Explain the work completed with GPT-5.6.
- [ ] Credit the generated art and any other external assets.
- [ ] Review contest rules for deadline, team, region, and prior-work
  restrictions.

## 8. Final logged-out review

- [ ] Repository loads without permission.
- [ ] License is visible.
- [ ] README setup works from a fresh clone.
- [ ] Deployment loads without owner credentials.
- [ ] YouTube video is public and under 3 minutes.
- [ ] All form links point to the intended project.
- [ ] All bracketed placeholders have been removed.
- [ ] All claims about Codex and GPT-5.6 are accurate.
- [ ] Save a copy or screenshot of the final submission confirmation.
