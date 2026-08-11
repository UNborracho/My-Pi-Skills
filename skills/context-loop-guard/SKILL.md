---
name: context-loop-guard
description: Prevents the agent from falling into thinking loops, repeated failed attempts, and over-planning in long, heavily-compacted conversations. Use when a session has been compacted multiple times, the context summary is degraded, the model keeps overthinking without acting, or it repeats the same tool calls.
---

# Context Loop Guard

Guard against the failure modes that appear in long, repeatedly-compacted sessions: thinking without acting, retrying the same failed approach, and treating planning as progress. These are behavioral rules — apply them continuously, not as a one-time checklist.

## Why this exists

Compaction is lossy. After several compactions, the context becomes a chain of meta-summaries (Goal / Progress / Next Steps) rather than raw conversation and tool output. The model loses ground truth and tends to compensate with more thinking or more retries, which makes things worse. These rules counter that.

## Rules

### 1. Context is a plan, not fact

The summary over-represents planning and under-represents actual results. Treat it as a plan to verify, not as ground truth. If your next step is clear, execute it immediately — do not re-summarize or re-plan before acting.

### 2. Verify state with tools

Before acting on anything "remembered" from earlier context, verify it with tools (`read`, `grep`, `ls`, `bash`). History may be summarized and stale. If a summary claims something is done, confirm it before assuming it is. When unsure about repo state, run `git status` or inspect the files first.

### 3. Break repetition loops

If a tool call fails or produces the same result twice, STOP and change approach:

1. Read the error message carefully — it often contains the answer.
2. Try one new, different approach instead of retrying the same command.
3. Do not attempt something again unless you can point to new information that makes it likely to succeed now.

### 4. Keep thinking short

Long internal reasoning is rarely needed. If you have not produced a tool call or visible text within your first few thinking lines, you are overthinking. Thinking should lead to an action, not substitute for one.

### 5. Remember you may be summarized

If recent context contradicts the summary, the summary is wrong — trust live tool output. Early user instructions still apply in full even if not visible in recent messages. If a task seems impossible or requirements seem unclear, say so explicitly instead of silently improvising or looping.

## Compact version

When the full rules are too much to hold in context, this is sufficient:

> Treat your context summary as a plan, not as fact. Verify state with tools before acting; never assume something is done. If a tool fails twice the same way, change approach instead of retrying. Keep thinking short — prefer actions over analysis. History may be compacted; if context contradicts live tool output, trust the tools.
