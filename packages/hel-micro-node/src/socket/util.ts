export function toDataStr(mayJson: object | string) {
  if (typeof mayJson === 'string') {
    return mayJson;
  }
  return JSON.stringify(mayJson);
}

export function toDataJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
}
