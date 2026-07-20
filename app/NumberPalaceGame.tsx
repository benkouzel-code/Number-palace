"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type WordRole = "adjective" | "noun" | "verb";

type CodexEntry = {
  noun: string;
  adjective: string;
  verb: string;
};

type SavedSequence = {
  id: string;
  name: string;
  sequence: string;
  createdAt: string;
};

type PlayerStats = {
  sessions: number;
  bestStreak: number;
  correctDigits: number;
  attemptedDigits: number;
};

type PlayerProfile = {
  id: string;
  name: string;
  createdAt: string;
  setupComplete: boolean;
  codex: CodexEntry[];
  savedSequences: SavedSequence[];
  stats: PlayerStats;
};

type PalaceStore = {
  profiles: PlayerProfile[];
  activeProfileId: string | null;
};

type View = "login" | "setup" | "home" | "saved" | "codex";
type PracticeMode = "digit" | "whole" | null;

const STORAGE_KEY = "number-palace-v1";
const ROLE_PATTERN: WordRole[] = ["adjective", "noun", "verb"];

const MYTHIC_WORDS = {
  nouns: [
    "Hercules",
    "Cthulhu",
    "Robin Hood",
    "Phoenix",
    "Kraken",
    "Medusa",
    "Atlas",
    "Wizard",
    "Valkyrie",
    "Dragon",
  ],
  adjectives: [
    "burning",
    "frozen",
    "golden",
    "divine",
    "demonic",
    "crystal",
    "ancient",
    "stormy",
    "shadowy",
    "radiant",
  ],
  verbs: [
    "lifting",
    "singing",
    "praying",
    "dancing",
    "forging",
    "climbing",
    "whispering",
    "painting",
    "charging",
    "guarding",
  ],
};

const STORYBOOK_WORDS = {
  nouns: [
    "Astronaut",
    "Octopus",
    "Queen",
    "Robot",
    "Tiger",
    "Pirate",
    "Chef",
    "Knight",
    "Mermaid",
    "Moon",
  ],
  adjectives: [
    "tiny",
    "gigantic",
    "striped",
    "invisible",
    "sparkling",
    "sleepy",
    "purple",
    "noisy",
    "feathered",
    "jelly",
  ],
  verbs: [
    "juggling",
    "surfing",
    "baking",
    "sneezing",
    "skating",
    "drumming",
    "floating",
    "digging",
    "waving",
    "tickling",
  ],
};

const SURREAL_WORDS = {
  nouns: [
    "Teapot",
    "Grandpa",
    "Lobster",
    "Violin",
    "Penguin",
    "Mailbox",
    "Detective",
    "Cactus",
    "Bicycle",
    "Volcano",
  ],
  adjectives: [
    "velvet",
    "electric",
    "melting",
    "clockwork",
    "polka-dot",
    "levitating",
    "neon",
    "miniature",
    "marble",
    "glowing",
  ],
  verbs: [
    "bowling",
    "knitting",
    "roaring",
    "reading",
    "whistling",
    "rowing",
    "spinning",
    "saluting",
    "napping",
    "escaping",
  ],
};

const emptyStore: PalaceStore = { profiles: [], activeProfileId: null };

function wordsToCodex(words: typeof MYTHIC_WORDS): CodexEntry[] {
  return Array.from({ length: 10 }, (_, digit) => ({
    noun: words.nouns[digit],
    adjective: words.adjectives[digit],
    verb: words.verbs[digit],
  }));
}

const makeMythicCodex = () => wordsToCodex(MYTHIC_WORDS);

function makeId(prefix: string) {
  const randomPart =
    typeof window !== "undefined" && window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${randomPart}`;
}

function cleanDigits(value: string, max = 60) {
  return value.replace(/\D/g, "").slice(0, max);
}

export default function NumberPalaceGame() {
  const [store, setStore] = useState<PalaceStore>(emptyStore);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>("login");
  const [loginName, setLoginName] = useState("");
  const [loginError, setLoginError] = useState("");
  const [draftCodex, setDraftCodex] = useState<CodexEntry[]>(makeMythicCodex);
  const [setupError, setSetupError] = useState("");
  const [generatorTab, setGeneratorTab] = useState<"random" | "custom">(
    "random",
  );
  const [randomLength, setRandomLength] = useState(9);
  const [customDigits, setCustomDigits] = useState("");
  const [customName, setCustomName] = useState("");
  const [sequenceError, setSequenceError] = useState("");
  const [activeSequence, setActiveSequence] = useState<{
    sequence: string;
    name: string;
  } | null>(null);
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(null);
  const [digitIndex, setDigitIndex] = useState(0);
  const [digitGuess, setDigitGuess] = useState("");
  const [digitFeedback, setDigitFeedback] = useState("");
  const [hintTier, setHintTier] = useState(0);
  const [wholeGuess, setWholeGuess] = useState("");
  const [wholeAttempts, setWholeAttempts] = useState(0);
  const [wholeFeedback, setWholeFeedback] = useState("");
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [practiceFinished, setPracticeFinished] = useState(false);
  const [practiceSuccess, setPracticeSuccess] = useState(false);
  const [practiceStreak, setPracticeStreak] = useState(0);
  const [wrongDigits, setWrongDigits] = useState(0);
  const digitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as PalaceStore;
          setStore({ ...parsed, activeProfileId: null });
        }
      } catch {
        setStore(emptyStore);
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [loaded, store]);

  useEffect(() => {
    if (practiceMode === "digit" && !practiceFinished) {
      digitInputRef.current?.focus();
    }
  }, [digitIndex, practiceFinished, practiceMode]);

  const profile = useMemo(
    () =>
      store.profiles.find((item) => item.id === store.activeProfileId) ?? null,
    [store],
  );

  const accuracy = profile?.stats.attemptedDigits
    ? Math.round(
        (profile.stats.correctDigits / profile.stats.attemptedDigits) * 100,
      )
    : 0;

  function updateProfile(
    updater: (currentProfile: PlayerProfile) => PlayerProfile,
  ) {
    setStore((current) => ({
      ...current,
      profiles: current.profiles.map((item) =>
        item.id === current.activeProfileId ? updater(item) : item,
      ),
    }));
  }

  function openProfile(selectedProfile: PlayerProfile) {
    setStore((current) => ({
      ...current,
      activeProfileId: selectedProfile.id,
    }));
    setDraftCodex(selectedProfile.codex.map((entry) => ({ ...entry })));
    setView(selectedProfile.setupComplete ? "home" : "setup");
    setLoginError("");
  }

  function createProfile(event: FormEvent) {
    event.preventDefault();
    const name = loginName.trim();
    if (!name) {
      setLoginError("Give your palace keeper a name.");
      return;
    }
    if (
      store.profiles.some(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setLoginError("That keeper already exists. Choose their card below.");
      return;
    }
    const newProfile: PlayerProfile = {
      id: makeId("keeper"),
      name,
      createdAt: new Date().toISOString(),
      setupComplete: false,
      codex: makeMythicCodex(),
      savedSequences: [],
      stats: {
        sessions: 0,
        bestStreak: 0,
        correctDigits: 0,
        attemptedDigits: 0,
      },
    };
    setStore((current) => ({
      profiles: [...current.profiles, newProfile],
      activeProfileId: newProfile.id,
    }));
    setDraftCodex(newProfile.codex.map((entry) => ({ ...entry })));
    setLoginName("");
    setLoginError("");
    setView("setup");
  }

  function enterDemo() {
    const existing = store.profiles.find((item) => item.name === "Demo Keeper");
    if (existing) {
      openProfile(existing);
      return;
    }
    const demo: PlayerProfile = {
      id: makeId("demo"),
      name: "Demo Keeper",
      createdAt: new Date().toISOString(),
      setupComplete: true,
      codex: makeMythicCodex(),
      savedSequences: [
        {
          id: makeId("sequence"),
          name: "Moon Gate",
          sequence: "201739528",
          createdAt: new Date().toISOString(),
        },
      ],
      stats: {
        sessions: 0,
        bestStreak: 0,
        correctDigits: 0,
        attemptedDigits: 0,
      },
    };
    setStore((current) => ({
      profiles: [...current.profiles, demo],
      activeProfileId: demo.id,
    }));
    setDraftCodex(demo.codex.map((entry) => ({ ...entry })));
    setView("home");
  }

  function logOut() {
    setStore((current) => ({ ...current, activeProfileId: null }));
    setActiveSequence(null);
    setPracticeMode(null);
    setView("login");
  }

  function applyPreset(words: typeof MYTHIC_WORDS) {
    setDraftCodex(wordsToCodex(words));
    setSetupError("");
  }

  function changeCodexEntry(
    digit: number,
    role: WordRole,
    value: string,
  ) {
    setDraftCodex((current) =>
      current.map((entry, index) =>
        index === digit ? { ...entry, [role]: value } : entry,
      ),
    );
  }

  function saveCodex() {
    const incomplete = draftCodex.some(
      (entry) =>
        !entry.noun.trim() || !entry.adjective.trim() || !entry.verb.trim(),
    );
    if (incomplete) {
      setSetupError("Every digit needs all three memory keys.");
      return;
    }
    updateProfile((current) => ({
      ...current,
      codex: draftCodex.map((entry) => ({
        noun: entry.noun.trim(),
        adjective: entry.adjective.trim(),
        verb: entry.verb.trim(),
      })),
      setupComplete: true,
    }));
    setSetupError("");
    setView("home");
  }

  function generateRandom() {
    const length = Math.max(3, Math.min(36, Math.floor(randomLength || 9)));
    const sequence = Array.from({ length }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    setRandomLength(length);
    setActiveSequence({ sequence, name: `${length}-digit expedition` });
    setSequenceError("");
  }

  function prepareCustomSequence(save: boolean) {
    const sequence = cleanDigits(customDigits);
    const name = customName.trim();
    if (!sequence) {
      setSequenceError("Enter at least one digit to open this route.");
      return;
    }
    if (save && !name) {
      setSequenceError("Name this sequence before saving it.");
      return;
    }
    if (
      save &&
      profile?.savedSequences.some(
        (item) => item.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setSequenceError("Sequence names must be unique in your palace.");
      return;
    }
    if (save) {
      updateProfile((current) => ({
        ...current,
        savedSequences: [
          {
            id: makeId("sequence"),
            name,
            sequence,
            createdAt: new Date().toISOString(),
          },
          ...current.savedSequences,
        ],
      }));
    }
    setActiveSequence({
      sequence,
      name: name || `${sequence.length}-digit custom route`,
    });
    setSequenceError("");
    if (save) {
      setCustomDigits("");
      setCustomName("");
    }
  }

  function selectSaved(saved: SavedSequence) {
    setActiveSequence({ sequence: saved.sequence, name: saved.name });
    setView("home");
    window.setTimeout(
      () =>
        document
          .getElementById("active-sequence")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      50,
    );
  }

  function deleteSaved(sequenceId: string) {
    updateProfile((current) => ({
      ...current,
      savedSequences: current.savedSequences.filter(
        (item) => item.id !== sequenceId,
      ),
    }));
  }

  function startPractice(mode: Exclude<PracticeMode, null>) {
    if (!activeSequence) return;
    setPracticeMode(mode);
    setDigitIndex(0);
    setDigitGuess("");
    setDigitFeedback("");
    setHintTier(0);
    setWholeGuess("");
    setWholeAttempts(0);
    setWholeFeedback("");
    setAnswerRevealed(false);
    setPracticeFinished(false);
    setPracticeSuccess(false);
    setPracticeStreak(0);
    setWrongDigits(0);
  }

  function finishPractice(success: boolean, wholeAttemptCount = 1) {
    if (!activeSequence || practiceFinished) return;
    setPracticeFinished(true);
    setPracticeSuccess(success);
    const length = activeSequence.sequence.length;
    updateProfile((current) => ({
      ...current,
      stats: {
        sessions: current.stats.sessions + 1,
        bestStreak: Math.max(
          current.stats.bestStreak,
          practiceMode === "digit" ? practiceStreak + (success ? 1 : 0) : length,
        ),
        correctDigits:
          current.stats.correctDigits + (success ? length : 0),
        attemptedDigits:
          current.stats.attemptedDigits +
          (practiceMode === "digit"
            ? length + wrongDigits
            : length * Math.max(1, wholeAttemptCount)),
      },
    }));
  }

  function submitDigit(event: FormEvent) {
    event.preventDefault();
    if (!activeSequence || practiceFinished || !digitGuess) return;
    const expected = activeSequence.sequence[digitIndex];
    if (digitGuess === expected) {
      setPracticeStreak((current) => current + 1);
      setDigitFeedback("The door opens.");
      setDigitGuess("");
      setHintTier(0);
      if (digitIndex === activeSequence.sequence.length - 1) {
        finishPractice(true);
      } else {
        setDigitIndex((current) => current + 1);
      }
      return;
    }
    setWrongDigits((current) => current + 1);
    setPracticeStreak(0);
    setDigitFeedback("That key does not turn. Picture the scene again.");
    setDigitGuess("");
  }

  function submitWhole(event: FormEvent) {
    event.preventDefault();
    if (!activeSequence || practiceFinished || answerRevealed) return;
    const guess = cleanDigits(wholeGuess);
    if (guess === activeSequence.sequence) {
      setWholeFeedback("Perfect recall. Every room is in place.");
      finishPractice(true, wholeAttempts + 1);
      return;
    }
    const nextAttempts = wholeAttempts + 1;
    setWholeAttempts(nextAttempts);
    setWholeGuess("");
    if (nextAttempts >= 3) {
      setAnswerRevealed(true);
      setWholeFeedback("The palace reveals the route. Walk it once more.");
      finishPractice(false, 3);
    } else {
      setWholeFeedback(
        `Not quite. ${3 - nextAttempts} ${
          3 - nextAttempts === 1 ? "attempt" : "attempts"
        } remain.`,
      );
    }
  }

  function closePractice() {
    setPracticeMode(null);
    setPracticeFinished(false);
  }

  function sceneGroups(sequence: string) {
    const groups: { digits: string; words: string[] }[] = [];
    for (let index = 0; index < sequence.length; index += 3) {
      const digits = sequence.slice(index, index + 3);
      const words = digits.split("").map((digit, offset) => {
        const role = ROLE_PATTERN[offset];
        return profile?.codex[Number(digit)]?.[role] ?? "";
      });
      groups.push({ digits, words });
    }
    return groups;
  }

  if (!loaded) {
    return (
      <main className="loading-screen">
        <div className="brand-orbit" aria-hidden="true">
          0
        </div>
        <p>Lighting the palace lamps…</p>
      </main>
    );
  }

  if (view === "login" || !profile) {
    return (
      <main className="login-shell">
        <section className="login-art" aria-label="A moonlit memory palace">
          <div className="login-art-scrim" />
          <div className="login-brand">
            <div className="brand-mark" aria-hidden="true">
              <span>0</span>
              <span>1</span>
              <span>2</span>
            </div>
            <div>
              <p className="eyebrow">Train vivid recall</p>
              <h1>Number Palace</h1>
            </div>
          </div>
          <blockquote>
            Turn every digit into a character, a quality, and an action. Then
            let the impossible scene remember for you.
          </blockquote>
          <div className="scene-formula" aria-label="Scene formula">
            <span>Adjective</span>
            <b>+</b>
            <span>Noun</span>
            <b>+</b>
            <span>Verb</span>
          </div>
        </section>

        <section className="login-panel">
          <div className="login-panel-inner">
            <p className="section-kicker">The keeper’s desk</p>
            <h2>Who is entering?</h2>
            <p className="muted">
              Profiles keep each player’s word codex, saved routes, and
              practice record separate on this device.
            </p>

            <form className="login-form" onSubmit={createProfile}>
              <label htmlFor="keeper-name">Create a new keeper</label>
              <div className="input-with-button">
                <input
                  id="keeper-name"
                  value={loginName}
                  onChange={(event) => {
                    setLoginName(event.target.value);
                    setLoginError("");
                  }}
                  placeholder="e.g. Maya"
                  autoComplete="name"
                  maxLength={30}
                />
                <button className="button primary" type="submit">
                  Build my palace
                </button>
              </div>
              {loginError && (
                <p className="form-error" role="alert">
                  {loginError}
                </p>
              )}
            </form>

            <div className="divider">
              <span>or</span>
            </div>

            <button className="demo-card" type="button" onClick={enterDemo}>
              <span className="demo-icon" aria-hidden="true">
                ✦
              </span>
              <span>
                <b>Enter the quick demo</b>
                <small>
                  Hercules, Cthulhu, Robin Hood, and a ready-made route
                </small>
              </span>
              <span aria-hidden="true">→</span>
            </button>

            {store.profiles.length > 0 && (
              <div className="returning-keepers">
                <div className="subhead-row">
                  <h3>Returning keepers</h3>
                  <span>{store.profiles.length}</span>
                </div>
                <div className="profile-list">
                  {store.profiles.map((item) => (
                    <button
                      className="profile-row"
                      key={item.id}
                      type="button"
                      onClick={() => openProfile(item)}
                    >
                      <span className="profile-avatar">
                        {item.name.charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <b>{item.name}</b>
                        <small>
                          {item.savedSequences.length} saved{" "}
                          {item.savedSequences.length === 1
                            ? "route"
                            : "routes"}{" "}
                          · {item.stats.sessions} sessions
                        </small>
                      </span>
                      <span aria-hidden="true">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  if (view === "setup" || view === "codex") {
    const isFirstSetup = !profile.setupComplete;
    return (
      <main className="app-shell">
        <header className="topbar">
          <button
            className="mini-brand"
            type="button"
            onClick={() => (isFirstSetup ? undefined : setView("home"))}
            aria-label="Number Palace home"
          >
            <span aria-hidden="true">012</span>
            <b>Number Palace</b>
          </button>
          {!isFirstSetup && (
            <button
              className="button ghost"
              type="button"
              onClick={() => setView("home")}
            >
              ← Back to the hall
            </button>
          )}
        </header>

        <section className="codex-page">
          <div className="codex-heading">
            <div>
              <p className="section-kicker">
                {isFirstSetup ? "First, forge your master list" : "Master list"}
              </p>
              <h1>
                Give every digit a <em>vivid identity.</em>
              </h1>
              <p>
                Each three-digit room becomes an adjective, a noun, and a verb:
                “golden Robin Hood praying.” Strange, specific images stick.
              </p>
            </div>
            <div className="pattern-card">
              <span>Scene pattern</span>
              <b>ADJ → NOUN → VERB</b>
              <small>then repeat for the next room</small>
            </div>
          </div>

          <div className="preset-section">
            <div className="subhead-row">
              <h2>Start with an example set</h2>
              <span>Everything stays editable</span>
            </div>
            <div className="preset-grid">
              <button
                type="button"
                className="preset-card mythic"
                onClick={() => applyPreset(MYTHIC_WORDS)}
              >
                <span>✦</span>
                <b>Mythic demo</b>
                <small>Hercules · burning · lifting</small>
              </button>
              <button
                type="button"
                className="preset-card storybook"
                onClick={() => applyPreset(STORYBOOK_WORDS)}
              >
                <span>☾</span>
                <b>Storybook strange</b>
                <small>Astronaut · tiny · juggling</small>
              </button>
              <button
                type="button"
                className="preset-card surreal"
                onClick={() => applyPreset(SURREAL_WORDS)}
              >
                <span>◉</span>
                <b>Everyday surreal</b>
                <small>Teapot · velvet · bowling</small>
              </button>
            </div>
          </div>

          <div className="codex-table-wrap">
            <div className="codex-table-header">
              <span>Digit</span>
              <span>Noun / character</span>
              <span>Adjective / quality</span>
              <span>Verb / action</span>
            </div>
            <div className="codex-table">
              {draftCodex.map((entry, digit) => (
                <div className="codex-row" key={digit}>
                  <div className="digit-seal">{digit}</div>
                  <label>
                    <span>Noun</span>
                    <input
                      value={entry.noun}
                      onChange={(event) =>
                        changeCodexEntry(digit, "noun", event.target.value)
                      }
                      aria-label={`Noun for ${digit}`}
                    />
                  </label>
                  <label>
                    <span>Adjective</span>
                    <input
                      value={entry.adjective}
                      onChange={(event) =>
                        changeCodexEntry(
                          digit,
                          "adjective",
                          event.target.value,
                        )
                      }
                      aria-label={`Adjective for ${digit}`}
                    />
                  </label>
                  <label>
                    <span>Verb</span>
                    <input
                      value={entry.verb}
                      onChange={(event) =>
                        changeCodexEntry(digit, "verb", event.target.value)
                      }
                      aria-label={`Verb for ${digit}`}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky-save">
            <div>
              <b>{profile.name}’s codex</b>
              <span>30 memory keys ready to be forged</span>
            </div>
            {setupError && (
              <p className="form-error" role="alert">
                {setupError}
              </p>
            )}
            <button className="button primary" type="button" onClick={saveCodex}>
              {isFirstSetup ? "Open my palace" : "Save master list"}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className="mini-brand"
          type="button"
          onClick={() => setView("home")}
          aria-label="Number Palace home"
        >
          <span aria-hidden="true">012</span>
          <b>Number Palace</b>
        </button>
        <nav aria-label="Palace navigation">
          <button
            type="button"
            className={view === "home" ? "active" : ""}
            onClick={() => setView("home")}
          >
            Great Hall
          </button>
          <button
            type="button"
            className={view === "saved" ? "active" : ""}
            onClick={() => setView("saved")}
          >
            Saved routes
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftCodex(profile.codex.map((entry) => ({ ...entry })));
              setView("codex");
            }}
          >
            My codex
          </button>
        </nav>
        <div className="user-menu">
          <span className="profile-avatar">
            {profile.name.charAt(0).toUpperCase()}
          </span>
          <span className="user-name">{profile.name}</span>
          <button type="button" onClick={logOut}>
            Leave
          </button>
        </div>
      </header>

      {view === "saved" ? (
        <section className="saved-page">
          <div className="page-heading">
            <div>
              <p className="section-kicker">The route archive</p>
              <h1>Saved sequences</h1>
              <p>Return to exact combos until their scenes feel effortless.</p>
            </div>
            <button
              className="button primary"
              type="button"
              onClick={() => setView("home")}
            >
              + Create a route
            </button>
          </div>

          {profile.savedSequences.length ? (
            <div className="saved-grid">
              {profile.savedSequences.map((saved, index) => (
                <article className="saved-card" key={saved.id}>
                  <div className="saved-card-top">
                    <span>Room {String(index + 1).padStart(2, "0")}</span>
                    <button
                      type="button"
                      onClick={() => deleteSaved(saved.id)}
                      aria-label={`Delete ${saved.name}`}
                    >
                      Delete
                    </button>
                  </div>
                  <h2>{saved.name}</h2>
                  <div className="mini-sequence">
                    {saved.sequence.split("").map((digit, digitIndex) => (
                      <span
                        key={`${saved.id}-${digitIndex}`}
                        className={
                          digitIndex > 0 && digitIndex % 3 === 0
                            ? "group-start"
                            : ""
                        }
                      >
                        {digit}
                      </span>
                    ))}
                  </div>
                  <div className="saved-meta">
                    <span>{saved.sequence.length} digits</span>
                    <span>
                      {saved.sequence.length % 3 === 0
                        ? `${saved.sequence.length / 3} complete scenes`
                        : "Includes a partial scene"}
                    </span>
                  </div>
                  <button
                    className="button secondary wide"
                    type="button"
                    onClick={() => selectSaved(saved)}
                  >
                    Practice this route →
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">⌁</span>
              <h2>No routes on this shelf yet</h2>
              <p>Name and save a custom number sequence in the Great Hall.</p>
              <button
                className="button primary"
                type="button"
                onClick={() => setView("home")}
              >
                Make the first one
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="dashboard-hero">
            <div className="hero-copy">
              <p className="section-kicker">Welcome back, {profile.name}</p>
              <h1>
                Build the scene.
                <br />
                <em>Recall the digits.</em>
              </h1>
              <p>
                Three digits become one impossible moment. Walk the rooms, make
                it vivid, and let your palace hold the sequence.
              </p>
              <div className="hero-stats">
                <div>
                  <b>{profile.stats.sessions}</b>
                  <span>Sessions</span>
                </div>
                <div>
                  <b>{profile.stats.bestStreak}</b>
                  <span>Best streak</span>
                </div>
                <div>
                  <b>{accuracy}%</b>
                  <span>Recall rate</span>
                </div>
              </div>
            </div>
            <div className="hero-art" aria-label="The moonlit Number Palace">
              <div className="floating-note note-one">
                <span>Scene 01</span>
                <b>golden · Robin Hood · praying</b>
              </div>
              <div className="floating-note note-two">
                <span>Your pattern</span>
                <b>ADJ → NOUN → VERB</b>
              </div>
            </div>
          </section>

          <section className="generator-section">
            <div className="generator-heading">
              <div>
                <p className="section-kicker">Choose a route</p>
                <h2>What will you remember?</h2>
              </div>
              <div className="generator-tabs" role="tablist">
                <button
                  role="tab"
                  aria-selected={generatorTab === "random"}
                  className={generatorTab === "random" ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setGeneratorTab("random");
                    setSequenceError("");
                  }}
                >
                  Random hash
                </button>
                <button
                  role="tab"
                  aria-selected={generatorTab === "custom"}
                  className={generatorTab === "custom" ? "active" : ""}
                  type="button"
                  onClick={() => {
                    setGeneratorTab("custom");
                    setSequenceError("");
                  }}
                >
                  Custom sequence
                </button>
              </div>
            </div>

            <div className="generator-card">
              {generatorTab === "random" ? (
                <div className="random-builder">
                  <div>
                    <label htmlFor="digit-length">Number of digits</label>
                    <div className="length-input">
                      <button
                        type="button"
                        aria-label="Remove one digit"
                        onClick={() =>
                          setRandomLength((current) => Math.max(3, current - 1))
                        }
                      >
                        −
                      </button>
                      <input
                        id="digit-length"
                        type="number"
                        min={3}
                        max={36}
                        value={randomLength}
                        onChange={(event) =>
                          setRandomLength(Number(event.target.value))
                        }
                      />
                      <button
                        type="button"
                        aria-label="Add one digit"
                        onClick={() =>
                          setRandomLength((current) =>
                            Math.min(36, current + 1),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="quick-lengths">
                    <span>Scene-friendly</span>
                    {[6, 9, 12, 18].map((length) => (
                      <button
                        key={length}
                        type="button"
                        className={randomLength === length ? "active" : ""}
                        onClick={() => setRandomLength(length)}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                  <div className="recommendation">
                    <span aria-hidden="true">✦</span>
                    <p>
                      Multiples of 3 make complete adjective–noun–verb scenes.
                    </p>
                  </div>
                  <button
                    className="button primary generator-action"
                    type="button"
                    onClick={generateRandom}
                  >
                    Generate number hash
                  </button>
                </div>
              ) : (
                <div className="custom-builder">
                  <label>
                    <span>Sequence name</span>
                    <input
                      value={customName}
                      onChange={(event) => {
                        setCustomName(event.target.value);
                        setSequenceError("");
                      }}
                      placeholder="e.g. Old locker code"
                      maxLength={40}
                    />
                  </label>
                  <label className="digits-field">
                    <span>Number sequence</span>
                    <input
                      value={customDigits}
                      inputMode="numeric"
                      onChange={(event) => {
                        setCustomDigits(cleanDigits(event.target.value));
                        setSequenceError("");
                      }}
                      placeholder="Type digits only"
                      aria-describedby="custom-digit-note"
                    />
                    <small id="custom-digit-note">
                      {customDigits.length || 0} digits
                      {customDigits.length > 0 && customDigits.length % 3 !== 0
                        ? " · try adding digits to complete the final scene"
                        : ""}
                    </small>
                  </label>
                  <div className="custom-actions">
                    <button
                      className="button ghost"
                      type="button"
                      onClick={() => prepareCustomSequence(false)}
                    >
                      Use once
                    </button>
                    <button
                      className="button primary"
                      type="button"
                      onClick={() => prepareCustomSequence(true)}
                    >
                      Save & prepare
                    </button>
                  </div>
                </div>
              )}
              {sequenceError && (
                <p className="form-error sequence-error" role="alert">
                  {sequenceError}
                </p>
              )}
            </div>
          </section>

          {activeSequence ? (
            <section className="active-sequence" id="active-sequence">
              <div className="sequence-title-row">
                <div>
                  <p className="section-kicker">Route prepared</p>
                  <h2>{activeSequence.name}</h2>
                </div>
                <span>{activeSequence.sequence.length} digits</span>
              </div>
              <div
                className="sequence-display"
                aria-label={`Sequence ${activeSequence.sequence}`}
              >
                {activeSequence.sequence.split("").map((digit, index) => (
                  <span
                    key={`${digit}-${index}`}
                    className={
                      index > 0 && index % 3 === 0 ? "group-start" : ""
                    }
                  >
                    {digit}
                  </span>
                ))}
              </div>
              <div className="scene-walk">
                {sceneGroups(activeSequence.sequence).map((group, index) => (
                  <div className="scene-room" key={`${group.digits}-${index}`}>
                    <span>Room {String(index + 1).padStart(2, "0")}</span>
                    <b>
                      {group.words.map((word, wordIndex) => (
                        <em key={`${word}-${wordIndex}`}>
                          {word}
                          {wordIndex < group.words.length - 1 ? " · " : ""}
                        </em>
                      ))}
                    </b>
                    <small>{group.digits}</small>
                  </div>
                ))}
              </div>
              <div className="practice-choice">
                <div>
                  <p>How do you want to walk it?</p>
                  <small>The sequence disappears when practice begins.</small>
                </div>
                <button
                  className="practice-button"
                  type="button"
                  onClick={() => startPractice("digit")}
                >
                  <span>01</span>
                  <b>Number by number</b>
                  <small>Guided recall with 3 hint tiers</small>
                  <i aria-hidden="true">→</i>
                </button>
                <button
                  className="practice-button"
                  type="button"
                  onClick={() => startPractice("whole")}
                >
                  <span>02</span>
                  <b>Whole sequence</b>
                  <small>Recall everything in 3 attempts</small>
                  <i aria-hidden="true">→</i>
                </button>
              </div>
            </section>
          ) : (
            <section className="waiting-route">
              <span aria-hidden="true">⌁</span>
              <p>Your next route will appear here.</p>
            </section>
          )}
        </>
      )}

      {practiceMode && activeSequence && (
        <div className="practice-overlay" role="dialog" aria-modal="true">
          <div className="practice-modal">
            <div className="practice-modal-top">
              <div>
                <p className="section-kicker">
                  {practiceMode === "digit"
                    ? "Guided room walk"
                    : "Whole route recall"}
                </p>
                <h2>{activeSequence.name}</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={closePractice}
                aria-label="Close practice"
              >
                ×
              </button>
            </div>

            {practiceFinished ? (
              <div className="result-panel">
                <div
                  className={`result-orbit ${
                    practiceSuccess ? "success" : "revealed"
                  }`}
                  aria-hidden="true"
                >
                  {practiceSuccess ? "✦" : "↺"}
                </div>
                <p className="section-kicker">
                  {practiceSuccess ? "Route secured" : "Route revealed"}
                </p>
                <h3>
                  {practiceSuccess
                    ? "The palace remembers."
                    : "Take another walk through the scene."}
                </h3>
                <div className="answer-strip">
                  {activeSequence.sequence.split("").map((digit, index) => (
                    <span
                      key={`${digit}-answer-${index}`}
                      className={
                        index > 0 && index % 3 === 0 ? "group-start" : ""
                      }
                    >
                      {digit}
                    </span>
                  ))}
                </div>
                <div className="result-actions">
                  <button
                    className="button ghost"
                    type="button"
                    onClick={closePractice}
                  >
                    Back to the hall
                  </button>
                  <button
                    className="button primary"
                    type="button"
                    onClick={() =>
                      startPractice(
                        practiceMode === "digit" ? "digit" : "whole",
                      )
                    }
                  >
                    Practice again
                  </button>
                </div>
              </div>
            ) : practiceMode === "digit" ? (
              <div className="digit-practice">
                <div className="progress-label">
                  <span>
                    Door {digitIndex + 1} of {activeSequence.sequence.length}
                  </span>
                  <span>{practiceStreak} streak</span>
                </div>
                <div className="progress-track">
                  <span
                    style={{
                      width: `${
                        (digitIndex / activeSequence.sequence.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="digit-prompt">
                  <span className="door-number">{digitIndex + 1}</span>
                  <p>Which digit opens this door?</p>
                  <small>Scene position {(digitIndex % 3) + 1} of 3</small>
                </div>
                <form className="digit-form" onSubmit={submitDigit}>
                  <input
                    ref={digitInputRef}
                    value={digitGuess}
                    onChange={(event) =>
                      setDigitGuess(cleanDigits(event.target.value, 1))
                    }
                    inputMode="numeric"
                    aria-label="Enter one digit"
                    maxLength={1}
                  />
                  <button className="button primary" type="submit">
                    Unlock
                  </button>
                </form>
                <p className="feedback" aria-live="polite">
                  {digitFeedback || "Trust the image you built."}
                </p>

                <div className="hint-panel">
                  <div className="hint-heading">
                    <div>
                      <span aria-hidden="true">☾</span>
                      <b>Need a lantern?</b>
                    </div>
                    <small>Hints grow more revealing</small>
                  </div>
                  <div className="hint-buttons">
                    <button
                      type="button"
                      className={hintTier >= 1 ? "used" : ""}
                      onClick={() =>
                        setHintTier((current) => Math.max(1, current))
                      }
                    >
                      <span>Tier 1</span>
                      <b>Reveal the role</b>
                    </button>
                    <button
                      type="button"
                      className={hintTier >= 2 ? "used" : ""}
                      disabled={hintTier < 1}
                      onClick={() =>
                        setHintTier((current) => Math.max(2, current))
                      }
                    >
                      <span>Tier 2</span>
                      <b>Reveal the key</b>
                    </button>
                    <button
                      type="button"
                      className={hintTier >= 3 ? "used" : ""}
                      disabled={hintTier < 2}
                      onClick={() => setHintTier(3)}
                    >
                      <span>Tier 3</span>
                      <b>Reveal the digit</b>
                    </button>
                  </div>
                  {hintTier > 0 && (
                    <div className="hint-reveal" aria-live="polite">
                      {hintTier === 1 && (
                        <>
                          This scene position is an{" "}
                          <b>{ROLE_PATTERN[digitIndex % 3]}</b>.
                        </>
                      )}
                      {hintTier === 2 && (
                        <>
                          The hidden digit’s key is{" "}
                          <b>
                            {
                              profile.codex[
                                Number(activeSequence.sequence[digitIndex])
                              ].adjective
                            }{" "}
                            ·{" "}
                            {
                              profile.codex[
                                Number(activeSequence.sequence[digitIndex])
                              ].noun
                            }{" "}
                            ·{" "}
                            {
                              profile.codex[
                                Number(activeSequence.sequence[digitIndex])
                              ].verb
                            }
                          </b>
                          .
                        </>
                      )}
                      {hintTier === 3 && (
                        <>
                          The digit is{" "}
                          <b className="revealed-digit">
                            {activeSequence.sequence[digitIndex]}
                          </b>
                          .
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="whole-practice">
                <div className="attempt-orbits" aria-label="Attempts remaining">
                  {[0, 1, 2].map((attempt) => (
                    <span
                      key={attempt}
                      className={attempt < wholeAttempts ? "spent" : ""}
                    >
                      {attempt + 1}
                    </span>
                  ))}
                </div>
                <div className="whole-prompt">
                  <p>Walk the palace from the first room to the last.</p>
                  <h3>Enter all {activeSequence.sequence.length} digits</h3>
                </div>
                <form className="whole-form" onSubmit={submitWhole}>
                  <input
                    value={wholeGuess}
                    onChange={(event) =>
                      setWholeGuess(cleanDigits(event.target.value))
                    }
                    inputMode="numeric"
                    autoFocus
                    placeholder="Your complete sequence"
                    aria-label="Enter the whole sequence"
                  />
                  <div className="input-count">
                    {wholeGuess.length} / {activeSequence.sequence.length}
                  </div>
                  <button className="button primary" type="submit">
                    Test my recall
                  </button>
                </form>
                <p className="feedback" aria-live="polite">
                  {wholeFeedback ||
                    "You have three attempts before the route is revealed."}
                </p>
                {answerRevealed && (
                  <div className="revealed-answer">
                    <span>The route was</span>
                    <b>{activeSequence.sequence}</b>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
