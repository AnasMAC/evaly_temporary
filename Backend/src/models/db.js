import { Sequelize } from 'sequelize';
import configJson from '../config/config.js'; // <- Remplace le .json par .js

const env = process.env.NODE_ENV || 'development';
const cfg = configJson[env];

let sequelize;

if (cfg.use_env_variable) {
  sequelize = new Sequelize(process.env[cfg.use_env_variable], cfg);
} else {
  sequelize = new Sequelize(
    cfg.database,
    cfg.username,
    cfg.password,
    {
      host: cfg.host,
      dialect: cfg.dialect,
      logging: false
    }
  );
}

export { Sequelize };
export default sequelize;