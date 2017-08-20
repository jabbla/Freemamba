module.exports = {
    "env": {
        "browser": true,
        "commonjs": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-fallthrough": 1,
        "default-case": 2,
        "indent": [
            "error",
            4,
            {"SwitchCase": 1}
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};