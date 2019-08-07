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

describe('checkMethod', function(){
    it('checkMethod base is wrong type.', function(){
        expect(function(){
            Sniffer.run({
                base: 1,
                name:'next.undefined',
                subscribe: true
            })
        }).to.throw('base is wrong type.');
    })
    it('checkMethod readyFunc is not object.', function(){
        Test.undefined = undefined;
        const result = Sniffer.run({
            base: Test,
            name:'undefined.undefined'
        })
        expect(result).to.be.equal(undefined);
    })
})