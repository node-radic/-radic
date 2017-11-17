Radic's NPM Packages
====================


**WIP** !!!
This repository pretty much contains all my public non browser/DOM node packages.

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
| Name                    | Short description | Links                                                                                                                             |
|:------------------------|:------------------|:----------------------------------------------------------------------------------------------------------------------------------|
| `@radic/console-colors` |                   | - [`Documentation`](https://github.io/node-radic/console-colors)<br>- [`NPMJS`](https://npmjs.com/packages/@radic/console-colors) |


Development
-----------

- Lerna
    - Includes example for extending it's CLI, extending commands or adding new ones.
- Typescript (NodeJS configuration)
- Typedoc
    - [typedoc-plugin-markdown](https://github.com/tgreyuk/typedoc-plugin-markdown)
    - [typedoc-plugin-sourcefile-url](https://npmjs.com/package/typedoc-plugin-sourcefile-url)
    - [typedoc-plugin-single-line-tags](https://npmjs.com/package/typedoc-plugin-single-line-tags)
    - [typedoc-plugin-context"](https://npmjs.com/package/typedoc-plugin-context")
    - [typedoc-plantuml](https://npmjs.com/package/typedoc-plantuml)
- Mocha, Mocha Typescript, Chai
- Gulp, optionally with:
    - Automatic Typescript packages task builder (clean,build,watch) for both `src` and `test`
    - IntelliJ IDEA (php/webstorm) helper task for fixing / configuring Typescript stuff
- IntelliJ IDEA (php/webstorm) run configurations
    - Debugging Typescript code using ts-node
    - Debugging/running Gulp using ts-node
