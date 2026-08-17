# Extensions

Custom pi extensions live here. When this repo is installed as a pi package
(`pi install git:github.com/UNborracho/my-pi-skills`), everything in this
directory is loaded automatically (declared in `package.json` → `pi.extensions`).

## Extensions in this repo

- `agent-browser.ts` — browser automation tools (`browser_open`, `browser_snapshot`, `browser_click`, `browser_fill`, `browser_get_text`, `browser_screenshot`, `browser_read`, `browser_close`) wrapping the [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) CLI.

  Requirement on each machine:

  ```bash
  npm install -g agent-browser
  agent-browser install   # first time only; downloads Chrome for Testing
  ```

## Adding an extension

Drop a file in this directory:

```
extensions/
└── my-extension.ts        # single-file extension (exports default function)
```

or a subdirectory:

```
extensions/
└── my-extension/
    ├── index.ts           # entry point (exports default function)
    └── helpers.ts
```

Extension API reference: `docs/extensions.md` in the pi install, or
https://github.com/earendil-works/pi (examples under `examples/extensions/`).

Quick template:

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "hello",
    label: "Hello",
    description: "Say hello",
    parameters: Type.Object({ name: Type.String() }),
    async execute(_id, params) {
      return { content: [{ type: "text", text: `Hello, ${params.name}!` }], details: {} };
    },
  });
}
```

## Syncing to other machines

After pushing, on each other machine:

```bash
pi update --all        # pulls the new repo ref and reloads extensions
```

