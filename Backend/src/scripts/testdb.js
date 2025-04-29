import db from '../models/index.js';

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log(' Connexion OK');
   await db.sequelize.sync({ alter: true });
    console.log(' Tables créées ou synchronisées avec les modèles'); 

  } catch (err) {
    console.error(' Erreur :', err.message);
  } finally {
    await db.sequelize.close();
  }
})();
