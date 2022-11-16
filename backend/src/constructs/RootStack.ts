import { App, Stack, StackProps } from 'aws-cdk-lib';

import { Api, Auth, Photos, Tables, Web, Zone } from '~/constructs';

export class RootStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    const zone = new Zone(this, 'Zone');
    const web = new Web(this, 'Web', { zone });
    const tables = new Tables(this, 'Tables');
    const auth = new Auth(this, 'Auth', { zone, web, tables });
    new Photos(this, 'Photos');
    new Api(this, 'Api', { zone, auth, tables });
  }
}
