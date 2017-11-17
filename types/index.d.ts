declare global {
    namespace NodeJS {
        export interface ReadableStream {
            pipe<T extends ReadWriteStream>(destination: T, options?: { end?: boolean; }): T;
        }

        export interface ReadWriteStream {
            pipe<T extends ReadWriteStream>(destination: T, options?: { end?: boolean; }): T;
        }
    }
}


declare module 'markdown-toc' {
    namespace mdtoc {
        interface MarkdownTocOptions {

            /** Append a string to the end of the TOC. **/
            append?: string
            /**
             *
             str {String} the actual heading string
             ele {Objecct} object of heading tokens
             arr {Array} all of the headings objects
             @Example

             From time to time, we might get junk like this in our TOC.

             [.aaa([foo], ...) another bad heading](#-aaa--foo--------another-bad-heading)
             Unless you like that kind of thing, you might want to filter these bad headings out.

             function removeJunk(str, ele, arr) {
        return str.indexOf('...') === -1;
    }

             var result = toc(str, {filter: removeJunk});
             * @param {string} str
             * @param ele
             * @param arr
             * @returns {options.slugify}
             */
            filter?: (str: string, ele?: any, arr?: any) => void

            /**
             *
             //=> beautiful TOC
             options.slugify

             Type: Function

             Default: Basic non-word character replacement.

             Example

             var str = toc('# Some Article', {slugify: require('uslug')});
             */
            slugify?: Function


            /**
             * default: *
             */
            bullets?: string | string[]

            /**
             * default: 6
             */
            maxdepth?: number

            /**
             * Exclude the first h1-level heading in a file. For example, this prevents the first heading in a README from showing up in the TOC.
             * default: true
             */
            firsth1?: boolean

            /**
             *
             Type: Boolean

             Default: true

             Strip extraneous HTML tags from heading text before slugifying. This is similar to GitHub markdown behavior.


             */
            stripHeadingTags?: boolean

        }

        interface MarkdownTocInstance {
            content: string
            highest: number
            json: Array<{
                content: string,
                sluug: string
                level: number
                i: number
                seen: number
            }>
            tokens: Array<{
                [key: string]: any
                type: string
                content?: string
                level: number
            }>
        }
    }

    function mdtoc (str:string, option:mdtoc.MarkdownTocOptions) : mdtoc.MarkdownTocInstance

    export = mdtoc
}