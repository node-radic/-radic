import { Colors } from "./colors";

export interface ParserParsedTag {
    colors: string[],
    replacements: { [old: string]: string }
    string: string
    replace: (text: string) => string
}
export class Parser {

    colors: Colors = new Colors;

    parse(text: string): string {
        if ( ! this.getTagsExp().test(text) ) return text;
        this.getTextTags(text, this.getTagsExp()).forEach((tag: string[]) => {
            let parsed = this.parseTag(tag);
            text       = parsed.replace(text);
        });
        return text
    }

    clean(text: string): string {
        if ( ! this.getTagsExp().test(text) ) return text;
        return text.replace(this.getTagsExp(), '');
    }

    protected getTagsExp(): RegExp {
        return /{(.*?)}/g
    }

    protected getTextTags(text: string, tagExp: RegExp): Array<string[]> {
        let matches = [], myArr;
        while ( (myArr = tagExp.exec(text)) !== null ) { matches.push(myArr); }
        return matches
    }

    protected parseTag(tag: string[]): ParserParsedTag {
        let replacements = {};
        tag[ 1 ].split('.').forEach((rawColor) => replacements[ rawColor ] = this.parseColor(rawColor));

        let colors  = Object.keys(replacements).map((key) => replacements[ key ]);
        let string  = colors.join('');
        let replace = (text: string) => text.replace(tag[ 0 ], string === '' ? tag[ 0 ] : string);

        return { replacements, colors, string, replace }
    }

    protected parseColor(color: string): string {
        let isClose = color.charAt(0) === '/';
        color       = isClose ? color.replace('/', '') : color;

        if ( color.charAt(0) === 'f' || color.charAt(0) === 'b' ) {

            // https://regex101.com/r/SdwSKD/1
            let exp = /^([fb])([:(])(.*)([)])$/m;
            if ( exp.test(color) ) {
                let segments = color.match(exp);
                let _color   = segments[ 3 ];
                if ( segments[ 1 ] === 'b' ) _color = 'background ' + _color;
                return this.colors.get(_color, isClose)
            }

            //throw Error('cant parase f or b in parseColor')
        }

        try {
            return this.colors.get(color, isClose)
        } catch ( err ) {
            return ''
        }
    }
}

