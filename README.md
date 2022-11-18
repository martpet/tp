# TP

A playground for [AWS CDK](https://aws.amazon.com/cdk), [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) and [React Spectrum](https://react-spectrum.adobe.com).

## Getting started

### 1. Specify your personal AWS account
Provide the administrator with your personal AWS account ID, or ask for a new organizational account specifically for this project.

*For administrators: [How to add developers](README-prod-setup.md#how-to-add-developers-to-project)*

### 2. Bootstrap your AWS account for CDK

`npx cdk bootstrap aws://<account id>/<region> --profile <aws profile name>`

Also bootstrap the `us-east-1` region.

### 3. Set personal environment variables

Copy `.env.local.example` to `.env.local` and set personal values.

## Developing

### Frontend server

`npm start`

For *Safari* users: Disable *Prevent cross-site tracking* from *Privacy settings*, or `sessionId` cookie won't be sent from localhost to API.

### Deploying to personal AWS account

`npm run deploy -- --profile <aws profile name>`

----

*Check also: [Setting up prod and staging environments](README-prod-setup.md)*
