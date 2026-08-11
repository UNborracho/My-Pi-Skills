# My Pi Skills

Personal Agent Skills collection following the [Agent Skills standard](https://agentskills.io/specification), for [pi](https://github.com/earendil-works/pi), Claude Code, Codex, and other agent harnesses that support the standard.

## Install

### pi

```bash
pi install git:github.com/UNborracho/my-pi-skills
pi config      # enable the skills you want
```

Then restart pi or run `/reload`.

### Other harnesses

Add the `skills/` directory to your skill path, e.g. Claude Code: `~/.claude/skills`.

## Skills

| Skill | What it does | When to use |
|-------|--------------|-------------|
| [grilling](skills/grilling/SKILL.md) | Interviews you relentlessly about a plan, decision, or idea, mapping it as a design tree until a shared understanding is reached | Stress-testing a plan or idea; any "grill" trigger phrase |
| [code-review](skills/code-review/SKILL.md) | Reviews changes since a fixed point along two axes: Standards and Spec | Reviewing a branch, PR, or WIP changes |
| [tdd](skills/tdd/SKILL.md) | Test-driven development workflow | Building features or fixing bugs test-first |
| [diagnosing-bugs](skills/diagnosing-bugs/SKILL.md) | Diagnosis loop for hard bugs and performance regressions | Something is broken, throwing, failing, or slow |
| [to-tickets](skills/to-tickets/SKILL.md) | Breaks a plan, spec, or conversation into tracer-bullet tickets with blocking edges | Planning or decomposing work |
| [context-loop-guard](skills/context-loop-guard/SKILL.md) | Behavioral rules against thinking loops, repeated failed attempts, and over-planning in long, heavily-compacted sessions | Session has been compacted multiple times, model overthinking without acting, or repeating the same tool calls |

## Security

Skills can instruct the agent to perform any action and may include executable code. Review skill content before use.

## License

MIT. See [LICENSE](LICENSE).
