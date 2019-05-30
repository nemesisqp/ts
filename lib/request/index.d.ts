import * as NodeRequest from 'request';
interface ExtendOptions {
    disableHttp2?: boolean;
    forceIpv6?: boolean;
}
interface TsRequestOptions extends NodeRequest.CoreOptions, ExtendOptions {
}
interface TsRequestWithUrlOptions extends NodeRequest.OptionsWithUrl, ExtendOptions {
}
declare type TsRequestAsyncReturn = Promise<{
    resp: NodeRequest.Response;
    body: any;
}>;
export declare function request(opts: TsRequestWithUrlOptions, callback: NodeRequest.RequestCallback): NodeRequest.Request;
export declare function request(url: string, opts: TsRequestOptions, callback: NodeRequest.RequestCallback): NodeRequest.Request;
export declare function requestAsync(opts: TsRequestWithUrlOptions): TsRequestAsyncReturn;
export declare function requestAsync(url: string, opts: TsRequestOptions): TsRequestAsyncReturn;
export {};
