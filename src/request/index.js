"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeRequest = require("request");
const Request = NodeRequest.Request;
const http2Client = require('./http2-client/index');
const http = http2Client.http;
const https = http2Client.https;
const initBefore = Request.prototype.init;
function init(options) {
    if (options) {
        if (options.disableHttp2) {
            this.disableHttp2 = true;
        }
        if (options.forceIpv6) {
            this.forceIpv6 = false;
        }
    }
    const ret = initBefore.call(this, options);
    patchAgent(this, this.agent);
    return ret;
}
function patchAgent(config, agent) {
    if (agent.patched)
        return;
    const originalGetName = agent.getName;
    agent.getName = function (opts) {
        if (config.forceIpv6)
            opts.family = 6;
        return originalGetName(opts);
    };
}
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
                }
                else if (selectedProtocol == 'https:') {
                    this._httpModule = https;
                }
                else if (selectedProtocol == 'http:') {
                    this._httpModule = http;
                }
                else {
                    this._httpModule = v;
                }
            }
        }
    });
}
function request(arg1, arg2, arg3) {
    if (typeof arg1 === 'string') {
        return NodeRequest(arg1, arg2, arg3);
    }
    else {
        return NodeRequest(arg1, arg2);
    }
}
exports.request = request;
function requestAsync(arg1, arg2) {
    if (typeof arg1 === 'string') {
        return new Promise((resolve, reject) => {
            NodeRequest(arg1, arg2, (err, resp, body) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ body, resp });
                }
            });
        });
    }
    else {
        return new Promise((resolve, reject) => {
            NodeRequest(arg1, (err, resp, body) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ body, resp });
                }
            });
        });
    }
}
exports.requestAsync = requestAsync;
//# sourceMappingURL=index.js.map