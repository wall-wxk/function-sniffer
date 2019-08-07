import run from './utils/run';
import trigger from './utils/trigger';
import {
    Tlist,
    Toption
} from './utils/type'

let list:Tlist = [];

export default {
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
    run: function(...args: any[]){
        return run(list, ...args);
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
    trigger: function(option: Toption){
        return trigger(list, option);
    }
}