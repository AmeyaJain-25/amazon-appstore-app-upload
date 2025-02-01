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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const log_1 = require("./log");
const constants_1 = require("./constants");
function getInputs() {
    const clientId = core.getInput("client_id");
    const clientSecret = core.getInput("client_secret");
    const appId = core.getInput("app_id");
    const androidApkFilePath = core.getInput("android_apk_file");
    if (!clientId) {
        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Amazon Appstore Client ID is required");
        return null;
    }
    else if (!clientSecret) {
        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Amazon Appstore Client Secret is required");
    }
    else if (!appId) {
        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Amazon Appstore App ID is required");
    }
    else if (!androidApkFilePath) {
        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Android APK file path is required");
    }
    else if (!androidApkFilePath.endsWith(".apk")) {
        (0, log_1.logMessage)(log_1.LogLevel.FAILED, "Invalid APK file");
    }
    else if (!fs_1.default.existsSync(androidApkFilePath)) {
        (0, log_1.logMessage)(log_1.LogLevel.FAILED, `The APK file at path "${androidApkFilePath}" does not exist.`);
    }
    else {
        return {
            clientId,
            clientSecret,
            appId,
            androidApkFilePath,
        };
    }
    return null;
}
function authenticateWithAmazonAppstore(clientId, clientSecret) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResponse = yield (0, node_fetch_1.default)(constants_1.AMAZON_AUTH_URL, {
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
            });
            const authData = (yield authResponse.json());
            if (!authResponse.ok) {
                (0, log_1.logMessage)(log_1.LogLevel.FAILED, `Failed to authenticate with Amazon Appstore: [${authData.error}]: ${authData.error_description}`, {
                    error: authData,
                });
                return null;
            }
            return authData.access_token;
        }
        catch (error) {
            (0, log_1.logMessage)(log_1.LogLevel.FAILED, error.message, {
                error: error,
            });
            return null;
        }
    });
}
function checkForExistingOpenEdits(accessToken, appId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`${constants_1.AMAZON_APPSTORE_API_BASE_URL}/${constants_1.AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                (0, log_1.logMessage)(log_1.LogLevel.FAILED, `Failed to check for existing open edits: ${response.statusText}`, {
                    error: response,
                });
                return null;
            }
            const data = (yield response.json());
            return data;
        }
        catch (error) {
            (0, log_1.logMessage)(log_1.LogLevel.FAILED, error.message, {
                error: error,
            });
            return null;
        }
    });
}
function createNewEdit(accessToken, appId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`${constants_1.AMAZON_APPSTORE_API_BASE_URL}/${constants_1.AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                (0, log_1.logMessage)(log_1.LogLevel.FAILED, `Failed to create a new edit: ${response.statusText}`, {
                    error: response,
                });
                return null;
            }
            const data = (yield response.json());
            return data;
        }
        catch (error) {
            (0, log_1.logMessage)(log_1.LogLevel.FAILED, error.message, {
                error: error,
            });
            return null;
        }
    });
}
function getLatestApk(accessToken, appId, editId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`${constants_1.AMAZON_APPSTORE_API_BASE_URL}/${constants_1.AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits/${editId}/apks`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                (0, log_1.logMessage)(log_1.LogLevel.FAILED, `Failed to get the latest APK: ${response.statusText}`, {
                    error: response,
                });
                return null;
            }
            const data = (yield response.json());
            const latestApk = data.sort((a, b) => b.versionCode - a.versionCode)[0];
            return latestApk;
        }
        catch (error) {
            (0, log_1.logMessage)(log_1.LogLevel.FAILED, error.message, {
                error: error,
            });
            return null;
        }
    });
}
function getETagForApk(accessToken, appId, editId, apkId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`${constants_1.AMAZON_APPSTORE_API_BASE_URL}/${constants_1.AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits/${editId}/apks/${apkId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                (0, log_1.logMessage)(log_1.LogLevel.FAILED, `Failed to get the ETag for the APK: ${response.statusText}`, {
                    error: response,
                });
                return null;
            }
            return response.headers.get("ETag");
        }
        catch (error) {
            (0, log_1.logMessage)(log_1.LogLevel.FAILED, error.message, {
                error: error,
            });
            return null;
        }
    });
}
function replaceApk(accessToken, appId, editId, apkId, eTag, androidApkFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`${constants_1.AMAZON_APPSTORE_API_BASE_URL}/${constants_1.AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits/${editId}/apks/${apkId}/replace`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "If-Match": eTag,
                    "Content-Type": "application/octet-stream",
                },
                body: fs_1.default.createReadStream(androidApkFilePath),
            });
            if (!response.ok) {
                (0, log_1.logMessage)(log_1.LogLevel.FAILED, `Failed to replace the APK: ${response.statusText}`, {
                    error: response,
                });
                return null;
            }
            const data = (yield response.json());
            return data;
        }
        catch (error) {
            (0, log_1.logMessage)(log_1.LogLevel.FAILED, error.message, {
                error: error,
            });
            return null;
        }
    });
}
function uploadAppToAmazonAppstore() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, log_1.logMessage)(log_1.LogLevel.INFO, "Starting Amazon Appstore app upload process...");
            const inputs = getInputs();
            if (!inputs) {
                return;
            }
            const { clientId, clientSecret, appId, androidApkFilePath } = inputs;
            (0, log_1.logMessage)(log_1.LogLevel.INFO, "Authenticating with Amazon Appstore...");
            const accessToken = yield authenticateWithAmazonAppstore(clientId, clientSecret);
            if (!accessToken) {
                return;
            }
            (0, log_1.logMessage)(log_1.LogLevel.INFO, "Authenticated successfully with Amazon Appstore. Checking for existing open edits...");
            const activeEdit = yield checkForExistingOpenEdits(accessToken, appId);
            let editId = null;
            if (activeEdit === null) {
                return;
            }
            if (JSON.stringify(activeEdit) !== "{}" && (activeEdit === null || activeEdit === void 0 ? void 0 : activeEdit.id)) {
                (0, log_1.logMessage)(log_1.LogLevel.INFO, `Found an existing open edit with ID: ${activeEdit.id}. Using this edit to upload the app...`, {
                    data: activeEdit,
                });
                editId = activeEdit.id;
            }
            else {
                (0, log_1.logMessage)(log_1.LogLevel.INFO, "No existing open edit found. Creating a new edit...");
                const newEdit = yield createNewEdit(accessToken, appId);
                if (newEdit === null) {
                    return;
                }
                (0, log_1.logMessage)(log_1.LogLevel.INFO, `Created a new edit with ID: ${newEdit.id}. Using this edit to upload the app...`, {
                    data: newEdit,
                });
                editId = newEdit.id;
            }
            (0, log_1.logMessage)(log_1.LogLevel.INFO, "Finding the latest APK file to replace...");
            const latestApk = yield getLatestApk(accessToken, appId, editId);
            if (latestApk === null) {
                return;
            }
            (0, log_1.logMessage)(log_1.LogLevel.INFO, `Found the latest APK - ${latestApk.name} (ID: ${latestApk.id}) with version code: ${latestApk.versionCode}. Uploading the new APK...`, {
                data: latestApk,
            });
            const eTag = yield getETagForApk(accessToken, appId, editId, latestApk.id);
            if (!eTag) {
                return;
            }
            (0, log_1.logMessage)(log_1.LogLevel.INFO, "Uploading new apk to Amazon Appstore...");
            const uploadedApk = yield replaceApk(accessToken, appId, editId, latestApk.id, eTag, androidApkFilePath);
            if (!uploadedApk) {
                return;
            }
            (0, log_1.logMessage)(log_1.LogLevel.INFO, `APK uploaded successfully with version code: ${uploadedApk.versionCode} and ID: ${uploadedApk.id}`, {
                data: uploadedApk,
            });
        }
        catch (error) {
            (0, log_1.logMessage)(log_1.LogLevel.FAILED, error.message, {
                error: error,
            });
        }
    });
}
uploadAppToAmazonAppstore();
