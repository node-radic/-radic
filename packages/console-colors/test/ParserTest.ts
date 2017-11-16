import { context, suite, test } from 'mocha-typescript';
import { bootstrap } from './_support/bootstrap';
import { assert, should } from 'chai'
import { Parser } from '../src';

bootstrap();

@suite
class ParserTest {
    @context mocha; // Set for instenace methods such as tests and before/after
    @context static mocha; // Set for static methods such as static before/after (mocha bdd beforeEach/afterEach)
             text: string
             parser: Parser


    static before() {

    }


    before() {
        this.parser = new Parser;

        this.text = `
{bold.red.underline}This is bold, red and underlined.{/red} But we dropped the red.{reset} And just resetted the rest.{b:blue.red}teetete
{f:yellow.b:blue.bold}We can also mix openers and closers{/b:blue.b:yellow./bold./f:yellow.blue}And make it really silly.
{b:red.bold.underline.b:#333.b:rgb(2,1,3)}Hex #333{reset}
`;

    }

    @test
    itCanCleanAllTagsInAText() {
        let cleaned = this.parser.clean(this.text);
        let exp     = /{(.*?)}/g;
        exp.test(cleaned).should.be.false;
    }

    @test
    itCanParseAllTagsInAText() {

        let parsed = this.parser.parse(this.text);
        let exp    = /{(.*?)}/g;
        exp.test(parsed).should.be.false
    }
}