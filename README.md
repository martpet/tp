# TP

A playground for 
[AWS CDK](https://aws.amazon.com/cdk), 
[RTK Query](https://redux-toolkit.js.org/rtk-query/overview) and
[React Spectrum](https://react-spectrum.adobe.com).

## Getting started

### 1. Bootstrap your AWS account for CDK

`npx cdk bootstrap aws://<id>/<region> --profile <profile>`

Also, bootstrap the `us-east-1` region.

### 2. Set environment variables

In the root project folder copy `.env.local.example` to `.env.local` and set own values.

### 3. Install dependencies

Use the Node version specified in `.nvmrc`

### 4. Deploy

`npm run deploy -- --profile <aws profile name>`