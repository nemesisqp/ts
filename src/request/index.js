"use strict";
exports.__esModule = true;
// source from https://github.com/hisco/http2-request
var NodeRequest = require("request");
// @ts-ignore
var Request = NodeRequest.Request;
var http2Client = require('./http2-client/index');
var http = http2Client.http;
var https = http2Client.https;
var initBefore = Request.prototype.init;
function init(options) {
    if (options) {
        if (options.disableHttp2) {
            this.disableHttp2 = true;
        }
        if (options.forceIpv6) {
            this.forceIpv6 = false;
        }
    }
    var ret = initBefore.call(this, options);
    // @ts-ignore
    patchAgent(this, this.agent);
    return ret;
}
function patchAgent(config, agent) {
    if (agent.patched)
        return;
    var originalGetName = agent.getName;
    agent.getName = function (opts) {
        if (config.forceIpv6)
            opts.family = 6;
        return originalGetName(opts);
    };
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
            get: function () {
                return this._httpModule;
            },
            set: function (v) {
                var selectedProtocol = v && v.globalAgent && v.globalAgent.protocol;
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
        return new Promise(function (resolve, reject) {
            NodeRequest(arg1, arg2, function (err, resp, body) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ body: body, resp: resp });
                }
            });
        });
    }
    else {
        return new Promise(function (resolve, reject) {
            NodeRequest(arg1, function (err, resp, body) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({ body: body, resp: resp });
                }
            });
        });
    }
}
exports.requestAsync = requestAsync;
