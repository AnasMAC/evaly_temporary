// tests/auth.login.integration.spec.js
import { describe, it, beforeAll, beforeEach, afterEach, afterAll, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../../index.js';                 
import db from '../../src/models/index.js';        

describe('POST /auth/login (intégration réelle DB)', () => {
  // 1) Au tout début, on force la synchronisation du schéma en mémoire
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  // 2) Avant chaque test, on crée notre utilisateur fixture
  beforeEach(async () => {
    const hashedAdminPwd = await bcrypt.hash('admin00', 10); 
                const admin = await db.Utilisateur.create({
                  cin : 'KB1000',
                  pwd : hashedAdminPwd,
                  nom: 'nichan',
                  prenom : 'said',
                  email : 'saidnichan789@gmail.com',
                  role : 'administrateur'
                });
                 await db.Administrateur.create({
                      cin: admin.cin 
                    });

    const hashed = await bcrypt.hash('testpassword', 10);
    await db.Utilisateur.create({
      cin:    'USER123',
      email:  'test@example.com',
      pwd:     hashed,
      nom:    'Test',
      prenom: 'User',
      role:   'etudiant',
      administrateurId: admin.cin
    });
  });

  // 3) Après chaque test, on vide toutes les tables
  afterEach(async () => {
    // truncate de toutes les tables, cascade pour les FK
    await db.sequelize.truncate({ cascade: true });
  });

  // 4) À la fin, on ferme la connexion
  afterAll(async () => {
    await db.sequelize.close();
  });

  it('400 si email ou pwd manquant', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: '', pwd: '' });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Email et mot de passe sont requis!');
  });

  it('401 si utilisateur introuvable', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nope@example.com', pwd: 'testpassword' });

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe('Email ou mot de passe incorrect!');
  });

  it('401 si mot de passe incorrect', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', pwd: 'badpassword' });

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe('Email ou mot de passe incorrect!');
  });

  it('200 et cookies si identifiants valides', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', pwd: 'testpassword' });

    expect(res.status).toBe(200);


    // Vérifier que les cookies d’access et refresh token sont bien présents
    const setCookies = res.get('Set-Cookie');
    expect(setCookies.some(c => c.startsWith('refreshToken='))).toBe(true);
    expect(setCookies.some(c => c.startsWith('accessToken='))).toBe(true);
  });
});
