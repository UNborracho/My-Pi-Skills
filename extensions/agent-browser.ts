// agent-browser pi extension — lets pi control a real browser via CLI.
// Requires: agent-browser >= 0.33 in PATH (npm i -g agent-browser; agent-browser install)
//
// Exposes tools:
//   browser_open        — open a URL (or launch blank browser)
//   browser_snapshot    — get accessibility tree with element refs
//   browser_click       — click element by ref (@e1) or CSS selector
//   browser_fill        — clear & fill input by ref/selector
//   browser_get_text    — read text of element by ref/selector
//   browser_screenshot  — save a screenshot PNG
//   browser_read        — fetch agent-readable text of a page (no browser needed)
//   browser_close       — close the browser
//
// All commands run through the agent-browser CLI. Element refs come from
// `browser_snapshot` output (e.g. @e2). Traditional CSS selectors also work.

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { existsSync } from "node:fs"

const exec = promisify(execFile)

const BIN = "agent-browser"
const DEFAULT_TIMEOUT_MS = 30_000

async function runBrowser(args: string[], timeoutMs = DEFAULT_TIMEOUT_MS): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await exec(BIN, args, {
      timeout: timeoutMs,
      env: { ...process.env, PATH: "/opt/homebrew/bin:/usr/local/bin:" + (process.env.PATH ?? "") },
    })
    return { stdout, stderr }
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(
        "agent-browser 未安装。请先运行: npm install -g agent-browser && agent-browser install"
      )
    }
    const msg = err.stderr ?? err.message ?? String(err)
    throw new Error(`agent-browser 命令失败 (${args[0]}): ${String(msg).slice(0, 800)}`)
  }
}

function text(content: string) {
  return { content: [{ type: "text" as const, text: content }], details: {} as Record<string, unknown> }
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "browser_open",
    label: "Browser: Open",
    description:
      "Launch the browser and navigate to a URL (e.g. https://example.com). With no URL, launches a blank browser. Use for testing web pages, verifying UI changes, scraping rendered sites.",
    parameters: Type.Object({
      url: Type.Optional(Type.String({ description: "URL to open. Omit to launch a blank browser." })),
    }),
    async execute(_id, params) {
      const args = params.url ? ["open", params.url] : ["open"]
      const { stdout, stderr } = await runBrowser(args)
      return text((stdout || stderr || "Browser launched").slice(0, 2000))
    },
  })

  pi.registerTool({
    name: "browser_snapshot",
    label: "Browser: Snapshot",
    description:
      "Get the accessibility tree of the current page with element refs (e.g. @e1). Use refs with click/fill/get_text. Run this after opening a page or after any navigation.",
    parameters: Type.Object({}),
    async execute() {
      const { stdout, stderr } = await runBrowser(["snapshot"])
      return text((stdout || stderr || "(no output)").slice(0, 6000))
    },
  })

  pi.registerTool({
    name: "browser_click",
    label: "Browser: Click",
    description:
      "Click an element. Use a ref from browser_snapshot (e.g. @e2) or a CSS selector (e.g. '#submit'). Fails early if another element covers the target.",
    parameters: Type.Object({
      selector: Type.String({ description: "Element ref (@e2) or CSS selector (#submit, .btn, button)" }),
    }),
    async execute(_id, params) {
      const { stdout, stderr } = await runBrowser(["click", params.selector])
      return text((stdout || stderr || "clicked").slice(0, 2000))
    },
  })

  pi.registerTool({
    name: "browser_fill",
    label: "Browser: Fill",
    description:
      "Clear and fill an input element. Use a ref from browser_snapshot (@e3) or CSS selector. For search boxes, login forms, etc.",
    parameters: Type.Object({
      selector: Type.String({ description: "Element ref (@e3) or CSS selector" }),
      text: Type.String({ description: "Text to fill in" }),
    }),
    async execute(_id, params) {
      const { stdout, stderr } = await runBrowser(["fill", params.selector, params.text])
      return text((stdout || stderr || "filled").slice(0, 2000))
    },
  })

  pi.registerTool({
    name: "browser_get_text",
    label: "Browser: Get Text",
    description: "Read the visible text of an element by ref (@e1) or CSS selector.",
    parameters: Type.Object({
      selector: Type.String({ description: "Element ref (@e1) or CSS selector" }),
    }),
    async execute(_id, params) {
      const { stdout, stderr } = await runBrowser(["get", "text", params.selector])
      return text((stdout || stderr || "(empty)").slice(0, 3000))
    },
  })

  pi.registerTool({
    name: "browser_screenshot",
    label: "Browser: Screenshot",
    description:
      "Take a screenshot of the current page and save it as a PNG. The image path is returned so it can be viewed.",
    parameters: Type.Object({
      path: Type.Optional(Type.String({ description: "Output PNG path. Default: ./browser-screenshot.png" })),
    }),
    async execute(_id, params) {
      const out = params.path ?? "browser-screenshot.png"
      await runBrowser(["screenshot", out])
      const abs = out.startsWith("/") ? out : `${process.cwd()}/${out}`
      return text(existsSync(abs) ? `截图已保存: ${abs}` : `截图完成: ${out}（未确认文件存在）`)
    },
  })

  pi.registerTool({
    name: "browser_read",
    label: "Browser: Read URL",
    description:
      "Fetch a URL and return agent-readable text (no browser needed). Good for quickly reading article content, docs, or checking a page's rendered text.",
    parameters: Type.Object({
      url: Type.String({ description: "URL to fetch and read" }),
    }),
    async execute(_id, params) {
      const { stdout, stderr } = await runBrowser(["read", params.url])
      return text((stdout || stderr || "(empty)").slice(0, 8000))
    },
  })

  pi.registerTool({
    name: "browser_close",
    label: "Browser: Close",
    description: "Close the browser instance.",
    parameters: Type.Object({}),
    async execute() {
      const { stdout, stderr } = await runBrowser(["close"])
      return text((stdout || stderr || "Browser closed").slice(0, 1000))
    },
  })
}
