export type TcallbackFunc = {
    name: string,
    base?: object,
    args?: Array<any>
};

export type Tlist = Array<TcallbackFunc>;

export type Toption = {
    name: string,
    base?: object
};