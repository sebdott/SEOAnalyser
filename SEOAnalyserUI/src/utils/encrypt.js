import cryptoJS from 'crypto-js';

export function encryptAES(value, encryptedMessage) {
  return cryptoJS.AES.encrypt(value, encryptedMessage);
}
export function decryptAES(value, encryptedMessage) {
  return cryptoJS.AES.decrypt(value, encryptedMessage).toString(
    cryptoJS.enc.Utf8,
  );
}
