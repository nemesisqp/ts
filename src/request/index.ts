// source from https://github.com/hisco/http2-request
import * as NodeRequest from 'request';
// @ts-ignore
const Request = NodeRequest.Request;
const http2Client = require('./http2-client/index');
const http = http2Client.http;
const https = http2Client.https;
const initBefore = Request.prototype.init;

interface ExtendOptions {
    disableHttp2?: boolean,
    forceIpv6?: boolean,
}

type TsRequest = Request & ExtendOptions;

interface TsRequestOptions extends NodeRequest.CoreOptions, ExtendOptions {
}

interface TsRequestWithUrlOptions extends NodeRequest.OptionsWithUrl, ExtendOptions {
}

type TsRequestAsyncReturn = Promise<{ resp: NodeRequest.Response, body: any }>

function init(this: TsRequest, options: any) {
    if (options) {
        if (options.disableHttp2) {
            this.disableHttp2 = true;
        }
        if (options.forceIpv6) {
            this.forceIpv6 = false;
        }
    }
    const ret = initBefore.call(this, options);
    // @ts-ignore
    patchAgent(this, this.agent);
    return ret;
}

function patchAgent(config: any, agent: any) {
    if (agent.patched) return;
    const originalGetName = agent.getName;
    agent.getName = function (opts: any) {
        if (config.forceIpv6)
            opts.family = 6;
        return originalGetName(opts);
    }
}

/*
When unit testing third party modules are not re-required while code is,
Therefore, we need to make sure we don't re-patch the request module.
*/
init.http2Patched = true;
if (!Request.prototype.init.http2Patched) {
    Request.prototype.init = init;
    Object.defineProperties(Request.prototype, {
        httpModule: {
            get() {
                return this._httpModule;
            },
            set(v) {
                const selectedProtocol = v && v.globalAgent && v.globalAgent.protocol;

                if (this.disableHttp2) {
                    this._httpModule = v;
                } else if (selectedProtocol == 'https:') {
                    this._httpModule = https;
                } else if (selectedProtocol == 'http:') {
                    this._httpModule = http;
                } else {
                    this._httpModule = v;
                }
            }
        }
    })
}


export function request(opts: TsRequestWithUrlOptions, callback: NodeRequest.RequestCallback): NodeRequest.Request;
export function request(url: string, opts: TsRequestOptions, callback: NodeRequest.RequestCallback): NodeRequest.Request;
export function request(arg1: string | TsRequestWithUrlOptions,
                        arg2: NodeRequest.CoreOptions | NodeRequest.RequestCallback,
                        arg3?: NodeRequest.RequestCallback): NodeRequest.Request {
    if (typeof arg1 === 'string') {
        return NodeRequest(arg1, <NodeRequest.CoreOptions>arg2, arg3);
    } else {
        return NodeRequest(<NodeRequest.OptionsWithUrl>arg1, <NodeRequest.RequestCallback>arg2);
    }
}

export function requestAsync(opts: TsRequestWithUrlOptions): TsRequestAsyncReturn;
export function requestAsync(url: string, opts: TsRequestOptions): TsRequestAsyncReturn;
export function requestAsync(arg1: string | TsRequestWithUrlOptions,
                             arg2?: NodeRequest.CoreOptions | NodeRequest.RequestCallback): TsRequestAsyncReturn {
    if (typeof arg1 === 'string') {
        return new Promise((resolve, reject) => {
            NodeRequest(arg1, <NodeRequest.CoreOptions>arg2, (err, resp, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({body, resp});
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            NodeRequest(<NodeRequest.OptionsWithUrl>arg1, (err, resp, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({body, resp});
                }
            });
        });
    }
}
