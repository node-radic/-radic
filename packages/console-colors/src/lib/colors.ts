///<reference path="../types/color-convert.d.ts"/>
///<reference path="../types/supports-color.d.ts"/>

import * as supports from "supports-color";
import * as convert from "color-convert";
import { trucolor, palette, chalkish, simple, Trucolor, Palette } from 'trucolor'
//import {startsWith } from 'lodash'


// import * as _ from "lodash";
// _.isNumber()
// let ansi256    = require('ansi-256-colors')
// let ansiColors = Object.keys(ansiStyles);

export interface AnsiRgbColors
{
    fg: Array<number>
    bg: Array<number>
}


function isLength(value: any, lengths: any[]): boolean[] {
    lengths = lengths.length === 1 && Array.isArray(lengths[ 0 ]) ? lengths[ 0 ] : lengths;
    let vLen: number;
    if ( value.length ) vLen = value.length;
    else if ( isFinite(value) ) vLen = parseInt(value);
    else return [ false ];

    let lens = []
    lengths.map((val) => parseInt(val)).forEach((len: number) => lens[ len ] = vLen === len);
    return lens;
}

let isAnyLength = (value: any, ...lengths: any[]) => isLength(value, lengths).indexOf(true) !== - 1
let isAllLength = (value: any, ...lengths: any[]) => isLength(value, lengths).indexOf(false) === - 1

export class Colors
{
    //static created: AnsiCreator[] = []
    palette: Palette = simple()

    get convert(): ColorConvert { return convert }

    get supports(): SupportsColorOptions { return supports }


    get(color: string, close?: boolean): string {
        let _color = this.palette[color] ? this.palette[color] : this.getTrucolorColor(color);
        return _color[ close ? 'out' : 'in' ];
    }

    getTrucolorColor(color: string): Trucolor {
        //return trucolor.bulk(trucolor.simplePalette(), { color }).color
        return trucolor(color, this.palette);
        // return require('deep-assign')(this.palette, trucolor.bulk({}, { color })).color;
    }

    getStyles(): Palette {
        //return trucolor.bulk(trucolor.simplePalette(), { color }).color
        return this.palette;
    }

    styles(styles:Object) :  this{
        this.palette = palette(this.palette, styles);
        // this.palette = require('deep-assign')(this.palette, trucolor.bulk({}, styles));
        return this;
    }

    reset() : this {
        this.palette = palette()
        return this
    }



}

export {  isAnyLength, isAllLength, isAnyLength as isLength}
