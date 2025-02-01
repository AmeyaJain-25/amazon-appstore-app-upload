"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
exports.logMessage = logMessage;
var core_1 = __importDefault(require("@actions/core"));
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["FAILED"] = "failed";
    LogLevel["INFO"] = "info";
    LogLevel["WARNING"] = "warning";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
function logMessage(level, message, options) {
    if (options === void 0) { options = {
        data: undefined,
        error: undefined,
    }; }
    switch (level) {
        case LogLevel.FAILED:
            if (core_1.default.isDebug()) {
                if (options.error instanceof Error || options.error !== undefined) {
                    core_1.default.error(options.error);
                }
            }
            core_1.default.setFailed(message);
            break;
        case LogLevel.INFO:
            core_1.default.info(message);
            if (options.data !== undefined) {
                core_1.default.info(JSON.stringify(options.data));
            }
            break;
        case LogLevel.WARNING:
            core_1.default.warning(message);
            break;
        default:
            if (core_1.default.isDebug()) {
                if (options.error instanceof Error || options.error !== undefined) {
                    core_1.default.error(options.error);
                }
            }
            core_1.default.error(message);
            break;
    }
}
//# sourceMappingURL=log.js.map