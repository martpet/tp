import { App, Stack, StackProps } from 'aws-cdk-lib';

import { Api, Auth, Photos, Tables, Web, Zone } from '~/constructs';

export class RootStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    const zone = new Zone(this, 'Zone');
    const web = new Web(this, 'Web', { zone });
    const tables = new Tables(this, 'Tables');
    const photos = new Photos(this, 'Photos');
    const auth = new Auth(this, 'Auth', { zone, web, tables });
    new Api(this, 'Api', { auth, zone, tables, photos });
  }
}
