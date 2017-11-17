import * as ts from 'typescript';
import { Settings } from 'gulp-typescript';
import { LoggerInstance } from 'winston';
import * as inquirer from '../types/inquirer';
import { InspectOptions } from 'util';
import { MarkdownTocOptions } from 'markdown-toc';

import { TsConfig } from 'gulp-typescript/release/types';

export interface PackageData {
    path: {
        toString: () => string
        to: (...args: string[]) => string
        glob: (pattern: string | string[]) => string[]
    },
    directory: string,
    package: IPackageJSON,
    name: string,
    tsconfig: TsConfig,
    depends: string[],
    dependencies: { [name: string]: string }
}

export interface GulpGhPagesOptions {
    src?: string
    remoteUrl?: string;
    origin?: string;
    branch?: string;
    force?:boolean
    cacheDir?: string;
    push?: boolean;
    message?: string;
}

export interface GulpTypedocOptions {
    out: string;
    mode?: string;
    json?: string;
    exclude?: string;
    includeDeclarations?: boolean;
    externalPattern?: string;
    excludeExternals?: boolean;
    module?: string;
    plugins?: string[]
    target?: string;
    theme?: string;
    name?: string;
    readme?: string;
    hideGenerator?: boolean;
    gaID?: string;
    gaSite?: string;
    verbose?: boolean;
}

export interface IPackageJSON extends Object {

    [key: string]: any

    radic?: {
        [key: string]: any
        typedoc?: GulpTypedocOptions | false
        ghpages?: GulpGhPagesOptions | false
    }

    readonly name: string;

    readonly version?: string;

    readonly description?: string;

    readonly keywords?: string[];

    readonly homepage?: string;

    readonly bugs?: string | IBugs;

    readonly license?: string;

    readonly author?: string | IAuthor;

    readonly contributors?: string[] | IAuthor[];

    readonly files?: string[];

    readonly main?: string;

    readonly bin?: string | IBinMap;

    readonly man?: string | string[];

    readonly directories?: IDirectories;

    readonly repository?: string | IRepository;

    readonly scripts?: IScriptsMap;

    readonly config?: IConfig;

    readonly dependencies?: IDependencyMap;

    readonly devDependencies?: IDependencyMap;

    readonly peerDependencies?: IDependencyMap;

    readonly optionalDependencies?: IDependencyMap;

    readonly bundledDependencies?: string[];

    readonly engines?: IEngines;

    readonly os?: string[];

    readonly cpu?: string[];

    readonly preferGlobal?: boolean;

    readonly private?: boolean;

    readonly publishConfig?: IPublishConfig;

}

/**
 * An author or contributor
 */
export interface IAuthor {
    name: string;
    email?: string;
    homepage?: string;
}

/**
 * A map of exposed bin commands
 */
export interface IBinMap {
    [commandName: string]: string;
}

/**
 * A bugs link
 */
export interface IBugs {
    email: string;
    url: string;
}

export interface IConfig {
    name?: string;
    config?: Object;
}

/**
 * A map of dependencies
 */
export interface IDependencyMap {
    [dependencyName: string]: string;
}

/**
 * CommonJS package structure
 */
export interface IDirectories {
    lib?: string;
    bin?: string;
    man?: string;
    doc?: string;
    example?: string;
}

export interface IEngines {
    node?: string;
    npm?: string;
}

export interface IPublishConfig {
    registry?: string;
}

/**
 * A project repository
 */
export interface IRepository {
    type: string;
    url: string;
}

export interface IScriptsMap {
    [scriptName: string]: string;
}

export type List<T> = ArrayLike<T>;

export interface Dictionary<T> {
    [index: string]: T;
}

export interface NumericDictionary<T> {
    [index: number]: T;
}

export interface Cancelable {
    cancel(): void;

    flush(): void;
}

export interface CheckListItem extends inquirer.objects.ChoiceOption {
    name?: string
    disabled?: string
    checked: boolean
    value?: string
}


export type PartialDeep<T> = {
    [P in keyof T]?: PartialDeep<T[P]>;
    };
export type TSProjectOptions = Settings & ts.CompilerOptions
export type IdeaBoolean = 'true' | 'false'

export interface RLoggerConfig {
    [key: string]: any

    level        ?: LogLevel,
    useLevelIcons?: boolean
    timestamp?: boolean
}

export interface RConfig {
    [key: string]: any

    templatesPath?: string
    idea ?: boolean
    pkg  ?: IPackageJSON
    lerna?: any
    log?: RLoggerConfig,
    readme?: MarkdownTocOptions,
    ts   ?: {
        [key: string]: any
        config    ?: any
        taskPrefix?: string,
        defaults  ?: TSProjectOptions
    },
    packageDefaults?: Partial<IPackageJSON>
}

export interface IdeaIml {
    module: {
        $: { type: string, version: string },
        component: Array<{
            '$': { 'name': string, 'inherit-compiler-output': IdeaBoolean },
            'exclude-output'?: any[],
            'content'?: Array<{
                '$': { 'url': string },
                'sourceFolder'?: Array<{
                    '$': { 'url': string, 'isTestSource'?: IdeaBoolean }
                }>,
                'excludeFolder'?: Array<{ '$': { 'url': string } }>
            }>,
            'orderEntry'?: Array<{
                '$': {
                    'type'?: 'library' | 'sourceFolder' | 'inheritedJdk',
                    'name'?: string,
                    'level'?: 'project' | 'global' | 'scope',
                    'forTests'?: IdeaBoolean
                }
            }>
        }>
    }
}

export interface IdeaJsMappings {
    'project': {
        '$': { 'version': string },
        'component': Array<{
            '$': { 'name': 'JavaScriptLibraryMappings' },
            'file': Array<{
                '$': { 'url': 'PROJECT' | 'GLOBAL', 'libraries': string }
            }>
        }>
    }
}

export interface Log extends LoggerInstance {}

export type LogLevel = 'error' | 'warn' | 'alert' | 'notice' | 'help' | 'info' | 'verbose' | 'data' | 'debug' | 'silly' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | string | number


export type TruncateFunction = (input: string, columns: number, options?: TruncateOptions) => string
export type WrapFunction = (input: string, columns: number, options?: WrapOptions) => string;
export type SliceFunction = (inputu: string, beginSlice: number, endSlice?: number) => string;
export type WidestFunction = (input: string) => number;
export type TruncatePosition = 'start' | 'middle' | 'end'


export interface TreeData {
    label: string;
    nodes?: (TreeData | string)[];
}

export interface TreeOptions {
    prefix?: string
    unicode?: boolean;
}

export interface OutputSpinners {
    ora?: any
    multi?: any
    single?: any
}

export interface TruncateOptions {
    position?: TruncatePosition
}

export interface WrapOptions {
    /**
     * By default the wrap is soft, meaning long words may extend past the column width. Setting this to true will make it hard wrap at the column width.
     * default: false
     */
    hard?: boolean
    /**
     * By default, an attempt is made to split words at spaces, ensuring that they don't extend past the configured columns.
     * If wordWrap is false, each column will instead be completely filled splitting words as necessary.
     * default: true
     */
    wordWrap?: boolean
    /**
     * Whitespace on all lines is removed by default. Set this option to false if you don't want to trim.
     * default: true
     */
    trim?: boolean
}

export interface ColumnsOptions {
    columns?: string[]
    minWidth?: number
    maxWidth?: number
    align?: 'left' | 'right' | 'center'
    paddingChr?: string
    columnSplitter?: string
    preserveNewLines?: boolean
    showHeaders?: boolean
    dataTransform?: (data) => string
    truncate?: boolean
    truncateMarker?: string
    widths?: { [name: string]: ColumnsOptions }
    config?: { [name: string]: ColumnsOptions }
}


export interface OutputOptions {
    enabled?: boolean
    colors?: boolean
    inspect?: InspectOptions
}


export interface OutputHelperOptionsConfigTableStyles {
    [name: string]: OutputHelperOptionsConfigTableStyle

    FAT?: OutputHelperOptionsConfigTableStyle
    SLIM?: OutputHelperOptionsConfigTableStyle
    NONE?: OutputHelperOptionsConfigTableStyle
}

export interface OutputHelperOptionsConfigTableStyle {
    [name: string]: string,

    'top'         ?: string,
    'top-mid'     ?: string,
    'top-left'    ?: string,
    'top-right'   ?: string,
    'bottom'      ?: string,
    'bottom-mid'  ?: string,
    'bottom-left' ?: string,
    'bottom-right'?: string,
    'left'        ?: string,
    'left-mid'    ?: string,
    'mid'         ?: string,
    'mid-mid'     ?: string,
    'right'       ?: string,
    'right-mid'   ?: string,
    'middle'      ?: string,
}

export interface OutputHelperOptionsConfig {
    quiet?: boolean,
    colors?: boolean,
    options?: {
        quiet?: boolean
        colors?: boolean
    },
    resetOnNewline?: boolean,
    styles?: { [name: string]: string },
    tableStyle?: OutputHelperOptionsConfigTableStyles
}


export interface Figures {
    tick: string
    cross: string
    star: string
    square: string
    squareSmall: string
    squareSmallFilled: string
    play: string
    circle: string
    circleFilled: string
    circleDotted: string
    circleDouble: string
    circleCircle: string
    circleCross: string
    circlePipe: string
    circleQuestionMark: string
    bullet: string
    dot: string
    line: string
    ellipsis: string
    pointer: string
    pointerSmall: string
    info: string
    warning: string
    hamburger: string
    smiley: string
    mustache: string
    heart: string
    arrowUp: string
    arrowDown: string
    arrowLeft: string
    arrowRight: string
    radioOn: string
    radioOff: string
    checkboxOn: string
    checkboxOff: string
    checkboxCircleOn: string
    checkboxCircleOff: string
    questionMarkPrefix: string
    oneHalf: string
    oneThird: string
    oneQuarter: string
    oneFifth: string
    oneSixth: string
    oneSeventh: string
    oneEighth: string
    oneNinth: string
    oneTenth: string
    twoThirds: string
    twoFifths: string
    threeQuarters: string
    threeFifths: string
    threeEighths: string
    fourFifths: string
    fiveSixths: string
    fiveEighths: string
    sevenEighths: string
}
