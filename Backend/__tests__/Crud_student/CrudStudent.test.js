import { describe, it, beforeAll, beforeEach, afterEach, afterAll, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../index.js';                 
import db from '../../src/models/index.js';  

describe('API test student CRUD', () => {
  let idadmin;
  const etudiantCin = 'AB1234';
  
  // Crée une base de données vierge avant tous les tests
  beforeAll(async () => {
    await db.sequelize.sync({force:true}); // Pas de force ici pour éviter la suppression de la DB
  });

  // Initialisation des données avant chaque test
  beforeEach(async () => {
    // Création de l'administrateur
    const hashedAdminPwd = await bcrypt.hash('admin1234', 10);
    const admin = await db.Utilisateur.create({
      cin: 'KB2007',
      pwd: hashedAdminPwd,
      nom: 'nichan',
      prenom: 'said',
      email: 'saidnichan540@gmail.com',
      role: 'administrateur'
    });

    await db.Administrateur.create({ cin: admin.cin });
    idadmin = admin.cin;

    // Création de l'étudiant
    await db.Utilisateur.create({
      cin: etudiantCin,
      pwd: hashedAdminPwd,
      nom: 'lahcen',
      prenom: 'zaki',
      email: 'lahcen@gmail.com',
      role: 'etudiant',
      administrateurId: admin.cin
    });

    await db.Etudiant.create({
      cin: etudiantCin,
      promotion: '2025',
      filiere: 'GINF1'
    });
  });

  // Nettoyage des données après chaque test
  afterEach(async () => {
    await db.sequelize.truncate({ cascade: true });
  });

  // Fermeture de la connexion DB après tous les tests
  afterAll(async () => {
    await db.sequelize.close();
  });

  // Test de création d'un étudiant
  it('Create student test return 201', async () => {
    const res = await request(app).post(`/api/etudiants/${idadmin}`).send({
      cin: "AB1022",
      nom: "said1",
      prenom: "nichan5",
      email: "said123@gmail.com",
      role: "etudiant",
      promotion: "2026",
      filiere: "GINF1"
    });

    console.log('Réponse de l\'API pour la création d\'étudiant:', res.body); // Affiche la réponse du serveur

    // Vérification de la réponse du serveur
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Etudiant créé avec succès');
  });

  // Test de mise à jour d'un étudiant
  it('should update student details successfully', async () => {
    const res = await request(app)
      .put(`/api/etudiants/${idadmin}`)
      .send({
        cin: etudiantCin,
        nom: "mohamed",
        prenom: "nichan",
        email: "mohamed@gmail.com",
        role: "etudiant",
        promotion: "2026",
        filiere: "GINF2"
      });

    console.log('Réponse de l\'API pour la mise à jour d\'étudiant:', res.body); // Affiche la réponse du serveur

    // Vérification de la réponse du serveur
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Étudiant mis à jour avec succès');
  });

  // Test de suppression d'un étudiant
  it('should delete student successfully && return 200', async () => {
    const res = await request(app)
      .delete(`/api/etudiants/${idadmin}/${etudiantCin}`);

    console.log('Réponse de l\'API pour la suppression de l\'étudiant:', res.body); // Affiche la réponse du serveur

    // Vérification de la réponse du serveur
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Étudiant supprimé avec succès');

    const deletedEtudiant = await db.Etudiant.findOne({ where: { cin: etudiantCin } });
    const deletedUtilisateur = await db.Utilisateur.findOne({ where: { cin: etudiantCin } });

    // Vérification que l'étudiant a bien été supprimé
    expect(deletedEtudiant).toBeNull();
    expect(deletedUtilisateur).toBeNull();
  });

  // Test pour supprimer un étudiant inexistant
  it('should return 404 when trying to delete non-existing student', async () => {
    const res = await request(app)
      .delete(`/api/etudiants/${idadmin}/NoCin`)
      .send();

    console.log('Réponse de l\'API pour la suppression d\'étudiant non trouvé:', res.body); // Affiche la réponse du serveur

    // Vérification que l'erreur est bien retournée
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Étudiant non trouvé");
  });

  // Test pour récupérer tous les étudiants
  it('should return all students with their details', async () => {
    const res = await request(app)
      .get(`/api/etudiants/${idadmin}`)
      .send();

    console.log('Réponse de l\'API pour la récupération des étudiants:', res.body); // Affiche la réponse du serveur

    // Vérification que les données sont bien retournées
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('cin');
    expect(res.body[0]).toHaveProperty('nom');
    expect(res.body[0]).toHaveProperty('prenom');
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('etudiant');
    expect(res.body[0].etudiant).toHaveProperty('filiere');
    expect(res.body[0].etudiant).toHaveProperty('promotion');
  });
});
