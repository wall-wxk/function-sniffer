
/*!
* function-sniffer.js v0.0.1
* (c) 2019-2019 [object Object]
* Released under the MIT License.
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Sniffer = factory());
}(this, function () { 'use strict';

    /**
    * @function {private} 检测方法是否可用
    * @param {string} funcName -- 方法名***.***.***
    * @param {object} base -- 方法所依附的对象
    */
    function checkMethod (funcName, base) {
        var methodList = funcName.split('.'); // 方法名list
        var readyFunc = base; // 检测合格的函数部分
        var result = {
            'success': true,
            'func': function () { }
        }; // 返回的检测结果
        var methodName; // 单个方法名
        var i;
        if (typeof base !== 'object') {
            throw new Error('base is wrong type.');
        }
        for (i = 0; i < methodList.length; i++) {
            methodName = methodList[i];
            if (typeof readyFunc !== 'object') {
                result.success = false;
                return result;
            }
            else if (methodName in readyFunc) {
                readyFunc = readyFunc[methodName];
            }
            else {
                result.success = false;
                return result;
            }
        }
        result.func = readyFunc;
        return result;
    }

    function run (list) {
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

    function trigger (list, option) {
        if (typeof option !== 'object') {
            throw new Error('Sniffer.trigger parameter error');
        }
        var funcName = option.name || ''; // 函数名
        var base = option.base || window; // 基准对象，函数查找的起点
        var newList = []; // 用于更新list
        var i; // 遍历list
        var param; // 临时存储list[i]
        if (funcName.length < 1) {
            throw new Error('parameter name is require');
        }
        // 遍历list，执行对应的函数，并将其从缓存池list中删除
        for (i = 0; i < list.length; i++) {
            param = list[i];
            if (param.name == funcName) {
                var result = checkMethod(funcName, base);
                if (result.success) {
                    try {
                        return result.func.apply(result.func, param.args);
                    }
                    catch (e) {
                        (typeof console != 'undefined') && console.log && console.log('错误:name=' + e.name + '; message=' + e.message);
                    }
                }
            }
            else {
                newList.push(param);
            }
        }
        list = newList;
    }

    var list = [];
    var main = {
        /**
         * @function 函数转换接口，用于判断函数是否存在命名空间中，有则调用，无则不调用
         * @version {create} 2015-11-30
         * @description
         * 用途：只设计用于延迟加载
         * @example
            ```javascript
            // Wall.mytext.init(45, false);
            // 调用：
            Sniffer.run({'base':window, 'name':'Wall.mytext.init'}, 45, false);
            // 或
            Sniffer.run({'base':Wall, 'name':'mytext.init'}, 45, false);
            // 如果不知道参数的个数，不能直接写，可以用apply的方式调用当前方法
            Sniffer.run.apply(window, [ {'name':'Wall.mytext.init'}, 45, false ])
            ```
        */
        run: function () {
            var args = Array.prototype.slice.call(arguments);
            return run.apply(void 0, [list].concat(args));
        },
        /**
        * @function 触发函数接口，调用已提前订阅的函数
        * @param {object} option -- 需要调用的相关参数
        *   {string} option.name -- 方法调用
        *   {object} option.base -- 基点
        * @description
        *   用途：只设计用于延迟加载
        *   另外，调用trigger方法的前提是，订阅方法所在js已经加载并解析完毕
        *   不管触发成功与否，都会清除list中对应的项
        */
        trigger: function (option) {
            return trigger(list, option);
        }
    };

    return main;

}));
//# sourceMappingURL=function-sniffer.js.map
