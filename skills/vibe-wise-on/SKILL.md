---
name: vibe-wise-on
description: "Turn on the vibe-wise learning mode in the current project and session, installing or enabling the plugin first if needed. Use for /vibe-wise-on, 'turn on vibe-wise', 'enable learning mode', 'start vibe-wise', or when /vibe-wise:learn is missing from the command list."
argument-hint: "Optional: what to build once learning is on"
---

# Turn on vibe-wise

vibe-wise is a plugin: you design, Claude asks for your approach first and writes only the agreed code. Its own `/vibe-wise:learn` only shows up after a restart, and clients built on the SDK, like T3 Code, may not list it. This skill makes sure the plugin is installed and enabled, then starts Learn right now by reading the plugin's guide from disk. Done means the plugin shows as enabled and Learn's onboarding or resume has begun.

## 1. Make sure the plugin is on

```sh
claude plugin list --json
```

Find the entry whose `id` is `vibe-wise@anthropic-plugin-directory`.

- No entry: `claude plugin install vibe-wise@anthropic-plugin-directory -y --scope user`, then list again.
- `"enabled": false`: `claude plugin enable vibe-wise@anthropic-plugin-directory`, then list again.

Keep its `installPath`. If the install fails, stop and show the error.

## 2. Check python3

The plugin's session hook runs `python3`. Run `python3 --version`. If it fails, say the hook won't restore learning in later sessions until `python3` is on PATH, and carry on: this session doesn't need it.

## 3. Start Learn

Read `<installPath>/skills/learn/SKILL.md` with the Read tool and follow it from the top, in this conversation, with the user's current working directory as the project. It points at `behavior.md`, `onboarding.md` and `state-templates.md` beside it: read those from the same folder. Any argument passed to this skill is the build task to continue after setup.

From the next session on, the plugin's hook resumes learning on its own in any project that has `.vibe-wise/`. To stop, tell Claude to pause learning; it sets `Learning mode: paused` in the project's `.vibe-wise/profile.md`.
