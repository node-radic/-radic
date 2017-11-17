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


### Workflow

- Centered around Typescript.
- `tsconfig.json` inheritance. The base [`tsconfig.json`](packages/tsconfig.json) is located inside the `packages` directory.
- Each package has its own `tsconfig.json`, which extends the base `tsconfig.json` in the parent folder.
- Most of the workflow uses fixed names and paths. This is hard-coded into several locations such as `gulpfile.ts`
- Everything that's located inside the `src` directoroy of a package will be compiled and written into the package it's root directory.

An example of pre-compiled package:
```
- src
    - index.ts
    - bin
        foo.ts
    - lib
        - file1.ts
        - file2.ts
- test
- package.json
- tsconfig.json
```

An example of the same package, but compiled:
```
- index.js
- bin
    foo.js
- lib
    - file1.js
    - file2.js
- types
    - index.d.ts
- src
    - index.ts
    - bin
        foo.ts
    - lib
        - file1.ts
        - file2.ts
- test
- package.json
- tsconfig.json
```

### Tasks
- Running `gulp tasks` would give a rough overview. Alternatively you could use `gulp tasks -d 5` for deeper task overview
- Running `gulp watch` will invoke watchers for each package.
- `gulp watch:ts:util` will only invoke watcher for the util directory


### Docs
- Using `gulp docs` will generate Typedoc into the repositories root directory, each package inside its own directory. A index.html file will also be generated.
- Ugins `gulp deploy` will execute `gulp docs` and then deploy the documentation onto gh-pages.

