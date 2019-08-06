declare type Tresult = {
    success: boolean;
    func: object | ((...args: any[]) => any);
};
/**
* @function {private} 检测方法是否可用
* @param {string} funcName -- 方法名***.***.***
* @param {object} base -- 方法所依附的对象
*/
export default function (funcName: string, base: object): Tresult;
export {};
