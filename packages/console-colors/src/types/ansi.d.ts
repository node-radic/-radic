
/// <reference types="node" />
declare var _ansi: _ansi.AnsiStatic

declare module _ansi
{
    interface AnsiStatic
    {
        (stream: NodeJS.WritableStream, options?:any): Ansi
    }

    interface ColorFunction<T>
    {

        (...p:any[]): T
    }

    interface Colorer<T>
    {
        _buffer: any[]

        back?: ColorFunction<T>
        beep?: ColorFunction<T>
        bold?: ColorFunction<T>
        buffer?: ColorFunction<T>
        eraseData?: ColorFunction<T>
        eraseLine?: ColorFunction<T>
        flush?: ColorFunction<T>
        forward?: ColorFunction<T>
        nextLine?: ColorFunction<T>
        previousLine?: ColorFunction<T>

        reset?: ColorFunction<T>
        resetBold?: ColorFunction<T>
        resetInverse?: ColorFunction<T>
        resetItalic?: ColorFunction<T>
        resetUnderline?: ColorFunction<T>
        resetPosition?: ColorFunction<T>

        queryPosition?: ColorFunction<T>
        savePosition?: ColorFunction<T>
        restorePosition?: ColorFunction<T>

        scrollDown?: ColorFunction<T>
        scrollUp?: ColorFunction<T>
        show?: ColorFunction<T>
        up?: ColorFunction<T>
        down?: ColorFunction<T>


        black?: ColorFunction<T>
        blue?: ColorFunction<T>
        cyan?: ColorFunction<T>
        green?: ColorFunction<T>
        magenta?: ColorFunction<T>
        red?: ColorFunction<T>
        white?: ColorFunction<T>
        yellow?: ColorFunction<T>

        grey?: ColorFunction<T>
        /**
         search:replace regex color to bright

         search:    (\w)(\w*?)\?(.*)
         replace:   bright\U$1\E$2 ?$3
         */

        brightBlack ?: ColorFunction<T>
        brightBlue ?: ColorFunction<T>
        brightCyan ?: ColorFunction<T>
        brightGreen ?: ColorFunction<T>
        brightMagenta ?: ColorFunction<T>
        brightRed ?: ColorFunction<T>
        brightWhite ?: ColorFunction<T>
        brightYellow ?: ColorFunction<T>



        dim?: ColorFunction<T>
        italic?: ColorFunction<T>
        underline?: ColorFunction<T>
        inverse?: ColorFunction<T>
        hidden?: ColorFunction<T>
        strikethrough?: ColorFunction<T>

        base: number
        current: any
        cursor: Cursor
        hex ?: (color: string) => T
        write ?: (data: string) => T
        rgb ?: (r: string|number, g: string|number, b: string|number) => T
        goto ?: (x: number, y: number) => T
        horizontalAbsolute ?: (line: number) => T
    }
    interface Stream extends NodeJS.ReadWriteStream
    {
        _ansicursor?: Cursor
    }

    interface Cursor
    {
        Bold?: boolean
        Inverse?: boolean
        Italic?: boolean
        Underline?: boolean
        buffering?: boolean
        enabled?: boolean
        newlines?: number
        stream?: Stream
        bg?: Colorer<this>
        fg?: Colorer<this>
        background?: Colorer<this>
        foreground?: Colorer<this>
    }

    interface Ansi extends Cursor, Colorer<Ansi>
    {

    }


}
declare module "ansi"
{
    export = _ansi
}
