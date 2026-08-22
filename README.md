# My Pi Skills

Personal pi skills collection — the sync source for your pi configuration across machines.

## Sync pi config to a new machine

```bash
# 1. install pi, then:
git clone git@github.com:UNborracho/my-pi-skills.git && cd my-pi-skills

# 2. apply settings, create secret templates (never overwrites existing keys)
bash scripts/bootstrap.sh

# 3. fill in API keys (never committed to the repo)
#     ~/.pi/agent/auth.json
#     ~/.pi/web-search.json

# 4. load skills from this repo, install npm packages from settings
pi install git:github.com/UNborracho/my-pi-skills
pi update --all

# 5. restart pi or run /reload
```

After a change on this machine, sync to others:

```bash
# this machine:  git push
# other machines: git pull && bash scripts/bootstrap.sh --force-settings && pi update --all
```

### What is synced, and how

| Item | Source of truth | Notes |
|------|-----------------|-------|
| Skills | `skills/` | Loaded as a pi package (`pi.skills` in `package.json`) |
| Provider / model / theme / npm packages / subagent overrides | `config/settings.example.json` | No secrets; applied by `bootstrap.sh` |
| API keys (auth.json, web-search.json) | per-machine | Only `*.example.json` templates are committed; fill in keys locally |
| MCP servers (e.g. zhipu-vision) | per-machine | Configured interactively, not portable — re-add via `/mcp` on each machine |

## Extensions (npm packages)

Installed via `pi update --all` from `settings.json → packages`:

| Package | What it does |
|---------|--------------|
| `pi-web-access` | Web search, URL fetching, GitHub repo cloning, PDF/YouTube/video analysis |
| `pi-subagents` | Subagent delegation and scripted multi-agent workflows |
| `pi-mcp-adapter` | MCP (Model Context Protocol) tool adapter |
| `context-mode` | Sandboxed code execution + FTS5 knowledge base, saves ~98% context window |
| `pai-acp` | Active Context Pruning — model-driven context compression |
| `billion-context-pi` | Model-driven context management |
| `@dietrichgebert/ponytail` | Lazy senior dev mode: minimal-code solutions, anti-over-engineering (skills + extension) |

## Skills

| Skill | What it does | When to use |
|-------|--------------|-------------|
| [grilling](skills/grilling/SKILL.md) | Interviews you relentlessly about a plan, decision, or idea, mapping it as a design tree until a shared understanding is reached | Stress-testing a plan or idea; any "grill" trigger phrase |
| [diagnosing-bugs](skills/diagnosing-bugs/SKILL.md) | Diagnosis loop for hard bugs and performance regressions | Something is broken, throwing, failing, or slow |
| [to-tickets](skills/to-tickets/SKILL.md) | Breaks a plan, spec, or conversation into tracer-bullet tickets with blocking edges | Planning or decomposing work |

## Security

Skills can instruct the agent to perform any action and may include executable code. Review skill content before use. API keys are never committed — only placeholder templates live in `config/`.

## License

MIT. See [LICENSE](LICENSE).
