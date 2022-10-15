import { UsersTableItem } from '../tableItems';

export type Me = Pick<UsersTableItem, 'givenName' | 'familyName' | 'picture' | 'email'>;
