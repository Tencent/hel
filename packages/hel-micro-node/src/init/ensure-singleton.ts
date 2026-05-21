import { VER } from '../base/consts';

function ensureSdkSingleton() {
  if (process.env.HMN_RUNNING_VER) {
    throw new Error(`Another hel-micro-node lib ${process.env.HMN_RUNNING_VER} is running, please check your project deps!`);
  }
  process.env.HMN_RUNNING_VER = VER;
}

ensureSdkSingleton();
