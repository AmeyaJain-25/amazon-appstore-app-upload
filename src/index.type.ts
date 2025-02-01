export type AuthResponseSuccess = {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
};

export type AuthResponseError = {
  error: string;
  error_description: string;
};

export type AuthResponse = AuthResponseSuccess | AuthResponseError;

export type ActiveOrCreateEditResponse = {
  id: string;
  status: string;
};

export type ListApksResponse = {
  versionCode: number;
  id: string;
  name: string;
}[];

export type GetApkResponse = {
  versionCode: number;
  id: string;
  name: string;
};

export type UploadApkResponse = {
  versionCode: number;
  id: string;
  name: string;
};
