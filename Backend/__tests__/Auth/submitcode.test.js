// tests/submitcode.integration.spec.js
import { describe, it, beforeEach, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// ─── 1) MOCK express-validator ──────────────────────────────────────────────
vi.mock('express-validator', () => ({
  __esModule: true,
  validationResult: vi.fn(),
  matchedData: vi.fn(),
}));
import { validationResult, matchedData } from 'express-validator';

// ─── 2) MOCK VerificationCode (Sequelize) ──────────────────────────────────
vi.mock('../../src/models/VerificationCode.js', () => ({
  __esModule: true,
  default: {
    findOne: vi.fn(),
    // we’ll stub destroy on the returned instance
  },
}));
import VerificationCode from '../../src/models/VerificationCode.js';

// ─── 3) IMPORT controller APRÈS les mocks ──────────────────────────────────
import { submitcode } from '../../src/controllers/authControllers.js';  // ajuste chemin si besoin

// ─── 4) mini‐app Express pour l’endpoint ───────────────────────────────────
function createApp() {
  const app = express();
  app.use(express.json());
  app.post('/auth/submitcode', submitcode);
  return app;
}

describe('POST /auth/submitcode — intégration avec Supertest', () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();

    // validation par défaut OK
    validationResult.mockReturnValue({ isEmpty: () => true, array: () => [] });
    matchedData.mockImplementation(req => ({ verificationCode: req.body.verificationCode }));
  });

  it('400 si express-validator détecte une erreur', async () => {
    validationResult.mockReturnValue({ isEmpty: () => false, array: () => ['err'] });

    const res = await request(app)
      .post('/auth/submitcode')
      .send({ verificationCode: 'xxx' });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Erreur de validation des données.');
  });

  it('400 si code non trouvé', async () => {
    VerificationCode.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/auth/submitcode')
      .send({ verificationCode: 'abc123' });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Code invalide ou expiré.');
  });

  it('400 si code expiré', async () => {
    const expiredEntry = { expiresAt: new Date(Date.now() - 60_000) }; // il y a 1 min
    VerificationCode.findOne.mockResolvedValueOnce(expiredEntry);

    const res = await request(app)
      .post('/auth/submitcode')
      .send({ verificationCode: 'abc123' });

    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Code invalide ou expiré.');
  });

  it('200 et supprime le code si valide', async () => {
    const future = new Date(Date.now() + 60_000); // dans 1 min
    // stub instance avec destroy
    const entry = { expiresAt: future, destroy: vi.fn(() => Promise.resolve()) };
    VerificationCode.findOne.mockResolvedValueOnce(entry);

    const res = await request(app)
      .post('/auth/submitcode')
      .send({ verificationCode: 'valid123' });

    expect(res.status).toBe(200);
    expect(res.body.msg).toBe('Code de vérification validé.');
    expect(entry.destroy).toHaveBeenCalledOnce();
  });

  it('500 si exception interne', async () => {
    // faire findOne rejeter
    VerificationCode.findOne.mockRejectedValueOnce(new Error('DB down'));

    const res = await request(app)
      .post('/auth/submitcode')
      .send({ verificationCode: 'any' });

    expect(res.status).toBe(500);
    expect(res.body.msg).toBe('Erreur serveur lors de la validation du code.');
  });
});