import { noDupPush } from 'at/utils/obj';
import type { IVisitHome } from './types';

export function handleVisitHome(base: IVisitHome, other: IVisitHome) {
  base.num += other.num;
  other.users.forEach((v) => {
    if (v) {
      noDupPush(base.users, v);
    }
  });
  base.totalUser = base.users.length;
}
