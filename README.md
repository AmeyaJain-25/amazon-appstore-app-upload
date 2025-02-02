# Upload Android App(.apk) Release to Amazon Appstore

A GitHub Action for uploading Android APK files to Amazon Appstore. It uses the Amazon Appstore Developer API to upload the APK file, handling the authentication, edit creation, and APK upload process.
It follows the [Amazon Appstore Developer App Submission API](https://developer.amazon.com/docs/app-submission-api/overview.html) to upload the APK file.
The steps to upload the APK file were taken from the [Amazon App Submission API Flows](https://developer.amazon.com/docs/app-submission-api/flows.html).

## Prerequisites

- Create an [Amazon Appstore Developer account](https://developer.amazon.com/login.html)
- In Apps & Services (API Access), create a new `Security Profile` under "App Submission API" in the Amazon Developer Console
- Save the `Client ID` and `Client Secret` from the Security Profile
- Associate Security Profile with the API by following the steps mentioned [here](https://developer.amazon.com/docs/app-submission-api/overview.html#associate-security-profile)
- Collect the `App ID` from the Amazon Developer Console

## NOTE:
- This action works for apps that are already created in the Amazon Appstore Developer Console. It does not create a new app.
- This action only supports uploading APK files to Amazon Appstore. It does not support uploading AAB files.

## Inputs

- `client_id` (required): Amazon AppStore Application Client ID obtained from the Amazon Developer Console
- `client_secret` (required): Amazon AppStore Application Client Secret obtained from the Amazon Developer Console
- `app_id` (required): Amazon AppStore Application ID (the unique identifier for your app in the Amazon AppStore)
- `apk_release_file` (required): Relative path to the Android APK release file (e.g., 'app/build/outputs/apk/release/app-release.apk')


## Usage

```yaml
- name: Upload Android App to Amazon App Store
        uses: AmeyaJain-25/amazon-appstore-app-upload@v1.0.0
        with:
          client_id: ${{secrets.AMAZON_APPSTORE_CLIENT_ID}}
          client_secret: ${{secrets.AMAZON_APPSTORE_CLIENT_SECRET}}
          app_id: ${{ secrets.AMAZON_APPSTORE_APP_ID }}
          apk_release_file: 'app/build/outputs/apk/release/app-release.apk'
```
