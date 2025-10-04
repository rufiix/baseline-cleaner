
# ✨ Baseline Cleaner ✨

[![NPM Version](https://img.shields.io/npm/v/baseline-cleaner.svg)](https://www.npmjs.com/package/baseline-cleaner)
[![License: ISC](https://img.shields.io/npm/l/baseline-cleaner.svg)](https://opensource.org/licenses/ISC)

> An intelligent CLI tool to automatically scan your web projects and recommend the removal of outdated polyfills based on the [Baseline](https://web.dev/baseline/) web platform status.

## 🤔 Why? The Problem of "Polyfill Rot"

As the web platform matures, a vast number of JavaScript polyfills and libraries (like `whatwg-fetch`, `intersection-observer`, etc.) that were once essential are now obsolete. Their functionality is built directly into the core of every modern browser, as defined by the **Baseline** feature set.

However, these dependencies often remain in older codebases, contributing to "polyfill rot." They add unnecessary weight to your application's bundle size, increase complexity, and represent a dependency debt that is rarely paid down. Manually tracking which polyfills are safe to remove is tedious and error-prone.

**Baseline Cleaner** automates this process, giving you the confidence to clean up your project.

## 🚀 Usage

No installation needed! `baseline-cleaner` is designed to be run on-demand directly in your project's directory.

Just `cd` into your project and run:

```sh
npx baseline-cleaner
````

The tool will then scan your project and generate a clear, actionable report directly in your terminal.

## 🛠️ How It Works

Baseline Cleaner uses a powerful three-step process to provide accurate and safe recommendations:

1.  **Dependency Scan:** First, it reads your `package.json` file to find all installed dependencies. It compares this list against its internal "knowledge base" (`library-map.json`) of known polyfills and their corresponding native web features.

2.  **Static Code Analysis:** Finding a polyfill in `package.json` isn't enough—it might be installed but no longer used\! Baseline Cleaner parses your entire source code (`.js`, `.ts`, `.jsx`, `.tsx`) into an Abstract Syntax Tree (AST) using the Babel parser. It then traverses this tree to confirm if a candidate polyfill is actually `import`-ed and used in your code. This prevents false positives.

3.  **Baseline Check:** For every polyfill that is confirmed to be in use, the tool cross-references its corresponding native feature with data from the official `web-features` package. It checks the feature's **Baseline status** to determine if it's safe to remove the polyfill.

The final report shows you only the polyfills that are actively used in your code and whose native equivalents are fully supported by all modern browsers.

## 💡 Extensible Knowledge Base

The intelligence of this tool is driven by a simple JSON file: `library-map.json`. This makes it incredibly easy to extend its capabilities without changing the core logic.

To teach the tool about a new polyfill, simply add a new entry to the map:

```json
{
  "new-polyfill-package": {
    "featureId": "the-id-from-web-features",
    "label": "The Human-Readable API Name"
  }
}
```

This data-driven architecture makes `baseline-cleaner` a scalable and community-maintainable tool.

-----

*This tool was created for the Google & Friends: Baseline Tooling Hackathon.*

