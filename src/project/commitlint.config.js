module.exports = {
	extends: [
		'@commitlint/config-conventional',
		'@commitlint/config-lerna-scopes'
	],
	rules: {
		'scope-case': [2, 'always', ['lower-case', 'upper-case']],
		'header-max-length': [2, 'always', 100],
	},
};
