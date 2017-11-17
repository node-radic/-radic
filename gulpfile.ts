//region: IMPORTS
import * as gulp from 'gulp';
import { WatchEvent } from 'gulp';
// noinspection ES6UnusedImports
import * as gutil from 'gulp-util';
// noinspection ES6UnusedImports
import * as gts from 'gulp-typescript';
import * as ts from 'typescript';
// noinspection ES6UnusedImports
import * as shelljs from 'shelljs';
import * as globule from 'globule';
import { basename, join, resolve } from 'path';
import * as _ from 'lodash';
import { existsSync, statSync } from 'fs';
import { exec } from 'child_process';
import { GulpTypedocOptions, IdeaIml, IdeaJsMappings, PackageData, RGulpConfig, TSProjectOptions } from './scripts/interfaces';
import * as yargs from 'yargs';
import { defer } from 'q';
import { Radic } from './scripts/Radic';
import * as scss from 'node-sass';
import * as pug from 'pug';
import { Options as PugOptions } from 'pug';
import * as browserSync from 'browser-sync';
import * as sequence from 'run-sequence';
import { isArray } from 'util';
// noinspection ES6UnusedImports
import typedoc = require('gulp-typedoc');
import mdtoc            = require('markdown-toc');
import { Template } from './scripts/Template';
import * as ghPages from 'gulp-gh-pages';

sequence.use(<any> gulp);

const clean            = require('gulp-clean')
const pump             = require('pump')
const DependencySorter = require('dependency-sorter')
const docsServer       = browserSync.create();

//endregion


//region: CONFIG
const c: RGulpConfig = {
    idea           : true,
    templatesPath  : resolve('./scripts/templates'),
    pkg            : require('./package.json'),
    lerna          : require('./lerna.json'),
    log            : {
        level        : 'info',
        useLevelIcons: true,
        timestamp    : true
    },
    ts             : {
        config    : require('./tsconfig.json'),
        taskPrefix: 'ts',
        defaults  : <TSProjectOptions>{
            typescript     : ts,
            // declaration    : true,
            inlineSourceMap: false,
            inlineSources  : false
        }
    },
    ghPages: {
        message: 'Update [timestamp]',
        push: true,
        cacheDir: '.publish',
        branch: 'gh-pages',
        origin: 'origin',
        //remoteUrl: ''
    },
    templates      : {
        readme: {
            firsth1: true,
            bullets: '-'
        },
        docs  : {
            scss: {
                outFile: './docs/index.css'
            },
            pug : {}
        }
    },
    packageDefaults: {
        radic: {
            ghpages: {
                remoteUrl: '',
                origin   : 'origin',
                branch   : 'gh-pages',
                push     : true,
                force    : false,
                message  : 'update [timestamp]',
                cacheDir : '.publish'
            },
            typedoc: {
                module             : 'commonjs',
                mode               : 'file',
                target             : 'es6',
                hideGenerator      : false,
                json               : 'docs/typedoc.json',
                verbose            : true,
                out                : 'docs',
                includeDeclarations: false,
                excludeExternals   : true,
                plugins            : [
                    'typedoc-plantuml',
                    'typedoc-plugin-markdown',
                    // 'typedoc-plugin-single-line-tags',
                    'typedoc-plugin-sourcefile-url'
                ],
                exclude            : [ 'types', 'test' ].join(',')
            }
        }
    }
};
//endregion


//region: HELPERS, CLASSES, FUNCTIONS
//IO
const r       = new Radic(c);
const defined = (val) => val !== undefined
const info    = r.log.bind(r)
const log     = r.log.bind(r)
const error   = r.error.bind(r)
Object.assign(gutil, { log: (msg, ...optional) => info(msg, ...optional) });
//endregion


//region: RESOLVE PACKAGES
const packagePaths            = globule
    .find('packages/*')
    .map(path => resolve(path))
    .filter(path => statSync(path).isDirectory());
// noinspection ReservedWordAsName
const packages: PackageData[] = new DependencySorter({ idProperty: 'name' }).sort(packagePaths.map(path => {

    const pkg  = require(resolve(path, 'package.json'))
    // general data
    const data = <PackageData> {
        path        : {
            toString: () => resolve(path),
            to      : (...args: string[]) => resolve.apply(null, [ path ].concat(args)),
            glob    : (pattern: string | string[]) => _.toArray(pattern).map(pattern => resolve(path, pattern))
        },
        directory   : basename(path),
        package     : pkg,
        name        : pkg.name,
        tsconfig    : require(resolve(path, 'tsconfig.json')),
        depends     : Object.keys(pkg.dependencies),
        dependencies: pkg.dependencies
    }

    // apply package defaults
    data.package = _.merge(data.package, {
        radic: c.packageDefaults.radic
    }, data.package)

    // Radic options (in package.json)
    if ( defined(data.package.radic) ) {
        // Typedoc options. Apply defaults, correct paths, etc
        if ( defined(data.package.radic.typedoc) && data.package.radic.typedoc !== false ) {
            let typedocOptions: GulpTypedocOptions = <GulpTypedocOptions>_.merge({}, c.packageDefaults.radic.typedoc, data.package.radic.typedoc);
            typedocOptions.out                     = join('docs', data.name.replace('/', '-'));
            typedocOptions.json                    = join('docs', data.name.replace('/', '-'), 'typedoc.json');
            [ 'readme' ].forEach(key => {
                if ( typedocOptions[ key ] !== undefined ) {
                    typedocOptions[ key ] = data.path.to(typedocOptions[ key ]);
                }
            })
            data.package.radic.typedoc = typedocOptions;
        }
    }

    return data;
}));

const packageNames = packages.map(pkg => pkg.name);


r.addTemplateParser('markdown-readme-toc', (content) => {
    let toc = mdtoc(content, c.readme)
    return content.replace('[[TOC]]', toc.content);
});
r.addTemplateParser('scss', (content) => {
    let result = scss.renderSync(_.merge(c.templates.docs.scss, {
        data: content

    }))
    return result.css.toString();
})
r.addTemplateParser('pug', (content) => {
    const compile = pug.compile(content, _.merge(c.templates.docs.pug, <PugOptions>{
        pretty: true
    }))
    return compile({ packageNames, packages, packagePaths });
})
//endregion


//region: TASKS:TYPESCRIPT
// the package task prefix names for src (populates by createTsTask() calls)
// - used to afterwards create [clean,build,watch]:ts:${packageName} task name array
// - and uses the array as dependencies for creation of [clean,build,watch]:ts tasks
let srcNames = []
// the package task prefix names for test works same as src but
// creates [clean,build,watch]:ts:test:${packageName} task name array for the [clean,build,watch]:ts:test tasks
let testNames      = []
const createTsTask = (name: string, pkg: PackageData, dest, tsProject: TSProjectOptions = {}) => {

    //region: clean, build and watch tasks for the src directory
    // need to manually set up clean paths because the src directory will be compiled into its parent directory, the package root
    // we can not just delete all directories in the package root (obvious)
    // - gets the declaration dir name > prefixes package root path > cleanPaths
    // - gets src dir names > prefixes package root path > cleanPaths
    // - gets src dir root .js file names > prefixes package root path > cleanPaths
    let cleanPaths = [ pkg.path.to(require(pkg.path.to('tsconfig.json')).compilerOptions.declarationDir) ]
        .concat(
            globule
                .find(join(pkg.path.to('src'), '**/*'))
                .filter(path => statSync(path).isDirectory())
                .map(path => path.replace(pkg.path.to('src'), pkg.path.toString()))
        )
        .concat(globule.find(join(pkg.path.to('*.js'))));

    if ( pkg.package.radic.typedoc !== false ) {
        gulp.task('docs:' + name, () => gulp.src(pkg.path.to('src/**/*.ts')).pipe(typedoc(<GulpTypedocOptions> pkg.package.radic.typedoc)))
        cleanPaths.push(pkg.package.radic.typedoc.out)
    }
    gulp.task('clean:' + name, (cb) => { pump(gulp.src(cleanPaths), clean(), (err) => cb(err)) });
    gulp.task('build:' + name, (cb) => {
        // Run Typescript Compiler
        exec(resolve('node_modules/.bin/tsc'), { cwd: pkg.path + '' })
            .on('exit', () => {
                cb()
            })
    })
    gulp.task('watch:' + name, () => {
        gulp.watch([ pkg.path.to('src/**/*.ts'), pkg.path.to('test/**/*.ts') ], (event: WatchEvent) => {
            gulp.start('build:' + name, 'idea')
        })
    });
    srcNames.push(name)
    //endregion


    let hasTests = existsSync(pkg.path.to('test'));
    //region: clean, build and watch tasks for the test directory
    if ( hasTests ) {
        gulp.task(`clean:${name}:test`, (cb) => { pump(gulp.src(pkg.path.to('test/**/*.js')), clean(), (err) => cb(err)) });
        gulp.task(`build:${name}:test`, (cb) => {
            let testProject = gts.createProject(pkg.path.to('tsconfig.json'), <TSProjectOptions> {
                declaration: false, outDir: './test'
            });
            delete testProject.options.declarationDir
            gulp.src(pkg.path.to('test/**/*.ts'))
                .pipe(testProject())
                .pipe(gulp.dest(pkg.path.to('test')))
        })
        gulp.task(`watch:${name}:test`, () => {
            gulp.watch(pkg.path.to('test/**/*.ts'), (event: WatchEvent) => {
                gulp.start(`build:${name}:test`)
            })
        });
        testNames.push(`${name}:test`);
    }
    //endregion
}
packages.forEach(pkg => createTsTask(`${c.ts.taskPrefix}:${pkg.directory}`, pkg, '/', {}));
// src
[ 'docs', 'build', 'clean', 'watch' ].forEach(prefix => gulp.task(`${prefix}:ts`, srcNames.map(name => `${prefix}:${name}`)));
// test
[ 'build', 'clean', 'watch' ].forEach(prefix => gulp.task(`${prefix}:ts:test`, testNames.map(name => `${prefix}:${name}`)));
//endregion


//region: TASKS:INTELLIJ
if ( c.idea ) {
    gulp.task('idea', (cb) => {
        const url       = (...parts: any[]) => [ 'file://$MODULE_DIR$/' ].concat(join.apply(null, parts)).join('')
        let editIml     = existsSync(resolve('.idea/libraries/tsconfig_roots.xml')),
              editJsMap = existsSync(resolve('.idea/jsLibraryMappings.xml'));

        if ( editIml || editJsMap ) {
            const xmlEdit = require('gulp-edit-xml')
            /** @link https://github.com/t1st3/muxml#options **/
            const muxml   = require('gulp-muxml')
            if ( editIml ) {
                const getDirs = (name: string, filter: (path: string) => boolean): string[] => packages
                    .map(pkg => pkg.path.to(name))
                    .filter(path => {
                        return existsSync(path)
                    })
                    .filter(path => {
                        return statSync(path).isDirectory()
                    })
                    .map(path => {
                        path = url(path.replace(__dirname, ''))
                        return path
                    })
                    .filter(filter)

                gulp.src('.idea/*.iml')
                    .pipe(xmlEdit((xml: IdeaIml) => {
                        // remote tsconfig$roots
                        xml.module.component[ 0 ].orderEntry = xml.module.component[ 0 ].orderEntry.filter(entry => entry.$.name !== 'tsconfig$roots')
                        const content                        = xml.module.component[ 0 ].content[ 0 ];
                        content.excludeFolder                = content.excludeFolder || []
                        content.sourceFolder                 = content.sourceFolder || []
                        const excludeFolders: string[]       = content.excludeFolder.map(sf => sf.$.url)
                        const sourceFolders: string[]        = content.sourceFolder.map(sf => sf.$.url)

                        // ensure we exclude all types folders
                        getDirs('types', path => ! excludeFolders.includes(path)).forEach(url => {
                            content.excludeFolder.push({ $: { url } })
                        })

                        // ensure we test all test folders
                        getDirs('test', path => ! sourceFolders.includes(path)).forEach(url => {
                            content.sourceFolder.push({ $: { url, isTestSource: 'true' } })
                        })

                        // ensure we source all src folders
                        getDirs('src', path => ! sourceFolders.includes(path)).forEach(url => {
                            content.sourceFolder.push({ $: { url, isTestSource: 'false' } })
                        })
                        return xml;
                    }))
                    .pipe(muxml({ identSpaces: 2 }))
                    .pipe(gulp.dest('.idea/'))
            }
            if ( editJsMap ) {

                // noinspection TypeScriptUnresolvedFunction
                gulp.src('.idea/jsLibraryMappings.xml')
                    .pipe(xmlEdit((xml: IdeaJsMappings) => {
                        // if(xml.project.component.length > 0) {
                        if ( isArray(xml.project.component[ 0 ].file) ) {
                            xml.project.component[ 0 ].file.forEach((file, i) => {
                                if ( xml.project.component[ 0 ].file[ i ].$.libraries.includes('tsconfig$roots') ) {
                                    xml.project.component[ 0 ].file[ i ].$.libraries = xml.project.component[ 0 ].file[ i ].$.libraries
                                        .replace(', tsconfig$roots', '')
                                        .replace('tsconfig$roots, ', '')
                                        .replace('tsconfig$roots', '')
                                }
                            })
                        }
                        return xml;
                    }))
                    .pipe(muxml({ identSpaces: 2 }))
                    .pipe(gulp.dest('.idea/'))
            }
        }
        cb();
    })
}
//endregion


//region: TASKS: GHPAGES / TYPEDOC

//endregion


//region: TASKS: README / DOCS / GHPAGES
gulp.task('docs:templates', [ 'clean:docs:templates' ], (cb) => {
    // create index page / style
    r.template('docs/index.pug').applyParsers([ 'pug' ]).writeTo('docs/index.html', true);
    log(`Compiled and written {cyan}templates/docs/index.pug{/cyan} to {cyan}docs/index.html{/cyan}`)
    r.template('docs/stylesheet.scss').parse(function(this:Template, content:string) {
        let result = scss.renderSync({
            file   : this.getFilePath()
        })
        content = result.css.toString();
        return content;
    }).writeTo('docs/stylesheet.css', true);

    log(`Compiled and written {cyan}templates/docs/stylesheet.scss{/cyan} to {cyan}docs/index.scss{/cyan}`)
    cb()
})
gulp.task('docs:script', (cb) => {
    exec(resolve('node_modules/.bin/tsc'), { cwd: 'scripts/templates/docs' })
        .on('exit', () => {
            cb()
        })
})
gulp.task('serve:docs', [ 'docs' ], () => {
    if ( docsServer.active ) {
        log('docServer already active. exiting')
        docsServer.exit();
    }
    log('docServer initializing')
    docsServer.init({
        server: {
            baseDir: './docs'
        }
    })
    log('watching {cyan}scripts/templates/**/*{/cyan}')
    gulp.watch('scripts/templates/**/*', () => {
        gulp.start('docs:templates', 'docs:script')
    }).on('change', () => {
        if ( docsServer.active ) {
            docsServer.reload()
        }
    })
});
gulp.task(`clean:docs`, (cb) => { pump(gulp.src('docs'), clean(), (err) => cb(err)) });
gulp.task(`clean:docs:templates`, (cb) => { pump(gulp.src('docs/{index.html,stylesheet.scss}'), clean(), (err) => cb(err)) });
gulp.task('docs', () => sequence('clean:docs', 'docs:ts', 'docs:templates', 'docs:script'))
gulp.task('deploy:docs', () => {
    gulp.src('./docs/**/*')
        .pipe(ghPages({

        }))
})

gulp.task('readme', (cb) => {
    r.template('README.md').writeTo('./README.md', true);
})
//endregion


//region: MAIN TASKS
gulp.task('clean', [ `clean:${c.ts.taskPrefix}`, `clean:${c.ts.taskPrefix}:test`, 'clean:docs' ])
gulp.task('build', [ 'clean' ], () => gulp.start(`build:${c.ts.taskPrefix}`, `build:${c.ts.taskPrefix}:test`, 'idea'))
gulp.task('watch', [ 'build' ], () => gulp.start(`watch:${c.ts.taskPrefix}`, `watch:${c.ts.taskPrefix}:test`))
gulp.task('default', [ 'build' ])
gulp.task('list', (cb) => {
    let args = yargs
        .option({
            d: { alias: 'depth', type: 'number', default: 0 }
        })
        .parse(process.argv.slice(2))
    log('-'.repeat(50));
    log(`Listing tasks with a depth of ${args.depth}.`)
    log(`Depth equals the amount of ':' columns`)
    log(`Use the '--depth N' or '-d N' to view more tasks.`)
    log('-'.repeat(50));

    Object.keys(gulp.tasks)
        .filter(taskName => taskName.split(':').length <= args.depth + 1)
        .forEach(taskName => {
            let text = ` - ${gutil.colors.cyan(taskName)}`;
            if ( gulp.tasks[ taskName ].dep.length > 0 ) {
                text += ' > '
                text += gulp.tasks[ taskName ].dep.join(' > ')
            }
            console.log(text)
        })
    cb();
})
gulp.task('tasks', [ 'list' ])
//endregion


//region: INTERACTIVE TASKS
gulp.task('interact', async () => {
    let d = defer()


    return d;
})

//endregion


if ( c.idea ) {
// always run the IntelliJ IDEA fixer
    gulp.start('idea')
}