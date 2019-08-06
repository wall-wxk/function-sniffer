import checkMethod from './checkMethod';
export default function (list) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args.length < 1 || typeof args[0] != 'object') {
        throw new Error('Sniffer.run parameter error');
    }
    // 0位为Object类型，方便做扩展
    var name = args[0].name; // 函数名 
    var subscribe = args[0].subscribe || false; // 订阅当函数可执行时，调用该函数, true:订阅; false:不订阅
    var prompt = args[0].prompt || ''; // 是否显示提示语(当函数未能执行的时候)
    var base = args[0].base || window; // 基准对象，函数查找的起点
    var showPromptFn = args[0].showPromptFn || window.alert;
    var funcArgs = Array.prototype.slice.call(args).slice(1); // 函数的参数列表
    var result = checkMethod(name, base); // 检测结果
    if (result.success) {
        subscribe = false;
        try {
            return result.func.apply(result.func, funcArgs); // apply调整函数的指针指向
        }
        catch (e) {
            (typeof console != 'undefined') && console.log && console.log('错误:name=' + e.name + '; message=' + e.message);
        }
    }
    else {
        if (prompt) {
            // 输出提示语到页面，代码略
            showPromptFn(prompt);
        }
    }
    //将订阅的函数缓存起来
    if (subscribe) {
        var callbackFunc = {
            name: ''
        }; // 临时存放需要回调的函数
        callbackFunc.name = name;
        callbackFunc.base = base;
        callbackFunc.args = funcArgs;
        list.push(callbackFunc);
    }
}
;
//# sourceMappingURL=run.js.map