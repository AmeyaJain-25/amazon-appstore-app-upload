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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = __importStar(require("@actions/core"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var fs_1 = __importDefault(require("fs"));
var log_1 = require("./log");
var constants_1 = require("./constants");
function getInputs() {
    var clientId = core.getInput("client_id", {
        required: true,
    });
    var clientSecret = core.getInput("client_secret", {
        required: true,
    });
    var appId = core.getInput("app_id", {
        required: true,
    });
    var apkReleaseFilePath = core.getInput("apk_release_file", {
        required: true,
    });
    if (!apkReleaseFilePath.endsWith(".apk")) {
        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "The file at path \"".concat(apkReleaseFilePath, "\" is not an APK file."));
        return null;
    }
    if (!fs_1.default.existsSync(apkReleaseFilePath)) {
        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "The APK file at path \"".concat(apkReleaseFilePath, "\" does not exist."));
        return null;
    }
    return {
        clientId: clientId,
        clientSecret: clientSecret,
        appId: appId,
        apkReleaseFilePath: apkReleaseFilePath,
    };
}
function authenticateWithAmazonAppstore(clientId, clientSecret) {
    return __awaiter(this, void 0, void 0, function () {
        var authResponse, authData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, node_fetch_1.default)(constants_1.AMAZON_AUTH_URL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({
                                grant_type: "client_credentials",
                                client_id: clientId,
                                client_secret: clientSecret,
                                scope: "appstore::apps:readwrite",
                            }),
                        })];
                case 1:
                    authResponse = _a.sent();
                    return [4 /*yield*/, authResponse.json()];
                case 2:
                    authData = (_a.sent());
                    if (!authResponse.ok) {
                        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Failed to authenticate with Amazon Appstore: [".concat(authData.error, "]: ").concat(authData.error_description), {
                            error: authData,
                        });
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, authData.access_token];
                case 3:
                    error_1 = _a.sent();
                    (0, log_1.logMessage)(log_1.LogLevel.FAILED, error_1.message, {
                        error: error_1,
                    });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function checkForExistingOpenEdits(accessToken, appId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(constants_1.AMAZON_APPSTORE_API_BASE_URL, "/").concat(constants_1.AMAZON_APPSTORE_API_VERSION, "/applications/").concat(appId, "/edits"), {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Failed to check for existing open edits: ".concat(response.statusText), {
                            error: response,
                        });
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    return [2 /*return*/, data];
                case 3:
                    error_2 = _a.sent();
                    (0, log_1.logMessage)(log_1.LogLevel.FAILED, error_2.message, {
                        error: error_2,
                    });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function createNewEdit(accessToken, appId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(constants_1.AMAZON_APPSTORE_API_BASE_URL, "/").concat(constants_1.AMAZON_APPSTORE_API_VERSION, "/applications/").concat(appId, "/edits"), {
                            method: "POST",
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Failed to create a new edit: ".concat(response.statusText), {
                            error: response,
                        });
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    return [2 /*return*/, data];
                case 3:
                    error_3 = _a.sent();
                    (0, log_1.logMessage)(log_1.LogLevel.FAILED, error_3.message, {
                        error: error_3,
                    });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getLatestApk(accessToken, appId, editId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, latestApk, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(constants_1.AMAZON_APPSTORE_API_BASE_URL, "/").concat(constants_1.AMAZON_APPSTORE_API_VERSION, "/applications/").concat(appId, "/edits/").concat(editId, "/apks"), {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Failed to get the latest APK: ".concat(response.statusText), {
                            error: response,
                        });
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    latestApk = data.sort(function (a, b) { return b.versionCode - a.versionCode; })[0];
                    return [2 /*return*/, latestApk];
                case 3:
                    error_4 = _a.sent();
                    (0, log_1.logMessage)(log_1.LogLevel.FAILED, error_4.message, {
                        error: error_4,
                    });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getETagForApk(accessToken, appId, editId, apkId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(constants_1.AMAZON_APPSTORE_API_BASE_URL, "/").concat(constants_1.AMAZON_APPSTORE_API_VERSION, "/applications/").concat(appId, "/edits/").concat(editId, "/apks/").concat(apkId), {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Failed to get the ETag for the APK: ".concat(response.statusText), {
                            error: response,
                        });
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, response.headers.get("ETag")];
                case 2:
                    error_5 = _a.sent();
                    (0, log_1.logMessage)(log_1.LogLevel.FAILED, error_5.message, {
                        error: error_5,
                    });
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function replaceApk(accessToken, appId, editId, apkId, eTag, apkReleaseFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileBuffer, response, data, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    fileBuffer = fs_1.default.readFileSync(apkReleaseFilePath);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(constants_1.AMAZON_APPSTORE_API_BASE_URL, "/").concat(constants_1.AMAZON_APPSTORE_API_VERSION, "/applications/").concat(appId, "/edits/").concat(editId, "/apks/").concat(apkId, "/replace"), {
                            method: "PUT",
                            headers: {
                                Authorization: "Bearer ".concat(accessToken),
                                "If-Match": eTag,
                                "Content-Type": "application/octet-stream",
                            },
                            body: fileBuffer,
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Failed to replace the APK: ".concat(response.statusText), {
                            error: response,
                        });
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    return [2 /*return*/, data];
                case 3:
                    error_6 = _a.sent();
                    (0, log_1.logMessage)(log_1.LogLevel.FAILED, error_6.message, {
                        error: error_6,
                    });
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function uploadAppToAmazonAppstore() {
    return __awaiter(this, void 0, void 0, function () {
        var inputs, clientId, clientSecret, appId, apkReleaseFilePath, accessToken, activeEdit, editId, newEdit, latestApk, eTag, uploadedApk, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "Starting Amazon Appstore app upload process...");
                    inputs = getInputs();
                    if (!inputs) {
                        return [2 /*return*/];
                    }
                    clientId = inputs.clientId, clientSecret = inputs.clientSecret, appId = inputs.appId, apkReleaseFilePath = inputs.apkReleaseFilePath;
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "Authenticating with Amazon Appstore...");
                    return [4 /*yield*/, authenticateWithAmazonAppstore(clientId, clientSecret)];
                case 1:
                    accessToken = _a.sent();
                    if (!accessToken) {
                        return [2 /*return*/];
                    }
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "Authenticated successfully with Amazon Appstore. Checking for existing open edits...");
                    return [4 /*yield*/, checkForExistingOpenEdits(accessToken, appId)];
                case 2:
                    activeEdit = _a.sent();
                    editId = null;
                    if (activeEdit === null) {
                        return [2 /*return*/];
                    }
                    if (!(JSON.stringify(activeEdit) !== "{}" && (activeEdit === null || activeEdit === void 0 ? void 0 : activeEdit.id))) return [3 /*break*/, 3];
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "Found an existing open edit with ID: ".concat(activeEdit.id, ". Using this edit to upload the app..."), {
                        data: activeEdit,
                    });
                    editId = activeEdit.id;
                    return [3 /*break*/, 5];
                case 3:
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "No existing open edit found. Creating a new edit...");
                    return [4 /*yield*/, createNewEdit(accessToken, appId)];
                case 4:
                    newEdit = _a.sent();
                    if (newEdit === null) {
                        return [2 /*return*/];
                    }
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "Created a new edit with ID: ".concat(newEdit.id, ". Using this edit to upload the app..."), {
                        data: newEdit,
                    });
                    editId = newEdit.id;
                    _a.label = 5;
                case 5:
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "Finding the latest APK file to replace...");
                    return [4 /*yield*/, getLatestApk(accessToken, appId, editId)];
                case 6:
                    latestApk = _a.sent();
                    if (latestApk === null) {
                        return [2 /*return*/];
                    }
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "Found the latest APK - ".concat(latestApk.name, " (ID: ").concat(latestApk.id, ") with version code: ").concat(latestApk.versionCode, ". Uploading the new APK..."), {
                        data: latestApk,
                    });
                    return [4 /*yield*/, getETagForApk(accessToken, appId, editId, latestApk.id)];
                case 7:
                    eTag = _a.sent();
                    if (!eTag) {
                        return [2 /*return*/];
                    }
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "Uploading new apk to Amazon Appstore...");
                    return [4 /*yield*/, replaceApk(accessToken, appId, editId, latestApk.id, eTag, apkReleaseFilePath)];
                case 8:
                    uploadedApk = _a.sent();
                    if (!uploadedApk) {
                        return [2 /*return*/];
                    }
                    (0, log_1.logMessage)(log_1.LogLevel.INFO, "APK uploaded successfully with version code: ".concat(uploadedApk.versionCode, " and ID: ").concat(uploadedApk.id), {
                        data: uploadedApk,
                    });
                    return [3 /*break*/, 10];
                case 9:
                    error_7 = _a.sent();
                    (0, log_1.logMessage)(log_1.LogLevel.FAILED, error_7.message, {
                        error: error_7,
                    });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
uploadAppToAmazonAppstore();
//# sourceMappingURL=index.js.map