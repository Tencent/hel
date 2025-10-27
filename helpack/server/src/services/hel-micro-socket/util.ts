import WebSocket from 'ws';
import type { IClientSocket } from './types';

export function isClientValid(client: IClientSocket) {
  return client.readyState === WebSocket.OPEN;
}

export function toDataJson(str: string) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
}

export function toDataStr(mayJson: object | string) {
  if (typeof mayJson === 'string') {
    return mayJson;
  }
  return JSON.stringify(mayJson);
}

export function newEnvInfo() {
  return {
    workerId: '',
    city: '',
    containerName: '',
    containerIP: '',
    podName: '',
    imgVersion: '',
    envName: '',
  };
}
