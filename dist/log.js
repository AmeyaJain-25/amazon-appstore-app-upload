"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
exports.logMessage = logMessage;
var core = __importStar(require("@actions/core"));
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
            if (core.isDebug() &&
                (options.error instanceof Error || options.error !== undefined)) {
                core.error(options.error);
            }
            core.setFailed(message);
            break;
        case LogLevel.INFO:
            core.info(message);
            if (core.isDebug() && options.data !== undefined) {
                core.info(JSON.stringify(options.data));
            }
            break;
        case LogLevel.WARNING:
            core.warning(message);
            if (core.isDebug() && options.data !== undefined) {
                core.warning(JSON.stringify(options.data));
            }
            break;
        default:
            if (core.isDebug() &&
                (options.error instanceof Error || options.error !== undefined)) {
                core.error(options.error);
            }
            core.error(message);
            break;
    }
}
//# sourceMappingURL=log.js.map