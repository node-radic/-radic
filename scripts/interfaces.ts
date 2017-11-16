import * as ts from 'typescript';
import { Settings } from 'gulp-typescript';
import { LoggerInstance } from 'winston';
import * as inquirer from '../types/inquirer';
import { InspectOptions } from 'util';
import { HelperOptionsConfig, HelperOptionsConfigOption } from '../../interfaces';

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

export interface GulpConfig {
    [key: string]: any

    idea ?: boolean
    pkg  ?: any
    lerna?: any
    log?: {
        [key: string]: any
        level        ?: LogLevel,
        useLevelIcons?: boolean
        timestamp?: boolean
    },
    ts   ?: {
        [key: string]: any
        config    ?: any
        taskPrefix?: string,
        defaults  ?: TSProjectOptions
    }
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

export interface OutputHelperOptionsConfig extends HelperOptionsConfig {
    quiet?: boolean,
    colors?: boolean,
    options?: {
        quiet?: HelperOptionsConfigOption,
        colors?: HelperOptionsConfigOption
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
