# TP

This is a personal playground, using AWS CDK, Adobe React Spectrum, Redux Toolkit Query, and others.

## Getting started

### Bootstrap AWS dev environment

`npx cdk bootstrap aws://<account-id>/<region> --profile <aws profile name>`

Also bootstrap the `us-east-1` region.

### Add local env variables

Copy `.env.local.example` to `.env.local` and set personal values.

### Run local frontend server

`npm start`

For Safari: disable *Prevent cross-site tracking* from *Privacy settings*. Otherwise `sessionId` cookie is not sent from localhost to API backend.

### Deploy frontend and backend to AWS dev

`npm run deploy -- --profile <aws profile name>`

----

Check also: [Setting up prod and staging environments](README-prod-setup.md)
