import db from '../models/index.js';
import bcrypt from "bcrypt";
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log(' Connexion OK');
    const hashedAdminPwd = await bcrypt.hash('admin1234', 10); 
    const admin = await db.Utilisateur.create({
      cin : 'KB2007',
      pwd : hashedAdminPwd,
      nom: 'nichan',
      prenom : 'said',
      email : 'saidnichan540@gmail.com',
      role : 'administrateur'
    });

    await db.Administrateur.create({
      cin: admin.cin 
    });

    const etudiant = await db.Utilisateur.create({
      cin: 'ET12310',
      pwd:'12345AZ',
      nom: 'Karim',
      prenom: 'Ali',
      email: 'karim1.etu12@example.com',
      role: 'etudiant',
      administrateurId: admin.cin
    });

    await db.Etudiant.create({
      cin: etudiant.cin,
      promotion: '2026',
      filiere: 'Génie Informatique'
    });

    console.log('Étudiant et  Administrateur créés avec succès');
    const verificationCode = '12345699';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);  // Code valide pendant 5 minutes
    const codeEntry = await db.VerificationCode.create({
      idUtilisateur: etudiant.cin,  // Utilisateur concerné
      idVerification: verificationCode,  // Le code de vérification
      expireAt: expiresAt,  // Date d'expiration
    });

    console.log('Code de vérification créé avec succès !');

    // Vérification de l'entrée dans la base de données
    const checkCode = await db.VerificationCode.findOne({
      where: { idVerification: verificationCode }
    });
    console.log('Vérification du code:', checkCode);

    // Étape 5: Valider le code de vérification
    // Vérifier si le code existe et n'est pas expiré
    const validCode = await db.VerificationCode.findOne({
      where: {
        idVerification: verificationCode,
        expireAt: new Date()   // Vérifie que le code n'est pas expiré
      }
    });

    if (validCode) {
      console.log('Code de vérification validé !');
      // Vous pouvez aussi supprimer le code une fois validé, si nécessaire
      await db.VerificationCode.destroy({ where: { idVerification: verificationCode } });
      console.log('Code de vérification supprimé après validation.');
    } else {
      console.log('Code invalide ou expiré.');
    }

  } catch (err) {
    console.error('Erreur :', err.message);
  } finally {
    await db.sequelize.close();
  }
})();
