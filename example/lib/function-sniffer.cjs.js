'use strict';

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
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
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

module.exports = main;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tc25pZmZlci5janMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jaGVja01ldGhvZC50cyIsIi4uLy4uL3NyYy91dGlscy9ydW4udHMiLCIuLi8uLi9zcmMvdXRpbHMvdHJpZ2dlci50cyIsIi4uLy4uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImludGVyZmFjZSBUcmVzdWx0e1xuICAgIHN1Y2Nlc3M6IGJvb2xlYW47XG4gICAgZnVuYzogb2JqZWN0IHwgKCguLi5hcmdzOiBhbnlbXSkgPT4gYW55KTtcbn1cbi8qKlxuKiBAZnVuY3Rpb24ge3ByaXZhdGV9IOajgOa1i+aWueazleaYr+WQpuWPr+eUqFxuKiBAcGFyYW0ge3N0cmluZ30gZnVuY05hbWUgLS0g5pa55rOV5ZCNKioqLioqKi4qKipcbiogQHBhcmFtIHtvYmplY3R9IGJhc2UgLS0g5pa55rOV5omA5L6d6ZmE55qE5a+56LGhIFxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGZ1bmNOYW1lOiBzdHJpbmcsIGJhc2U6IG9iamVjdCk6IFRyZXN1bHR7XG4gICAgY29uc3QgbWV0aG9kTGlzdCA9IGZ1bmNOYW1lLnNwbGl0KCcuJyk7IC8vIOaWueazleWQjWxpc3RcbiAgICBsZXQgcmVhZHlGdW5jID0gYmFzZTsgLy8g5qOA5rWL5ZCI5qC855qE5Ye95pWw6YOo5YiGXG4gICAgbGV0IHJlc3VsdDogVHJlc3VsdCA9IHtcbiAgICAgICAgJ3N1Y2Nlc3MnOiB0cnVlLFxuICAgICAgICAnZnVuYyc6ICgpPT57fVxuICAgIH07IC8vIOi/lOWbnueahOajgOa1i+e7k+aenFxuICAgIGxldCBtZXRob2ROYW1lOyAvLyDljZXkuKrmlrnms5XlkI1cbiAgICBsZXQgaTtcblxuICAgIGlmKHR5cGVvZiBiYXNlICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYmFzZSBpcyB3cm9uZyB0eXBlLicpO1xuICAgIH1cbiAgICBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbWV0aG9kTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBtZXRob2ROYW1lID0gbWV0aG9kTGlzdFtpXTtcbiAgICAgICAgaWYodHlwZW9mIHJlYWR5RnVuYyAhPT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgcmVzdWx0LnN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1lbHNlIGlmIChtZXRob2ROYW1lIGluIHJlYWR5RnVuYykge1xuICAgICAgICAgICAgcmVhZHlGdW5jID0gcmVhZHlGdW5jW21ldGhvZE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQuZnVuYyA9IHJlYWR5RnVuYztcbiAgICByZXR1cm4gcmVzdWx0O1xufSIsImltcG9ydCBjaGVja01ldGhvZCBmcm9tICcuL2NoZWNrTWV0aG9kJztcbmltcG9ydCB7XG4gICAgVGxpc3QsXG4gICAgVGNhbGxiYWNrRnVuYyxcbn0gZnJvbSAnLi90eXBlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKFxuICAgIGxpc3Q6IFRsaXN0LFxuICAgIC4uLmFyZ3Ncbikge1xuICAgIGlmIChhcmdzLmxlbmd0aCA8IDEgfHwgdHlwZW9mIGFyZ3NbMF0gIT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTbmlmZmVyLnJ1biBwYXJhbWV0ZXIgZXJyb3InKTtcbiAgICB9XG5cbiAgICAvLyAw5L2N5Li6T2JqZWN057G75Z6L77yM5pa55L6/5YGa5omp5bGVXG4gICAgY29uc3QgbmFtZTogc3RyaW5nID0gYXJnc1swXS5uYW1lOyAvLyDlh73mlbDlkI0gXG4gICAgbGV0IHN1YnNjcmliZTogYm9vbGVhbiA9IGFyZ3NbMF0uc3Vic2NyaWJlIHx8IGZhbHNlOyAvLyDorqLpmIXlvZPlh73mlbDlj6/miafooYzml7bvvIzosIPnlKjor6Xlh73mlbAsIHRydWU66K6i6ZiFOyBmYWxzZTrkuI3orqLpmIVcbiAgICBjb25zdCBwcm9tcHQ6IHN0cmluZyA9IGFyZ3NbMF0ucHJvbXB0IHx8ICcnOyAvLyDmmK/lkKbmmL7npLrmj5DnpLror60o5b2T5Ye95pWw5pyq6IO95omn6KGM55qE5pe25YCZKVxuICAgIGNvbnN0IGJhc2U6IG9iamVjdCA9IGFyZ3NbMF0uYmFzZSB8fCB3aW5kb3c7IC8vIOWfuuWHhuWvueixoe+8jOWHveaVsOafpeaJvueahOi1t+eCuVxuICAgIGNvbnN0IHNob3dQcm9tcHRGbiA9IGFyZ3NbMF0uc2hvd1Byb21wdEZuIHx8IHdpbmRvdy5hbGVydDtcbiAgICBjb25zdCBmdW5jQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLnNsaWNlKDEpOyAvLyDlh73mlbDnmoTlj4LmlbDliJfooahcbiAgICBsZXQgcmVzdWx0ID0gY2hlY2tNZXRob2QobmFtZSwgYmFzZSk7IC8vIOajgOa1i+e7k+aenFxuXG4gICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHN1YnNjcmliZSA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQuZnVuYyBhcyBGdW5jdGlvbikuYXBwbHkocmVzdWx0LmZ1bmMsIGZ1bmNBcmdzKTsgLy8gYXBwbHnosIPmlbTlh73mlbDnmoTmjIfpkojmjIflkJFcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgKHR5cGVvZiBjb25zb2xlICE9ICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLmxvZyAmJiBjb25zb2xlLmxvZygn6ZSZ6K+vOm5hbWU9JyArIGUubmFtZSArICc7IG1lc3NhZ2U9JyArIGUubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJvbXB0KSB7XG4gICAgICAgICAgICAvLyDovpPlh7rmj5DnpLror63liLDpobXpnaLvvIzku6PnoIHnlaVcbiAgICAgICAgICAgIHNob3dQcm9tcHRGbihwcm9tcHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy/lsIborqLpmIXnmoTlh73mlbDnvJPlrZjotbfmnaVcbiAgICBpZiAoc3Vic2NyaWJlKSB7XG4gICAgICAgIGxldCBjYWxsYmFja0Z1bmM6IFRjYWxsYmFja0Z1bmMgPSB7XG4gICAgICAgICAgICBuYW1lOiAnJ1xuICAgICAgICB9OyAvLyDkuLTml7blrZjmlL7pnIDopoHlm57osIPnmoTlh73mlbBcbiAgICAgICAgY2FsbGJhY2tGdW5jLm5hbWUgPSBuYW1lO1xuICAgICAgICBjYWxsYmFja0Z1bmMuYmFzZSA9IGJhc2U7XG4gICAgICAgIGNhbGxiYWNrRnVuYy5hcmdzID0gZnVuY0FyZ3M7XG4gICAgICAgIGxpc3QucHVzaChjYWxsYmFja0Z1bmMpO1xuICAgIH1cbn0iLCJpbXBvcnQgY2hlY2tNZXRob2QgZnJvbSAnLi9jaGVja01ldGhvZCdcbmltcG9ydCB7XG4gICAgVGxpc3QsXG4gICAgVG9wdGlvblxufSBmcm9tICcuL3R5cGUnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChsaXN0OiBUbGlzdCwgb3B0aW9uOiBUb3B0aW9uKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb24gIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU25pZmZlci50cmlnZ2VyIHBhcmFtZXRlciBlcnJvcicpO1xuICAgIH1cblxuICAgIGNvbnN0IGZ1bmNOYW1lID0gb3B0aW9uLm5hbWUgfHwgJyc7IC8vIOWHveaVsOWQjVxuICAgIGNvbnN0IGJhc2UgPSBvcHRpb24uYmFzZSB8fCB3aW5kb3c7IC8vIOWfuuWHhuWvueixoe+8jOWHveaVsOafpeaJvueahOi1t+eCuVxuICAgIGxldCBuZXdMaXN0OiBUbGlzdCA9IFtdOyAvLyDnlKjkuo7mm7TmlrBsaXN0XG4gICAgbGV0IGk7IC8vIOmBjeWOhmxpc3RcbiAgICBsZXQgcGFyYW07IC8vIOS4tOaXtuWtmOWCqGxpc3RbaV1cblxuICAgIGlmIChmdW5jTmFtZS5sZW5ndGggPCAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGFyYW1ldGVyIG5hbWUgaXMgcmVxdWlyZScpO1xuICAgIH1cblxuICAgIC8vIOmBjeWOhmxpc3TvvIzmiafooYzlr7nlupTnmoTlh73mlbDvvIzlubblsIblhbbku47nvJPlrZjmsaBsaXN05Lit5Yig6ZmkXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGFyYW0gPSBsaXN0W2ldO1xuICAgICAgICBpZiAocGFyYW0ubmFtZSA9PSBmdW5jTmFtZSkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGNoZWNrTWV0aG9kKGZ1bmNOYW1lLCBiYXNlKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAocmVzdWx0LmZ1bmMgYXMgRnVuY3Rpb24pLmFwcGx5KHJlc3VsdC5mdW5jLCBwYXJhbS5hcmdzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICh0eXBlb2YgY29uc29sZSAhPSAndW5kZWZpbmVkJykgJiYgY29uc29sZS5sb2cgJiYgY29uc29sZS5sb2coJ+mUmeivrzpuYW1lPScgKyBlLm5hbWUgKyAnOyBtZXNzYWdlPScgKyBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0xpc3QucHVzaChwYXJhbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsaXN0ID0gbmV3TGlzdDtcbn0iLCJpbXBvcnQgcnVuIGZyb20gJy4vdXRpbHMvcnVuJztcbmltcG9ydCB0cmlnZ2VyIGZyb20gJy4vdXRpbHMvdHJpZ2dlcic7XG5pbXBvcnQge1xuICAgIFRsaXN0LFxuICAgIFRvcHRpb25cbn0gZnJvbSAnLi91dGlscy90eXBlJ1xuXG5sZXQgbGlzdDogVGxpc3QgPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIC8qKlxuICAgICAqIEBmdW5jdGlvbiDlh73mlbDovazmjaLmjqXlj6PvvIznlKjkuo7liKTmlq3lh73mlbDmmK/lkKblrZjlnKjlkb3lkI3nqbrpl7TkuK3vvIzmnInliJnosIPnlKjvvIzml6DliJnkuI3osIPnlKhcbiAgICAgKiBAdmVyc2lvbiB7Y3JlYXRlfSAyMDE1LTExLTMwXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICog55So6YCU77ya5Y+q6K6+6K6h55So5LqO5bu26L+f5Yqg6L29XG4gICAgICogQGV4YW1wbGVcbiAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICAvLyBXYWxsLm15dGV4dC5pbml0KDQ1LCBmYWxzZSk7XG4gICAgICAgIC8vIOiwg+eUqO+8mlxuICAgICAgICBTbmlmZmVyLnJ1bih7J2Jhc2UnOndpbmRvdywgJ25hbWUnOidXYWxsLm15dGV4dC5pbml0J30sIDQ1LCBmYWxzZSk7XG4gICAgICAgIC8vIOaIllxuICAgICAgICBTbmlmZmVyLnJ1bih7J2Jhc2UnOldhbGwsICduYW1lJzonbXl0ZXh0LmluaXQnfSwgNDUsIGZhbHNlKTtcbiAgICAgICAgLy8g5aaC5p6c5LiN55+l6YGT5Y+C5pWw55qE5Liq5pWw77yM5LiN6IO955u05o6l5YaZ77yM5Y+v5Lul55SoYXBwbHnnmoTmlrnlvI/osIPnlKjlvZPliY3mlrnms5VcbiAgICAgICAgU25pZmZlci5ydW4uYXBwbHkod2luZG93LCBbIHsnbmFtZSc6J1dhbGwubXl0ZXh0LmluaXQnfSwgNDUsIGZhbHNlIF0pXG4gICAgICAgIGBgYFxuICAgICovXG4gICAgcnVuOiBmdW5jdGlvbiguLi5hcmdzOiBhbnlbXSk6IGFueXtcbiAgICAgICAgcmV0dXJuIHJ1bihsaXN0LCAuLi5hcmdzKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICogQGZ1bmN0aW9uIOinpuWPkeWHveaVsOaOpeWPo++8jOiwg+eUqOW3suaPkOWJjeiuoumYheeahOWHveaVsFxuICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbiAtLSDpnIDopoHosIPnlKjnmoTnm7jlhbPlj4LmlbBcbiAgICAqICAge3N0cmluZ30gb3B0aW9uLm5hbWUgLS0g5pa55rOV6LCD55SoXG4gICAgKiAgIHtvYmplY3R9IG9wdGlvbi5iYXNlIC0tIOWfuueCuSBcbiAgICAqIEBkZXNjcmlwdGlvblxuICAgICogICDnlKjpgJTvvJrlj6rorr7orqHnlKjkuo7lu7bov5/liqDovb1cbiAgICAqICAg5Y+m5aSW77yM6LCD55SodHJpZ2dlcuaWueazleeahOWJjeaPkOaYr++8jOiuoumYheaWueazleaJgOWcqGpz5bey57uP5Yqg6L295bm26Kej5p6Q5a6M5q+VXG4gICAgKiAgIOS4jeeuoeinpuWPkeaIkOWKn+S4juWQpu+8jOmDveS8mua4hemZpGxpc3TkuK3lr7nlupTnmoTpoblcbiAgICAqL1xuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKG9wdGlvbjogVG9wdGlvbik6IGFueXtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXIobGlzdCwgb3B0aW9uKTtcbiAgICB9XG59Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUE7Ozs7O0FBS0Esc0JBQXdCLFFBQWdCLEVBQUUsSUFBWTtJQUNsRCxJQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztJQUNyQixJQUFJLE1BQU0sR0FBWTtRQUNsQixTQUFTLEVBQUUsSUFBSTtRQUNmLE1BQU0sRUFBRSxlQUFNO0tBQ2pCLENBQUM7SUFDRixJQUFJLFVBQVUsQ0FBQztJQUNmLElBQUksQ0FBQyxDQUFDO0lBRU4sSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUM7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0tBQzFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FB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
