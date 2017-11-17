Radic's NPM Packages
====================

This repository contains some of my public **non browser/DOM** node packages.

[[TOC]]

Summary
-------
- All packages are prefixed/scoped under **@radic**
- Typescript only
- Opinionated structure and workflow
- Automation as much as possible, including docs, gh-pages, etc
- Individual package versions. Aims to follow [Semantic version](http://semver.org/) as much as possible.

Packages
--------
| Name                    | Short description | Links                                                                                                                  |
|:------------------------|:------------------|:-----------------------------------------------------------------------------------------------------------------------|
| `@radic/console-colors` | soon...           | [`Documentation`](@radic-console-colors/index.html) [`NPMJS`](https://npmjs.com/packages/@radic/console-colors) |


Development
-----------
### Primary toolset
- Lerna
    - Includes example for extending it's CLI, extending commands or adding new ones.
- Typescript (NodeJS configuration)
- Typedoc
- Mocha, Mocha Typescript, Chai
- Gulp, optionally with:
    - Automatic Typescript packages task builder (clean,build,watch) for both `src` and `test`
    - IntelliJ IDEA (php/webstorm) helper task for fixing / configuring Typescript stuff
- IntelliJ IDEA (php/webstorm) run configurations
    - Debugging Typescript code using ts-node
    - Debugging/running Gulp using ts-node