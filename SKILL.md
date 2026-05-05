---
name: tritype-comparison
description: Compare Enneagram tritype pairs using a bundled relationship corpus for compatibility, friction, communication, and growth.
---

# Tritype Comparison

Use this skill to answer relationship-comparison questions between two lead-specific Enneagram tritypes.

## Data Model

- Tritype codes are canonical lead-first 3-digit strings.
- Each code must contain exactly one head digit (`5`, `6`, `7`), one heart digit (`2`, `3`, `4`), and one gut digit (`8`, `9`, `1`).
- The first digit is the lead. The remaining two digits are sorted ascending.
- Pair keys are canonicalized by sorting the two tritype codes lexically, e.g. `935` vs `378` resolves to `378-935`.
- The corpus lives at `data/pairs.json`.

## Workflow

1. Identify the two tritype codes in the user's request.
2. Run the lookup script from this skill directory: `node "$CLAUDE_SKILL_DIR/scripts/lookup-pair.mjs" <code-a> <code-b> --format markdown` in Claude Code, or `node scripts/lookup-pair.mjs <code-a> <code-b> --format markdown` when already inside the skill directory.
3. Use the returned analysis as the authoritative source for that pair.
4. Adapt the answer to the user's framing. Keep the original nuance, but do not dump every section unless the user asks for the full comparison.
5. If the user supplied names or roles, replace `{{A}}` and `{{B}}` in the retrieved analysis with those labels. Preserve the canonical order unless the user clearly wants the answer from one person's point of view.

## Commands

Retrieve a pair as Markdown:

```bash
node "${CLAUDE_SKILL_DIR:-.}/scripts/lookup-pair.mjs" 378 935 --format markdown
```

Retrieve a pair as JSON:

```bash
node "${CLAUDE_SKILL_DIR:-.}/scripts/lookup-pair.mjs" 378-935
```

List available pair keys:

```bash
node "${CLAUDE_SKILL_DIR:-.}/scripts/list-pairs.mjs"
```

## Claude Compatibility

- Claude Code can install this skill at `~/.claude/skills/tritype-comparison/SKILL.md` or `.claude/skills/tritype-comparison/SKILL.md`.
- Claude.ai can use a ZIP whose root contains the `tritype-comparison/` directory.
- Code execution must be enabled so Claude can run the bundled lookup script.

## Response Guidance

- Ground claims in the retrieved pair analysis.
- Prefer concise synthesis for ordinary conversation.
- Use headings like `Where They Click`, `Where They Grate`, and `How To Work With It` when the user wants a structured comparison.
- Mention when the requested code is invalid or missing from the corpus.
- Avoid presenting the corpus as universal truth; frame it as a lens for reflection.
