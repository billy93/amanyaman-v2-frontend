import { AES, enc } from 'crypto-js';

const secretKey = 'amanyamanv22023'; // Replace with your secret key

// Function to encrypt data
export const encryptData = (data) => {
  const ciphertext = AES.encrypt(JSON.stringify(data), secretKey).toString();
  return ciphertext;
};

// Function to decrypt data
export const decryptData = (ciphertext) => {
  const bytes = AES.decrypt(ciphertext, secretKey);
  const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
  return decryptedData;
};
