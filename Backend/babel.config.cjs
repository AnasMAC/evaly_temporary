module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",  // Polyfill only the features you use
        corejs: 3,             // Use core-js version 3
      },
    ],
  ],
};