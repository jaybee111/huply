module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
    ],
    rules: {
        // override/add rules settings here, such as:
        // 'vue/no-unused-vars': 'error'
    }
}
