import db from '../models/index.js';
import bcrypt from "bcryptjs";
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log(' Connexion OK');
    const hashedAdminPwd = await bcrypt.hash('admin1234', 10); 
    const admin = await db.Utilisateur.create({
      cin : 'KB2269',
      pwd : hashedAdminPwd,
      nom: 'nichan',
      prenom : 'said',
      email : 'saidnichane40@gmail.com',
      role : 'administrateur'
    });

    await db.Administrateur.create({
      cin: admin.cin 
    });

    const etudiant = await db.Utilisateur.create({
      cin: 'Ee1231',
      pwd:'12345AZ',
      nom: 'Karim',
      prenom: 'Ali',
      email: 'karim1.ete@example.com',
      role: 'etudiant',
      administrateurId: admin.cin
    });

    await db.Etudiant.create({
      cin: etudiant.cin,
      promotion: '2026',
      filiere: 'Génie Informatique'
    });

    console.log('Étudiant et  Administrateur créés avec succès');
  
  } catch (err) {
    console.error('Erreur :', err.message);
  } finally {
    await db.sequelize.close();
  }
})();
