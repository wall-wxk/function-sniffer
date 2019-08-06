var Sniffer = require('../dist/function-sniffer.cjs.js');
var expect = require('chai').expect;

var Test = {
    say: function(str){
        return str;
    },
    next: {
        value: 1,
        walk: function(){
            return true;
        }
    }
};

describe('run()', function(){
    it('run default', function(){
        var result = Sniffer.run({
            base: Test,
            name: 'say'
        }, 'hello');
        expect(result).to.equal('hello');
    })
    it('run function not exit', function(){
        var result = Sniffer.run({
            base: window,
            name: 'say'
        }, 'hello');
        expect(result).to.not.equal('hello');
    })
    it('run prompt', function(){
        Sniffer.run({
            base: window,
            name: 'say',
            prompt: 'no say',
            showPromptFn: function(str){
                expect(str).to.equal('no say');
            }
        }, 'hello');
    })
    it('run no arguments', function(){
        expect(function(){
            Sniffer.run()
        }).to.throw('Sniffer.run parameter error');
    })
    it('run is not function', function(){
        var result = Sniffer.run({
            base: Test,
            name: 'next.value'
        }, 1, 2)
        expect(result).to.be.equal(undefined);
    })
    it('run default base', function(){
        window.sayHello = function(){
            return true;
        }
        var result = Sniffer.run({
            name: 'sayHello',
        });

        expect(result).to.be.equal(true);
    })
})