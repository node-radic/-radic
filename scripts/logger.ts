import * as winston from 'winston';
import { config, ConsoleTransportOptions, LeveledLogMethod, LogCallback, Logger, LoggerInstance, TransportInstance } from 'winston';
import { figures } from './figures';
import * as util from 'util';
import { Parser } from '../packages/console-colors/src/lib/parser';
import { LogLevel, RLoggerConfig } from './interfaces';
import * as moment from 'moment';

export function createLogger(opts:RLoggerConfig) :LoggerInstance{

//region: todo: get from @radic/util
    let kindsOf: any = {};
    'Number String Boolean Function RegExp Array Date Error'.split(' ').forEach(function (k) {
        kindsOf[ '[object ' + k + ']' ] = k.toLowerCase();
    });
    type KindOf = 'number' | 'string' | 'boolean' | 'function' | 'regexp' | 'array' | 'date' | 'error' | 'object' | 'null' | 'undefined'

    function kindOf(value: any): KindOf {
        // Null or undefined.
        if ( value == null ) {
            return <any> String(value);
        }
        // Everything else.
        return kindsOf[ kindsOf.toString.call(value) ] || 'object';
    }

//endregion

//region: todo: get from rcli
    function logConsoleTransportFormatter(options: ConsoleTransportOptions) {
        let meta   = options[ 'meta' ];
        let output = '';
        if ( meta !== null && meta !== undefined ) {
            if ( meta && meta instanceof Error && meta.stack ) {
                meta = meta.stack;
            }
            if ( typeof meta !== 'object' ) {
                output += '' + meta;
            }
            else if ( Object.keys(meta).length > 0 ) {
                if ( typeof options.prettyPrint === 'function' ) {
                    output += '' + options.prettyPrint(meta);
                } else if ( options.prettyPrint ) {
                    output += '' + util.inspect(meta, false, options.depth || null, options.colorize);
                } else if (
                    options.humanReadableUnhandledException
                    && Object.keys(meta).length === 5
                    && meta.hasOwnProperty('date')
                    && meta.hasOwnProperty('process')
                    && meta.hasOwnProperty('os')
                    && meta.hasOwnProperty('trace')
                    && meta.hasOwnProperty('stack') ) {

                    //
                    // If meta carries unhandled exception data serialize the stack nicely
                    //
                    var stack = meta.stack;
                    delete meta.stack;
                    delete meta.trace;
                    output += '' + exports.serialize(meta);

                    if ( stack ) {
                        output += stack.join('\n');
                    }
                } else {
                    output += '' + exports.serialize(meta);
                }
            }
        }

        return output;
    }


//[ 'error', 'warn', 'alert', 'notice', 'help', 'info', 'verbose', 'data', 'debug', 'silly' ]
    let levelIcons     = {
        error  : figures.circleCross,
        warn   : figures.warning,
        alert  : figures.circlePipe,
        notice : '{bold}!{/bold}',
        help   : figures.circleQuestionMark,
        info   : figures.info,
        verbose: figures.info.repeat(2),
        data   : figures.info.repeat(3),
        debug  : figures.hamburger,
        silly  : figures.smiley
    }
    let parser: Parser = new Parser;

    const logTransports: TransportInstance[] = [
        new (winston.transports.Console)({
            // json       : true,
            colorize   : true,
            prettyPrint: true,

            // timestamp  : true,
            showLevel: true,
            formatter: function (options: ConsoleTransportOptions) {
                options.colorize = true
                // Return string will be passed to logger.
                let timestamp = ''
                if(options.timestamp){
                    let date = new Date(Date.now());
                    timestamp = parser.parse(`[{grey}${moment().format('LTS')}{/grey}] `);
                }
                let message      = options[ 'message' ] ? options[ 'message' ] : ''
                let color        = config.syslog.colors[ options.level ] || config.cli.colors[ options.level ]
                let level        = options.level;
                if ( opts.useLevelIcons && options.level in levelIcons ) {
                    level = levelIcons[ options.level ] + ' ' + level + ' '
                }
                if ( options.colorize ) {
                    message = parser.parse(message);
                    level   = parser.parse(`{${color}}${level}{/${color}}`)
                }
                let meta: any  = logConsoleTransportFormatter(options);
                let metaPrefix = meta.length > 200 ? '\n' : '\t'
                return `${timestamp}${level}:: ${message} ${metaPrefix}${meta}`
                // level           : 'info',
                // handleExceptions: true,
                // label: string|null;
                // formatter(opts?:ConsoleTransportOptions) : string{
                //     return opts['message'];
                // }
            },
            timestamp: opts.timestamp,
            colors: true,
            name: 'console',
            depth: 10,
            handleExceptions: true,
            debugStdout: true
        })
    ];

    const logLevels: LogLevel[]              = [ 'error', 'warn', 'alert', 'notice', 'help', 'info', 'verbose', 'data', 'debug', 'silly' ]
    let logLevel                             = {};
    let logColors                            = {};
    logLevels.forEach((level, index) => {
        logLevel[ level ]  = index;
        logColors[ level ] = config.cli.colors[ level ] ? config.cli.colors[ level ] : config.syslog.colors[ level ]
    })
//endregion

    return <any> new Logger(<any>{
        level      : opts.level,
        rewriters  : [
            (level, msg, meta) => {
                parser.parse(msg);
                return meta;
            }
        ],
        levels     : logLevel,
        exitOnError: false,
        transports : logTransports
        // exitOnError: false
    });

}