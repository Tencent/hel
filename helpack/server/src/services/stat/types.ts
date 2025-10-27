export interface IVisitHome {
  num: number;
  totalUser: number;
  users: string[];
}

export interface IStatItem<T = any> {
  type: string;
  timeLabel: string;
  envLabel: string;
  distEnvLabel: string;
  data: T;
  [key: string]: any;
}
