import checkMethod from './checkMethod'
import {
    Tlist,
    Toption
} from './type'

export default function (list: Tlist, option: Toption): void {
    if (typeof option !== 'object') {
        throw new Error('Sniffer.trigger parameter error');
    }

    const funcName = option.name || ''; // 函数名
    const base = option.base || window; // 基准对象，函数查找的起点
    let newList: Tlist = []; // 用于更新list
    let i; // 遍历list
    let param; // 临时存储list[i]

    if (funcName.length < 1) {
        throw new Error('parameter name is require');
    }

    // 遍历list，执行对应的函数，并将其从缓存池list中删除
    for (i = 0; i < list.length; i++) {
        param = list[i];
        if (param.name == funcName) {
            let result = checkMethod(funcName, base);
            if (result.success) {
                try {
                    return (result.func as Function).apply(result.func, param.args);
                } catch (e) {
                    (typeof console != 'undefined') && console.log && console.log('错误:name=' + e.name + '; message=' + e.message);
                }
            }
        } else {
            newList.push(param);
        }
    }

    list = newList;
}