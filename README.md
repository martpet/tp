# TP

## Setup dev env
1. Bootstrap your personal dev AWS account

`npx cdk bootstrap aws://<account-id>/<region> --profile <aws profile name>`

In addition, bootstrap the `us-east-1` region if it's different from the above region.

2. Add env variables

Copy `.env.local.example` to `.env.local` and add your own env variables.

3. Deploy

`npm run deploy -- --profile <aws profile name>`

----

[setup prod and staging](README-prod-setup.md)
