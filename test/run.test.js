import Sniffer from '../dist/function-sniffer.cjs';
import {
    expect
} from 'chai';

let Test = {
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
        const result = Sniffer.run({
            base: Test,
            name: 'say'
        }, 'hello');
        expect(result).to.equal('hello');
    })
    it('run function not exit', function(){
        const result = Sniffer.run({
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
        const result = Sniffer.run({
            base: Test,
            name: 'next.value'
        }, 1, 2)
        expect(result).to.be.equal(undefined);
    })
    it('run default base', function(){
        window.sayHello = function(){
            return true;
        }
        const result = Sniffer.run({
            name: 'sayHello',
        });

        expect(result).to.be.equal(true);
    })
})