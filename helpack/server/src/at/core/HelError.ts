export function HelError(msg: string, code = '-1'): void {
  const error = new Error(msg);
  // @ts-ignore, serve for hel-pack server
  error.code = code;
  // @ts-ignore, let new HelError() works
  return error;
}

export type IHelError = typeof HelError;

export default HelError;
