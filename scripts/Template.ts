import { isAbsolute, resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { Radic } from './Radic';

export type Parser = (content: string) => string

export class Template {

    protected static parsers: { [name: string]: Parser } = {}

    static addParser(name: string, parser: Parser) {
        this.parsers[ name ] = parser;
    }


    protected content: string;

    constructor(protected r: Radic) {}

    setContent(content: string): this {
        this.content = content;
        return this
    }

    parse(parser: Parser): this {
        this.content = parser(this.content)
        return this;
    }

    applyParsers(names: string[]): this {

        names.forEach(name => {
            if(false===Object.keys(Template.parsers).includes(name)){
                this.r.error(`Cannot apply parser [${name}] as it does not exist!`)
            }
            this.parse(Template.parsers[ name ])
        })
        return this
    }

    writeTo(filePath, force: boolean = false): this {
        filePath = isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath)
        if ( existsSync(filePath) && force === false ) {
            this.r.error(`Could not write template to [${filePath}]. File already exists. Set force parameter to true if you want to overwrite`)
        }
        writeFileSync(filePath, this.content, {
            encoding: 'utf-8'
        })
        return this
    }

    read() {return this.content; }
}