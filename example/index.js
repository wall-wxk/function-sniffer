var $say = document.getElementById('say');
var $do = document.getElementById('do');

var Test = {
    say: function(str){
        return str;
    },
    next: {
        walk: function(){
            return true;
        }
    }
};

$say.innerHTML = Sniffer.run({
    'base':Test,
    'name':'say'
}, 'hello');

$do.innerHTML = Sniffer.run({
    'base':Test,
    'name':'do',
    'prompt': 'Test.do方法无法执行'
});