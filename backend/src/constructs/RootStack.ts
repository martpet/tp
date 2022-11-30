import { App, Stack, StackProps } from 'aws-cdk-lib';

import { Api, Auth, Photos, Tables, Web, Zone } from '~/constructs';

export class RootStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    const zone = new Zone(this);
    const web = new Web(this, { zone });
    const tables = new Tables(this);
    const photos = new Photos(this);
    const auth = new Auth(this, { zone, tables, web });
    new Api(this, { auth, zone, tables, photos });
  }
}
