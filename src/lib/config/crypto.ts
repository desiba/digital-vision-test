const CryptoJS = require('crypto-js');

export const encrypt = async (email: string) => {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(email), process.env.ENCRYPTION_KEY).toString(); 
}

export const decrypt = async (ciphertext: string) => {
    return CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
}

  