// Evaly/Backend/config/config.js

export default {
  development: {
    username: 'pc',
    password: 'anas',
    database: 'test3',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: 'said',
    database: 'evalydb',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'pc',
    password: 'anas',
    database: 'evaly',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
