interface Tresult{
    success: boolean;
    func: object | ((...args: any[]) => any);
}
/**
* @function {private} 检测方法是否可用
* @param {string} funcName -- 方法名***.***.***
* @param {object} base -- 方法所依附的对象 
*/
export default function(funcName: string, base: object): Tresult{
    const methodList = funcName.split('.'); // 方法名list
    let readyFunc = base; // 检测合格的函数部分
    let result: Tresult = {
        'success': true,
        'func': ()=>{}
    }; // 返回的检测结果
    let methodName; // 单个方法名
    let i;

    if(typeof base !== 'object'){
        throw new Error('base is wrong type.');
    }
    
    for (i = 0; i < methodList.length; i++) {
        methodName = methodList[i];
        if(typeof readyFunc !== 'object'){
            result.success = false;
            return result;
        }else if (methodName in readyFunc) {
            readyFunc = readyFunc[methodName];
        } else {
            result.success = false;
            return result;
        }
    }

    result.func = readyFunc;
    return result;
}