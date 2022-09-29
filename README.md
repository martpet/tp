# TP

## Local development

### Bootstrap development AWS environment

`npx cdk bootstrap aws://<account-id>/<region> --profile <aws profile name>`

Bootstrap also the `us-east-1` in the same AWS account.

### Set env vars

Copy `.env.local.example` to `.env.local` and set personal values.

### Start local frontend webserver

`npm start`

For Safari: disable "Prevent cross-site tracking" from Privacy settings. Otherwise "session" cookie is not sent from localhost to API backend.

### Deploy to development AWS environment

`npm run deploy -- --profile <aws profile name>`

----

[Setup production and staging AWS envs](README-prod-setup.md)
