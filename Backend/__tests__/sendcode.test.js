import { describe, it, beforeEach, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import crypto from 'crypto';

// ─── 1) MOCK express-validator ──────────────────────────────────────────────
vi.mock('express-validator', () => ({
  __esModule: true,
  validationResult: vi.fn(),
  matchedData: vi.fn(),
}));
import { validationResult, matchedData } from 'express-validator';

// ─── 2) MOCK Utilisateur (Sequelize) ────────────────────────────────────────
vi.mock('../src/models/utilisateur.js', () => ({
  __esModule: true,
  default: { findOne: vi.fn() },
}));
import Utilisateur from '../src/models/utilisateur.js';

// ─── 3) MOCK VerificationCode (Sequelize) ──────────────────────────────────
vi.mock('../src/models/VerificationCode.js', () => ({
  __esModule: true,
  default: { create: vi.fn() },
}));
import VerificationCode from '../src/models/VerificationCode.js';

// ─── 4) MOCK sendVerificationEmail ─────────────────────────────────────────
vi.mock('../src/assets/email.js', () => ({
  __esModule: true,
  sendVerificationEmail: vi.fn(() => Promise.resolve()),
}));
import { sendVerificationEmail } from '../src/assets/email.js';

// ─── 5) MOCK jsonwebtoken.sign ──────────────────────────────────────────────
vi.mock('jsonwebtoken', () => ({
  __esModule: true,
  default: {
    sign: vi.fn(() => 'MOCK_JWT'),
  },
}));
import jwt from 'jsonwebtoken';

// ─── 6) IMPORTER le contrôleur APRÈS les mocks ───────────────────────────────
import { sendcode } from '../src/controllers/authControllers.js';

// ─── 7) Créer une mini‐app Express pour tester l’endpoint ────────────────────
function createApp() {
  const app = express();
  app.use(express.json());
  app.post('/auth/sendcode', sendcode);
  return app;
}

describe('POST /auth/sendcode — intégration avec Supertest', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
    // Validation passe par défaut
    validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
    matchedData.mockImplementation(req => ({ email: req.body.email }));
  });

  it('retourne 400 si express-validator détecte une erreur', async () => {
    validationResult.mockReturnValue({ isEmpty: () => false, array: () => ['err'] });

    const res = await request(app)
      .post('/auth/sendcode')
      .send({ email: 'x' });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Erreur de validation des données.');
  });

  it('retourne 404 si l’utilisateur est introuvable', async () => {
    Utilisateur.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/auth/sendcode')
      .send({ email: 'nope@example.com' });

    expect(res.status).toBe(404);
    expect(res.body.msg).toBe("Utilisateur non trouvé pour l'email : nope@example.com");

    expect(VerificationCode.create).not.toHaveBeenCalled();
    expect(sendVerificationEmail).not.toHaveBeenCalled();
  });

  it('retourne 200 et déroule tout le flow si tout est OK', async () => {
    // Stub crypto pour toujours générer "a1b2c3"
    vi.spyOn(crypto, 'randomBytes').mockReturnValue(Buffer.from('a1b2c3', 'hex'));
    Utilisateur.findOne.mockResolvedValueOnce({ cin: 'U1' });

    const res = await request(app)
      .post('/auth/sendcode')
      .send({ email: 'test@example.com' });

    // Vérification du statut et du body
    expect(res.status).toBe(200);
    expect(res.body.msg).toBe('Code de vérification envoyé.');

    // Vérification de la création du code en base
    expect(VerificationCode.create).toHaveBeenCalledWith({
      idUtilisateur: 'U1',
      idVerification: 'a1b2c3',
      expireAt: expect.any(Date),
    });

    // Vérification de l’envoi d’email
    expect(sendVerificationEmail).toHaveBeenCalledWith('test@example.com', 'a1b2c3');

    // → **C’est ici : on utilise jwt.sign, pas jwt.default.sign** 
    expect(jwt.sign).toHaveBeenCalledWith(
      { cin: 'U1' },
      process.env.RESET_SECRET,
      { expiresIn: '15m' }
    );

    // Vérification du cookie resetToken
    const cookies = res.get('Set-Cookie');
    expect(cookies.some(c => c.startsWith('resetToken=MOCK_JWT'))).toBe(true);
  });

  it('retourne 500 si une erreur interne est levée', async () => {
    Utilisateur.findOne.mockResolvedValueOnce({ cin: 'U1' });
    VerificationCode.create.mockRejectedValueOnce(new Error('DB down'));

    const res = await request(app)
      .post('/auth/sendcode')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(500);
    expect(res.body.msg).toBe("Erreur serveur lors de l'envoi du code.");
  });
});