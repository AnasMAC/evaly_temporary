import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './db.js';      

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const db = {};

const files = fs.readdirSync(__dirname)
  .filter(
    f =>
      f !== 'index.js' &&
      f !== 'db.js' &&
      f.endsWith('.js')
  );

for (const file of files) {
  const mod   = await import(`./${file}`);
  const model = mod.default;        
  db[model.name] = model;
}

for (const model of Object.values(db)) {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
}

db.sequelize = sequelize;

export default db;
