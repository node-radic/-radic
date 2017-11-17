import { kindOf } from '../packages/util/src/lib/general';
import { Answers, ChoiceType, DateType, MessageType, objects, prompt, prompts, Question, Questions, QuestionType, registerPrompt, Separator, SourceType, TimeType } from 'inquirer';
import * as _ from 'lodash';
import { Colors } from '../packages/console-colors/src/lib/colors';
import { Parser } from '../packages/console-colors/src/lib/parser';
import { OutputUtil } from './OutputUtil';
import { RConfig, OutputOptions } from './interfaces';
import { inspect } from 'util';
import { createLogger} from './logger';
import { LoggerInstance } from 'winston';

const seperator = (msg = '') => new Separator(` -=${msg}=- `)

export class IO {

    protected logger:LoggerInstance

    public get types(): QuestionType[] { return [ 'input', 'confirm', 'list', 'rawlist', 'expand', 'checkbox', 'password', 'autocomplete', 'datetime' ] }

    constructor(protected config:RConfig) {
        let promptNames = Object.keys(prompts);
        if ( ! promptNames.includes('autocomplete') ) registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
        if ( ! promptNames.includes('datetime') ) registerPrompt('datetime', require('inquirer-datepicker-prompt'))
        this._parser = new Parser()
        this.util    = new OutputUtil(this);
    }

    attachLogger(logger:LoggerInstance){
        this.logger = logger;
    }

    protected _parser: Parser
    protected macros: { [name: string]: (...args: any[]) => string }
    public options: OutputOptions = {
        enabled: true,
        colors : true,
        inspect: { showHidden: true, depth: 10 }
    }

    public util: OutputUtil;
    public stdout: NodeJS.WriteStream = process.stdout

    get parser(): Parser { return this._parser }

    get colors(): Colors { return this._parser.colors; }

    // get options(): OutputOptions { return this.options}

    get nl(): this { return this.write('\n') }

    parse(text: string, force?: boolean): string {return this._parser.parse(text) }

    clean(text: string): string { return this._parser.clean(text)}

    write(text: string): this {
        if ( this.options.colors ) {
            text = this.parse(text);
        } else {
            text = this.clean(text);
        }
        this.stdout.write(text);
        return this;
    }

    writeln(text: string = ''): this { return this.write(text + '\n') }

    line(text: string = ''): this { return this.write(text + '\n')}

    dump(...args: any[]): this {
        this.options.inspect.colors = this.options.colors
        args.forEach(arg => this.line(inspect(arg, this.options.inspect)));
        return this
    }

    async ask(message: MessageType, def?: string): Promise<string> {
        return this.prompt<string>({ default: def, type: 'input', message })
    }


    async confirm(message: MessageType, def: boolean=true): Promise<boolean> {
        return this.prompt<boolean>({ type: 'confirm', default: def, message })
    }

    async list(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'list', choices, validate);
    }

    async rawlist(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'rawlist', choices, validate);
    }

    async expand(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple<string>(msg, 'expand', choices, validate);
    }

    async checkbox(msg: MessageType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string[]> {
        return this.multiple<string[]>(msg, 'checkbox', choices, validate);
    }

    async password(message: MessageType, def?: string, validate?: (answer) => boolean): Promise<string> {
        return this.prompt<string>({ type: 'password', default: def, message, validate })
    }

    async autocomplete(message: MessageType, source: string[] | SourceType, suggestOnly: boolean = false, validate?: (answer) => boolean): Promise<string> {
        let src: SourceType = <SourceType> source;
        if ( kindOf(source) === 'array' ) {
            src = (answersSoFar, input): Promise<any> => {
                return Promise.resolve((<string[]> source).filter((name) => {
                    return name.startsWith(input);
                }))
            }
        }

        return this.prompt<string>({ type: 'autocomplete', message, source: src, suggestOnly, validate })
    }

    /**
     *
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     * @link https://www.npmjs.com/package/dateformat
     *
     * @returns {Promise<string>}
     */
    async datetime(message: MessageType, date?: DateType, time?: TimeType, format: string[] = [ 'd', '/', 'm', '/', 'yyyy', ' ', 'HH', ':', 'MM', ':', 'ss' ]): Promise<string> {
        return this.prompt<string>({ type: 'datetime', message, date, time, format })

    }

    async multiple<T>(message: MessageType, type: QuestionType, choices: ChoiceType[] | Array<objects.ChoiceOption>, validate?: (answer) => boolean): Promise<T> {
        let prompt = { type, message, choices }
        if ( validate ) {
            prompt[ 'validate' ] = validate;
        }
        return this.prompt<T>(prompt)
    }

    async prompts(questions: Questions): Promise<Answers> {
        return prompt(questions);
    }

    async prompt<T extends any>(question: Question): Promise<T> {
        question.name = 'prompt'
        return prompt([ question ])
            .then((answers) => Promise.resolve(<T>answers.prompt))
            .catch(e => Promise.reject(e))
    }

    async interact(message: string, type: string = 'input', opts: Question = {}, def?: string) {
        return <Promise<string>> new Promise((resolve, reject) => {
            let question = _.merge({ name: 'ask', message, type, default: def }, opts)
            prompt(question).then(answers => resolve(answers.ask)).catch(e => reject(e))
        })
    }
}