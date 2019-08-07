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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tc25pZmZlci5janMuanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jaGVja01ldGhvZC50cyIsIi4uLy4uL3NyYy91dGlscy9ydW4udHMiLCIuLi8uLi9zcmMvdXRpbHMvdHJpZ2dlci50cyIsIi4uLy4uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInR5cGUgVHJlc3VsdCA9IHtcbiAgICBzdWNjZXNzOiBib29sZWFuLFxuICAgIGZ1bmM6IG9iamVjdCB8ICgoLi4uYXJnczogYW55W10pPT5hbnkpXG59O1xuLyoqXG4qIEBmdW5jdGlvbiB7cHJpdmF0ZX0g5qOA5rWL5pa55rOV5piv5ZCm5Y+v55SoXG4qIEBwYXJhbSB7c3RyaW5nfSBmdW5jTmFtZSAtLSDmlrnms5XlkI0qKiouKioqLioqKlxuKiBAcGFyYW0ge29iamVjdH0gYmFzZSAtLSDmlrnms5XmiYDkvp3pmYTnmoTlr7nosaEgXG4qL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZnVuY05hbWU6c3RyaW5nLCBiYXNlOm9iamVjdCk6IFRyZXN1bHR7XG4gICAgY29uc3QgbWV0aG9kTGlzdCA9IGZ1bmNOYW1lLnNwbGl0KCcuJyk7IC8vIOaWueazleWQjWxpc3RcbiAgICBsZXQgcmVhZHlGdW5jID0gYmFzZTsgLy8g5qOA5rWL5ZCI5qC855qE5Ye95pWw6YOo5YiGXG4gICAgbGV0IHJlc3VsdDpUcmVzdWx0ID0ge1xuICAgICAgICAgICAgJ3N1Y2Nlc3MnOiB0cnVlLFxuICAgICAgICAgICAgJ2Z1bmMnOiAoKT0+e31cbiAgICAgICAgfTsgLy8g6L+U5Zue55qE5qOA5rWL57uT5p6cXG4gICAgbGV0IG1ldGhvZE5hbWU7IC8vIOWNleS4quaWueazleWQjVxuICAgIGxldCBpO1xuXG4gICAgaWYodHlwZW9mIGJhc2UgIT09ICdvYmplY3QnKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdiYXNlIGlzIHdyb25nIHR5cGUuJyk7XG4gICAgfVxuICAgIFxuICAgIGZvciAoaSA9IDA7IGkgPCBtZXRob2RMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2RMaXN0W2ldO1xuICAgICAgICBpZih0eXBlb2YgcmVhZHlGdW5jICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICByZXN1bHQuc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfWVsc2UgaWYgKG1ldGhvZE5hbWUgaW4gcmVhZHlGdW5jKSB7XG4gICAgICAgICAgICByZWFkeUZ1bmMgPSByZWFkeUZ1bmNbbWV0aG9kTmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQuc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdC5mdW5jID0gcmVhZHlGdW5jO1xuICAgIHJldHVybiByZXN1bHQ7XG59IiwiaW1wb3J0IGNoZWNrTWV0aG9kIGZyb20gJy4vY2hlY2tNZXRob2QnO1xuaW1wb3J0IHtcbiAgICBUbGlzdCxcbiAgICBUY2FsbGJhY2tGdW5jLFxufSBmcm9tICcuL3R5cGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoXG4gICAgbGlzdDpUbGlzdCxcbiAgICAuLi5hcmdzXG4pIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPCAxIHx8IHR5cGVvZiBhcmdzWzBdICE9ICdvYmplY3QnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU25pZmZlci5ydW4gcGFyYW1ldGVyIGVycm9yJyk7XG4gICAgfVxuXG4gICAgLy8gMOS9jeS4uk9iamVjdOexu+Wei++8jOaWueS+v+WBmuaJqeWxlVxuICAgIGNvbnN0IG5hbWU6c3RyaW5nID0gYXJnc1swXS5uYW1lOyAvLyDlh73mlbDlkI0gXG4gICAgbGV0IHN1YnNjcmliZTpib29sZWFuID0gYXJnc1swXS5zdWJzY3JpYmUgfHwgZmFsc2U7IC8vIOiuoumYheW9k+WHveaVsOWPr+aJp+ihjOaXtu+8jOiwg+eUqOivpeWHveaVsCwgdHJ1ZTrorqLpmIU7IGZhbHNlOuS4jeiuoumYhVxuICAgIGNvbnN0IHByb21wdDpzdHJpbmcgPSBhcmdzWzBdLnByb21wdCB8fCAnJzsgLy8g5piv5ZCm5pi+56S65o+Q56S66K+tKOW9k+WHveaVsOacquiDveaJp+ihjOeahOaXtuWAmSlcbiAgICBjb25zdCBiYXNlOm9iamVjdCA9IGFyZ3NbMF0uYmFzZSB8fCB3aW5kb3c7IC8vIOWfuuWHhuWvueixoe+8jOWHveaVsOafpeaJvueahOi1t+eCuVxuICAgIGNvbnN0IHNob3dQcm9tcHRGbiA9IGFyZ3NbMF0uc2hvd1Byb21wdEZuIHx8IHdpbmRvdy5hbGVydDtcbiAgICBjb25zdCBmdW5jQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpLnNsaWNlKDEpOyAvLyDlh73mlbDnmoTlj4LmlbDliJfooahcbiAgICBsZXQgcmVzdWx0ID0gY2hlY2tNZXRob2QobmFtZSwgYmFzZSk7IC8vIOajgOa1i+e7k+aenFxuXG4gICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIHN1YnNjcmliZSA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQuZnVuYyBhcyBGdW5jdGlvbikuYXBwbHkocmVzdWx0LmZ1bmMsIGZ1bmNBcmdzKTsgLy8gYXBwbHnosIPmlbTlh73mlbDnmoTmjIfpkojmjIflkJFcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgKHR5cGVvZiBjb25zb2xlICE9ICd1bmRlZmluZWQnKSAmJiBjb25zb2xlLmxvZyAmJiBjb25zb2xlLmxvZygn6ZSZ6K+vOm5hbWU9JyArIGUubmFtZSArICc7IG1lc3NhZ2U9JyArIGUubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJvbXB0KSB7XG4gICAgICAgICAgICAvLyDovpPlh7rmj5DnpLror63liLDpobXpnaLvvIzku6PnoIHnlaVcbiAgICAgICAgICAgIHNob3dQcm9tcHRGbihwcm9tcHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy/lsIborqLpmIXnmoTlh73mlbDnvJPlrZjotbfmnaVcbiAgICBpZiAoc3Vic2NyaWJlKSB7XG4gICAgICAgIGxldCBjYWxsYmFja0Z1bmM6VGNhbGxiYWNrRnVuYyA9IHtcbiAgICAgICAgICAgIG5hbWU6ICcnXG4gICAgICAgIH07IC8vIOS4tOaXtuWtmOaUvumcgOimgeWbnuiwg+eahOWHveaVsFxuICAgICAgICBjYWxsYmFja0Z1bmMubmFtZSA9IG5hbWU7XG4gICAgICAgIGNhbGxiYWNrRnVuYy5iYXNlID0gYmFzZTtcbiAgICAgICAgY2FsbGJhY2tGdW5jLmFyZ3MgPSBmdW5jQXJncztcbiAgICAgICAgbGlzdC5wdXNoKGNhbGxiYWNrRnVuYyk7XG4gICAgfVxufTsiLCJpbXBvcnQgY2hlY2tNZXRob2QgZnJvbSAnLi9jaGVja01ldGhvZCdcbmltcG9ydCB7XG4gICAgVGxpc3QsXG4gICAgVG9wdGlvblxufSBmcm9tICcuL3R5cGUnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChsaXN0OiBUbGlzdCwgb3B0aW9uOiBUb3B0aW9uKTp2b2lkIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTbmlmZmVyLnRyaWdnZXIgcGFyYW1ldGVyIGVycm9yJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZnVuY05hbWUgPSBvcHRpb24ubmFtZSB8fCAnJzsgLy8g5Ye95pWw5ZCNXG4gICAgY29uc3QgYmFzZSA9IG9wdGlvbi5iYXNlIHx8IHdpbmRvdzsgLy8g5Z+65YeG5a+56LGh77yM5Ye95pWw5p+l5om+55qE6LW354K5XG4gICAgbGV0IG5ld0xpc3Q6VGxpc3QgPSBbXTsgLy8g55So5LqO5pu05pawbGlzdFxuICAgIGxldCBpOyAvLyDpgY3ljoZsaXN0XG4gICAgbGV0IHBhcmFtOyAvLyDkuLTml7blrZjlgqhsaXN0W2ldXG5cbiAgICBpZiAoZnVuY05hbWUubGVuZ3RoIDwgMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3BhcmFtZXRlciBuYW1lIGlzIHJlcXVpcmUnKTtcbiAgICB9XG5cbiAgICAvLyDpgY3ljoZsaXN077yM5omn6KGM5a+55bqU55qE5Ye95pWw77yM5bm25bCG5YW25LuO57yT5a2Y5rGgbGlzdOS4reWIoOmZpFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHBhcmFtID0gbGlzdFtpXTtcbiAgICAgICAgaWYgKHBhcmFtLm5hbWUgPT0gZnVuY05hbWUpIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBjaGVja01ldGhvZChmdW5jTmFtZSwgYmFzZSk7XG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHJlc3VsdC5mdW5jIGFzIEZ1bmN0aW9uKS5hcHBseShyZXN1bHQuZnVuYywgcGFyYW0uYXJncyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAodHlwZW9mIGNvbnNvbGUgIT0gJ3VuZGVmaW5lZCcpICYmIGNvbnNvbGUubG9nICYmIGNvbnNvbGUubG9nKCfplJnor686bmFtZT0nICsgZS5uYW1lICsgJzsgbWVzc2FnZT0nICsgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdMaXN0LnB1c2gocGFyYW0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGlzdCA9IG5ld0xpc3Q7XG59OyIsImltcG9ydCBydW4gZnJvbSAnLi91dGlscy9ydW4nO1xuaW1wb3J0IHRyaWdnZXIgZnJvbSAnLi91dGlscy90cmlnZ2VyJztcbmltcG9ydCB7XG4gICAgVGxpc3QsXG4gICAgVG9wdGlvblxufSBmcm9tICcuL3V0aWxzL3R5cGUnXG5cbmxldCBsaXN0OlRsaXN0ID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvKipcbiAgICAgKiBAZnVuY3Rpb24g5Ye95pWw6L2s5o2i5o6l5Y+j77yM55So5LqO5Yik5pat5Ye95pWw5piv5ZCm5a2Y5Zyo5ZG95ZCN56m66Ze05Lit77yM5pyJ5YiZ6LCD55So77yM5peg5YiZ5LiN6LCD55SoXG4gICAgICogQHZlcnNpb24ge2NyZWF0ZX0gMjAxNS0xMS0zMFxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIOeUqOmAlO+8muWPquiuvuiuoeeUqOS6juW7tui/n+WKoOi9vVxuICAgICAqIEBleGFtcGxlXG4gICAgICAgIGBgYGphdmFzY3JpcHRcbiAgICAgICAgLy8gV2FsbC5teXRleHQuaW5pdCg0NSwgZmFsc2UpO1xuICAgICAgICAvLyDosIPnlKjvvJpcbiAgICAgICAgU25pZmZlci5ydW4oeydiYXNlJzp3aW5kb3csICduYW1lJzonV2FsbC5teXRleHQuaW5pdCd9LCA0NSwgZmFsc2UpO1xuICAgICAgICAvLyDmiJZcbiAgICAgICAgU25pZmZlci5ydW4oeydiYXNlJzpXYWxsLCAnbmFtZSc6J215dGV4dC5pbml0J30sIDQ1LCBmYWxzZSk7XG4gICAgICAgIC8vIOWmguaenOS4jeefpemBk+WPguaVsOeahOS4quaVsO+8jOS4jeiDveebtOaOpeWGme+8jOWPr+S7peeUqGFwcGx555qE5pa55byP6LCD55So5b2T5YmN5pa55rOVXG4gICAgICAgIFNuaWZmZXIucnVuLmFwcGx5KHdpbmRvdywgWyB7J25hbWUnOidXYWxsLm15dGV4dC5pbml0J30sIDQ1LCBmYWxzZSBdKVxuICAgICAgICBgYGBcbiAgICAqL1xuICAgIHJ1bjogZnVuY3Rpb24oLi4uYXJnczogYW55W10pe1xuICAgICAgICByZXR1cm4gcnVuKGxpc3QsIC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgKiBAZnVuY3Rpb24g6Kem5Y+R5Ye95pWw5o6l5Y+j77yM6LCD55So5bey5o+Q5YmN6K6i6ZiF55qE5Ye95pWwXG4gICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uIC0tIOmcgOimgeiwg+eUqOeahOebuOWFs+WPguaVsFxuICAgICogICB7c3RyaW5nfSBvcHRpb24ubmFtZSAtLSDmlrnms5XosIPnlKhcbiAgICAqICAge29iamVjdH0gb3B0aW9uLmJhc2UgLS0g5Z+654K5IFxuICAgICogQGRlc2NyaXB0aW9uXG4gICAgKiAgIOeUqOmAlO+8muWPquiuvuiuoeeUqOS6juW7tui/n+WKoOi9vVxuICAgICogICDlj6blpJbvvIzosIPnlKh0cmlnZ2Vy5pa55rOV55qE5YmN5o+Q5piv77yM6K6i6ZiF5pa55rOV5omA5ZyoanPlt7Lnu4/liqDovb3lubbop6PmnpDlrozmr5VcbiAgICAqICAg5LiN566h6Kem5Y+R5oiQ5Yqf5LiO5ZCm77yM6YO95Lya5riF6ZmkbGlzdOS4reWvueW6lOeahOmhuVxuICAgICovXG4gICAgdHJpZ2dlcjogZnVuY3Rpb24ob3B0aW9uOiBUb3B0aW9uKXtcbiAgICAgICAgcmV0dXJuIHRyaWdnZXIobGlzdCwgb3B0aW9uKTtcbiAgICB9XG59Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUE7Ozs7O0FBS0Esc0JBQXdCLFFBQWUsRUFBRSxJQUFXO0lBQ2hELElBQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLElBQUksTUFBTSxHQUFXO1FBQ2IsU0FBUyxFQUFFLElBQUk7UUFDZixNQUFNLEVBQUUsZUFBTTtLQUNqQixDQUFDO0lBQ04sSUFBSSxVQUFVLENBQUM7SUFDZixJQUFJLENBQUMsQ0FBQztJQUVOLElBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFDO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztLQUMxQztJQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1B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
