import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export function signByMd5(content: string) {
  const md5 = crypto.createHash('md5');
  md5.update(content);
  const sign = md5.digest('hex');
  return sign;
}

export function genRandomStr(length: number) {
  return crypto
    .randomBytes(length / 2)
    .toString('hex')
    .slice(0, length);
}

export function encryptAES(text: string, secretKey: string) {
  if (typeof text !== 'string') {
    throw new Error('text must be a string');
  }
  if (typeof secretKey !== 'string' || secretKey.length !== 32) {
    throw new Error('secretKey must be a 32-byte string');
  }

  const iv = crypto.randomBytes(16); // 初始化向量，长度必须是16字节
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

export function decryptAES(encryptedData: string, iv: string, secretKey: string) {
  if (typeof encryptedData !== 'string') {
    throw new Error('encryptedData must be a string');
  }
  if (typeof iv !== 'string' || iv.length !== 32) {
    // IV应为16字节的hex字符串，此处应为32以匹配示例输出格式
    throw new Error('iv must be a 32-character hex string');
  }
  if (typeof secretKey !== 'string' || secretKey.length !== 32) {
    throw new Error('secretKey must be a 32-byte string');
  }

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
