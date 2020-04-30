module.exports = {
    parser: "babel-eslint",
    env: {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    extends: [
        "airbnb"
    ],
    globals: {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "window": true
    },
    parserOptions: {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    plugins: [
        "react"
    ],
    rules: {
        'linebreak-style': [0], // 换行符的问题
        "camelcase": 0,
        "import/no-extraneous-dependencies": 0,
        "import/extensions": [0],
        "import/no-unresolved": 0,
        "import/prefer-default-export": 0,
        "react/jsx-filename-extension": [2, { "extensions": [".js", ".jsx"] }],
        "react/state-in-constructor": 0,
        "react/destructuring-assignment": 0,
        "class-methods-use-this": 0,
        "no-underscore-dangle": 0,
        "max-len": 0,
        "react/sort-comp": 0,
        "react/prop-types": 0,
        "react/jsx-indent-props": 0,
        "consistent-return": 0,
        "comma-dangle": [2, "never"],
        "no-param-reassign": 0,
        "no-restricted-syntax": 0,
        "no-await-in-loop": 0,
        "no-return-assign": 0,
        "no-nested-ternary": 0,
        "no-trailing-spaces": 0,
        "no-restricted-properties": 0,
        "react/jsx-one-expression-per-line": 0,
        "jsx-a11y/label-has-associated-control": 0,
        "react/jsx-tag-spacing": [0],
        "react/jsx-indent": [2, 4],
        "react/jsx-closing-tag-location": [2],
        "react/jsx-curly-spacing": [0],
        "jsx-a11y/label-has-for": 0,
        "react/jsx-props-no-spreading": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "jsx-a11y/click-events-have-key-events": 0, // 有一些 event 的时候, 不需要 role 属性, 不需要其他解释
        "react/no-array-index-key": 0,
        "no-unused-expressions": [2, { "allowShortCircuit": true, "allowTernary": true }],
        "no-use-before-define": ["error", { "functions": false }],
        "no-plusplus": 0,
        "object-curly-newline": 0,
        "no-tabs": 0,
        "indent": [2, 4],
        "guard-for-in": [0],
        "no-unused-vars": [2, { "args": "none", "ignoreRestSiblings": false }] // 不检查函数参数是否未使用 
    }
};
