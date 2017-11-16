declare module "trucolor" {

    interface Palette {
        [name:string]:Trucolor
        white: Trucolor
        black: Trucolor
        red: Trucolor
        green: Trucolor
        blue: Trucolor
        cyan: Trucolor
        yellow: Trucolor
        magenta: Trucolor
        brightWhite: Trucolor
        brightRed: Trucolor
        brightGreen: Trucolor
        brightBlue: Trucolor
        brightCyan: Trucolor
        brightYellow: Trucolor
        brightMagenta: Trucolor
        dim: Trucolor
        bold: Trucolor
        italic: Trucolor
        invert: Trucolor
        example: Trucolor
        command: Trucolor
        argument: Trucolor
        option: Trucolor
        operator: Trucolor
        grey: Trucolor
        title: Trucolor
        normal: Trucolor
        reset: Trucolor
    }

    interface Trucolor {
        name:string
        in:string
        out:string
        hex:string
        rgb:string
        toString():string
        toSwatch():any
    }

    function trucolor(color?: string, options?: any): Trucolor

    function palette(options?: any, palette?: any): Palette

    function chalkish(palette?: any): any

    function simple(options?: any): Palette

    function simplePalette(options?: any): any
}

