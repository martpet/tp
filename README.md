# TP

This is a fullstack javascript project, a playground for [AWS CDK](https://aws.amazon.com/cdk), [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) and [React Spectrum](https://react-spectrum.adobe.com).

## Setup development environment

### 1. Specify personal account
Provide the administrator with:
* your personal AWS account ID (or ask for an organizational account),
* a name for your dev subdomain (Ex: **johndoe**).

(*Administrators: [How to add developers](README-prod-setup.md#how-to-add-developers-to-project)*)

### 2. Bootstrap your personal account

`npx cdk bootstrap aws://<id>/<region> --profile <profile>`

Also bootstrap the `us-east-1` region.

### 3. Set environment variables

In the root project folder copy `.env.local.example` to `.env.local` and set own values.

### 4. Install Node modules

Check required Node version in `.nvmrc`

`npm install`

### 5. Deploy personal stack

See *Deploying* bellow.

## Developing

### Start frontend server

`npm start`

Web server runs on localhost:3000 and calls your personal stack.

*Safari* users need to disable *Prevent cross-site tracking* in *Privacy Settings*, otherwise  `sessionId` cookie won't be sent from localhost to API backend.

## Deploying

### Personal stack

`npm run deploy -- --profile <aws profile name>`

[localhost:3000](http://localhost:3000), *myname.dev.trip.pictures*


### Staging
Deployment is triggered by pushing to branch `main`.

[test.trip.pictures](http://test.trip.pictures)

### Production
Deployment is triggered by creating a new release.

[trip.pictures](http://trip.pictures)

----

*Check also: [Setting up prod and staging environments](README-prod-setup.md)*
