interface IInfo {
  source: string;
  msg?: string;
  url?: string;
  status?: any;
  method?: string;
  body?: any;
  error?: any;
}

export const internal = {
  error: console.error,
  info: console.info,
  log: console.log,
};

export const info = (info: IInfo) => {
  internal.info(info);
};

export const error = (info: IInfo) => {
  internal.error(info);
};

export const fatal = (info: IInfo) => {
  internal.error(info);
};
