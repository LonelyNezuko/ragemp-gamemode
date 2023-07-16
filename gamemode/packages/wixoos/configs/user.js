module.exports = {
	accountData: [
		'uid',
		'login',

		'password',
		'email',
		'promo',

		'keyBinds',

		'admin',
		'adminData'
	],
	characterData: [
		'id',
		'uid',
		'name',
		
		'createDate',

		'viewData',
		'clothes',

		'mute',

		'keysToggle',

		'inv',
		'invBackpackStatus',
		'invBackpack',

		'cash',
		'bank',
		'bankCash'
	],

	viewDataDefault: {
		gender: 0,
		genetic: {
			father: 0,
			mother: 21,

			similarity: 0.5,
			skinTone: 0.5
		},
		hair: {
			head: 0,
			beard: 0,
			eyebrow: 0,
			breast: 0,

			head_color: 0,
			beard_color: 0,
			eyebrow_color: 0,
			breast_color: 0
		},
		appearance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		face: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	}
}