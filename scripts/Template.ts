import { dirname, resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { Radic } from './Radic';
import { ensureDirSync } from 'fs-extra';

export type Parser = (content: string) => string

export class Template {
    protected filePath: string;

    protected static parsers: { [name: string]: Parser } = {}

    static addParser(name: string, parser: Parser) {
        this.parsers[ name ] = parser;
    }


    protected content: string;

    constructor(protected r: Radic) {}

    getFilePath(): string { return this.filePath}

    setFilePath(filePath: string): this {
        this.filePath = filePath;
        return this
    }

    setContent(content: string): this {
        this.content = content;
        return this
    }

    parse(this:this, parser: Parser): this {
        this.content = parser.apply(this, [this.content])
        return this;
    }

    applyParsers(names: string[]): this {

        names.forEach(name => {
            if ( false === Object.keys(Template.parsers).includes(name) ) {
                this.r.error(`Cannot apply parser [${name}] as it does not exist!`)
            }
            this.parse(Template.parsers[ name ])
        })
        return this
    }

    writeTo(filePath, force: boolean = false): this {
        filePath = resolve(filePath)
        if ( existsSync(filePath) && force === false ) {
            this.r.error(`Could not write template to [${filePath}]. File already exists. Set force parameter to true if you want to overwrite`)
        }
        ensureDirSync(dirname(filePath))
        // this.r.log(`ensured dir [${dirname(filePath)}]. Going to write to [${filePath}]`)
        writeFileSync(filePath, this.content, {
            encoding: 'utf-8'
        })
        return this
    }

    read() {return this.content; }
}