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

describe('trigger()', function(){
    it('trigger default', function(){
        const result = Sniffer.run({
            base: Test,
            name: 'do',
            subscribe: true
        }, true);

        expect(result).to.equal(undefined);

        Test.do = function(str){
            return str
        };

        const result2 = Sniffer.trigger({
            base: Test,
            name: 'do'
        });

        expect(result2).to.equal(true);
    })
    it('trigger default base', function(){
        const result = Sniffer.run({
            base: window,
            name: 'todo',
            subscribe: true
        }, true);

        expect(result).to.equal(undefined);

        window.todo = function(str){
            return str
        };

        const result2 = Sniffer.trigger({
            name: 'todo'
        });

        expect(result2).to.equal(true);
    })
    it('trigger no arguments', function(){
        expect(function(){
            Sniffer.trigger()
        }).to.throw('Sniffer.trigger parameter error');
    })
    it('trigger no option.name', function(){
        expect(function(){
            Sniffer.trigger({
                base: window
            })
        }).to.throw('parameter name is require');
    })
    it('trigger subscribe function not exist', function(){
        Sniffer.run({
            base: Test,
            name: 'notExist',
            subscribe: true
        }, true);

        const result = Sniffer.trigger({
            base: Test,
            name: 'notExist'
        });

        expect(result).to.not.be.equal(true);
    })
    it('trigger subscribe function is not function', function(){
        Sniffer.run({
            base: Test,
            name: 'notFn',
            subscribe: true
        }, true);

        Test.notFn = {};

        const result = Sniffer.trigger({
            base: Test,
            name: 'notFn'
        });

        expect(result).to.not.be.equal(true);
    })
    
    it('checkMethod base is wrong type.', function(){
        expect(function(){
            Sniffer.run({
                base: 1,
                name:'next.undefined',
                subscribe: true
            })
        }).to.throw('base is wrong type.');
    })
    it('checkMethod readyFunc is undefined.', function(){
        Test.undefined = undefined;
        const result = Sniffer.run({
            base: Test,
            name:'undefined.undefined'
        })
        expect(result).to.be.equal(undefined);
    })
})