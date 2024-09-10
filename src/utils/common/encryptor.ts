import JSEncrypt from 'jsencrypt';
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCNpnwVvcShyKczBHr5U/N2SoGoYhfisylXJsN0bsm2k1NjF9ldwa7q2R8ohR7EAJU+8/SMCHUhAllHmCjQR8xZEc/MWvrTJk3FMo7/GiCKUfAlfIpdL3rdWyOXZ/VcvwAr2gbDrC29qyOYSz113Rll9WDVN1yZME2FZlNtCurO4wIDAQAB';
export default {
  // 加密
  encrypt(txt) {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey); // 设置公钥
    return encryptor.encrypt(txt); // 对需要加密的数据进行加密
  },
  // 解密
  decrypt(txt) {
    const encryptor = new JSEncrypt();
    encryptor.setPrivateKey(privateKey);
    return encryptor.decrypt(txt);
  },
};
