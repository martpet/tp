# TP

This is a fullstack javascript project, a playground for [AWS CDK](https://aws.amazon.com/cdk), [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) and [React Spectrum](https://react-spectrum.adobe.com).

## Getting started

### 1. Specify an AWS account for development
Provide the administrator with
* your own AWS account's ID (or ask for an organizational account),
* a name for your dev subdomain (Ex: **johndoe**).

(*Administrators: [How to add developers](README-prod-setup.md#how-to-add-developers-to-project)*)

### 2. Bootstrap your AWS account

`npx cdk bootstrap aws://<id>/<region> --profile <profile>`

Also, bootstrap the `us-east-1` region.

### 3. Set environment variables

In the root project folder copy `.env.local.example` to `.env.local` and set own values.

### 4. Install dependencies

Use the Node version specified in `.nvmrc`

`npm install`

### 5. Deploy to your AWS account

See *Personal stack* under *How to deploy* bellow.

## Developing

### Start the frontend server

`npm start`

The web server runs on `localhost:3000` and calls your personal stack.

**Safari users** need to disable *Prevent cross-site tracking* in *Privacy Settings*, otherwise  `sessionId` cookie won't be sent from localhost to API backend.

## How to deploy

### Personal stack

`npm run deploy -- --profile <aws profile name>`


### Staging
Deployment is triggered by pushing to branch `main`.

### Production
Deployment is triggered by creating a new release.

----

*Check also: [Setting up prod and staging environments](README-prod-setup.md)*
