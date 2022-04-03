/**
 * 生成密码
 * @param length  密码长度
 * @param lower   小写字母
 * @param upper   大写字母
 * @param number  数字
 * @param symbol  特殊字符 
 * @param symbols 可选特殊字符项 
 */
export function generatePassword(length, lower, upper, number, symbol, symbols) {
	let generatedPassword = "";
	const typesCount = lower + upper + number + symbol;
	if (typesCount === 0) {
		return "";
	}
	const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
	for (let i = 0; i < length; i++) {
		typesArr.forEach(type => {
			const funcName = Object.keys(type)[0];
			generatedPassword += randomFunc[funcName](symbols);
		});
	}
	generatedPassword=Array.from(generatedPassword).sort(() => 0.5 - Math.random()).join('')
	return generatedPassword.slice(0, length);
}
const randomFunc = {
	lower: getRandomLower,
	upper: getRandomUpper,
	number: getRandomNumber,
	symbol: getRandomSymbol,
};
// 生成小写字母
function getRandomLower() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
// 生成大写字母
function getRandomUpper() {
	return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
// 生成数字
function getRandomNumber() {
	return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}
// 生成特殊字符
function getRandomSymbol(symbols) {
	if(!symbols || symbols == ''){
		symbols = '~!@#$%^&*()_+{}":?><;.,';
	}
	return symbols[Math.floor(Math.random() * symbols.length)];
}