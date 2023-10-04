import CryptoJS from 'crypto-js';

// Encryption function
export const encryptData = (data, secretKey) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey);
  return encryptedData.toString();
};

// Decryption function
export const decryptData = (encryptedData, secretKey) => {
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
};
