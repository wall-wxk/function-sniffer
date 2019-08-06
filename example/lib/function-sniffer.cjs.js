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

module.exports = main;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tc25pZmZlci5janMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jaGVja01ldGhvZC50cyIsIi4uLy4uL3NyYy91dGlscy9ydW4udHMiLCIuLi8uLi9zcmMvdXRpbHMvdHJpZ2dlci50cyIsIi4uLy4uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInR5cGUgVHJlc3VsdCA9IHtcbiAgICBzdWNjZXNzOiBib29sZWFuLFxuICAgIGZ1bmM6IG9iamVjdCB8ICgoLi4uYXJnczogYW55W10pPT5hbnkpXG59O1xuLyoqXG4qIEBmdW5jdGlvbiB7cHJpdmF0ZX0g5qOA5rWL5pa55rOV5piv5ZCm5Y+v55SoXG4qIEBwYXJhbSB7c3RyaW5nfSBmdW5jTmFtZSAtLSDmlrnms5XlkI0qKiouKioqLioqKlxuKiBAcGFyYW0ge29iamVjdH0gYmFzZSAtLSDmlrnms5XmiYDkvp3pmYTnmoTlr7nosaEgXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZnVuY05hbWU6c3RyaW5nLCBiYXNlOm9iamVjdCk6IFRyZXN1bHR7XG4gICAgY29uc3QgbWV0aG9kTGlzdCA9IGZ1bmNOYW1lLnNwbGl0KCcuJyk7IC8vIOaWueazleWQjWxpc3RcbiAgICBsZXQgcmVhZHlGdW5jID0gYmFzZTsgLy8g5qOA5rWL5ZCI5qC855qE5Ye95pWw6YOo5YiGXG4gICAgbGV0IHJlc3VsdDpUcmVzdWx0ID0ge1xuICAgICAgICAgICAgJ3N1Y2Nlc3MnOiB0cnVlLFxuICAgICAgICAgICAgJ2Z1bmMnOiAoKT0+e31cbiAgICAgICAgfTsgLy8g6L+U5Zue55qE5qOA5rWL57uT5p6cXG4gICAgbGV0IG1ldGhvZE5hbWU7IC8vIOWNleS4quaWueazleWQjVxuICAgIGxldCBpO1xuXG4gICAgaWYodHlwZW9mIGJhc2UgIT09ICdvYmplY3QnKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdiYXNlIGlzIHdyb25nIHR5cGUuJyk7XG4gICAgfVxuICAgIFxuICAgIGZvciAoaSA9IDA7IGkgPCBtZXRob2RMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2RMaXN0W2ldO1xuICAgICAgICBpZih0eXBlb2YgcmVhZHlGdW5jICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICByZXN1bHQuc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfWVsc2UgaWYgKG1ldGhvZE5hbWUgaW4gcmVhZHlGdW5jKSB7XG4gICAgICAgICAgICByZWFkeUZ1bmMgPSByZWFkeUZ1bmNbbWV0aG9kTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQuc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdC5mdW5jID0gcmVhZHlGdW5jO1xuICAgIHJldHVybiByZXN1bHQ7XG59IiwiaW1wb3J0IGNoZWNrTWV0aG9kIGZyb20gJy4vY2hlY2tNZXRob2QnO1xuaW1wb3J0IHtcbiAgICBUbGlzdCxcbiAgICBUY2FsbGJhY2tGdW5jLFxufSBmcm9tICcuL3R5cGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoXG4gICAgbGlzdDpUbGlzdCxcbiAgICAuLi5hcmdzXG4pIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPCAxIHx8IHR5cGVvZiBhcmdzWzBdICE9ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU25pZmZlci5ydW4gcGFyYW1ldGVyIGVycm9yJyk7XG4gICAgfVxuXG4gICAgLy8gMOS9jeS4uk9iamVjdOexu+Wei++8jOaWueS+v+WBmuaJqeWxlVxuICAgIGNvbnN0IG5hbWU6c3RyaW5nID0gYXJnc1swXS5uYW1lOyAvLyDlh73mlbDlkI0gXG4gICAgbGV0IHN1YnNjcmliZTpib29sZWFuID0gYXJnc1swXS5zdWJzY3JpYmUgfHwgZmFsc2U7IC8vIOiuoumYheW9k+WHveaVsOWPr+aJp+ihjOaXtu+8jOiwg+eUqOivpeWHveaVsCwgdHJ1ZTrorqLpmIU7IGZhbHNlOuS4jeiuoumYhVxuICAgIGNvbnN0IHByb21wdDpzdHJpbmcgPSBhcmdzWzBdLnByb21wdCB8fCAnJzsgLy8g5piv5ZCm5pi+56S65o+Q56S66K+tKOW9k+WHveaVsOacquiDveaJp+ihjOeahOaXtuWAmSlcbiAgICBjb25zdCBiYXNlOm9iamVjdCA9IGFyZ3NbMF0uYmFzZSB8fCB3aW5kb3c7IC8vIOWfuuWHhuWvueixoe+8jOWHveaVsOafpeaJvueahOi1t+eCuVxuICAgIGNvbnN0IHNob3dQcm9tcHRGbiA9IGFyZ3NbMF0uc2hvd1Byb21wdEZuIHx8IHdpbmRvdy5hbGVydDtcbiAgICBjb25zdCBmdW5jQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLnNsaWNlKDEpOyAvLyDlh73mlbDnmoTlj4LmlbDliJfooahcbiAgICBsZXQgcmVzdWx0ID0gY2hlY2tNZXRob2QobmFtZSwgYmFzZSk7IC8vIOajgOa1i+e7k+aenFxuXG4gICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHN1YnNjcmliZSA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQuZnVuYyBhcyBGdW5jdGlvbikuYXBwbHkocmVzdWx0LmZ1bmMsIGZ1bmNBcmdzKTsgLy8gYXBwbHnosIPmlbTlh73mlbDnmoTmjIfpkojmjIflkJFcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgKHR5cGVvZiBjb25zb2xlICE9ICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLmxvZyAmJiBjb25zb2xlLmxvZygn6ZSZ6K+vOm5hbWU9JyArIGUubmFtZSArICc7IG1lc3NhZ2U9JyArIGUubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJvbXB0KSB7XG4gICAgICAgICAgICAvLyDovpPlh7rmj5DnpLror63liLDpobXpnaLvvIzku6PnoIHnlaVcbiAgICAgICAgICAgIHNob3dQcm9tcHRGbihwcm9tcHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy/lsIborqLpmIXnmoTlh73mlbDnvJPlrZjotbfmnaVcbiAgICBpZiAoc3Vic2NyaWJlKSB7XG4gICAgICAgIGxldCBjYWxsYmFja0Z1bmM6VGNhbGxiYWNrRnVuYyA9IHtcbiAgICAgICAgICAgIG5hbWU6ICcnXG4gICAgICAgIH07IC8vIOS4tOaXtuWtmOaUvumcgOimgeWbnuiwg+eahOWHveaVsFxuICAgICAgICBjYWxsYmFja0Z1bmMubmFtZSA9IG5hbWU7XG4gICAgICAgIGNhbGxiYWNrRnVuYy5iYXNlID0gYmFzZTtcbiAgICAgICAgY2FsbGJhY2tGdW5jLmFyZ3MgPSBmdW5jQXJncztcbiAgICAgICAgbGlzdC5wdXNoKGNhbGxiYWNrRnVuYyk7XG4gICAgfVxufTsiLCJpbXBvcnQgY2hlY2tNZXRob2QgZnJvbSAnLi9jaGVja01ldGhvZCdcbmltcG9ydCB7XG4gICAgVGxpc3Rcbn0gZnJvbSAnLi90eXBlJ1xuXG50eXBlIFRvcHRpb24gPSB7XG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGJhc2U6IG9iamVjdFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGxpc3Q6IFRsaXN0LCBvcHRpb246IFRvcHRpb24pOnZvaWQge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uICE9PSAnb2JqZWN0Jykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NuaWZmZXIudHJpZ2dlciBwYXJhbWV0ZXIgZXJyb3InKTtcbiAgICB9XG5cbiAgICBjb25zdCBmdW5jTmFtZSA9IG9wdGlvbi5uYW1lIHx8ICcnOyAvLyDlh73mlbDlkI1cbiAgICBjb25zdCBiYXNlID0gb3B0aW9uLmJhc2UgfHwgd2luZG93OyAvLyDln7rlh4blr7nosaHvvIzlh73mlbDmn6Xmib7nmoTotbfngrlcbiAgICBsZXQgbmV3TGlzdDpUbGlzdCA9IFtdOyAvLyDnlKjkuo7mm7TmlrBsaXN0XG4gICAgbGV0IGk7IC8vIOmBjeWOhmxpc3RcbiAgICBsZXQgcGFyYW07IC8vIOS4tOaXtuWtmOWCqGxpc3RbaV1cblxuICAgIGlmIChmdW5jTmFtZS5sZW5ndGggPCAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigncGFyYW1ldGVyIG5hbWUgaXMgcmVxdWlyZScpO1xuICAgIH1cblxuICAgIC8vIOmBjeWOhmxpc3TvvIzmiafooYzlr7nlupTnmoTlh73mlbDvvIzlubblsIblhbbku47nvJPlrZjmsaBsaXN05Lit5Yig6ZmkXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGFyYW0gPSBsaXN0W2ldO1xuICAgICAgICBpZiAocGFyYW0ubmFtZSA9PSBmdW5jTmFtZSkge1xuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGNoZWNrTWV0aG9kKGZ1bmNOYW1lLCBiYXNlKTtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAocmVzdWx0LmZ1bmMgYXMgRnVuY3Rpb24pLmFwcGx5KHJlc3VsdC5mdW5jLCBwYXJhbS5hcmdzKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICh0eXBlb2YgY29uc29sZSAhPSAndW5kZWZpbmVkJykgJiYgY29uc29sZS5sb2cgJiYgY29uc29sZS5sb2coJ+mUmeivrzpuYW1lPScgKyBlLm5hbWUgKyAnOyBtZXNzYWdlPScgKyBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ld0xpc3QucHVzaChwYXJhbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsaXN0ID0gbmV3TGlzdDtcbn07IiwiaW1wb3J0IHJ1biBmcm9tICcuL3V0aWxzL3J1bic7XG5pbXBvcnQgdHJpZ2dlciBmcm9tICcuL3V0aWxzL3RyaWdnZXInO1xuaW1wb3J0IHtcbiAgICBUbGlzdFxufSBmcm9tICcuL3V0aWxzL3R5cGUnXG5cbmxldCBsaXN0OlRsaXN0ID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24g5Ye95pWw6L2s5o2i5o6l5Y+j77yM55So5LqO5Yik5pat5Ye95pWw5piv5ZCm5a2Y5Zyo5ZG95ZCN56m66Ze05Lit77yM5pyJ5YiZ6LCD55So77yM5peg5YiZ5LiN6LCD55SoXG4gICAgICogQHZlcnNpb24ge2NyZWF0ZX0gMjAxNS0xMS0zMFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOeUqOmAlO+8muWPquiuvuiuoeeUqOS6juW7tui/n+WKoOi9vVxuICAgICAqIEBleGFtcGxlXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgLy8gV2FsbC5teXRleHQuaW5pdCg0NSwgZmFsc2UpO1xuICAgICAgICAvLyDosIPnlKjvvJpcbiAgICAgICAgU25pZmZlci5ydW4oeydiYXNlJzp3aW5kb3csICduYW1lJzonV2FsbC5teXRleHQuaW5pdCd9LCA0NSwgZmFsc2UpO1xuICAgICAgICAvLyDmiJZcbiAgICAgICAgU25pZmZlci5ydW4oeydiYXNlJzpXYWxsLCAnbmFtZSc6J215dGV4dC5pbml0J30sIDQ1LCBmYWxzZSk7XG4gICAgICAgIC8vIOWmguaenOS4jeefpemBk+WPguaVsOeahOS4quaVsO+8jOS4jeiDveebtOaOpeWGme+8jOWPr+S7peeUqGFwcGx555qE5pa55byP6LCD55So5b2T5YmN5pa55rOVXG4gICAgICAgIFNuaWZmZXIucnVuLmFwcGx5KHdpbmRvdywgWyB7J25hbWUnOidXYWxsLm15dGV4dC5pbml0J30sIDQ1LCBmYWxzZSBdKVxuICAgICAgICBgYGBcbiAgICAqL1xuICAgIHJ1bjogZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiBydW4obGlzdCwgLi4uYXJncyk7XG4gICAgfSxcbiAgICAvKipcbiAgICAqIEBmdW5jdGlvbiDop6blj5Hlh73mlbDmjqXlj6PvvIzosIPnlKjlt7Lmj5DliY3orqLpmIXnmoTlh73mlbBcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb24gLS0g6ZyA6KaB6LCD55So55qE55u45YWz5Y+C5pWwXG4gICAgKiAgIHtzdHJpbmd9IG9wdGlvbi5uYW1lIC0tIOaWueazleiwg+eUqFxuICAgICogICB7b2JqZWN0fSBvcHRpb24uYmFzZSAtLSDln7rngrkgXG4gICAgKiBAZGVzY3JpcHRpb25cbiAgICAqICAg55So6YCU77ya5Y+q6K6+6K6h55So5LqO5bu26L+f5Yqg6L29XG4gICAgKiAgIOWPpuWklu+8jOiwg+eUqHRyaWdnZXLmlrnms5XnmoTliY3mj5DmmK/vvIzorqLpmIXmlrnms5XmiYDlnKhqc+W3sue7j+WKoOi9veW5tuino+aekOWujOavlVxuICAgICogICDkuI3nrqHop6blj5HmiJDlip/kuI7lkKbvvIzpg73kvJrmuIXpmaRsaXN05Lit5a+55bqU55qE6aG5XG4gICAgKi9cbiAgICB0cmlnZ2VyOiBmdW5jdGlvbihvcHRpb24pe1xuICAgICAgICByZXR1cm4gdHJpZ2dlcihsaXN0LCBvcHRpb24pO1xuICAgIH1cbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQTs7Ozs7QUFLQSxzQkFBd0IsUUFBZSxFQUFFLElBQVc7SUFDaEQsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDckIsSUFBSSxNQUFNLEdBQVc7UUFDYixTQUFTLEVBQUUsSUFBSTtRQUNmLE1BQU0sRUFBRSxlQUFNO0tBQ2pCLENBQUM7SUFDTixJQUFJLFVBQVUsQ0FBQztJQUNmLElBQUksQ0FBQyxDQUFDO0lBRU4sSUFBRyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUM7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFB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
