export function isSubApp(): boolean;

export function isMasterApp(): boolean;

declare type DefaultExport = {
  isSubApp: typeof isSubApp;
  isMasterApp: typeof isMasterApp;
};

declare const defaultExport: DefaultExport;
export default defaultExport;
