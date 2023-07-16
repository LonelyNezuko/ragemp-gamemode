const alphabet = "abcdefghijklmnopqrstuvwxyz"
const num = "0123456789"

const random = {
	number: (length = 4) => {
		let result = ''
		for(let i = 0; i < parseInt(length); i ++) result += num.charAt(Math.floor(Math.random() * num.length));

		return parseInt(result);
	},
	text: (length = 4) => {
		let result = ''
		for(let i = 0; i < parseInt(length); i ++) result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));

		return result;
	},
	textNumber: (length = 4) => {
		let result = ''
		for(let i = 0; i < parseInt(length); i ++) {
			if(parseInt(random.number(1)) <= 5) result += num.charAt(Math.floor(Math.random() * num.length));
			else result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		}

		return result;
	}
}
export default random