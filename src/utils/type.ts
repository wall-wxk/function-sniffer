export interface TcallbackFunc{
    name: string;
    base?: object;
    args?: any[];
}

export type Tlist = TcallbackFunc[];

export interface Toption{
    name: string;
    base?: object;
}