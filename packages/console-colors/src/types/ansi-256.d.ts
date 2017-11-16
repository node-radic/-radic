
interface Ansi256Colors
{
    getRgb(red: number, green, blue): string
    codes: Array<number>
    standard: Array<string>
    bright: Array<number>
    greyscale: Array<number>
    rgb: Array<number>
}
declare module "ansi-256-colors"
{
    export var fg: Ansi256Colors;
    export var bg: Ansi256Colors;
    export var reset: string;
}
