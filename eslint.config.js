module.exports = [
	{
		ignores: ["source/project/__tests__/**/*.js", "source/project/docs/**/*.js", "source/project/config/**/*.js"],
	},
	{
		plugins: {
			node: require("eslint-plugin-node"),
		},
		languageOptions: {
			parser: require("@babel/eslint-parser"),
			parserOptions: {
				ecmaVersion: 6,
				sourceType: "module",
				requireConfigFile: false,
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: {
			"no-var": "error",
			"prefer-const": "warn",
			"no-console": "off",
			"no-unused-vars": "warn",
			"no-undef": "warn",
			"no-redeclare": "error",
			"prefer-arrow-callback": "warn",
			"node/no-unpublished-require": "off",
		},
	},
];
