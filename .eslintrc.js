
module.exports = {
    ignorePatterns: [
		"source/project/__tests__/**/*.js",
		"source/project/docs/**/*.js",
		"source/project/config/**/*.js",
		"eslint.config.js"
	],
    plugins: ["node"],
    parser: "@babel/eslint-parser",
    env: {
        browser: true,
        node: true,
        worker: true,
        es6: true,
    },
    parserOptions: {
        ecmaVersion: 6,
        requireConfigFile: false,
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
		"no-var": "error",
		"prefer-const": "warn",
		"no-console": "off",
		"no-unused-vars": "warn",
		"no-undef": "error",
		"no-redeclare": "error",
		"prefer-arrow-callback": "warn",
		"node/no-unpublished-require": "off",
	},
}

