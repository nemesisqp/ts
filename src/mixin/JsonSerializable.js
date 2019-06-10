"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
function JsonSerializable(Base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _super.apply(this, args) || this;
        }
        class_1.prototype.deserialize = function (data) {
            var instanceData = JSON.parse(data.toString('utf8'));
            var keys = Object.keys(this);
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (instanceData.hasOwnProperty(key)) {
                    this[key] = instanceData[key];
                }
            }
        };
        class_1.prototype.serialize = function () {
            var json = this.beautify ? JSON.stringify(this, null, 4) : JSON.stringify(this);
            return Buffer.from(json);
        };
        return class_1;
    }(Base));
}
exports.JsonSerializable = JsonSerializable;
