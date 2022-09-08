Bootstrap AWS account:

`npx cdk bootstrap aws://<account-id>/<region> --profile <profile>`

Choose a personal subdomain name:

* Create `.env.local` file in the root folder of the repository.
* Add a subdomain name to a variable named `VITE_PERSONAL_SUBDOMAIN`.

Deploy:

`npm run deploy -- --profile <profile>`

----

[Setup Staging and Prod environments](README-prod-setup.md)

