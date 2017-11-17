import { LoggerInstance } from 'winston';
import { IO } from './IO';
import { RConfig } from './interfaces';
import { createLogger } from './logger';
import { ChoiceType } from 'inquirer';
import { Parser, Template } from './Template';
import { resolve } from 'path';
import { readFileSync } from 'fs';

export class Radic {
    protected io: IO
    protected logger: LoggerInstance

    constructor(protected config: RConfig) {
        this.io     = new IO(config)
        this.logger = createLogger(config.log)

        // const info   = io.logger.info.bind(io.logger)
        // const log    = io.logger.info.bind(io.logger)
    }

    template (name: string): Template {
        let filePath = resolve(this.config.templatesPath, name);
        let template = new Template(this)
        template.setContent(readFileSync(filePath, 'utf-8'));
        return template;
    }

    addTemplateParser(name:string, parser:Parser):this{
        Template.addParser(name, parser);
        return this;
    }

    line    = (msg: string) => this.io.line(msg)
    write   = (msg: string) => this.io.write(msg)
    dump    = (...crap) => this.io.dump(...crap);
    confirm = (msg: string, def: boolean = true) => this.io.confirm(msg)
    list    = (msg: string, choices: ChoiceType[]) => this.io.list(msg, choices)
    ask     = (msg: string) => this.io.ask(msg)

    log    = (msg: string, ...optional: any[]) => this.logger.info(msg, ...optional)
    notice = (msg: string, ...optional: any[]) => this.logger.notice(msg, ...optional)
    warn   = (msg: string, ...optional: any[]) => this.logger.warn(msg, ...optional)
    error  = (msg: string, ...optional: any[]) => this.logger.error(msg, ...optional)
    debug  = (msg: string, ...optional: any[]) => this.logger.debug(msg, ...optional)
    silly  = (msg: string, ...optional: any[]) => this.logger.silly(msg, ...optional)
}