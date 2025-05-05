import db from '../models/index.js';
import bcrypt from 'bcrypt';

const {
  Utilisateur,
  Etudiant,
  Enseignant,
  Professionnel,
  Cadre,
  Competence,
  Indicateur
} = db;

async function seed() {
  try {
    await db.sequelize.sync({ force: true });

    const pwd = await bcrypt.hash('1234', 10);

    // Création des utilisateurs de base
    await Utilisateur.bulkCreate([
      { cin: 'CIN001', nom: 'Souma', prenom: 'Test', email: 'souma@mail.com', role: 'etudiant', pwd },
      { cin: 'CIN002', nom: 'Prof', prenom: 'X', email: 'prof@mail.com', role: 'enseignant', pwd },
      { cin: 'CIN003', nom: 'Pro', prenom: 'Y', email: 'pro@mail.com', role: 'professionnel', pwd },
      {cin: 'CIN004', nom: 'Amina', prenom: 'Test', email: 'Amina@mail.com', role: 'etudiant', pwd}
    ]);

    // Création des profils spécifiques
    await Etudiant.create({ cin: 'CIN001', promotion: '2025', filiere: 'GI' });
    await Etudiant.create({ cin: 'CIN004', promotion: '2025', filiere: 'GINF' });

    await Enseignant.create({ cin: 'CIN002', departement: 'Informatique' });
    await Professionnel.create({ cin: 'CIN003', nomEntreprise: 'DevCorp', domaineActivite: 'IT' });

    // Création d'un cadre
    const cadre = await Cadre.create({
      Nom: 'Stage Projet',
      Type: 'Projet',
      Frequence_evaluation: 1,
      Date_debut: new Date(),
      Date_fin: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      Description: "Cadre d'évaluation de stage",
      cinEnseignant: 'CIN002',  // Ajout direct de la référence
      cinProfessionnel: 'CIN003' // Ajout direct de la référence
    });

    // Association des participants (étudiants)
    const etudiant = await Etudiant.findByPk('CIN001');
    const etudiant1 = await Etudiant.findByPk('CIN004');

    await cadre.addParticipant(etudiant);
    await cadre.addParticipant(etudiant1);
    // Création d'une compétence
    const comp = await Competence.create({
      Nom: 'Travail en équipe',
      Categorie: 'Soft skill',
      Description: 'Capacité à collaborer efficacement'
    });

    // Association compétence-cadre
    await cadre.addCompetence(comp);

    // Création des indicateurs
    await Indicateur.bulkCreate([
      { indicateur: 'Collabore efficacement', id_competence: comp.id_competence },
      { indicateur: 'Respect des délais', id_competence: comp.id_competence }
    ]);

    console.log('✅ Données insérées avec succès !');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur lors du seed :', err);
    process.exit(1);
  }
}

seed();