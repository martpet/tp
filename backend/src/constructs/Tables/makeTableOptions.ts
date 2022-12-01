import { TableOptions } from '~/constructs/Tables/types';
import { appName } from '~/consts';

export const makeTableOptions = <T extends unknown>(
  props: TableOptions<T>
): TableOptions<T> => {
  return {
    ...props,
    tableName: `${appName}-${props.tableName}`,
  };
};
