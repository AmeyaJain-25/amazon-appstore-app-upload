import * as core from "@actions/core";
import fetch from "node-fetch";
import fs from "fs";
import { LogLevel, logMessage } from "./log";
import {
  AMAZON_APPSTORE_API_BASE_URL,
  AMAZON_APPSTORE_API_VERSION,
  AMAZON_AUTH_URL,
} from "./constants";
import {
  ActiveOrCreateEditResponse,
  AuthResponse,
  AuthResponseError,
  AuthResponseSuccess,
  GetApkResponse,
  ListApksResponse,
  UploadApkResponse,
} from "./index.type";

function getInputs() {
  const clientId = core.getInput("client_id");
  const clientSecret = core.getInput("client_secret");
  const appId = core.getInput("app_id");
  const androidApkFilePath = core.getInput("android_apk_file");

  if (!clientId) {
    logMessage(LogLevel.FAILED, "Amazon Appstore Client ID is required");
    return null;
  } else if (!clientSecret) {
    logMessage(LogLevel.FAILED, "Amazon Appstore Client Secret is required");
  } else if (!appId) {
    logMessage(LogLevel.FAILED, "Amazon Appstore App ID is required");
  } else if (!androidApkFilePath) {
    logMessage(LogLevel.FAILED, "Android APK file path is required");
  } else if (!androidApkFilePath.endsWith(".apk")) {
    logMessage(LogLevel.FAILED, "Invalid APK file");
  } else if (!fs.existsSync(androidApkFilePath)) {
    logMessage(
      LogLevel.FAILED,
      `The APK file at path "${androidApkFilePath}" does not exist.`,
    );
  } else {
    return {
      clientId,
      clientSecret,
      appId,
      androidApkFilePath,
    };
  }

  return null;
}

async function authenticateWithAmazonAppstore(
  clientId: string,
  clientSecret: string,
): Promise<string | null> {
  try {
    const authResponse = await fetch(AMAZON_AUTH_URL, {
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

    const authData = (await authResponse.json()) as AuthResponse;

    if (!authResponse.ok) {
      logMessage(
        LogLevel.FAILED,
        `Failed to authenticate with Amazon Appstore: [${(authData as AuthResponseError).error}]: ${(authData as AuthResponseError).error_description}`,
        {
          error: authData,
        },
      );
      return null;
    }

    return (authData as AuthResponseSuccess).access_token;
  } catch (error: any) {
    logMessage(LogLevel.FAILED, error.message, {
      error: error,
    });
    return null;
  }
}

async function checkForExistingOpenEdits(
  accessToken: string,
  appId: string,
): Promise<ActiveOrCreateEditResponse | null> {
  try {
    const response = await fetch(
      `${AMAZON_APPSTORE_API_BASE_URL}/${AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      logMessage(
        LogLevel.FAILED,
        `Failed to check for existing open edits: ${response.statusText}`,
        {
          error: response,
        },
      );
      return null;
    }

    const data = (await response.json()) as ActiveOrCreateEditResponse;
    return data;
  } catch (error: any) {
    logMessage(LogLevel.FAILED, error.message, {
      error: error,
    });
    return null;
  }
}

async function createNewEdit(
  accessToken: string,
  appId: string,
): Promise<ActiveOrCreateEditResponse | null> {
  try {
    const response = await fetch(
      `${AMAZON_APPSTORE_API_BASE_URL}/${AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      logMessage(
        LogLevel.FAILED,
        `Failed to create a new edit: ${response.statusText}`,
        {
          error: response,
        },
      );
      return null;
    }

    const data = (await response.json()) as ActiveOrCreateEditResponse;
    return data;
  } catch (error: any) {
    logMessage(LogLevel.FAILED, error.message, {
      error: error,
    });
    return null;
  }
}

async function getLatestApk(
  accessToken: string,
  appId: string,
  editId: string,
): Promise<{
  versionCode: number;
  id: string;
  name: string;
} | null> {
  try {
    const response = await fetch(
      `${AMAZON_APPSTORE_API_BASE_URL}/${AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits/${editId}/apks`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      logMessage(
        LogLevel.FAILED,
        `Failed to get the latest APK: ${response.statusText}`,
        {
          error: response,
        },
      );
      return null;
    }

    const data = (await response.json()) as ListApksResponse;

    const latestApk = data.sort((a, b) => b.versionCode - a.versionCode)[0];
    return latestApk;
  } catch (error: any) {
    logMessage(LogLevel.FAILED, error.message, {
      error: error,
    });
    return null;
  }
}

async function getETagForApk(
  accessToken: string,
  appId: string,
  editId: string,
  apkId: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `${AMAZON_APPSTORE_API_BASE_URL}/${AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits/${editId}/apks/${apkId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      logMessage(
        LogLevel.FAILED,
        `Failed to get the ETag for the APK: ${response.statusText}`,
        {
          error: response,
        },
      );
      return null;
    }

    return response.headers.get("ETag");
  } catch (error: any) {
    logMessage(LogLevel.FAILED, error.message, {
      error: error,
    });
    return null;
  }
}

async function replaceApk(
  accessToken: string,
  appId: string,
  editId: string,
  apkId: string,
  eTag: string,
  androidApkFilePath: string,
): Promise<UploadApkResponse | null> {
  try {
    const response = await fetch(
      `${AMAZON_APPSTORE_API_BASE_URL}/${AMAZON_APPSTORE_API_VERSION}/applications/${appId}/edits/${editId}/apks/${apkId}/replace`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "If-Match": eTag,
          "Content-Type": "application/octet-stream",
        },
        body: fs.createReadStream(androidApkFilePath),
      },
    );

    if (!response.ok) {
      logMessage(
        LogLevel.FAILED,
        `Failed to replace the APK: ${response.statusText}`,
        {
          error: response,
        },
      );
      return null;
    }

    const data = (await response.json()) as UploadApkResponse;
    return data;
  } catch (error: any) {
    logMessage(LogLevel.FAILED, error.message, {
      error: error,
    });
    return null;
  }
}

async function uploadAppToAmazonAppstore() {
  try {
    logMessage(LogLevel.INFO, "Starting Amazon Appstore app upload process...");

    const inputs = getInputs();
    if (!inputs) {
      return;
    }

    const { clientId, clientSecret, appId, androidApkFilePath } = inputs;

    logMessage(LogLevel.INFO, "Authenticating with Amazon Appstore...");

    const accessToken = await authenticateWithAmazonAppstore(
      clientId,
      clientSecret,
    );

    if (!accessToken) {
      return;
    }

    logMessage(
      LogLevel.INFO,
      "Authenticated successfully with Amazon Appstore. Checking for existing open edits...",
    );

    const activeEdit = await checkForExistingOpenEdits(accessToken, appId);
    let editId = null;
    if (activeEdit === null) {
      return;
    }
    if (JSON.stringify(activeEdit) !== "{}" && activeEdit?.id) {
      logMessage(
        LogLevel.INFO,
        `Found an existing open edit with ID: ${activeEdit.id}. Using this edit to upload the app...`,
        {
          data: activeEdit,
        },
      );
      editId = activeEdit.id;
    } else {
      logMessage(
        LogLevel.INFO,
        "No existing open edit found. Creating a new edit...",
      );
      const newEdit = await createNewEdit(accessToken, appId);
      if (newEdit === null) {
        return;
      }
      logMessage(
        LogLevel.INFO,
        `Created a new edit with ID: ${newEdit.id}. Using this edit to upload the app...`,
        {
          data: newEdit,
        },
      );
      editId = newEdit.id;
    }

    logMessage(LogLevel.INFO, "Finding the latest APK file to replace...");

    const latestApk = await getLatestApk(accessToken, appId, editId);
    if (latestApk === null) {
      return;
    }

    logMessage(
      LogLevel.INFO,
      `Found the latest APK - ${latestApk.name} (ID: ${latestApk.id}) with version code: ${latestApk.versionCode}. Uploading the new APK...`,
      {
        data: latestApk,
      },
    );

    const eTag = await getETagForApk(accessToken, appId, editId, latestApk.id);
    if (!eTag) {
      return;
    }

    logMessage(LogLevel.INFO, "Uploading new apk to Amazon Appstore...");

    const uploadedApk = await replaceApk(
      accessToken,
      appId,
      editId,
      latestApk.id,
      eTag,
      androidApkFilePath,
    );
    if (!uploadedApk) {
      return;
    }

    logMessage(
      LogLevel.INFO,
      `APK uploaded successfully with version code: ${uploadedApk.versionCode} and ID: ${uploadedApk.id}`,
      {
        data: uploadedApk,
      },
    );
  } catch (error: any) {
    logMessage(LogLevel.FAILED, error.message, {
      error: error,
    });
  }
}

uploadAppToAmazonAppstore();
