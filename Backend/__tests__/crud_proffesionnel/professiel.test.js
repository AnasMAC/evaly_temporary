import { describe, it, beforeAll, beforeEach, afterEach, afterAll, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../index.js';  // Ton fichier principal Express
import db from '../../src/models/index.js';  // Tes modèles Sequelize

describe('Professionnel API Tests', () => {
  let administrateurId;
  const professionnelCin = 'PROF123'; 
  

  beforeAll(async () => {
   
    await db.sequelize.sync({ force: true });  
    console.log('Base de données synchronisée');
  });


  beforeEach(async () => {
    const hashedAdminPwd = await bcrypt.hash('admin00', 10);
    
    // Création d'un administrateur
    const admin = await db.Utilisateur.create({
      cin: 'ADMIN12',
      pwd: hashedAdminPwd,
      nom: 'Admin',
      prenom: 'Test',
      email: 'admin@test.com',
      role: 'administrateur'
    });

    await db.Administrateur.create({
      cin: admin.cin
    });

    administrateurId = admin.cin;

    // Création d'un professionnel
    await db.Utilisateur.create({
      cin: professionnelCin,
      pwd: hashedAdminPwd,
      nom: 'Doe',
      prenom: 'John',
      email: 'john.doe@test.com',
      role: 'professionnel',
      administrateurId: admin.cin
    });

    await db.Professionnel.create({
      cin: professionnelCin,
      nomEntreprise: 'TechCorp',
      domaineActivite: 'Technology'
    });
  });


  afterEach(async () => {
    await db.sequelize.truncate({ cascade: true });  
  });


  afterAll(async () => {
    await db.sequelize.close();
  });

  // Test de création d'un professionnel
  it('should create a new professional and return 201', async () => {
    const res = await request(app).post(`/api/professionnels/${administrateurId}`).send({
      cin: 'PROF124',
      nom: 'Smith',
      prenom: 'Jane',
      email: 'jane.smith@test.com',
      nomEntreprise: 'InnovateTech',
      domaineActivite: 'AI'
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Professionnel créé avec succès');
    expect(res.body).toHaveProperty('cin', 'PROF124');
    expect(res.body).toHaveProperty('nomEntreprise', 'InnovateTech');
    expect(res.body).toHaveProperty('domaineActivite', 'AI');
  });

  it('should return all professionals and their details', async () => {
    const res = await request(app).get(`/api/professionnels/${administrateurId}`).send();

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);  
    expect(res.body.length).toBeGreaterThan(0); 
    expect(res.body[0]).toHaveProperty('cin');
    expect(res.body[0]).toHaveProperty('nom');
    expect(res.body[0]).toHaveProperty('prenom');
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('professionnel');
    expect(res.body[0].professionnel).toHaveProperty('nomEntreprise');
    expect(res.body[0].professionnel).toHaveProperty('domaineActivite');
  });


  it('should update a professional and return 200', async () => {
    const res = await request(app)
      .put(`/api/professionnels/${administrateurId}`)
      .send({
        cin: professionnelCin,
        nom: 'DoeUpdated',
        prenom: 'JohnUpdated',
        email: 'john.doe.updated@test.com',
        nomEntreprise: 'NewTechCorp',
        domaineActivite: 'FinTech'
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Professionnel mis à jour avec succès');
  });

 
  it('should delete a professional and return 200', async () => {
    const res = await request(app).delete(`/api/professionnels/${administrateurId}/${professionnelCin}`).send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Professionnel supprimé avec succès');
  });


  it('should return 404 when trying to delete a non-existing professional', async () => {
    const res = await request(app).delete(`/api/professionnels/${administrateurId}/NO_EXISTING_CIN`).send();

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Professionnel non trouvé');
  });
});
