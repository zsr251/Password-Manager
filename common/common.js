 import CryptoJS from "@/common/crypto-js.js";
 /**
  * 生成UUID
  */
 export function generateUUID() { // Public Domain/MIT
     var d = new Date().getTime();//Timestamp
     var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
         var r = Math.random() * 16;//random number between 0 and 16
         if(d > 0){//Use timestamp until depleted
             r = (d + r)%16 | 0;
             d = Math.floor(d/16);
         } else {//Use microseconds since page-load if supported
             r = (d2 + r)%16 | 0;
             d2 = Math.floor(d2/16);
         }
         return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
     });
 }
 /**
   * AES-256-CBC对称加密
   * @param text {string} 要加密的明文
   * @param secretKey {string} 密钥，43位随机大小写与数字
   * @returns {string} 加密后的密文，Base64格式
   */
 function AES_CBC_ENCRYPT(text, secretKey) {
	if(!text){
		return text;
	}
	var keyHex = CryptoJS.enc.Base64.parse(secretKey);
	var ivHex = keyHex.clone();
	// 前16字节作为向量
	ivHex.sigBytes = 16;
	ivHex.words.splice(4);
	var messageHex = CryptoJS.enc.Utf8.parse(text);
	var encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
	  "iv": ivHex,
	  "mode": CryptoJS.mode.CBC,
	  "padding": CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
  }

  /**
   * AES-256-CBC对称解密
   * @param textBase64 {string} 要解密的密文，Base64格式
   * @param secretKey {string} 密钥，43位随机大小写与数字
   * @returns {string} 解密后的明文
   */
 function AES_CBC_DECRYPT(textBase64, secretKey) {
	if(!textBase64){
		return textBase64;
	}
	var keyHex = CryptoJS.enc.Base64.parse(secretKey);
	var ivHex = keyHex.clone();
	// 前16字节作为向量
	ivHex.sigBytes = 16;
	ivHex.words.splice(4);
	
	var decrypt = CryptoJS.AES.decrypt(textBase64, keyHex, {
	  "iv": ivHex,
	  "mode": CryptoJS.mode.CBC,
	  "padding": CryptoJS.pad.Pkcs7
	});
	return CryptoJS.enc.Utf8.stringify(decrypt);
  }
  
  export {
  	AES_CBC_ENCRYPT,
  	AES_CBC_DECRYPT
  }
  