import { suite, test } from "mocha-typescript";
import { Config } from "../src";
let defaultConfig = {
    foo     : 'bar',
    fooNum  : 1,
    fooBool : true
}
@suite
class ConfigTest {
    config: Config;

    static before() {
    }

    before() {


        this.config  = new Config(defaultConfig)
    }

    @test testPrepareArgumentVariations() {
        this.config.get('foo').should.eq('bar')
        this.config.get().should.keys(Object.keys(defaultConfig))
        this.config.has('foo').should.be.true;
        this.config.raw('foo').should.eq('bar');
        this.config.merge({foo: 'foobar'});
        this.config.get('foo').should.eq('foobar');
        // this.config.unset('foo');
        this.config.set('foo', false);
        this.config.get('foo',false).should.be.false;
    }

    // @test testParseArgumentsSome() {
    //     let parsed = parseArguments([ 'foo', 'bar', 'laat', 'die' ], this.config.arguments);
    //     let a      = parsed.arguments
    //     a[ 'name' ].should.eq('foo');
    //     a[ 'projects' ].should.contain.ordered.members([ 'bar', 'laat', 'die' ])
    //
    //     a[ 'num' ].should.eq(123);
    //     a[ 'nums' ].should.contain.ordered.members([ 123, 321 ])
    //     a[ 'bool' ].should.eq(true)
    //     a[ 'bools' ].should.contain.ordered.members([ true, false, true ])
    // }
}
