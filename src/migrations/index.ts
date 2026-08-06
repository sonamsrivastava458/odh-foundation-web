import * as migration_20260803_105336 from './20260803_105336';
import * as migration_20260803_112206 from './20260803_112206';

export const migrations = [
  {
    up: migration_20260803_105336.up,
    down: migration_20260803_105336.down,
    name: '20260803_105336',
  },
  {
    up: migration_20260803_112206.up,
    down: migration_20260803_112206.down,
    name: '20260803_112206'
  },
];
