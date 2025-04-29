import request from "supertest";
import app from "../index.js";

  // L'importation de ta base de données Sequelize
  // Assure-toi que tu importes correctement ton modèle

describe("Test submitcode", () => {
  let validVerificationCode;

  test("should return 400 if validation fails (no code)", async () => {
    const res = await request(app)
      .post("/auth/submitcode")
      .send({});  // Données invalides (pas de code envoyé)

    expect(res.status).toBe(400);  // Vérifie que le statut est 400
    expect(res.body.msg).toBe("Erreur de validation des données.");
  });

  test("should return 400 if code is invalid or expired", async () => {
    // Utiliser un code invalide (qui n'existe pas dans la base de données)
    const res = await request(app)
      .post("/auth/submitcode")
      .send({ verificationCode: "invalidCode" });

    expect(res.status).toBe(400);  // Vérifie que le statut est 400
    expect(res.body.msg).toBe("Erreur de validation des données.");
  });

  validVerificationCode = "12345699"; // Code fictif pour le test
 



test("Devrait retourner 200 et valider le code", async () => {
  // Tester la soumission du code de vérification valide
  const res = await request(app)
    .post("/auth/submitcode")
    .send({ verificationCode: validVerificationCode });

  expect(res.status).toBe(200); // Vérifie que le statut est 200
  expect(res.body.msg).toBe("Code de vérification validé.");

  
  expect(codeEntry).toBeNull(); // Le code doit être supprimé après validation
});

  test("should return 500 if there's a server error", async () => {
    // Simuler une erreur dans la base de données
   

    const res = await request(app)
      .post("/auth/submitcode")
      .send({ verificationCode: validVerificationCode });
     
    expect(res.status).toBe(500);  // Vérifie que le statut est 500
    expect(res.body.msg).toBe("Erreur serveur lors de la validation du code.");
  });
});
