// imports nécessaires pour les tests et mocks
import { describe, it, beforeEach, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';

// ─── 1) MOCK express-validator ──────────────────────────────────────────────
vi.mock('express-validator', () => ({
  __esModule: true,
  validationResult: vi.fn(),
  matchedData: vi.fn(),
}));
import { validationResult, matchedData } from 'express-validator';

// ─── 2) MOCK bcrypt.hash ───────────────────────────────────────────────────
vi.mock('bcrypt', () => ({
  __esModule: true,
  default: {
    hash: vi.fn(),
  },
}));
import bcrypt from 'bcrypt';

// ─── 3) MOCK jsonwebtoken.verify ────────────────────────────────────────────
vi.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    verify: vi.fn(),
  },
}));
import jwt from 'jsonwebtoken';

// ─── 4) MOCK Utilisateur.update ────────────────────────────────────────────
vi.mock('../../src/models/utilisateur.js', () => ({
  __esModule: true,
  default: { update: vi.fn() },
}));
import Utilisateur from '../../src/models/utilisateur.js';

// ─── 5) MOCK VerificationCode.destroy ───────────────────────────────────────
vi.mock('../../src/models/VerificationCode.js', () => ({
  __esModule: true,
  default: { destroy: vi.fn() },
}));
import VerificationCode from '../../src/models/VerificationCode.js';

// ─── 6) IMPORT controller APRÈS les mocks ──────────────────────────────────
import { resetpassword } from '../../src/controllers/authControllers.js'; // ajuster le chemin

// ─── 7) Créer une mini‐app Express pour l’endpoint ─────────────────────────
function createApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.post('/auth/resetpassword', resetpassword);
  return app;
}

describe('POST /auth/resetpassword — intégration avec Supertest', () => {
  let app;

  // Avant chaque test, initialisation de l'application et des mocks
  beforeEach(() => {
    vi.clearAllMocks(); // Réinitialisation de tous les mocks
    app = createApp();
    // validation OK par défaut
    validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
    matchedData.mockImplementation(req => ({ pwd: req.body.pwd }));
    bcrypt.hash.mockResolvedValue('HASHED_PWD');
  });

  // Test 1: Vérification de l'échec de la validation des données
  it('400 si express-validator détecte une erreur', async () => {
    validationResult.mockReturnValue({ isEmpty: () => false, array: () => ['err'] });

    const res = await request(app)
      .post('/auth/resetpassword')
      .send({ pwd: 'newpass' });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Erreur de validation des données.');
  });

  // Test 2: Vérification de l'absence de cookie resetToken
  it('401 si pas de cookie resetToken', async () => {
    // pas de Cookie header
    const res = await request(app)
      .post('/auth/resetpassword')
      .send({ pwd: 'newpass' });

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe('Aucun token trouvé pour réinitialiser le mot de passe.');
  });

  // Test 3: Vérification d'un token invalide
  it('403 si token invalide', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('bad token'); });

    const res = await request(app)
      .post('/auth/resetpassword')
      .set('Cookie', ['resetToken=BAD'])
      .send({ pwd: 'newpass' });

    expect(res.status).toBe(403);
    expect(res.body.msg).toBe('Token invalide ou expiré.');
  });

  // Test 4: Vérification de l'absence d'utilisateur lors de la mise à jour
  it('404 si Utilisateur.update ne trouve pas d’utilisateur', async () => {
    jwt.verify.mockReturnValue({ cin: 'U1' });
    Utilisateur.update.mockResolvedValue([0]); // zéro lignes mises à jour

    const res = await request(app)
      .post('/auth/resetpassword')
      .set('Cookie', ['resetToken=GOOD'])
      .send({ pwd: 'newpass' });

    expect(res.status).toBe(404);
    expect(res.body.msg).toBe('Utilisateur non trouvé.');
    expect(VerificationCode.destroy).not.toHaveBeenCalled();
    // cookie cleared
    expect(res.get('Set-Cookie').some(c => c.startsWith('resetToken=;'))).toBe(true);
  });

  // Test 5: Vérification du succès de la réinitialisation du mot de passe
  it('200 si tout est OK', async () => {
    jwt.verify.mockReturnValue({ cin: 'U1' });
    Utilisateur.update.mockResolvedValue([1]);  // mise à jour OK
    VerificationCode.destroy.mockResolvedValue(1);

    const res = await request(app)
      .post('/auth/resetpassword')
      .set('Cookie', ['resetToken=GOOD'])
      .send({ pwd: 'newpass' });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe('Mot de passe réinitialisé avec succès.');

    // bcrypt.hash appelé
    expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
    // update avec hash
    expect(Utilisateur.update).toHaveBeenCalledWith(
      { pwd: 'HASHED_PWD' },
      { where: { cin: 'U1' } }
    );
    // VerificationCode.destroy
    expect(VerificationCode.destroy).toHaveBeenCalledWith({ where: { idUtilisateur: 'U1' } });
    // clearCookie
    expect(res.get('Set-Cookie').some(c => c.startsWith('resetToken=;'))).toBe(true);
  });

  // Test 6: Vérification d'une erreur interne
  it('500 si exception interne', async () => {
    jwt.verify.mockReturnValue({ cin: 'U1' });
    Utilisateur.update.mockRejectedValue(new Error('DB down'));

    const res = await request(app)
      .post('/auth/resetpassword')
      .set('Cookie', ['resetToken=GOOD'])
      .send({ pwd: 'newpass' });

    expect(res.status).toBe(500);
    expect(res.body.msg).toBe("Erreur serveur lors de la réinitialisation du mot de passe.");
  });
});
