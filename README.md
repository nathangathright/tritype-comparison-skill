# Tritype Comparison Skill

An Agent Skill for comparing Enneagram lead-specific tritype pairs using a bundled relationship-analysis corpus.

The skill retrieves one pair at a time from `data/pairs.json`, so agents can ground conversational answers in the corpus without loading all 15 MB into context.

## What It Supports

- Pair comparisons such as `378` vs `935`
- Compatibility, friction, communication, misunderstanding, and growth dynamics
- Claude Code local skills
- Claude.ai skill upload ZIPs
- Codex local skills

The corpus contains 3,292 canonical pair analyses. Tritype codes are lead-first and must contain one head digit (`5`, `6`, `7`), one heart digit (`2`, `3`, `4`), and one gut digit (`8`, `9`, `1`).

## Claude Code Install

Clone the repo and install the skill symlink:

```bash
git clone https://github.com/nathangathright/tritype-comparison-skill.git
cd tritype-comparison-skill
node scripts/install-claude-skill.mjs
```

Claude Code will load it from:

```text
~/.claude/skills/tritype-comparison
```

You can invoke it directly with `/tritype-comparison` or ask Claude to compare two tritypes.

## Claude.ai Install

Download `tritype-comparison.zip` from the latest GitHub release and upload it as a custom skill.

Claude.ai requires code execution to be enabled so the bundled lookup script can read the corpus.

## Codex Install

Symlink the repo into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
ln -sfn "$PWD" ~/.codex/skills/tritype-comparison
```

## Local Usage

Retrieve a pair as Markdown:

```bash
node scripts/lookup-pair.mjs 378 935 --format markdown
```

Retrieve a pair as JSON:

```bash
node scripts/lookup-pair.mjs 378-935
```

List pair keys:

```bash
node scripts/list-pairs.mjs
```

Build the Claude.ai upload ZIP:

```bash
node scripts/package-claude-skill.mjs
```

The package is written to `dist/tritype-comparison.zip`.

## Release Process

Create and push a version tag:

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions validates the skill, builds the Claude.ai ZIP, and attaches it to a GitHub release.

You can also run the release workflow manually from the Actions tab with a version such as `v0.1.0`.

## Notes

This corpus is interpretive Enneagram relationship analysis. Use it as a reflection tool, not as clinical, diagnostic, or authoritative guidance.
