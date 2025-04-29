export interface FeatherCallOptions {
    url: string;
    method: 'GET' | 'POST';
    data?: any;
    headers?: Record<string, string>;
}
export interface FeatherCallResponse<T = any> {
    status: number;
    data: T;
    headers: Record<string, string>;
}
export declare class FeatherError extends Error {
    status: number;
    data: any;
    constructor(status: number, data: any);
}
export declare function call<T = any>(opts: FeatherCallOptions): Promise<FeatherCallResponse<T>>;
